import { 
  Product, CategoryInfo, OccasionInfo, Banner, Coupon, Order, Customer, 
  StoreSettings, Review, CartItem, OrderStatus, AuditLog, AdminUser
} from '../types';
import { 
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_OCCASIONS, 
  INITIAL_BANNERS, INITIAL_COUPONS, INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, INITIAL_REVIEWS, INITIAL_SETTINGS 
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'gt_products_v1',
  CATEGORIES: 'gt_categories_v1',
  BANNERS: 'gt_banners_v1',
  COUPONS: 'gt_coupons_v1',
  ORDERS: 'gt_orders_v1',
  CUSTOMERS: 'gt_customers_v1',
  REVIEWS: 'gt_reviews_v1',
  SETTINGS: 'gt_settings_v1',
  CART: 'gt_cart_v1',
  WISHLIST: 'gt_wishlist_v1',
  APPLIED_COUPON: 'gt_applied_coupon_v1',
  CURRENT_USER: 'gt_current_user_v1',
  ADMIN_SESSION: 'gt_admin_session_v1',
  AUDIT_LOGS: 'gt_audit_logs_v1',
};

class Store {
  private products: Product[] = [];
  private categories: CategoryInfo[] = [];
  private occasions: OccasionInfo[] = INITIAL_OCCASIONS;
  private banners: Banner[] = [];
  private coupons: Coupon[] = [];
  private orders: Order[] = [];
  private customers: Customer[] = [];
  private reviews: Review[] = [];
  private settings: StoreSettings = INITIAL_SETTINGS;
  private cart: CartItem[] = [];
  private wishlist: string[] = [];
  private appliedCoupon: Coupon | null = null;
  private currentCustomer: Customer | null = null;
  private adminSession: AdminUser | null = null;
  private auditLogs: AuditLog[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.products = this.loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      this.categories = this.loadFromStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      this.banners = this.loadFromStorage(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
      this.coupons = this.loadFromStorage(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
      this.orders = this.loadFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      this.customers = this.loadFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
      this.reviews = this.loadFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
      this.settings = this.loadFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
      this.cart = this.loadFromStorage(STORAGE_KEYS.CART, []);
      this.wishlist = this.loadFromStorage(STORAGE_KEYS.WISHLIST, ['gt-prod-01', 'gt-prod-09', 'gt-prod-31']);
      this.appliedCoupon = this.loadFromStorage(STORAGE_KEYS.APPLIED_COUPON, null);
      this.currentCustomer = this.loadFromStorage(STORAGE_KEYS.CURRENT_USER, this.customers[0] || null);
      this.adminSession = this.loadFromStorage(STORAGE_KEYS.ADMIN_SESSION, null);
      this.auditLogs = this.loadFromStorage(STORAGE_KEYS.AUDIT_LOGS, [
        { id: 'log-1', action: 'Store Initialized', user: 'System', timestamp: new Date().toISOString(), details: '52 Products and seed catalogs loaded.' }
      ]);
    } catch (e) {
      console.error('Error initializing store from storage:', e);
      this.resetDatabase();
    }
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  }

  private saveToStorage(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Listener notification error:', err);
      }
    });
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return [...this.products];
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug || p.id === slug);
  }

  public getProductsByCategory(categoryName: string): Product[] {
    return this.products.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase() ||
             p.slug.includes(categoryName.toLowerCase())
    );
  }

  public getProductsByOccasion(occasionName: string): Product[] {
    return this.products.filter(
      (p) => p.occasions && p.occasions.some(
        (o) => o.toLowerCase() === occasionName.toLowerCase()
      )
    );
  }

  public createProduct(product: Omit<Product, 'id'>): Product {
    const id = `gt-prod-${Date.now().toString(36)}`;
    const newProduct: Product = { ...product, id };
    this.products.unshift(newProduct);
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
    this.logAction('Product Created', this.adminSession?.name || 'Admin', `Created product: ${newProduct.title} (${newProduct.sku})`);
    this.notify();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
    this.logAction('Product Updated', this.adminSession?.name || 'Admin', `Updated product: ${this.products[idx].title}`);
    this.notify();
    return this.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const product = this.products.find((p) => p.id === id);
    if (!product) return false;
    this.products = this.products.filter((p) => p.id !== id);
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
    this.logAction('Product Deleted', this.adminSession?.name || 'Admin', `Deleted product: ${product.title}`);
    this.notify();
    return true;
  }

  public duplicateProduct(id: string): Product | null {
    const product = this.products.find((p) => p.id === id);
    if (!product) return null;
    const duplicated: Product = {
      ...product,
      id: `gt-prod-${Date.now().toString(36)}`,
      title: `${product.title} (Copy)`,
      sku: `${product.sku}-COPY`,
      slug: `${product.slug}-copy-${Date.now().toString(36).slice(-4)}`,
    };
    this.products.unshift(duplicated);
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
    this.logAction('Product Duplicated', this.adminSession?.name || 'Admin', `Duplicated product: ${product.title}`);
    this.notify();
    return duplicated;
  }

  // --- CATEGORIES & OCCASIONS ---
  public getCategories(): CategoryInfo[] {
    return [...this.categories];
  }

  public getOccasions(): OccasionInfo[] {
    return [...this.occasions];
  }

  public updateCategory(id: string, updates: Partial<CategoryInfo>): CategoryInfo | null {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
    this.notify();
    return this.categories[idx];
  }

  // --- BANNERS ---
  public getBanners(): Banner[] {
    return [...this.banners].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public updateBanner(id: string, updates: Partial<Banner>): Banner | null {
    const idx = this.banners.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.banners[idx] = { ...this.banners[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.BANNERS, this.banners);
    this.logAction('Banner Updated', this.adminSession?.name || 'Admin', `Updated banner: ${this.banners[idx].title}`);
    this.notify();
    return this.banners[idx];
  }

  // --- CART ("Your Giggle Basket") ---
  public getCart(): CartItem[] {
    return [...this.cart];
  }

  public addToCart(
    product: Product, 
    quantity: number = 1, 
    variant?: any, 
    customText?: string,
    giftWrap?: boolean,
    giftMessage?: string
  ) {
    const existingIndex = this.cart.findIndex(
      (item) => item.product.id === product.id && 
                item.selectedVariant?.id === variant?.id &&
                item.customText === customText
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      if (giftWrap !== undefined) this.cart[existingIndex].giftWrap = giftWrap;
      if (giftMessage !== undefined) this.cart[existingIndex].giftMessage = giftMessage;
    } else {
      this.cart.push({
        product,
        quantity,
        selectedVariant: variant,
        customText,
        giftWrap,
        giftMessage,
      });
    }

    this.saveToStorage(STORAGE_KEYS.CART, this.cart);
    this.notify();
  }

  public updateCartQuantity(productId: string, quantity: number, variantId?: string) {
    if (quantity <= 0) {
      this.removeFromCart(productId, variantId);
      return;
    }
    const item = this.cart.find(
      (i) => i.product.id === productId && (!variantId || i.selectedVariant?.id === variantId)
    );
    if (item) {
      item.quantity = quantity;
      this.saveToStorage(STORAGE_KEYS.CART, this.cart);
      this.notify();
    }
  }

  public removeFromCart(productId: string, variantId?: string) {
    this.cart = this.cart.filter(
      (i) => !(i.product.id === productId && (!variantId || i.selectedVariant?.id === variantId))
    );
    this.saveToStorage(STORAGE_KEYS.CART, this.cart);
    this.notify();
  }

  public clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    this.saveToStorage(STORAGE_KEYS.CART, this.cart);
    this.saveToStorage(STORAGE_KEYS.APPLIED_COUPON, null);
    this.notify();
  }

  public getCartTotals() {
    const subtotal = this.cart.reduce((acc, item) => {
      const variantAdd = item.selectedVariant?.priceModifier || 0;
      return acc + (item.product.price + variantAdd) * item.quantity;
    }, 0);

    let discount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.discountType === 'percentage') {
        discount = (subtotal * this.appliedCoupon.discountValue) / 100;
        if (this.appliedCoupon.maxDiscount && discount > this.appliedCoupon.maxDiscount) {
          discount = this.appliedCoupon.maxDiscount;
        }
      } else {
        discount = this.appliedCoupon.discountValue;
      }
    }

    const freeThreshold = this.settings.freeShippingThreshold;
    const isFreeShipping = subtotal >= freeThreshold;
    const amountToFreeShipping = Math.max(0, freeThreshold - subtotal);
    const shippingCost = isFreeShipping || subtotal === 0 ? 0 : this.settings.standardShippingRate;

    const hasGiftWrap = this.cart.some((i) => i.giftWrap);
    const giftWrapFee = hasGiftWrap ? this.settings.giftWrapFee : 0;

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round((taxableAmount * this.settings.gstRate) / 100);
    const total = Math.max(0, taxableAmount + shippingCost + giftWrapFee);

    return {
      subtotal,
      discount: Math.round(discount * 100) / 100,
      appliedCoupon: this.appliedCoupon,
      isFreeShipping,
      amountToFreeShipping,
      shippingCost,
      tax,
      giftWrapFee,
      total: Math.round(total * 100) / 100,
      itemCount: this.cart.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  // --- COUPONS ---
  public getCoupons(): Coupon[] {
    return [...this.coupons];
  }

  public applyCoupon(code: string): { success: boolean; message: string } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons.find((c) => c.code === cleanCode && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    const { subtotal } = this.getCartTotals();
    if (subtotal < coupon.minOrderValue) {
      return { 
        success: false, 
        message: `This coupon requires a minimum order value of ₹${coupon.minOrderValue}.` 
      };
    }

    this.appliedCoupon = coupon;
    this.saveToStorage(STORAGE_KEYS.APPLIED_COUPON, coupon);
    this.notify();
    return { success: true, message: `Coupon "${coupon.code}" applied successfully!` };
  }

  public removeCoupon() {
    this.appliedCoupon = null;
    this.saveToStorage(STORAGE_KEYS.APPLIED_COUPON, null);
    this.notify();
  }

  public createCoupon(coupon: Coupon): Coupon {
    this.coupons.push(coupon);
    this.saveToStorage(STORAGE_KEYS.COUPONS, this.coupons);
    this.logAction('Coupon Created', this.adminSession?.name || 'Admin', `Created coupon: ${coupon.code}`);
    this.notify();
    return coupon;
  }

  public updateCoupon(code: string, updates: Partial<Coupon>): Coupon | null {
    const idx = this.coupons.findIndex((c) => c.code === code);
    if (idx === -1) return null;
    this.coupons[idx] = { ...this.coupons[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.COUPONS, this.coupons);
    this.notify();
    return this.coupons[idx];
  }

  public deleteCoupon(code: string): boolean {
    this.coupons = this.coupons.filter((c) => c.code !== code);
    this.saveToStorage(STORAGE_KEYS.COUPONS, this.coupons);
    this.notify();
    return true;
  }

  // --- WISHLIST ---
  public getWishlist(): string[] {
    return [...this.wishlist];
  }

  public isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  public toggleWishlist(productId: string): boolean {
    const exists = this.wishlist.includes(productId);
    if (exists) {
      this.wishlist = this.wishlist.filter((id) => id !== productId);
    } else {
      this.wishlist.push(productId);
    }
    this.saveToStorage(STORAGE_KEYS.WISHLIST, this.wishlist);
    this.notify();
    return !exists;
  }

  public moveToCart(productId: string) {
    const product = this.getProductById(productId);
    if (product) {
      this.addToCart(product, 1);
      this.wishlist = this.wishlist.filter((id) => id !== productId);
      this.saveToStorage(STORAGE_KEYS.WISHLIST, this.wishlist);
      this.notify();
    }
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderInput: {
    customer: { name: string; email: string; phone: string };
    shippingAddress: any;
    deliveryMethod: 'standard' | 'express';
    paymentMethod: any;
    giftWrap?: boolean;
    giftMessage?: string;
  }): Order {
    const totals = this.getCartTotals();
    const orderNum = `GT-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    
    // Calculate estimated delivery
    const deliveryDays = orderInput.deliveryMethod === 'express' ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);
    const estDateStr = estDate.toISOString().split('T')[0];

    const newOrder: Order = {
      id: `ord-gt-${Date.now().toString(36)}`,
      orderNumber: orderNum,
      createdAt: now.toISOString(),
      customer: orderInput.customer,
      shippingAddress: orderInput.shippingAddress,
      items: this.cart.map((i) => ({
        productId: i.product.id,
        productTitle: i.product.title,
        productImage: i.product.images[0],
        price: i.product.price + (i.selectedVariant?.priceModifier || 0),
        quantity: i.quantity,
        selectedVariant: i.selectedVariant?.name,
        customText: i.customText,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponCode: this.appliedCoupon?.code,
      deliveryMethod: orderInput.deliveryMethod,
      shippingCost: orderInput.deliveryMethod === 'express' 
        ? this.settings.expressShippingRate 
        : totals.shippingCost,
      tax: totals.tax,
      giftWrapFee: orderInput.giftWrap ? this.settings.giftWrapFee : totals.giftWrapFee,
      giftMessage: orderInput.giftMessage,
      total: totals.total,
      paymentMethod: orderInput.paymentMethod,
      paymentStatus: orderInput.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'Confirmed',
      estimatedDelivery: estDateStr,
      timeline: [
        {
          status: 'Confirmed',
          date: `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          description: `Order successfully placed via ${orderInput.paymentMethod.toUpperCase()}.`,
        },
      ],
    };

    // Deduct stock
    this.cart.forEach((item) => {
      const prod = this.products.find((p) => p.id === item.product.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);

    // If coupon used, increment count
    if (this.appliedCoupon) {
      const c = this.coupons.find((x) => x.code === this.appliedCoupon?.code);
      if (c) c.usageCount += 1;
      this.saveToStorage(STORAGE_KEYS.COUPONS, this.coupons);
    }

    this.orders.unshift(newOrder);
    this.saveToStorage(STORAGE_KEYS.ORDERS, this.orders);

    // Clear cart
    this.clearCart();

    this.logAction('Order Placed', orderInput.customer.name, `Placed order #${newOrder.orderNumber} for ₹${newOrder.total}`);
    this.notify();
    return newOrder;
  }

  public updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string, 
    carrier?: string, 
    note?: string
  ): Order | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.trackingCarrier = carrier;
    if (status === 'Delivered') order.paymentStatus = 'paid';

    const now = new Date();
    order.timeline.push({
      status,
      date: `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      description: note || `Order status updated to ${status}.`,
    });

    this.saveToStorage(STORAGE_KEYS.ORDERS, this.orders);
    this.logAction('Order Status Updated', this.adminSession?.name || 'Admin', `Updated order #${order.orderNumber} to ${status}`);
    this.notify();
    return order;
  }

  // --- REVIEWS ---
  public getReviews(productId?: string): Review[] {
    if (productId) {
      return this.reviews.filter((r) => r.productId === productId);
    }
    return [...this.reviews];
  }

  public addReview(review: Omit<Review, 'id' | 'date' | 'verified' | 'helpfulCount'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now().toString(36)}`,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpfulCount: 0,
    };
    this.reviews.unshift(newRev);

    // Update product rating and review count
    const productReviews = this.reviews.filter((r) => r.productId === review.productId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const prod = this.products.find((p) => p.id === review.productId);
    if (prod) {
      prod.rating = Math.round(avgRating * 10) / 10;
      prod.reviewCount = productReviews.length;
      this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
    }

    this.saveToStorage(STORAGE_KEYS.REVIEWS, this.reviews);
    this.notify();
    return newRev;
  }

  public addAdminReply(reviewId: string, replyComment: string) {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.adminReply = {
        date: new Date().toISOString().split('T')[0],
        comment: replyComment,
      };
      this.saveToStorage(STORAGE_KEYS.REVIEWS, this.reviews);
      this.notify();
    }
  }

  // --- CUSTOMERS ---
  public getCustomers(): Customer[] {
    return [...this.customers];
  }

  public getCurrentCustomer(): Customer | null {
    return this.currentCustomer;
  }

  public updateCustomerProfile(updates: Partial<Customer>): Customer | null {
    if (!this.currentCustomer) return null;
    this.currentCustomer = { ...this.currentCustomer, ...updates };
    const idx = this.customers.findIndex((c) => c.id === this.currentCustomer?.id);
    if (idx > -1) {
      this.customers[idx] = this.currentCustomer;
      this.saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
    }
    this.saveToStorage(STORAGE_KEYS.CURRENT_USER, this.currentCustomer);
    this.notify();
    return this.currentCustomer;
  }

  public loginCustomer(email: string): Customer {
    let customer = this.customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (!customer) {
      customer = {
        id: `cust-${Date.now().toString(36)}`,
        name: email.split('@')[0],
        email,
        phone: '+91 98765 00000',
        registeredAt: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
        addresses: [],
        wishlist: [],
      };
      this.customers.push(customer);
      this.saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
    }
    this.currentCustomer = customer;
    this.saveToStorage(STORAGE_KEYS.CURRENT_USER, customer);
    this.notify();
    return customer;
  }

  public logoutCustomer() {
    this.currentCustomer = null;
    this.saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
    this.notify();
  }

  // --- ADMIN AUTH ---
  public getAdminSession(): AdminUser | null {
    return this.adminSession;
  }

  public loginAdmin(email: string, pass: string): { success: boolean; user?: AdminUser; error?: string } {
    if (email === 'admin@gigglethreads.com' && pass === 'admin123') {
      const user: AdminUser = {
        id: 'admin-1',
        name: 'Sarah Jenkins',
        email: 'admin@gigglethreads.com',
        role: 'Super Admin',
      };
      this.adminSession = user;
      this.saveToStorage(STORAGE_KEYS.ADMIN_SESSION, user);
      this.logAction('Admin Login', user.name, 'Logged into GiggleThreads Admin Portal');
      this.notify();
      return { success: true, user };
    }
    return { success: false, error: 'Invalid admin credentials.' };
  }

  public logoutAdmin() {
    if (this.adminSession) {
      this.logAction('Admin Logout', this.adminSession.name, 'Logged out of Admin Portal');
    }
    this.adminSession = null;
    this.saveToStorage(STORAGE_KEYS.ADMIN_SESSION, null);
    this.notify();
  }

  // --- SETTINGS ---
  public getSettings(): StoreSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<StoreSettings>) {
    this.settings = { ...this.settings, ...updates };
    this.saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    this.logAction('Settings Updated', this.adminSession?.name || 'Admin', 'Updated store configuration');
    this.notify();
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public logAction(action: string, user: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now().toString(36)}`,
      action,
      user,
      timestamp: new Date().toISOString(),
      details,
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    this.saveToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- RESET DATABASE HELPER ---
  public resetDatabase() {
    this.products = [...INITIAL_PRODUCTS];
    this.categories = [...INITIAL_CATEGORIES];
    this.banners = [...INITIAL_BANNERS];
    this.coupons = [...INITIAL_COUPONS];
    this.orders = [...INITIAL_ORDERS];
    this.customers = [...INITIAL_CUSTOMERS];
    this.reviews = [...INITIAL_REVIEWS];
    this.settings = { ...INITIAL_SETTINGS };
    this.cart = [];
    this.wishlist = ['gt-prod-01', 'gt-prod-09', 'gt-prod-31'];
    this.appliedCoupon = null;
    this.currentCustomer = this.customers[0];
    this.adminSession = null;
    this.auditLogs = [
      { id: 'log-1', action: 'Database Reset', user: 'System', timestamp: new Date().toISOString(), details: 'Reset store to initial state.' }
    ];

    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, this.categories);
    this.saveToStorage(STORAGE_KEYS.BANNERS, this.banners);
    this.saveToStorage(STORAGE_KEYS.COUPONS, this.coupons);
    this.saveToStorage(STORAGE_KEYS.ORDERS, this.orders);
    this.saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
    this.saveToStorage(STORAGE_KEYS.REVIEWS, this.reviews);
    this.saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    this.notify();
  }
}

export const store = new Store();
