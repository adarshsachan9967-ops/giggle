import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Trash2, ArrowRight, Gift, 
  Sparkles, CheckCircle2, Heart, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { store } from '../../services/store';
import { CartItem } from '../../types';
import { useToast } from '../../context/ToastContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(store.getCart());
  const [couponInput, setCouponInput] = useState('');
  const [giftWrapChecked, setGiftWrapChecked] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [showGiftMessageInput, setShowGiftMessageInput] = useState(false);

  useEffect(() => {
    const update = () => {
      setCart(store.getCart());
      setGiftWrapChecked(store.getCart().some((i) => i.giftWrap));
    };
    update();
    const unsub = store.subscribe(update);
    return unsub;
  }, []);

  if (!isOpen) return null;

  const totals = store.getCartTotals();
  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = store.applyCoupon(couponInput);
    if (res.success) {
      showToast(res.message, 'success');
      setCouponInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRemoveCoupon = () => {
    store.removeCoupon();
    showToast('Coupon removed', 'info');
  };

  const handleGiftWrapToggle = (checked: boolean) => {
    setGiftWrapChecked(checked);
    setShowGiftMessageInput(checked);
    // Apply gift wrap to items in cart
    const current = store.getCart();
    current.forEach((item) => {
      item.giftWrap = checked;
      if (checked) item.giftMessage = giftMessage;
    });
    // Trigger store update
    store.updateCartQuantity(current[0]?.product.id, current[0]?.quantity, current[0]?.selectedVariant?.id);
  };

  const handleSaveForLater = (item: CartItem) => {
    store.toggleWishlist(item.product.id);
    store.removeFromCart(item.product.id, item.selectedVariant?.id);
    showToast(`Moved "${item.product.title}" to your Wishlist ❤️`, 'info');
  };

  const handleProceedToCheckout = () => {
    onClose();
    if (!store.isCustomerLoggedIn()) {
      showToast('Please sign in or create an account to proceed to checkout 🎁', 'info');
      onNavigate('login', 'checkout');
      return;
    }
    onNavigate('checkout');
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #EFE4DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              backgroundColor: '#FFF0F1',
              color: '#FF5B60',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex',
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E2229' }}>
                Your Giggle Basket
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                {totals.itemCount} {totals.itemCount === 1 ? 'gift waiting' : 'gifts waiting'}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#64748B' }}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: totals.isFreeShipping ? '#E6FBF5' : '#FFF9F5',
          borderBottom: '1px solid #EFE4DC',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 600, color: totals.isFreeShipping ? '#059669' : '#C2410C', marginBottom: '6px' }}>
            {totals.isFreeShipping ? (
              <>
                <CheckCircle2 size={16} />
                <span>Yay! You've unlocked <strong>FREE Delivery</strong> on this order! 🎉</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>You're <strong>₹{totals.amountToFreeShipping}</strong> away from FREE delivery!</span>
              </>
            )}
          </div>
          <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progressPercent}%`, 
                backgroundColor: totals.isFreeShipping ? '#06D6A0' : '#FF5B60',
                transition: 'width 0.3s ease',
                borderRadius: '9999px'
              }} 
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#FFF0F1',
                color: '#FF5B60',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
              }}>
                <ShoppingBag size={38} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                Your Giggle Basket is Empty
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#64748B', maxWidth: '280px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                Little surprises create big giggles! Explore our cuddly soft toys, games, and thoughtful gifts.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onNavigate('catalog');
                }}
              >
                Start Gifting
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${item.selectedVariant?.id || idx}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.title} 
                    style={{ width: '74px', height: '74px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1E2229', marginBottom: '2px', lineHeight: 1.3 }}>
                      {item.product.title}
                    </div>

                    {item.selectedVariant && (
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '4px' }}>
                        Variant: {item.selectedVariant.name}
                      </div>
                    )}

                    {item.customText && (
                      <div style={{ fontSize: '0.78rem', color: '#FF5B60', fontStyle: 'italic', marginBottom: '4px' }}>
                        Personalized: "{item.customText}"
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E2229' }}>
                        ₹{item.product.price + (item.selectedVariant?.priceModifier || 0)}
                      </span>
                      {item.product.mrp > item.product.price && (
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                          ₹{item.product.mrp}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantity Selector */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1.5px solid #EFE4DC',
                        borderRadius: '9999px',
                        padding: '1px 6px',
                        backgroundColor: '#FFFFFF',
                      }}>
                        <button 
                          onClick={() => store.updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                          style={{ padding: '2px 6px', fontWeight: 700, color: '#64748B' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                        <button 
                          onClick={() => store.updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                          style={{ padding: '2px 6px', fontWeight: 700, color: '#64748B' }}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Actions */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleSaveForLater(item)}
                          style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}
                          title="Save for Later"
                        >
                          <Heart size={14} />
                          <span>Save</span>
                        </button>

                        <button 
                          onClick={() => store.removeFromCart(item.product.id, item.selectedVariant?.id)}
                          style={{ color: '#EF4444', padding: '4px' }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Gift Wrapping Addon Option */}
              <div style={{
                backgroundColor: '#FFF9F5',
                border: '1px solid #FFE6D5',
                borderRadius: '14px',
                padding: '14px',
                marginTop: '8px',
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={giftWrapChecked}
                    onChange={(e) => handleGiftWrapToggle(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#FF5B60', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <Gift size={18} color="#FF5B60" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E2229' }}>
                        Add Gift Wrapping (+₹99)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Wrapped in signature GiggleThreads box with satin ribbon &amp; greeting card
                      </div>
                    </div>
                  </div>
                </label>

                {showGiftMessageInput && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #FFE0CE' }}>
                    <textarea 
                      placeholder="Write your custom gift message here (e.g. Happy Birthday sweetie!)..."
                      value={giftMessage}
                      onChange={(e) => {
                        setGiftMessage(e.target.value);
                        const current = store.getCart();
                        current.forEach((i) => i.giftMessage = e.target.value);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.82rem',
                        resize: 'none',
                        height: '60px',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Coupon Code Section */}
              <div style={{ marginTop: '10px' }}>
                {totals.appliedCoupon ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#E6FBF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} color="#06D6A0" />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#065F46' }}>
                          {totals.appliedCoupon.code} APPLIED
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                          Saving ₹{totals.discount} on your smile order!
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleRemoveCoupon}
                      style={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text"
                      placeholder="Enter coupon (e.g. GIGGLE10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #EFE4DC',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    />
                    <button 
                      type="submit"
                      className="btn btn-secondary"
                      style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                    >
                      Apply
                    </button>
                  </form>
                )}
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
                  💡 Try: <span style={{ color: '#FF5B60', fontWeight: 700 }}>GIGGLE10</span> (10% off) or <span style={{ color: '#FF5B60', fontWeight: 700 }}>SMILE15</span> (₹999+)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #EFE4DC',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#1E2229' }}>₹{totals.subtotal}</span>
              </div>

              {totals.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#06D6A0' }}>
                  <span>Coupon Discount</span>
                  <span style={{ fontWeight: 700 }}>-₹{totals.discount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Shipping</span>
                <span>{totals.shippingCost === 0 ? <strong style={{ color: '#06D6A0' }}>FREE</strong> : `₹${totals.shippingCost}`}</span>
              </div>

              {totals.giftWrapFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Signature Gift Wrap</span>
                  <span style={{ fontWeight: 600, color: '#1E2229' }}>₹{totals.giftWrapFee}</span>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                marginTop: '4px',
                borderTop: '1px solid #F1F5F9',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#1E2229',
              }}>
                <span>Grand Total</span>
                <span style={{ color: '#FF5B60', fontFamily: 'var(--font-heading)' }}>₹{totals.total}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748B', marginTop: '10px' }}>
              <ShieldCheck size={14} color="#06D6A0" />
              <span>Razorpay 256-Bit Encrypted Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
