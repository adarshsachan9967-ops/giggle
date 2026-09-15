import React, { useState, useEffect } from 'react';
import { 
  User, Package, Heart, MapPin, Tag, Headphones, 
  LogOut, Truck, Clock, CheckCircle2, ChevronRight, 
  Plus, Trash2, ArrowRight, ExternalLink 
} from 'lucide-react';
import { store } from '../services/store';
import { Order, Product, Customer, Address } from '../types';
import { useToast } from '../context/ToastContext';

interface AccountViewProps {
  initialTab?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ initialTab = 'dashboard', onNavigate }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [customer, setCustomer] = useState<Customer | null>(store.getCurrentCustomer());
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(customer?.name || '');
  const [editPhone, setEditPhone] = useState(customer?.phone || '');

  // Add Address State
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine1, setNewAddressLine1] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');

  useEffect(() => {
    const update = () => {
      const c = store.getCurrentCustomer();
      setCustomer(c);
      setOrders(store.getOrders());
      const wishIds = store.getWishlist();
      setWishlistProducts(store.getProducts().filter((p) => wishIds.includes(p.id)));
      if (c) {
        setEditName(c.name);
        setEditPhone(c.phone);
      }
    };
    update();
    const unsub = store.subscribe(update);
    return unsub;
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCustomerProfile({ name: editName, phone: editPhone });
    showToast('Profile updated successfully!', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newAddressLine1 || !newCity || !newPincode) {
      showToast('Please fill all address fields.', 'error');
      return;
    }
    const newAddr: Address = {
      id: `addr-${Date.now().toString(36)}`,
      fullName: newFullName,
      phone: newPhone,
      addressLine1: newAddressLine1,
      city: newCity,
      state: newState,
      pincode: newPincode,
      type: 'home',
    };
    const currentAddresses = customer?.addresses || [];
    store.updateCustomerProfile({ addresses: [...currentAddresses, newAddr] });
    showToast('New delivery address saved!', 'success');
    setShowAddAddressModal(false);
    setNewFullName('');
    setNewPhone('');
    setNewAddressLine1('');
    setNewCity('');
    setNewState('');
    setNewPincode('');
  };

  const handleRemoveWishlist = (productId: string) => {
    store.toggleWishlist(productId);
    showToast('Removed from wishlist', 'info');
  };

  const handleMoveWishlistToBasket = (productId: string) => {
    store.moveToCart(productId);
    showToast('Moved to your Giggle Basket! 🎁', 'success');
  };

  return (
    <div style={{ padding: '36px 0 80px', backgroundColor: '#FAF7F5', minHeight: '85vh' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CUSTOMER PORTAL
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1E2229' }}>
            My GiggleThreads
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem' }}>
            Manage your orders, smile wishlist, addresses and personal preferences.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="account-layout-grid">
          {/* Sidebar Menu */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #EFE4DC',
            padding: '16px',
            boxShadow: 'var(--shadow-xs)',
            height: 'fit-content',
          }}>
            {/* User Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px 18px',
              borderBottom: '1px solid #F1F5F9',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#FFF0F1',
                color: '#FF5B60',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}>
                {customer?.name?.[0] || 'G'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E2229', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {customer?.name || 'Valued Customer'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {customer?.email || 'guest@gigglethreads.com'}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: User },
                { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
                { id: 'wishlist', label: 'Saved for a Smile', icon: Heart, count: wishlistProducts.length },
                { id: 'addresses', label: 'Delivery Addresses', icon: MapPin },
                { id: 'coupons', label: 'My Coupons', icon: Tag, count: 4 },
                { id: 'support', label: 'Help & Support', icon: Headphones },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.88rem',
                      backgroundColor: isActive ? '#FFF0F1' : 'transparent',
                      color: isActive ? '#FF5B60' : '#475569',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span style={{
                        backgroundColor: isActive ? '#FF5B60' : '#F1F5F9',
                        color: isActive ? '#FFFFFF' : '#64748B',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  store.logoutCustomer();
                  onNavigate('home');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#EF4444',
                  marginTop: '12px',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div>
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Metric Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #EFE4DC' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>Total Orders</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E2229' }}>{orders.length}</div>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #EFE4DC' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>Saved Items</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FF5B60' }}>{wishlistProducts.length}</div>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #EFE4DC' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>Smile Savings</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#06D6A0' }}>₹840</div>
                  </div>
                </div>

                {/* Recent Order Preview */}
                {orders.length > 0 && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE4DC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Most Recent Order</h3>
                      <button onClick={() => setActiveTab('orders')} style={{ fontSize: '0.85rem', color: '#FF5B60', fontWeight: 700 }}>
                        View All Orders &rarr;
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Order #{orders[0].orderNumber}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          Placed on {new Date(orders[0].createdAt).toLocaleDateString()} • {orders[0].items.length} items
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FF5B60' }}>₹{orders[0].total}</div>
                        <span style={{
                          backgroundColor: '#E6FBF5',
                          color: '#059669',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}>
                          {orders[0].orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Edit Form */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE4DC' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Profile Information</h3>
                  <form onSubmit={handleUpdateProfile}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mobile Number</label>
                        <input 
                          type="tel" 
                          className="form-input" 
                          value={editPhone} 
                          onChange={(e) => setEditPhone(e.target.value)} 
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-secondary">
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 2. ORDERS */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E2229' }}>
                  My Orders ({orders.length})
                </h2>

                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px solid #EFE4DC',
                      padding: '24px',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #F1F5F9',
                      paddingBottom: '14px',
                      marginBottom: '16px',
                      gap: '12px',
                    }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1E2229' }}>
                          Order #{order.orderNumber}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          backgroundColor: order.orderStatus === 'Delivered' ? '#E6FBF5' : '#FFF0F1',
                          color: order.orderStatus === 'Delivered' ? '#059669' : '#FF5B60',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}>
                          {order.orderStatus}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1E2229' }}>
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img 
                            src={item.productImage} 
                            alt={item.productTitle} 
                            style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} 
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1E2229' }}>
                              {item.productTitle}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                              Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                            </div>
                            {item.customText && (
                              <div style={{ fontSize: '0.75rem', color: '#FF5B60' }}>
                                Custom: "{item.customText}"
                              </div>
                            )}
                          </div>
                          <div style={{ fontWeight: 700, color: '#1E2229' }}>
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Actions */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '14px',
                      gap: '12px',
                    }}>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                        Carrier: <strong>{order.trackingCarrier || 'BlueDart Express'}</strong>
                        {order.trackingNumber && ` (AWB: ${order.trackingNumber})`}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedOrderForTracking(order)}
                        >
                          <Truck size={15} />
                          <span>Track Package</span>
                        </button>

                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => onNavigate('order-success', order.id)}
                        >
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. WISHLIST ("Things You're Saving for a Smile ❤️") */}
            {activeTab === 'wishlist' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E2229', marginBottom: '4px' }}>
                    Things You're Saving for a Smile ❤️
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                    Your private collection of gifts and toys you love. Ready to bring big giggles whenever you are!
                  </p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '60px 20px',
                    textAlign: 'center',
                    border: '1px solid #EFE4DC',
                  }}>
                    <Heart size={44} color="#CBD5E1" style={{ margin: '0 auto 14px' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                      Your Smile Wishlist is Empty
                    </h3>
                    <p style={{ color: '#64748B', maxWidth: '320px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
                      Click the little heart icon on any toy or gift to save it here for later.
                    </p>
                    <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>
                      Discover Gifts
                    </button>
                  </div>
                ) : (
                  <div className="grid-products" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
                    {wishlistProducts.map((p) => (
                      <div 
                        key={p.id}
                        className="product-card"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        <div className="product-card-image-wrap">
                          <img src={p.images[0]} alt={p.title} className="product-card-image" />
                          <button 
                            onClick={() => handleRemoveWishlist(p.id)}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#EF4444',
                            }}
                            title="Remove from wishlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="product-card-content">
                          <div className="product-card-category">{p.category}</div>
                          <h4 className="product-card-title">{p.title}</h4>
                          <div className="product-card-pricing">
                            <span className="product-card-price">₹{p.price}</span>
                            {p.mrp > p.price && <span className="product-card-mrp">₹{p.mrp}</span>}
                          </div>
                          <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', marginTop: 'auto' }}
                            onClick={() => handleMoveWishlistToBasket(p.id)}
                          >
                            <span>Move to Basket</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. ADDRESSES */}
            {activeTab === 'addresses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Saved Delivery Addresses</h2>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowAddAddressModal(true)}>
                    <Plus size={16} />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {(customer?.addresses || []).map((addr, i) => (
                    <div 
                      key={addr.id || i}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1.5px solid #EFE4DC',
                        position: 'relative',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E2229', marginBottom: '4px' }}>
                        {addr.fullName}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                        {addr.addressLine1}<br />
                        {addr.city}, {addr.state} - {addr.pincode}<br />
                        Phone: {addr.phone}
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF5B60', backgroundColor: '#FFF0F1', padding: '2px 8px', borderRadius: '4px' }}>
                          {addr.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. COUPONS */}
            {activeTab === 'coupons' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Available GiggleThreads Coupons</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {store.getCoupons().map((c) => (
                    <div
                      key={c.code}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1.5px dashed #FF5B60',
                        padding: '20px',
                        position: 'relative',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF5B60', marginBottom: '4px' }}>
                        {c.code}
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E2229', marginBottom: '6px' }}>
                        {c.description}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '14px' }}>
                        Min Order: ₹{c.minOrderValue} • Valid till {c.validUntil}
                      </div>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          store.applyCoupon(c.code);
                          showToast(`Applied ${c.code} to your cart! 🎁`, 'success');
                        }}
                      >
                        Apply to Basket
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SUPPORT */}
            {activeTab === 'support' && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '36px',
                border: '1px solid #EFE4DC',
              }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>
                  We're Here to Help!
                </h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Have questions about your order, customized gifts, or delivery timelines? The GiggleThreads support team is ready to bring smiles.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontWeight: 700, color: '#1E2229', marginBottom: '4px' }}>Email Care Team</div>
                    <div style={{ fontSize: '0.88rem', color: '#FF5B60', fontWeight: 600 }}>care@gigglethreads.com</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>Response within 2-4 hours</div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontWeight: 700, color: '#1E2229', marginBottom: '4px' }}>WhatsApp &amp; Phone</div>
                    <div style={{ fontSize: '0.88rem', color: '#059669', fontWeight: 600 }}>+91 98765 43210</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>Mon - Sat: 9 AM to 8 PM</div>
                  </div>
                </div>

                <button className="btn btn-secondary" onClick={() => onNavigate('contact')}>
                  Open Interactive Contact Form
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Tracking Modal */}
        {selectedOrderForTracking && (
          <div className="modal-backdrop" onClick={() => setSelectedOrderForTracking(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '580px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    Track Order #{selectedOrderForTracking.orderNumber}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Carrier: {selectedOrderForTracking.trackingCarrier || 'BlueDart Express'} • AWB: {selectedOrderForTracking.trackingNumber || 'GT-TRACK-8921'}
                  </span>
                </div>
                <button onClick={() => setSelectedOrderForTracking(null)} style={{ padding: '6px' }}>
                  &times;
                </button>
              </div>

              {/* Progress Stepper Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
                {selectedOrderForTracking.timeline.map((event, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#06D6A0',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CheckCircle2 size={16} />
                      </div>
                      {idx < selectedOrderForTracking.timeline.length - 1 && (
                        <div style={{ width: '2px', height: '36px', backgroundColor: '#CBD5E1' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1E2229' }}>
                        {event.status}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4 }}>
                        {event.description}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '2px' }}>
                        {event.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedOrderForTracking(null)}>
                  Close Tracker
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddAddressModal && (
          <div className="modal-backdrop" onClick={() => setShowAddAddressModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>
                Add New Delivery Address
              </h3>
              <form onSubmit={handleAddAddress}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address Line</label>
                  <input type="text" className="form-input" value={newAddressLine1} onChange={(e) => setNewAddressLine1(e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" value={newCity} onChange={(e) => setNewCity(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" className="form-input" value={newState} onChange={(e) => setNewState(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input type="text" className="form-input" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddAddressModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
