import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { store } from '../../services/store';
import { useToast } from '../../context/ToastContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onNavigate }) => {
  const { showToast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product?.variants ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(
    product ? store.isInWishlist(product.id) : false
  );

  if (!product) return null;

  const handleAddToCart = () => {
    store.addToCart(product, quantity, selectedVariant);
    showToast(`Added ${quantity}x "${product.title}" to your Giggle Basket! 🎁`, 'success');
    onClose();
  };

  const handleToggleWishlist = () => {
    const added = store.toggleWishlist(product.id);
    setIsWishlisted(added);
    showToast(added ? 'Saved for a Smile ❤️' : 'Removed from Wishlist', 'info');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '780px', padding: '24px' }}
      >
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            padding: '6px', 
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            color: '#64748B',
            zIndex: 10
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          {/* Image */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
            <img 
              src={product.images[0]} 
              alt={product.title} 
              style={{ width: '100%', height: '340px', objectFit: 'cover' }} 
            />
            {product.badge && (
              <span 
                className="badge badge-bestseller" 
                style={{ position: 'absolute', top: '12px', left: '12px' }}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase' }}>
              {product.category}
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 10px', color: '#1E2229', lineHeight: 1.25 }}>
              {product.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div className="star-rating">
                <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
                <span style={{ fontWeight: 700, color: '#1E2229' }}>{product.rating}</span>
              </div>
              <span style={{ color: '#64748B' }}>({product.reviewCount} customer reviews)</span>
              <span style={{ color: '#94A3B8' }}>•</span>
              <span style={{ color: product.stock > 0 ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', fontFamily: 'var(--font-heading)' }}>
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span style={{ fontSize: '1.05rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ₹{product.mrp}
                </span>
              )}
              {product.discount > 0 && (
                <span className="product-card-discount" style={{ fontSize: '0.85rem', padding: '3px 8px' }}>
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
              {product.shortDescription}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2229', marginBottom: '8px' }}>
                  SELECT VARIANT:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        border: selectedVariant?.id === v.id ? '2px solid #FF5B60' : '1px solid #CBD5E1',
                        backgroundColor: selectedVariant?.id === v.id ? '#FFF0F1' : '#FFFFFF',
                        color: selectedVariant?.id === v.id ? '#FF5B60' : '#1E2229',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                      }}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #EFE4DC',
                borderRadius: '9999px',
                padding: '2px 8px',
                backgroundColor: '#FFFFFF',
              }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '6px 10px', fontWeight: 700, fontSize: '1rem', color: '#64748B' }}
                >
                  -
                </button>
                <span style={{ padding: '0 10px', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ padding: '6px 10px', fontWeight: 700, fontSize: '1rem', color: '#64748B' }}
                >
                  +
                </button>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '12px 20px' }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Add to Basket</span>
              </button>

              <button 
                className="btn btn-secondary btn-icon"
                onClick={handleToggleWishlist}
                title="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#FF5B60' : 'none'} color={isWishlisted ? '#FF5B60' : '#64748B'} />
              </button>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button 
                onClick={() => {
                  onClose();
                  onNavigate('product', product.slug);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#FF5B60',
                }}
              >
                <span>View Full Specifications &amp; Story</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
