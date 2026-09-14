import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Zap } from 'lucide-react';
import { Product } from '../../types';
import { store } from '../../services/store';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (view: string, param?: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, onQuickView }) => {
  const { showToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(store.isInWishlist(product.id));

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = store.toggleWishlist(product.id);
    setIsWishlisted(added);
    showToast(
      added 
        ? `Added "${product.title}" to your smile wishlist ❤️` 
        : `Removed from wishlist`,
      'info'
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.addToCart(product, 1);
    showToast(`Added "${product.title}" to your Giggle Basket! 🎁`, 'success');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.addToCart(product, 1);
    if (!store.isCustomerLoggedIn()) {
      showToast('Please sign in or create an account to proceed to checkout 🎁', 'info');
      onNavigate('login', 'checkout');
      return;
    }
    onNavigate('checkout');
  };

  const getBadgeClass = () => {
    switch (product.badge) {
      case 'BESTSELLER': return 'badge-bestseller';
      case 'NEW': return 'badge-new';
      case 'TRENDING': return 'badge-trending';
      case 'LIMITED STOCK': return 'badge-limited';
      case 'TOP RATED': return 'badge-top-rated';
      case 'PERSONALIZED': return 'badge-personalized';
      default: return 'badge-bestseller';
    }
  };

  return (
    <div 
      className="product-card" 
      onClick={() => onNavigate('product', product.slug)}
      style={{ cursor: 'pointer' }}
    >
      {/* Product Image Wrapper */}
      <div className="product-card-image-wrap">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="product-card-image" 
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="product-card-badge">
            <span className={`badge ${getBadgeClass()}`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          className={`product-card-wishlist ${isWishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Remove from wishlist' : 'Save for a Smile'}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? '#FF5B60' : 'none'} color={isWishlisted ? '#FF5B60' : '#475569'} />
        </button>

        {/* Quick View Button overlay on hover */}
        {onQuickView && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#1E2229',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s',
            }}
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="product-card-content">
        <div className="product-card-category">
          {product.category}
        </div>

        <h3 className="product-card-title" title={product.title}>
          {product.title}
        </h3>

        <div className="product-card-rating">
          <div className="star-rating">
            <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
            <span style={{ fontWeight: 700, color: '#1E2229' }}>{product.rating}</span>
          </div>
          <span>({product.reviewCount})</span>
          {product.stock <= 5 && product.stock > 0 && (
            <span style={{ marginLeft: 'auto', color: '#EF4444', fontSize: '0.74rem', fontWeight: 700 }}>
              Only {product.stock} left!
            </span>
          )}
        </div>

        <div className="product-card-pricing">
          <span className="product-card-price">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="product-card-mrp">₹{product.mrp}</span>
          )}
          {product.discount > 0 && (
            <span className="product-card-discount">{product.discount}% OFF</span>
          )}
        </div>

        <div className="product-card-actions">
          <button 
            className="btn btn-primary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
            onClick={handleAddToCart}
            title="Add to Giggle Basket"
          >
            <ShoppingBag size={15} />
            <span>Add</span>
          </button>

          <button 
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            onClick={handleBuyNow}
            title="Buy Now immediately"
          >
            <Zap size={14} color="#F59E0B" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
