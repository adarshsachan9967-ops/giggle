export type ProductCategory = 
  | 'Toys'
  | 'Gifts'
  | 'Soft Toys'
  | 'Personalized'
  | 'Birthday'
  | 'Couple Gifts'
  | 'Gift Hampers'
  | 'Educational Toys';

export type ProductBadge = 
  | 'BESTSELLER' 
  | 'NEW' 
  | 'TRENDING' 
  | 'LIMITED STOCK' 
  | 'TOP RATED' 
  | 'PERSONALIZED';

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  category: ProductCategory;
  subcategory?: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: ProductBadge;
  images: string[];
  shortDescription: string;
  story: {
    headline: string;
    content: string;
  };
  features: string[];
  specs: {
    material: string;
    dimensions: string;
    weight: string;
    recommendedAge: string;
    batteryRequired?: string;
    warranty?: string;
  };
  includes: string[];
  careInstructions: string;
  safetyInfo: string;
  deliveryDays: number;
  isBestseller: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPersonalized: boolean;
  variants?: ProductVariant[];
  tags: string[];
  occasions: string[];
}

export interface CategoryInfo {
  id: string;
  name: ProductCategory;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface OccasionInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
  badge?: string;
  active: boolean;
  displayOrder: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerLocation?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  images?: string[];
  adminReply?: {
    date: string;
    comment: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  customText?: string;
  giftWrap?: boolean;
  giftMessage?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  type: 'home' | 'work' | 'other';
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedVariant?: string;
  customText?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  date: string;
  time?: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryMethod: 'standard' | 'express';
  shippingCost: number;
  tax: number;
  giftWrapFee: number;
  giftMessage?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery: string;
  timeline: OrderTimelineEvent[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  addresses: Address[];
  wishlist: string[]; // product IDs
}

export interface RefundRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  reason: string;
  status: 'Requested' | 'Under Review' | 'Approved' | 'Rejected' | 'Processing' | 'Completed';
  date: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Catalog Manager' | 'Order Specialist' | 'Support Agent';
  avatar?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  gstRate: number;
  giftWrapFee: number;
  razorpayTestMode: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}
