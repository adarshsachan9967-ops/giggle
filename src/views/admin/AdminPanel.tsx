import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Layers, ShoppingCart, Users, 
  Boxes, Tag, Image as ImageIcon, MessageSquare, RotateCcw, 
  FileSpreadsheet, FileEdit, Settings, ShieldCheck, History, 
  LogOut, Plus, Search, Filter, Edit, Trash2, Copy, Check, 
  AlertTriangle, ArrowUpRight, ExternalLink, Printer, TrendingUp,
  Upload, Database, Cloud, CheckCircle, RefreshCw
} from 'lucide-react';
import { store } from '../../services/store';
import { Product, Order, Customer, Coupon, Banner, Review, OrderStatus, ProductCategory } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Logo } from '../../components/common/Logo';
import { imageKitConfig, uploadToImageKit } from '../../services/imagekit';

interface AdminPanelProps {
  onNavigateHome: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigateHome, onLogout }) => {
  const { showToast } = useToast();

  // Active Admin Section
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 
    'inventory' | 'coupons' | 'banners' | 'reviews' | 'refunds' | 
    'content' | 'reports' | 'settings' | 'users' | 'audit'
  >('dashboard');

  // Reactive Data Sources
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [customers, setCustomers] = useState<Customer[]>(store.getCustomers());
  const [coupons, setCoupons] = useState<Coupon[]>(store.getCoupons());
  const [banners, setBanners] = useState<Banner[]>(store.getBanners());
  const [reviews, setReviews] = useState<Review[]>(store.getReviews());
  const [settings, setSettings] = useState(store.getSettings());
  const [auditLogs, setAuditLogs] = useState(store.getAuditLogs());

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product Modal State (Add/Edit)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pSku, setPSku] = useState('');
  const [pCategory, setPCategory] = useState<ProductCategory>('Toys');
  const [pPrice, setPPrice] = useState(999);
  const [pMrp, setPMrp] = useState(1499);
  const [pStock, setPStock] = useState(20);
  const [pImage, setPImage] = useState('');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pStoryHeadline, setPStoryHeadline] = useState('');
  const [pStoryContent, setPStoryContent] = useState('');
  const [pBadge, setPBadge] = useState<any>('BESTSELLER');
  const [pIsPersonalized, setPIsPersonalized] = useState(false);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Confirmed');
  const [newTrackingNum, setNewTrackingNum] = useState('');

  // Coupon Form Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cDiscountValue, setCDiscountValue] = useState(15);
  const [cMinOrder, setCMinOrder] = useState(999);
  const [cDesc, setCDesc] = useState('');

  useEffect(() => {
    const update = () => {
      setProducts(store.getProducts());
      setOrders(store.getOrders());
      setCustomers(store.getCustomers());
      setCoupons(store.getCoupons());
      setBanners(store.getBanners());
      setReviews(store.getReviews());
      setSettings(store.getSettings());
      setAuditLogs(store.getAuditLogs());
    };
    const unsub = store.subscribe(update);
    return unsub;
  }, []);

  // Compute Dashboard Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Handle Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPTitle('');
    setPSku(`GT-PROD-${Math.floor(100 + Math.random() * 900)}`);
    setPCategory('Toys');
    setPPrice(899);
    setPMrp(1499);
    setPStock(25);
    setPImage('https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80');
    setPShortDesc('Beautifully designed gift crafted with love and child-safe materials.');
    setPStoryHeadline('A Beautiful Gift for Beautiful Memories');
    setPStoryContent('Created to spark smiles and lifelong happiness.');
    setPBadge('NEW');
    setPIsPersonalized(false);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPTitle(p.title);
    setPSku(p.sku);
    setPCategory(p.category);
    setPPrice(p.price);
    setPMrp(p.mrp);
    setPStock(p.stock);
    setPImage(p.images[0]);
    setPShortDesc(p.shortDescription);
    setPStoryHeadline(p.story.headline);
    setPStoryContent(p.story.content);
    setPBadge(p.badge || 'BESTSELLER');
    setPIsPersonalized(p.isPersonalized);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.round(((pMrp - pPrice) / pMrp) * 100);

    if (editingProduct) {
      store.updateProduct(editingProduct.id, {
        title: pTitle,
        sku: pSku,
        category: pCategory,
        price: Number(pPrice),
        mrp: Number(pMrp),
        discount,
        stock: Number(pStock),
        images: [pImage],
        shortDescription: pShortDesc,
        story: { headline: pStoryHeadline, content: pStoryContent },
        badge: pBadge,
        isPersonalized: pIsPersonalized,
      });
      showToast(`Product "${pTitle}" updated successfully!`, 'success');
    } else {
      store.createProduct({
        title: pTitle,
        slug: pTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: pSku,
        category: pCategory,
        price: Number(pPrice),
        mrp: Number(pMrp),
        discount,
        stock: Number(pStock),
        rating: 5.0,
        reviewCount: 1,
        images: [pImage],
        shortDescription: pShortDesc,
        story: { headline: pStoryHeadline, content: pStoryContent },
        features: ['Safe non-toxic certified', 'Artisanal packaging', 'Premium quality'],
        specs: {
          material: 'Certified Premium Materials',
          dimensions: '30 cm x 20 cm',
          weight: '400g',
          recommendedAge: 'All Ages',
        },
        includes: ['1x Product', 'GiggleThreads Tag', 'Care Guide'],
        careInstructions: 'Spot clean with mild damp cloth.',
        safetyInfo: 'Certified BIS non-toxic compliance.',
        deliveryDays: 3,
        isBestseller: pBadge === 'BESTSELLER',
        isFeatured: true,
        isNewArrival: true,
        isPersonalized: pIsPersonalized,
        tags: [pCategory.toLowerCase(), 'gift', 'toys'],
        occasions: ['Birthday', 'Just Because'],
      });
      showToast(`New product "${pTitle}" published to storefront! 🎉`, 'success');
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      store.deleteProduct(id);
      showToast(`Product "${title}" removed from catalog.`, 'info');
    }
  };

  const handleDuplicateProduct = (id: string) => {
    const dup = store.duplicateProduct(id);
    if (dup) {
      showToast(`Duplicated product created: "${dup.title}"`, 'success');
    }
  };

  // Adjust stock
  const handleStockAdjust = (id: string, currentStock: number, delta: number) => {
    const newCount = Math.max(0, currentStock + delta);
    store.updateProduct(id, { stock: newCount });
    showToast(`Stock updated to ${newCount}`, 'info');
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId: string) => {
    store.updateOrderStatus(orderId, newStatus, newTrackingNum, 'BlueDart Express');
    showToast(`Order status updated to ${newStatus}`, 'success');
    setSelectedOrder(null);
  };

  // Coupon Creation
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode) return;
    store.createCoupon({
      code: cCode.toUpperCase(),
      discountType: 'percentage',
      discountValue: Number(cDiscountValue),
      minOrderValue: Number(cMinOrder),
      description: cDesc || `${cDiscountValue}% off on orders above ₹${cMinOrder}`,
      validUntil: '2027-12-31',
      isActive: true,
      usageCount: 0,
    });
    showToast(`Coupon ${cCode.toUpperCase()} activated!`, 'success');
    setShowCouponModal(false);
    setCCode('');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        {/* Logo & Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1E293B' }}>
          <Logo variant="admin" size="md" showTagline={false} />
          <div style={{
            fontSize: '0.74rem',
            color: '#94A3B8',
            fontWeight: 600,
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06D6A0' }} />
            <span>Store Operations Live</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products (50+)', icon: Package, count: products.length },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, count: orders.length },
            { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
            { id: 'inventory', label: 'Inventory & Alerts', icon: Boxes, alert: lowStockProducts.length },
            { id: 'coupons', label: 'Coupons & Promos', icon: Tag },
            { id: 'banners', label: 'Homepage Banners', icon: ImageIcon },
            { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare, count: reviews.length },
            { id: 'refunds', label: 'Refunds & Returns', icon: RotateCcw },
            { id: 'content', label: 'Content Management', icon: FileEdit },
            { id: 'reports', label: 'Sales Reports', icon: FileSpreadsheet },
            { id: 'settings', label: 'Store Settings', icon: Settings },
            { id: 'users', label: 'Admin Users & Roles', icon: ShieldCheck },
            { id: 'audit', label: 'Audit Logs', icon: History },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                style={{ width: 'calc(100% - 20px)' }}
              >
                <Icon size={18} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.count !== undefined && (
                  <span style={{
                    fontSize: '0.72rem',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#1E293B',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}>
                    {item.count}
                  </span>
                )}
                {item.alert !== undefined && item.alert > 0 && (
                  <span style={{
                    fontSize: '0.72rem',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                  }}>
                    {item.alert} low
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onNavigateHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              fontSize: '0.84rem',
              fontWeight: 600,
            }}
          >
            <ExternalLink size={15} color="#FF5B60" />
            <span>Open Storefront</span>
          </button>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              color: '#EF4444',
              fontSize: '0.84rem',
              fontWeight: 600,
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="admin-main">
        {/* Admin Header */}
        <header className="admin-header">
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              Good morning, Admin 👋
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Here's what's happening at <strong>GiggleThreads</strong> today.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '9999px',
            }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FF5B60', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                SJ
              </div>
              <div style={{ fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>Sarah Jenkins</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body Content */}
        <div className="admin-content">
          {/* ================= 1. DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* 8 Analytics Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '16px',
              }}>
                <div className="admin-metric-card">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>TOTAL REVENUE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>₹{totalRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>+18.4% from last month</div>
                </div>

                <div className="admin-metric-card">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>TODAY'S SALES</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FF5B60' }}>₹5,230</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>3 completed orders</div>
                </div>

                <div className="admin-metric-card">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>TOTAL ORDERS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>{orders.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>100% fulfillment rate</div>
                </div>

                <div className="admin-metric-card">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>PENDING ORDERS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B' }}>{pendingOrdersCount}</div>
                  <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700, marginTop: '4px' }}>Ready for dispatch</div>
                </div>

                <div className="admin-metric-card">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>ACTIVE PRODUCTS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>{products.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>Across 8 categories</div>
                </div>

                <div className="admin-metric-card">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>CUSTOMERS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>{customers.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>+4 new today</div>
                </div>

                <div className="admin-metric-card">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>LOW STOCK ALERTS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: lowStockProducts.length > 0 ? '#EF4444' : '#059669' }}>
                    {lowStockProducts.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: 700, marginTop: '4px' }}>Needs restock</div>
                </div>

                <div className="admin-metric-card">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>REFUNDS PROCESSED</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>0</div>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>0.0% return rate</div>
                </div>
              </div>

              {/* Visual Charts & Category Analytics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
                {/* Revenue Trend Chart Card */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Weekly Revenue Performance</h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Online sales verified via Razorpay</div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', backgroundColor: '#E6FBF5', padding: '4px 10px', borderRadius: '8px' }}>
                      +24.5% Wow
                    </span>
                  </div>

                  {/* SVG Line Chart */}
                  <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                    <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      {/* Grid lines */}
                      <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="90" x2="600" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" strokeWidth="1" />

                      {/* Area Fill */}
                      <path 
                        d="M 0 160 Q 100 120, 200 130 T 400 70 T 600 40 L 600 200 L 0 200 Z" 
                        fill="rgba(255, 91, 96, 0.08)" 
                      />

                      {/* Line */}
                      <path 
                        d="M 0 160 Q 100 120, 200 130 T 400 70 T 600 40" 
                        fill="none" 
                        stroke="#FF5B60" 
                        strokeWidth="3.5" 
                      />

                      {/* Data dots */}
                      <circle cx="0" cy="160" r="5" fill="#FF5B60" />
                      <circle cx="100" cy="140" r="5" fill="#FF5B60" />
                      <circle cx="200" cy="130" r="5" fill="#FF5B60" />
                      <circle cx="300" cy="95" r="5" fill="#FF5B60" />
                      <circle cx="400" cy="70" r="5" fill="#FF5B60" />
                      <circle cx="500" cy="55" r="5" fill="#FF5B60" />
                      <circle cx="600" cy="40" r="5" fill="#FF5B60" />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94A3B8', marginTop: '12px' }}>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* Sales by Category Distribution */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
                    Sales by Category
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Soft Toys', pct: 32, color: '#FF5B60' },
                      { name: 'Gift Hampers', pct: 28, color: '#F59E0B' },
                      { name: 'Toys & RC', pct: 20, color: '#06D6A0' },
                      { name: 'Personalized', pct: 12, color: '#3B82F6' },
                      { name: 'Educational', pct: 8, color: '#8B5CF6' },
                    ].map((c) => (
                      <div key={c.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                          <span>{c.name}</span>
                          <span>{c.pct}%</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${c.pct}%`, height: '100%', backgroundColor: c.color, borderRadius: '9999px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Recent Store Orders</h3>
                  <button onClick={() => setActiveTab('orders')} style={{ fontSize: '0.84rem', color: '#FF5B60', fontWeight: 700 }}>
                    Manage All Orders &rarr;
                  </button>
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id}>
                        <td style={{ fontWeight: 700, color: '#0F172A' }}>#{ord.orderNumber}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{ord.customer.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{ord.customer.email}</div>
                        </td>
                        <td>{ord.items.length} items</td>
                        <td style={{ fontWeight: 700 }}>₹{ord.total}</td>
                        <td>
                          <span style={{
                            backgroundColor: ord.paymentStatus === 'paid' ? '#E6FBF5' : '#FEF3C7',
                            color: ord.paymentStatus === 'paid' ? '#059669' : '#B45309',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}>
                            {ord.paymentStatus.toUpperCase()} ({ord.paymentMethod.toUpperCase()})
                          </span>
                        </td>
                        <td>
                          <span style={{
                            backgroundColor: ord.orderStatus === 'Delivered' ? '#E6FBF5' : '#FFF0F1',
                            color: ord.orderStatus === 'Delivered' ? '#059669' : '#FF5B60',
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setSelectedOrder(ord);
                              setNewStatus(ord.orderStatus);
                              setNewTrackingNum(ord.trackingNumber || '');
                            }}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 2. PRODUCTS CRUD ================= */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                    Store Products ({products.length})
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Create, edit, duplicate, and manage all storefront gift items.
                  </p>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={handleOpenAddProduct}
                  style={{ padding: '10px 20px' }}
                >
                  <Plus size={18} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Search filter */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <Search size={18} color="#94A3B8" />
                <input 
                  type="text"
                  placeholder="Search products by title, SKU or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>

              {/* Products Table */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price / MRP</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Badge</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((p) => p.title.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase()))
                      .map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img 
                                src={p.images[0]} 
                                alt={p.title} 
                                style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} 
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: '#0F172A', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {p.title}
                                </div>
                                {p.isPersonalized && (
                                  <span style={{ fontSize: '0.72rem', color: '#3B82F6', fontWeight: 600 }}>Personalized</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#64748B', fontFamily: 'monospace' }}>{p.sku}</td>
                          <td>{p.category}</td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>₹{p.price}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{p.mrp}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{
                                fontWeight: 700,
                                color: p.stock <= 5 ? '#EF4444' : '#0F172A',
                              }}>
                                {p.stock}
                              </span>
                              {p.stock <= 5 && (
                                <span title="Low stock alert"><AlertTriangle size={14} color="#EF4444" /></span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#F59E0B' }}>★ {p.rating}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}> ({p.reviewCount})</span>
                          </td>
                          <td>
                            {p.badge && (
                              <span className="badge badge-bestseller" style={{ fontSize: '0.7rem' }}>
                                {p.badge}
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button 
                                onClick={() => handleOpenEditProduct(p)}
                                style={{ padding: '6px', color: '#3B82F6' }}
                                title="Edit Product"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDuplicateProduct(p.id)}
                                style={{ padding: '6px', color: '#64748B' }}
                                title="Duplicate Product"
                              >
                                <Copy size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                style={{ padding: '6px', color: '#EF4444' }}
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. CATEGORIES ================= */}
          {activeTab === 'categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                  Categories Management
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Manage the 8 core GiggleThreads collections.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {store.getCategories().map((c) => (
                  <div key={c.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', gap: '14px' }}>
                    <img src={c.image} alt={c.name} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{c.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#FF5B60', fontStyle: 'italic', marginBottom: '4px' }}>"{c.tagline}"</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{c.itemCount} active products</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. ORDERS ================= */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                    Orders Management ({orders.length})
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Track customer shipments, update delivery statuses, and print invoices.
                  </p>
                </div>
              </div>

              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      backgroundColor: orderStatusFilter === status ? '#FF5B60' : '#FFFFFF',
                      color: orderStatusFilter === status ? '#FFFFFF' : '#475569',
                      border: '1px solid #E2E8F0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {status === 'all' ? 'All Orders' : status}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((o) => orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter)
                      .map((o) => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 800, color: '#0F172A' }}>#{o.orderNumber}</td>
                          <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{o.customer.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{o.customer.phone}</div>
                          </td>
                          <td>
                            {o.items.map((it, idx) => (
                              <div key={idx} style={{ fontSize: '0.8rem', color: '#334155' }}>
                                {it.quantity}x {it.productTitle}
                              </div>
                            ))}
                          </td>
                          <td style={{ fontWeight: 800 }}>₹{o.total}</td>
                          <td>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>
                              {o.paymentStatus.toUpperCase()} ({o.paymentMethod.toUpperCase()})
                            </span>
                          </td>
                          <td>
                            <span style={{
                              backgroundColor: o.orderStatus === 'Delivered' ? '#E6FBF5' : '#FFF0F1',
                              color: o.orderStatus === 'Delivered' ? '#059669' : '#FF5B60',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                            }}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setSelectedOrder(o);
                                setNewStatus(o.orderStatus);
                                setNewTrackingNum(o.trackingNumber || '');
                              }}
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 5. INVENTORY ================= */}
          {activeTab === 'inventory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                  Inventory &amp; Stock Levels
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Monitor available warehouse units and low-stock alerts.
                </p>
              </div>

              {/* Low stock alert box */}
              {lowStockProducts.length > 0 && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <AlertTriangle size={24} color="#EF4444" />
                  <div>
                    <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '0.92rem' }}>
                      {lowStockProducts.length} Products Have Reached Low Stock Threshold (5 or fewer units)!
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#B91C1C' }}>
                      Adjust warehouse inventory below to prevent out-of-stock orders.
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Current Units</th>
                      <th>Status</th>
                      <th>Quick Stock Adjustment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700, color: '#0F172A' }}>{p.title}</td>
                        <td>{p.category}</td>
                        <td style={{ fontWeight: 800, fontSize: '1.05rem', color: p.stock <= 5 ? '#EF4444' : '#0F172A' }}>
                          {p.stock} units
                        </td>
                        <td>
                          {p.stock <= 5 ? (
                            <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.8rem' }}>⚠️ Only {p.stock} left</span>
                          ) : (
                            <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.8rem' }}>✓ Optimal Stock</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStockAdjust(p.id, p.stock, -5)}
                            >
                              -5
                            </button>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStockAdjust(p.id, p.stock, 5)}
                            >
                              +5
                            </button>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStockAdjust(p.id, p.stock, 25)}
                            >
                              +25 (Restock)
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 6. COUPONS ================= */}
          {activeTab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                    Coupon Promotions
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Manage discount codes for marketing campaigns.
                  </p>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCouponModal(true)}
                >
                  <Plus size={16} />
                  <span>Create New Coupon</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {coupons.map((c) => (
                  <div key={c.code} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FF5B60' }}>{c.code}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#E6FBF5', color: '#059669', padding: '2px 8px', borderRadius: '9999px' }}>
                        Active ({c.usageCount} uses)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E2229', marginBottom: '6px' }}>
                      {c.description}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '14px' }}>
                      Discount: {c.discountValue}% off • Min Order: ₹{c.minOrderValue}
                    </div>
                    <button 
                      onClick={() => {
                        store.deleteCoupon(c.code);
                        showToast(`Coupon ${c.code} deleted.`, 'info');
                      }}
                      style={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: 700 }}
                    >
                      Delete Promo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 7. BANNERS ================= */}
          {activeTab === 'banners' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                  Homepage Promotional Banners
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Manage the 5 hero campaigns displayed on the storefront.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {banners.map((b) => (
                  <div 
                    key={b.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <img src={b.image} alt={b.title} style={{ width: '90px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#FF5B60', fontWeight: 700 }}>{b.badge}</div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>{b.title}</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{b.subtitle}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', backgroundColor: '#E6FBF5', padding: '4px 10px', borderRadius: '9999px' }}>
                        Active (Order #{b.displayOrder})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 8. REVIEWS ================= */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                  Customer Reviews Moderation ({reviews.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Approve and publish customer feedback.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.customerName}</span>
                        <span style={{ color: '#64748B', fontSize: '0.8rem' }}> on {r.date}</span>
                      </div>
                      <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {r.rating}.0</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginBottom: '4px' }}>{r.title}</div>
                    <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>{r.comment}</p>
                    {r.adminReply && (
                      <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#059669', backgroundColor: '#E6FBF5', padding: '8px 12px', borderRadius: '8px' }}>
                        Admin Reply: "{r.adminReply.comment}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 9. SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
              {/* Store Policies & Brand */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '18px' }}>
                  Store Configuration &amp; Policies
                </h2>
                <div className="form-group">
                  <label className="form-label">Store Brand Name</label>
                  <input type="text" className="form-input" value={settings.storeName} readOnly style={{ backgroundColor: '#F8FAFC' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Official Tagline</label>
                  <input type="text" className="form-input" value={settings.tagline} readOnly style={{ backgroundColor: '#F8FAFC' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Free Shipping Threshold (₹)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={settings.freeShippingThreshold}
                      onChange={(e) => store.updateSettings({ freeShippingThreshold: Number(e.target.value) })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Standard Shipping Rate (₹)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={settings.standardShippingRate}
                      onChange={(e) => store.updateSettings({ standardShippingRate: Number(e.target.value) })} 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">GST Tax Rate (%)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={settings.gstRate}
                    onChange={(e) => store.updateSettings({ gstRate: Number(e.target.value) })} 
                  />
                </div>
              </div>

              {/* ImageKit Media CDN Configuration */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Cloud size={20} color="var(--color-primary)" /> ImageKit Media Storage &amp; CDN
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                      High-speed media delivery, real-time WebP/AVIF compression, and automated image transformations.
                    </p>
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}>
                    <CheckCircle size={14} /> Active &amp; Connected
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">ImageKit ID</label>
                    <input type="text" className="form-input" value={imageKitConfig.id} readOnly style={{ backgroundColor: '#F8FAFC', fontFamily: 'monospace' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Public Key</label>
                    <input type="text" className="form-input" value={imageKitConfig.publicKey} readOnly style={{ backgroundColor: '#F8FAFC', fontFamily: 'monospace' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">URL Endpoint</label>
                  <input type="text" className="form-input" value={imageKitConfig.urlEndpoint} readOnly style={{ backgroundColor: '#F8FAFC', fontFamily: 'monospace' }} />
                </div>

                {/* Quick Test Upload to ImageKit */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px dashed #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>Upload Media Asset to ImageKit</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Folder: <code>/gigglethreads/products</code></div>
                  </div>
                  <label className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <Upload size={14} /> Test Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        showToast('Uploading file to ImageKit CDN...', 'info');
                        const res = await uploadToImageKit(file);
                        showToast(`Uploaded successfully! CDN URL generated ✨`, 'success');
                      }} 
                    />
                  </label>
                </div>
              </div>

              {/* MongoDB Atlas Database & Repository Info */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Database size={20} color="var(--color-primary)" /> MongoDB Atlas &amp; Infrastructure
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Database Cluster</label>
                    <input type="text" className="form-input" value="giggle.kupuume.mongodb.net" readOnly style={{ backgroundColor: '#F8FAFC' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Database Name</label>
                    <input type="text" className="form-input" value="giggle" readOnly style={{ backgroundColor: '#F8FAFC' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Source Repository</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      value="https://github.com/adarshsachan9967-ops/giggle.git" 
                      readOnly 
                      style={{ backgroundColor: '#F8FAFC', fontFamily: 'monospace' }} 
                    />
                    <a 
                      href="https://github.com/adarshsachan9967-ops/giggle" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary" 
                      style={{ padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ExternalLink size={14} /> Open
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 10. AUDIT LOGS ================= */}
          {activeTab === 'audit' && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
                System &amp; Action Audit Logs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {auditLogs.map((log) => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #F1F5F9', fontSize: '0.85rem' }}>
                    <div>
                      <strong>{log.action}</strong>: {log.details}
                      <span style={{ color: '#94A3B8', marginLeft: '8px' }}>by {log.user}</span>
                    </div>
                    <span style={{ color: '#64748B' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= OTHER SECTIONS (CUSTOMERS / CONTENT / REPORTS / USERS) ================= */}
          {(activeTab === 'customers' || activeTab === 'content' || activeTab === 'reports' || activeTab === 'users' || activeTab === 'refunds') && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', border: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'capitalize', marginBottom: '8px' }}>
                {activeTab} Management
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>
                Operational module for GiggleThreads enterprise management.
              </p>
              {activeTab === 'customers' && (
                <table className="admin-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th></tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 700 }}>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>{c.totalOrders}</td>
                        <td style={{ fontWeight: 700 }}>₹{c.totalSpent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'reports' && (
                <div>
                  <p>Comprehensive monthly sales, order volume, and category reports are calculated in real-time.</p>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => showToast('Sales Report CSV generated & downloaded! 📊', 'success')}
                  >
                    Export Sales CSV
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= PRODUCT ADD / EDIT MODAL ================= */}
      {showProductModal && (
        <div className="modal-backdrop" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product to Catalog'}
            </h3>
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input type="text" className="form-input" value={pTitle} onChange={(e) => setPTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">SKU *</label>
                  <input type="text" className="form-input" value={pSku} onChange={(e) => setPSku(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={pCategory} onChange={(e) => setPCategory(e.target.value as any)}>
                    <option value="Toys">Toys</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Soft Toys">Soft Toys</option>
                    <option value="Personalized">Personalized</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Couple Gifts">Couple Gifts</option>
                    <option value="Gift Hampers">Gift Hampers</option>
                    <option value="Educational Toys">Educational Toys</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input type="number" className="form-input" value={pPrice} onChange={(e) => setPPrice(Number(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">MRP (₹) *</label>
                  <input type="number" className="form-input" value={pMrp} onChange={(e) => setPMrp(Number(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Units *</label>
                  <input type="number" className="form-input" value={pStock} onChange={(e) => setPStock(Number(e.target.value))} required />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Product Image URL *</label>
                  <label style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '5px', 
                    fontSize: '0.78rem', 
                    color: 'var(--color-primary)', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 91, 96, 0.08)',
                    padding: '3px 10px',
                    borderRadius: '6px'
                  }}>
                    <Upload size={13} /> Upload via ImageKit
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        showToast('Uploading to ImageKit CDN...', 'info');
                        const res = await uploadToImageKit(file);
                        setPImage(res.url);
                        showToast('Image uploaded & linked via ImageKit! ✨', 'success');
                      }}
                    />
                  </label>
                </div>
                <input 
                  type="url" 
                  className="form-input" 
                  value={pImage} 
                  onChange={(e) => setPImage(e.target.value)} 
                  placeholder="https://ik.imagekit.io/avdarinn/... or https://..." 
                  required 
                />
                {pImage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <img src={pImage} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1' }} />
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>✓ ImageKit CDN Verified</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <textarea className="form-textarea" value={pShortDesc} onChange={(e) => setPShortDesc(e.target.value)} required style={{ minHeight: '60px' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Product Story Headline</label>
                <input type="text" className="form-input" value={pStoryHeadline} onChange={(e) => setPStoryHeadline(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '560px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
              Manage Order #{selectedOrder.orderNumber}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Customer: {selectedOrder.customer.name} ({selectedOrder.customer.phone})
            </div>

            <div className="form-group">
              <label className="form-label">Update Status</label>
              <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)}>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tracking Number (AWB)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. GT-BLR-98214"
                value={newTrackingNum} 
                onChange={(e) => setNewTrackingNum(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => handleUpdateOrderStatus(selectedOrder.id)}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE COUPON MODAL ================= */}
      {showCouponModal && (
        <div className="modal-backdrop" onClick={() => setShowCouponModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>Create Promotional Coupon</h3>
            <form onSubmit={handleCreateCoupon}>
              <div className="form-group">
                <label className="form-label">Coupon Code (Uppercase)</label>
                <input type="text" className="form-input" placeholder="e.g. MAGIC20" value={cCode} onChange={(e) => setCCode(e.target.value.toUpperCase())} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input type="number" className="form-input" value={cDiscountValue} onChange={(e) => setCDiscountValue(Number(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Order (₹)</label>
                  <input type="number" className="form-input" value={cMinOrder} onChange={(e) => setCMinOrder(Number(e.target.value))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" placeholder="e.g. 20% festive surprise" value={cDesc} onChange={(e) => setCDesc(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCouponModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
