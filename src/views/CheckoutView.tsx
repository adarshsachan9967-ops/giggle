import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, CheckCircle2, Truck, CreditCard, 
  Smartphone, Building, Wallet, Banknote, ArrowRight, ArrowLeft, LogIn, UserPlus 
} from 'lucide-react';
import { store } from '../services/store';
import { Address, PaymentMethod } from '../types';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

interface CheckoutViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate, onOrderSuccess }) => {
  const { showToast } = useToast();
  const totals = store.getCartTotals();
  const cart = store.getCart();
  const currentCustomer = store.getCurrentCustomer();

  // Active step: 1 (Address) | 2 (Delivery Method) | 3 (Payment)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Address form loaded from logged-in customer's profile (or empty for user to enter)
  const userAddresses = currentCustomer?.addresses || [];
  const primaryAddr = userAddresses[0];

  const [fullName, setFullName] = useState(currentCustomer?.name || '');
  const [email, setEmail] = useState(currentCustomer?.email || '');
  const [phone, setPhone] = useState(currentCustomer?.phone || '');
  const [addressLine1, setAddressLine1] = useState(primaryAddr?.addressLine1 || '');
  const [city, setCity] = useState(primaryAddr?.city || '');
  const [state, setState] = useState(primaryAddr?.state || '');
  const [pincode, setPincode] = useState(primaryAddr?.pincode || '');

  // Step 2: Delivery Speed
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with currentCustomer if they log in
  useEffect(() => {
    if (currentCustomer) {
      if (!fullName) setFullName(currentCustomer.name || '');
      if (!email) setEmail(currentCustomer.email || '');
      if (!phone) setPhone(currentCustomer.phone || '');
      if (!addressLine1 && currentCustomer.addresses?.[0]) {
        setAddressLine1(currentCustomer.addresses[0].addressLine1 || '');
        setCity(currentCustomer.addresses[0].city || '');
        setState(currentCustomer.addresses[0].state || '');
        setPincode(currentCustomer.addresses[0].pincode || '');
      }
    }
  }, [currentCustomer]);

  // If user is not logged in, block checkout and display sign-in prompt
  if (!currentCustomer) {
    return (
      <div className="container" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '40px 32px',
          border: '1px solid #EFE4DC',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 91, 96, 0.1)',
            color: '#FF5B60',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '10px' }}>
            Please Log In to Checkout
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.92rem', marginBottom: '28px', lineHeight: 1.5 }}>
            To securely process your order, save your delivery details, and enable live tracking, please sign in or create an account.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => onNavigate('login', 'checkout')}
            >
              <LogIn size={18} />
              <span>Sign In to Continue</span>
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => onNavigate('signup', 'checkout')}
            >
              <UserPlus size={18} />
              <span>Create New Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
          Your Giggle Basket is Empty
        </h2>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>
          Add some joyful gifts before proceeding to checkout!
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>
          Explore Gifts &amp; Toys
        </button>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine1 || !city || !pincode) {
      showToast('Please fill all delivery address fields.', 'error');
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Submit = () => {
    setCurrentStep(3);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    // Simulate Razorpay server-side verification and order completion
    setTimeout(() => {
      const order = store.createOrder({
        customer: { name: fullName, email, phone },
        shippingAddress: {
          id: `addr-${Date.now().toString(36)}`,
          fullName,
          phone,
          addressLine1,
          city,
          state,
          pincode,
          type: 'home',
        },
        deliveryMethod,
        paymentMethod,
        giftWrap: cart.some((i) => i.giftWrap),
        giftMessage: cart.find((i) => i.giftMessage)?.giftMessage,
      });

      setIsProcessing(false);

      // Trigger celebratory confetti burst!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5B60', '#F59E0B', '#06D6A0', '#3B82F6'],
      });

      showToast('Yay! Your GiggleThreads order is confirmed! 🎉', 'success');
      onOrderSuccess(order.id);
    }, 1200);
  };

  const finalTotal = totals.total + (deliveryMethod === 'express' ? 100 : 0);

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#FAF7F5', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Checkout Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '36px',
          borderBottom: '1px solid #EFE4DC',
          paddingBottom: '20px',
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SECURE CHECKOUT
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E2229' }}>
              Finalize Your Smiles
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
            <ShieldCheck size={20} />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '36px',
        }}>
          {[
            { step: 1, title: '01 — Delivery Address' },
            { step: 2, title: '02 — Delivery Method' },
            { step: 3, title: '03 — Payment & Place Order' },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                backgroundColor: currentStep >= s.step ? '#FFFFFF' : '#F1F5F9',
                border: currentStep === s.step ? '2px solid #FF5B60' : '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: currentStep > s.step ? '#06D6A0' : (currentStep === s.step ? '#FF5B60' : '#CBD5E1'),
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {currentStep > s.step ? '✓' : s.step}
              </div>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: currentStep === s.step ? 700 : 500,
                color: currentStep === s.step ? '#1E2229' : '#64748B',
              }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Main 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
          {/* Left Form Area */}
          <div>
            {/* STEP 1: Delivery Address */}
            {currentStep === 1 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid #EFE4DC',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
                  Where should we send the smiles?
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>
                  Enter recipient address details accurately for timely courier delivery.
                </p>

                <form onSubmit={handleStep1Submit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (For tracking &amp; invoice) *</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address Line (Flat / Building / Street) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      required 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PIN Code *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        maxLength={6}
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                      <span>Continue to Delivery Method</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Delivery Method */}
            {currentStep === 2 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid #EFE4DC',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
                  Choose Delivery Speed
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>
                  Select how fast you need your GiggleThreads surprise delivered.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: deliveryMethod === 'standard' ? '2px solid #FF5B60' : '1px solid #E2E8F0',
                    backgroundColor: deliveryMethod === 'standard' ? '#FFF9F6' : '#FFFFFF',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <input 
                        type="radio" 
                        name="delivery-method"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        style={{ accentColor: '#FF5B60', width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2229' }}>Standard Delivery (3-5 Days)</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Safe handling via BlueDart / Delhivery</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: totals.isFreeShipping ? '#059669' : '#1E2229' }}>
                      {totals.isFreeShipping ? 'FREE' : '₹49'}
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: deliveryMethod === 'express' ? '2px solid #FF5B60' : '1px solid #E2E8F0',
                    backgroundColor: deliveryMethod === 'express' ? '#FFF9F6' : '#FFFFFF',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <input 
                        type="radio" 
                        name="delivery-method"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        style={{ accentColor: '#FF5B60', width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2229' }}>Express Priority Delivery (1-2 Days)</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Air shipping priority dispatch with tracking</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#1E2229' }}>
                      ₹149
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Address</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleStep2Submit}
                    style={{ padding: '12px 28px' }}
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Options (Razorpay Simulation) */}
            {currentStep === 3 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid #EFE4DC',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    Select Payment Method
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#3B82F6', fontWeight: 700, backgroundColor: '#EFF6FF', padding: '4px 10px', borderRadius: '9999px' }}>
                    Razorpay Gateway
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>
                  Secure payment verification. Your payment details are encrypted end-to-end.
                </p>

                {/* Payment Options Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { id: 'upi', name: 'UPI / QR', icon: Smartphone },
                    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                    { id: 'netbanking', name: 'Net Banking', icon: Building },
                    { id: 'wallet', name: 'Wallets', icon: Wallet },
                    { id: 'cod', name: 'Cash on Delivery', icon: Banknote },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                        style={{
                          padding: '14px 10px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #FF5B60' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#FFF0F1' : '#FFFFFF',
                          color: isSelected ? '#FF5B60' : '#475569',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Icon size={22} />
                        <span>{method.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Method Specific Fields */}
                {paymentMethod === 'upi' && (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                    <label className="form-label">Enter UPI ID (Google Pay / PhonePe / Paytm / BHIM)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                    />
                    <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '6px' }}>
                      A payment request will be triggered on your UPI app upon clicking "Pay &amp; Place Order".
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="16-digit card number"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="3 digits"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div style={{ backgroundColor: '#FEF3C7', padding: '16px', borderRadius: '14px', border: '1px solid #FDE68A', marginBottom: '24px' }}>
                    <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.9rem', marginBottom: '4px' }}>
                      Cash on Delivery Available
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#B45309' }}>
                      Please keep exact cash ready at the time of courier delivery. OTP verification will be required on your phone.
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-primary btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    style={{ padding: '14px 36px', opacity: isProcessing ? 0.7 : 1 }}
                  >
                    {isProcessing ? (
                      <span>Verifying Payment...</span>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>Pay &amp; Place Order (₹{finalTotal})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Order Summary Column */}
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #EFE4DC',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '100px',
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
                Order Summary ({totals.itemCount} gifts)
              </h3>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', marginBottom: '18px', paddingRight: '4px' }}>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.85rem' }}>
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.title} 
                      style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#1E2229', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product.title}
                      </div>
                      <div style={{ color: '#64748B', fontSize: '0.78rem' }}>
                        Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#1E2229' }}>
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Items Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#1E2229' }}>₹{totals.subtotal}</span>
                </div>

                {totals.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#06D6A0' }}>
                    <span>Coupon ({totals.appliedCoupon?.code})</span>
                    <span style={{ fontWeight: 700 }}>-₹{totals.discount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Delivery Method</span>
                  <span>{deliveryMethod === 'express' ? '₹149 (Express)' : (totals.isFreeShipping ? <strong style={{ color: '#06D6A0' }}>FREE</strong> : '₹49')}</span>
                </div>

                {totals.giftWrapFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>Gift Wrapping</span>
                    <span style={{ fontWeight: 600, color: '#1E2229' }}>₹{totals.giftWrapFee}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Taxes (GST 18% Incl.)</span>
                  <span style={{ fontWeight: 600, color: '#1E2229' }}>₹{totals.tax}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  marginTop: '6px',
                  borderTop: '1px solid #EFE4DC',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#1E2229',
                }}>
                  <span>Total Due</span>
                  <span style={{ color: '#FF5B60', fontFamily: 'var(--font-heading)' }}>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
