import React, { useState, useEffect } from 'react';
import { 
  Star, Heart, ShoppingBag, Zap, Truck, ShieldCheck, 
  RotateCcw, Gift, Check, ArrowRight, Share2, MapPin, 
  Package, Sparkles, MessageSquare, ThumbsUp 
} from 'lucide-react';
import { Product, ProductVariant, Review } from '../types';
import { store } from '../services/store';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/product/ProductCard';

interface ProductDetailViewProps {
  productSlug: string;
  onNavigate: (view: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productSlug,
  onNavigate,
  onQuickView,
}) => {
  const { showToast } = useToast();
  const product = store.getProductBySlug(productSlug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(product ? store.isInWishlist(product.id) : false);

  // Delivery Pincode Checker
  const [pincode, setPincode] = useState('560038');
  const [pincodeResult, setPincodeResult] = useState<string | null>('Delivering to 560038 (Bengaluru) by tomorrow, Express available!');

  // Tab state for product information
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'care' | 'delivery'>('story');

  // Review Form Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // Bundle selection for "Frequently Bought Together"
  const [bundleMugIncluded, setBundleMugIncluded] = useState(true);
  const [bundleChocIncluded, setBundleChocIncluded] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setIsWishlisted(store.isInWishlist(product.id));
      setSelectedVariant(product.variants ? product.variants[0] : undefined);
      setActiveImageIndex(0);
    }
  }, [productSlug, product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
          Product Not Found
        </h2>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>
          The gift you're looking for might have hopped to another page.
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>
          Explore Catalog
        </button>
      </div>
    );
  }

  const reviews = store.getReviews(product.id);
  const relatedProducts = store.getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Bundle companion items
  const mugCompanion = store.getProductById('gt-prod-25') || store.getProducts()[24];
  const chocCompanion = store.getProductById('gt-prod-30') || store.getProducts()[29];

  const bundleTotal = product.price + 
    (bundleMugIncluded ? mugCompanion.price : 0) + 
    (bundleChocIncluded ? chocCompanion.price : 0);
  const bundleSavings = 150;

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    const days = product.deliveryDays || 3;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    setPincodeResult(`🚚 Standard Delivery to ${pincode} by ${dateStr}. Express Delivery available!`);
  };

  const handleAddToCart = () => {
    store.addToCart(product, quantity, selectedVariant, customText, giftWrap, giftMessage);
    showToast(`Added ${quantity}x "${product.title}" to your Giggle Basket! 🎁`, 'success');
  };

  const handleBuyNow = () => {
    store.addToCart(product, quantity, selectedVariant, customText, giftWrap, giftMessage);
    onNavigate('checkout');
  };

  const handleAddBundle = () => {
    store.addToCart(product, 1, selectedVariant);
    if (bundleMugIncluded) store.addToCart(mugCompanion, 1);
    if (bundleChocIncluded) store.addToCart(chocCompanion, 1);
    showToast('Bundle added to your Giggle Basket with special bundle savings! 🎉', 'success');
  };

  const handleToggleWishlist = () => {
    const added = store.toggleWishlist(product.id);
    setIsWishlisted(added);
    showToast(added ? 'Saved for a Smile ❤️' : 'Removed from Wishlist', 'info');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) {
      showToast('Please fill out all review fields.', 'error');
      return;
    }
    store.addReview({
      productId: product.id,
      customerName: reviewName,
      customerLocation: reviewLocation || 'India',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
    });
    showToast('Thank you! Your verified review has been published ⭐', 'success');
    setShowReviewModal(false);
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <div style={{ padding: '30px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '24px' }}>
          <button onClick={() => onNavigate('home')} style={{ color: '#FF5B60', fontWeight: 600 }}>Home</button>
          <span style={{ margin: '0 8px' }}>/</span>
          <button onClick={() => onNavigate('catalog')} style={{ color: '#64748B' }}>Catalog</button>
          <span style={{ margin: '0 8px' }}>/</span>
          <button onClick={() => onNavigate('category', product.category.toLowerCase().replace(/\s+/g, '-'))} style={{ color: '#64748B' }}>
            {product.category}
          </button>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#1E2229', fontWeight: 600 }}>{product.title}</span>
        </div>

        {/* Main Product Showcase (Two Columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '48px',
          marginBottom: '64px',
        }}>
          {/* Left Column: Gallery */}
          <div>
            {/* Main Stage Image */}
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#F8FAFC',
              border: '1px solid #EFE4DC',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-md)',
            }}>
              <img 
                src={product.images[activeImageIndex] || product.images[0]} 
                alt={product.title} 
                style={{
                  width: '100%',
                  height: '480px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {product.badge && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge badge-bestseller" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    {product.badge}
                  </span>
                </div>
              )}

              <button 
                onClick={handleToggleWishlist}
                className={`product-card-wishlist ${isWishlisted ? 'active' : ''}`}
                style={{ position: 'absolute', top: '16px', right: '16px', width: '42px', height: '42px' }}
                title="Save for a Smile"
                aria-label="Wishlist"
              >
                <Heart size={22} fill={isWishlisted ? '#FF5B60' : 'none'} color={isWishlisted ? '#FF5B60' : '#475569'} />
              </button>
            </div>

            {/* Thumbnail switcher */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: activeImageIndex === i ? '2.5px solid #FF5B60' : '1px solid #E2E8F0',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#FF5B60',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px',
            }}>
              <span>{product.category}</span>
              <span>•</span>
              <span style={{ color: '#94A3B8' }}>SKU: {product.sku}</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
              fontWeight: 800,
              color: '#1E2229',
              lineHeight: 1.25,
              marginBottom: '12px',
            }}>
              {product.title}
            </h1>

            {/* Rating and Reviews Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>
              <div className="star-rating">
                <Star size={18} fill="#F59E0B" stroke="#F59E0B" />
                <span style={{ fontWeight: 800, color: '#1E2229', fontSize: '1.05rem', marginLeft: '3px' }}>{product.rating}</span>
              </div>
              <span style={{ color: '#64748B' }}>({product.reviewCount} customer reviews)</span>
              <span style={{ color: '#CBD5E1' }}>|</span>
              <span style={{
                color: product.stock > 0 ? '#059669' : '#DC2626',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}>
                {product.stock > 5 ? '✓ In Stock & Ready to Ship' : (product.stock > 0 ? `⚠️ Only ${product.stock} left in stock!` : 'Out of Stock')}
              </span>
            </div>

            {/* Price Box */}
            <div style={{
              backgroundColor: '#FFF9F6',
              padding: '18px 22px',
              borderRadius: '16px',
              border: '1px solid #FFE4DB',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '6px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1E2229', fontFamily: 'var(--font-heading)' }}>
                  ₹{product.price}
                </span>
                {product.mrp > product.price && (
                  <span style={{ fontSize: '1.2rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                    MRP: ₹{product.mrp}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="product-card-discount" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>
                    Save {product.discount}% OFF
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Inclusive of all taxes • Free express shipping on orders over ₹999
              </div>
            </div>

            {/* Short Description */}
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
              {product.shortDescription}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E2229', marginBottom: '10px' }}>
                  CHOOSE OPTION: <span style={{ color: '#FF5B60' }}>{selectedVariant?.name}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '9999px',
                        border: selectedVariant?.id === v.id ? '2px solid #FF5B60' : '1.5px solid #CBD5E1',
                        backgroundColor: selectedVariant?.id === v.id ? '#FFF0F1' : '#FFFFFF',
                        color: selectedVariant?.id === v.id ? '#FF5B60' : '#1E2229',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                      }}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Personalized Input (if personalized) */}
            {product.isPersonalized && (
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>
                  <Sparkles size={18} />
                  <span>Personalize This Gift (Free Customization)</span>
                </div>
                <input 
                  type="text"
                  placeholder="Enter Name, Date, or Custom Message (e.g. Aarav / Sneha & Arjun 2026)"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  maxLength={50}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #93C5FD',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: '6px' }}>
                  Our artisans will engrave/print your custom text exactly as entered above.
                </div>
              </div>
            )}

            {/* Gift Wrapping Addon Option */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EFE4DC',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#FF5B60', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <Gift size={20} color="#FF5B60" />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1E2229' }}>
                      Add GiggleThreads Signature Gift Wrap (+₹99)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      Luxurious box, satin ribbon knot &amp; handwritten greeting note
                    </div>
                  </div>
                </div>
              </label>

              {giftWrap && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #EFE4DC' }}>
                  <textarea 
                    placeholder="Write your personal message for the greeting card..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.85rem',
                      height: '70px',
                      resize: 'none',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Quantity & CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #EFE4DC',
                borderRadius: '9999px',
                padding: '4px 10px',
                backgroundColor: '#FFFFFF',
              }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '6px 12px', fontWeight: 800, fontSize: '1.1rem', color: '#64748B' }}
                >
                  -
                </button>
                <span style={{ padding: '0 12px', fontWeight: 800, fontSize: '1rem' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ padding: '6px 12px', fontWeight: 800, fontSize: '1.1rem', color: '#64748B' }}
                >
                  +
                </button>
              </div>

              <button 
                className="btn btn-primary btn-lg"
                style={{ flex: '1', minWidth: '180px' }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={20} />
                <span>Add to Basket</span>
              </button>

              <button 
                className="btn btn-secondary btn-lg"
                style={{ minWidth: '140px' }}
                onClick={handleBuyNow}
              >
                <Zap size={18} color="#F59E0B" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Delivery Pincode Checker */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              padding: '18px',
              border: '1px solid #E2E8F0',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', fontWeight: 700, color: '#1E2229', marginBottom: '8px' }}>
                <MapPin size={16} color="#FF5B60" />
                <span>Check Estimated Delivery Date</span>
              </div>
              <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  type="text"
                  placeholder="Enter 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                  }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
                  Check
                </button>
              </form>
              {pincodeResult && (
                <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                  {pincodeResult}
                </div>
              )}
            </div>

            {/* Guarantee Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
              <div style={{ padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EFE4DC' }}>
                <Truck size={20} color="#FF5B60" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Fast Shipping</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>In 2-4 Days</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EFE4DC' }}>
                <RotateCcw size={20} color="#F59E0B" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>7 Days Return</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Easy Replacement</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EFE4DC' }}>
                <ShieldCheck size={20} color="#06D6A0" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Child Safe</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>BIS Certified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Product Story & Specifications Tabs */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #EFE4DC',
          overflow: 'hidden',
          marginBottom: '64px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid #EFE4DC', overflowX: 'auto' }}>
            {[
              { id: 'story', label: '📖 Product Story' },
              { id: 'specs', label: '⚙️ Specifications & Features' },
              { id: 'care', label: '🛡️ Safety & Care Instructions' },
              { id: 'delivery', label: '📦 Delivery & Returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '18px 28px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderBottom: activeTab === tab.id ? '3px solid #FF5B60' : '3px solid transparent',
                  color: activeTab === tab.id ? '#FF5B60' : '#64748B',
                  backgroundColor: activeTab === tab.id ? '#FFF9F6' : 'transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '36px' }}>
            {/* Story Tab */}
            {activeTab === 'story' && (
              <div style={{ maxWidth: '780px' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '14px' }}>
                  {product.story.headline}
                </h3>
                <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8, marginBottom: '28px' }}>
                  {product.story.content}
                </p>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E2229', marginBottom: '14px' }}>
                  Key Highlights &amp; Features
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {product.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#334155' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF5B60' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <div style={{ maxWidth: '780px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E2229', marginBottom: '20px' }}>
                  Technical Specifications
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#64748B', width: '35%' }}>Materials</td>
                      <td style={{ padding: '12px 0', color: '#1E2229' }}>{product.specs.material}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#64748B' }}>Dimensions</td>
                      <td style={{ padding: '12px 0', color: '#1E2229' }}>{product.specs.dimensions}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#64748B' }}>Weight</td>
                      <td style={{ padding: '12px 0', color: '#1E2229' }}>{product.specs.weight}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#64748B' }}>Recommended Age</td>
                      <td style={{ padding: '12px 0', color: '#1E2229' }}>{product.specs.recommendedAge}</td>
                    </tr>
                    {product.specs.batteryRequired && (
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 0', fontWeight: 700, color: '#64748B' }}>Battery Information</td>
                        <td style={{ padding: '12px 0', color: '#1E2229' }}>{product.specs.batteryRequired}</td>
                      </tr>
                    )}
                    {product.specs.warranty && (
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 0', fontWeight: 700, color: '#64748B' }}>Warranty</td>
                        <td style={{ padding: '12px 0', color: '#1E2229' }}>{product.specs.warranty}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E2229', margin: '28px 0 12px' }}>
                  What's Included in the Box
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.includes.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#334155' }}>
                      <Check size={16} color="#06D6A0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Care & Safety Tab */}
            {activeTab === 'care' && (
              <div style={{ maxWidth: '780px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E2229', marginBottom: '14px' }}>
                  Child Safety &amp; Quality Compliance
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>
                  {product.safetyInfo} All GiggleThreads toys and gifts undergo rigorous physical tensile tests, non-toxic dye tests, and drop impact tests before shipping.
                </p>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E2229', marginBottom: '10px' }}>
                  Care &amp; Cleaning Instructions
                </h4>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7 }}>
                  {product.careInstructions}
                </p>
              </div>
            )}

            {/* Delivery & Returns Tab */}
            {activeTab === 'delivery' && (
              <div style={{ maxWidth: '780px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E2229', marginBottom: '14px' }}>
                  Delivery &amp; Return Policy
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
                  Orders are dispatched within 24 hours from our Bengaluru fulfillment center. Standard delivery takes 2 to 4 business days. Express next-day delivery available for metro cities.
                </p>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7 }}>
                  We offer a 7-day hassle-free replacement for any damaged or defective items. Due to individual customization, personalized items cannot be returned unless manufacturing defect is verified.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: "Frequently Bought Together" Bundle */}
        <div style={{
          backgroundColor: '#FFFBF9',
          borderRadius: '24px',
          border: '1.5px solid #FFE4DB',
          padding: '36px',
          marginBottom: '64px',
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            SMILE COMBO
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E2229', marginBottom: '20px' }}>
            Frequently Bought Together
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}>
            {/* Products Row */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              {/* Product 1 (Current) */}
              <div style={{ textAlign: 'center', width: '130px' }}>
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  style={{ width: '100px', height: '100px', borderRadius: '14px', objectFit: 'cover', margin: '0 auto 8px' }} 
                />
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2229', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.title}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FF5B60' }}>₹{product.price}</div>
              </div>

              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#CBD5E1' }}>+</span>

              {/* Product 2 (Mug) */}
              <div style={{ textAlign: 'center', width: '130px', opacity: bundleMugIncluded ? 1 : 0.4 }}>
                <img 
                  src={mugCompanion.images[0]} 
                  alt={mugCompanion.title} 
                  style={{ width: '100px', height: '100px', borderRadius: '14px', objectFit: 'cover', margin: '0 auto 8px' }} 
                />
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2229', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {mugCompanion.title}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FF5B60' }}>₹{mugCompanion.price}</div>
              </div>

              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#CBD5E1' }}>+</span>

              {/* Product 3 (Chocolate Box) */}
              <div style={{ textAlign: 'center', width: '130px', opacity: bundleChocIncluded ? 1 : 0.4 }}>
                <img 
                  src={chocCompanion.images[0]} 
                  alt={chocCompanion.title} 
                  style={{ width: '100px', height: '100px', borderRadius: '14px', objectFit: 'cover', margin: '0 auto 8px' }} 
                />
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2229', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {chocCompanion.title}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FF5B60' }}>₹{chocCompanion.price}</div>
              </div>
            </div>

            {/* Bundle Total & CTA */}
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #EFE4DC',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569', marginBottom: '6px' }}>
                  <input type="checkbox" checked={bundleMugIncluded} onChange={(e) => setBundleMugIncluded(e.target.checked)} />
                  <span>Include {mugCompanion.title} (+₹{mugCompanion.price})</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
                  <input type="checkbox" checked={bundleChocIncluded} onChange={(e) => setBundleChocIncluded(e.target.checked)} />
                  <span>Include {chocCompanion.title} (+₹{chocCompanion.price})</span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Combo Price:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229' }}>₹{bundleTotal}</span>
                <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>Saved ₹{bundleSavings}!</span>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleAddBundle}
              >
                <ShoppingBag size={18} />
                <span>Add 3-Item Smile Bundle to Basket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Customer Reviews & "Write a Review" */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #EFE4DC',
          padding: '36px',
          marginBottom: '64px',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            gap: '16px',
          }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '4px' }}>
                Customer Smiles &amp; Reviews
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Real feedback from real families celebrating genuine giggles.
              </p>
            </div>

            <button 
              className="btn btn-secondary"
              onClick={() => setShowReviewModal(true)}
            >
              <MessageSquare size={16} />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Rating Summary Breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            paddingBottom: '32px',
            borderBottom: '1px solid #F1F5F9',
            marginBottom: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#1E2229', lineHeight: 1 }}>
                {product.rating}
              </div>
              <div>
                <div className="star-rating" style={{ marginBottom: '4px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Based on {reviews.length} verified ratings
                </div>
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { stars: 5, pct: 85 },
                { stars: 4, pct: 12 },
                { stars: 3, pct: 3 },
                { stars: 2, pct: 0 },
                { stars: 1, pct: 0 },
              ].map((row) => (
                <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                  <span style={{ width: '45px', color: '#64748B' }}>{row.stars} Stars</span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${row.pct}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '9999px' }} />
                  </div>
                  <span style={{ width: '30px', color: '#64748B', textAlign: 'right' }}>{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {reviews.length === 0 ? (
              <p style={{ color: '#64748B', fontStyle: 'italic' }}>
                Be the first to share your giggle story for this gift!
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#FFF0F1',
                        color: '#FF5B60',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {rev.customerName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1E2229' }}>
                          {rev.customerName}
                          {rev.customerLocation && <span style={{ color: '#64748B', fontWeight: 400 }}> ({rev.customerLocation})</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                          <Check size={12} />
                          <span>Verified Purchase</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{rev.date}</div>
                  </div>

                  <div className="star-rating" style={{ marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={14} 
                        fill={s <= rev.rating ? '#F59E0B' : '#E2E8F0'} 
                        stroke={s <= rev.rating ? '#F59E0B' : '#E2E8F0'} 
                      />
                    ))}
                  </div>

                  <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1E2229', marginBottom: '6px' }}>
                    {rev.title}
                  </h5>

                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55, marginBottom: '12px' }}>
                    {rev.comment}
                  </p>

                  {/* Admin Reply if exists */}
                  {rev.adminReply && (
                    <div style={{
                      backgroundColor: '#FFF8F5',
                      borderLeft: '3px solid #FF5B60',
                      padding: '12px 16px',
                      borderRadius: '0 10px 10px 0',
                      marginTop: '10px',
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FF5B60', marginBottom: '4px' }}>
                        GiggleThreads Care Team Response
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0 }}>
                        {rev.adminReply.comment}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 5: "You May Also Like" Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
            }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  MORE TO SMILE ABOUT
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229' }}>
                  You May Also Like
                </h3>
              </div>

              <button 
                onClick={() => onNavigate('category', product.category.toLowerCase().replace(/\s+/g, '-'))}
                style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FF5B60', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>View More in {product.category}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid-products">
              {relatedProducts.map((rel) => (
                <ProductCard 
                  key={rel.id} 
                  product={rel} 
                  onNavigate={onNavigate} 
                  onQuickView={onQuickView} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Write Review Modal */}
        {showReviewModal && (
          <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
                Write a Review for {product.title}
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '20px' }}>
                Share how this gift made someone smile!
              </p>

              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        fill={star <= reviewRating ? '#F59E0B' : '#E2E8F0'}
                        stroke={star <= reviewRating ? '#F59E0B' : '#E2E8F0'}
                        onClick={() => setReviewRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Radhika M."
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City, State</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Mumbai, MH"
                      value={reviewLocation}
                      onChange={(e) => setReviewLocation(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Headline</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Brings the biggest smiles every morning!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Experience</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Tell other gift-givers about the quality, packaging, and the reaction when opened..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Review
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
