import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Package, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { store } from '../services/store';
import { Order } from '../types';

interface TrackOrderViewProps {
  initialOrderNumber?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({ initialOrderNumber = '', onNavigate }) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    initialOrderNumber ? store.getOrderById(initialOrderNumber) || null : null
  );
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderNumber));

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    const found = store.getOrderById(orderQuery.trim().replace('#', '')) || null;
    setSearchedOrder(found);
    setHasSearched(true);
  };

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#FAF7F5', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            LIVE PACKAGE DISPATCH
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#1E2229', margin: '8px 0 12px' }}>
            Track Your GiggleThreads Surprise
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto' }}>
            Enter your Order Number (e.g. GT-89421) to check live status and courier milestones.
          </p>
        </div>

        {/* Search Input Box */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #EFE4DC',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px',
        }}>
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Package size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input 
                type="text" 
                placeholder="Enter Order Number (e.g. GT-89421)"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <Search size={18} />
              <span>Track</span>
            </button>
          </form>

          {/* Quick Demo Pickers */}
          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Try demo order:</span>
            {store.getOrders().slice(0, 3).map((o) => (
              <button 
                key={o.id}
                type="button"
                onClick={() => {
                  setOrderQuery(o.orderNumber);
                  setSearchedOrder(o);
                  setHasSearched(true);
                }}
                style={{ color: '#FF5B60', fontWeight: 700, textDecoration: 'underline' }}
              >
                #{o.orderNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          searchedOrder ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px',
              border: '1px solid #EFE4DC',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {/* Order Status Ribbon */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #F1F5F9',
                paddingBottom: '20px',
                marginBottom: '24px',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Tracking Order</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E2229' }}>
                    #{searchedOrder.orderNumber}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    backgroundColor: searchedOrder.orderStatus === 'Delivered' ? '#E6FBF5' : '#FFF0F1',
                    color: searchedOrder.orderStatus === 'Delivered' ? '#059669' : '#FF5B60',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                  }}>
                    {searchedOrder.orderStatus.toUpperCase()}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '6px' }}>
                    Est. Delivery: <strong>{searchedOrder.estimatedDelivery}</strong>
                  </div>
                </div>
              </div>

              {/* Courier info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '32px',
                fontSize: '0.88rem',
              }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem', fontWeight: 700 }}>COURIER PARTNER</div>
                  <div style={{ fontWeight: 700, color: '#1E2229' }}>{searchedOrder.trackingCarrier || 'BlueDart Express'}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem', fontWeight: 700 }}>TRACKING AWB NUMBER</div>
                  <div style={{ fontWeight: 700, color: '#1E2229' }}>{searchedOrder.trackingNumber || 'GT-BLR-8921004'}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem', fontWeight: 700 }}>DESTINATION</div>
                  <div style={{ fontWeight: 700, color: '#1E2229' }}>{searchedOrder.shippingAddress.city} ({searchedOrder.shippingAddress.pincode})</div>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
                Delivery Milestones
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                {searchedOrder.timeline.map((event, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#06D6A0',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CheckCircle2 size={18} />
                      </div>
                      {idx < searchedOrder.timeline.length - 1 && (
                        <div style={{ width: '2px', height: '40px', backgroundColor: '#CBD5E1' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E2229' }}>
                        {event.status}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.4 }}>
                        {event.description}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '3px' }}>
                        {event.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Items in shipment */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
                  Items in this Package
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.productImage} alt={item.productTitle} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{item.productTitle}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid #EFE4DC',
            }}>
              <Package size={44} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
                No Order Found for "{orderQuery}"
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 20px' }}>
                Please double-check your Order Number or check your confirmation email from GiggleThreads.
              </p>
              <button className="btn btn-secondary" onClick={() => onNavigate('contact')}>
                Contact Support Team
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
