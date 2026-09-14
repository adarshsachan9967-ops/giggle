import React from 'react';
import { 
  CheckCircle2, Printer, ArrowRight, Package, 
  Truck, Calendar, MapPin, Sparkles, ShoppingBag 
} from 'lucide-react';
import { store } from '../services/store';
import { Logo } from '../components/common/Logo';

interface OrderSuccessViewProps {
  orderId: string;
  onNavigate: (view: string, param?: string) => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ orderId, onNavigate }) => {
  const order = store.getOrderById(orderId) || store.getOrders()[0];

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <button className="btn btn-primary" onClick={() => onNavigate('home')}>
          Back to Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#FAF7F5' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Celebration Banner */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid #EFE4DC',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: '#E6FBF5',
            color: '#06D6A0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <CheckCircle2 size={46} />
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800,
            color: '#1E2229',
            marginBottom: '10px',
          }}>
            Yay! Your GiggleThreads Order Is Confirmed! 🎉
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Your order is on its way to becoming someone's next big smile. We've sent a confirmation and tracking details to <strong>{order.customer.email}</strong>.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFF9F6',
            border: '1.5px solid #FFE4DB',
            borderRadius: '9999px',
            padding: '8px 24px',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#FF5B60',
            marginBottom: '28px',
          }}>
            <span>Order Number: #{order.orderNumber}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('track-order', order.orderNumber)}
            >
              <Truck size={18} />
              <span>Track Live Order</span>
            </button>

            <button 
              className="btn btn-secondary"
              onClick={handlePrint}
            >
              <Printer size={18} />
              <span>Print Tax Invoice</span>
            </button>

            <button 
              className="btn btn-ghost"
              onClick={() => onNavigate('catalog')}
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Card */}
        <div 
          id="invoice-print-area"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid #EFE4DC',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Invoice Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #F1F5F9',
            paddingBottom: '24px',
            marginBottom: '28px',
          }}>
            <div>
              <Logo variant="invoice" size="md" showTagline={true} />
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '8px', lineHeight: 1.4 }}>
                GiggleThreads Private Limited<br />
                42 Happiness Lane, Indiranagar, Bengaluru, KA 560038<br />
                GSTIN: 29AABCU9603R1ZM • care@gigglethreads.com
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E2229' }}>TAX INVOICE</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                Invoice No: <strong>INV-{order.orderNumber}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px', fontSize: '0.88rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Billed &amp; Shipped To:
              </div>
              <div style={{ fontWeight: 800, color: '#1E2229' }}>{order.shippingAddress.fullName}</div>
              <div style={{ color: '#475569' }}>{order.shippingAddress.addressLine1}</div>
              <div style={{ color: '#475569' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </div>
              <div style={{ color: '#475569' }}>Phone: {order.shippingAddress.phone}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Payment &amp; Delivery:
              </div>
              <div style={{ color: '#1E2229' }}>Method: <strong>{order.paymentMethod.toUpperCase()}</strong></div>
              <div style={{ color: '#059669', fontWeight: 700 }}>Status: {order.paymentStatus.toUpperCase()}</div>
              <div style={{ color: '#475569' }}>Carrier: {order.trackingCarrier || 'BlueDart Express'}</div>
              <div style={{ color: '#475569' }}>Est. Arrival: <strong>{order.estimatedDelivery}</strong></div>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Item Description</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Qty</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>Unit Price</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: '#1E2229' }}>{item.productTitle}</div>
                    {item.selectedVariant && (
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Option: {item.selectedVariant}</div>
                    )}
                    {item.customText && (
                      <div style={{ fontSize: '0.78rem', color: '#FF5B60', fontStyle: 'italic' }}>
                        Custom Text: "{item.customText}"
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>₹{item.price}</td>
                  <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700 }}>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Shipping ({order.deliveryMethod}):</span>
                <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              {order.giftWrapFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Signature Gift Wrap:</span>
                  <span>₹{order.giftWrapFee}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>GST (Included 18%):</span>
                <span>₹{order.tax}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '2px solid #E2E8F0',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: '#1E2229',
              }}>
                <span>Grand Total:</span>
                <span style={{ color: '#FF5B60' }}>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Sign-off & Footer Note */}
          <div style={{
            borderTop: '1px dashed #E2E8F0',
            paddingTop: '18px',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: '#64748B',
          }}>
            Thank you for shopping at <strong>GiggleThreads</strong>! "Little gifts. Big giggles. Beautiful memories." ❤️
          </div>
        </div>
      </div>
    </div>
  );
};
