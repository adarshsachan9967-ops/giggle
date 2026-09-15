import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingBag, Heart, User, 
  Menu, X, Sparkles, ChevronDown, PackageCheck,
  Phone, HelpCircle, Info, LogOut
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { store } from '../../services/store';
import { Product } from '../../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentCustomer, setCurrentCustomer] = useState(store.getCurrentCustomer());
  const [activeDropdown, setActiveDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeaderState = () => {
      const totals = store.getCartTotals();
      setCartCount(totals.itemCount);
      setWishlistCount(store.getWishlist().length);
      setCurrentCustomer(store.getCurrentCustomer());
    };

    updateHeaderState();
    const unsubscribe = store.subscribe(updateHeaderState);
    return unsubscribe;
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Live search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = store.getProducts().filter(
      (p) => p.title.toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q) ||
             p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
    setSearchResults(matches);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideDesktop = !searchRef.current || !searchRef.current.contains(target);
      const outsideMobile = !mobileSearchRef.current || !mobileSearchRef.current.contains(target);
      if (outsideDesktop && outsideMobile) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navCategories = [
    { name: 'Toys', slug: 'toys' },
    { name: 'Gifts', slug: 'gifts' },
    { name: 'Soft Toys', slug: 'soft-toys' },
    { name: 'Personalized', slug: 'personalized' },
    { name: 'Birthday', slug: 'birthday' },
    { name: 'Gift Hampers', slug: 'gift-hampers' },
    { name: 'Educational Toys', slug: 'educational-toys' },
  ];

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
    onNavigate('product', slug);
  };

  const handleMobileNav = (view: string, param?: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(view, param);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', width: '100%' }}>
      {/* Top Announcement Bar */}
      <div style={{
        backgroundColor: '#1E2229',
        color: '#FFFFFF',
        padding: '6px 0',
        fontSize: '0.78rem',
        fontWeight: 500,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
            <Sparkles size={13} color="#FFB300" style={{ flexShrink: 0 }} />
            <span style={{ textAlign: 'center' }}>
              <strong>Launch Offer:</strong> Use code <span style={{ color: '#FFB300', fontWeight: 700 }}>GIGGLE10</span> for 10% off • Free Delivery above ₹999!
            </span>
          </div>

          <div className="desktop-only" style={{ alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            <button 
              onClick={() => onNavigate('track-order')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#E2E8F0', fontSize: '0.78rem' }}
            >
              <PackageCheck size={14} />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', gap: '16px' }}>
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mobile menu toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="mobile-menu-btn"
            aria-label="Open menu"
            style={{ padding: '6px', color: '#1E2229' }}
          >
            <Menu size={24} />
          </button>

          {/* Brand Logo (Desktop) */}
          <div className="desktop-only">
            <Logo 
              variant="full" 
              size="md" 
              showTagline={true} 
              onClick={() => onNavigate('home')} 
            />
          </div>
          {/* Brand Logo (Mobile) */}
          <div className="mobile-only">
            <Logo 
              variant="full" 
              size="sm" 
              showTagline={false} 
              onClick={() => onNavigate('home')} 
            />
          </div>
        </div>

        {/* Live Search Bar (Desktop) */}
        <div ref={searchRef} className="desktop-only" style={{ position: 'relative', flex: '1', maxWidth: '500px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: '9999px',
            border: '1.5px solid #EFE4DC',
            padding: '8px 18px',
            transition: 'all 0.2s',
          }}>
            <Search size={18} color="#94A3B8" style={{ marginRight: '10px', flexShrink: 0 }} />
            <input 
              type="text"
              placeholder="Search gifts, soft toys, RC cars, personalized mugs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.9rem',
                color: '#1E2229',
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ color: '#94A3B8', fontSize: '0.8rem', padding: '2px' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Autocomplete Results Dropdown (Desktop) */}
          {isSearchOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
              border: '1px solid #EFE4DC',
              padding: '10px 0',
              zIndex: 200,
            }}>
              <div style={{ padding: '6px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                Products Found ({searchResults.length})
              </div>
              {searchResults.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF0F1')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E2229', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {product.category}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#FF5B60', fontSize: '0.95rem' }}>
                    ₹{product.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Wishlist Button */}
          <button 
            onClick={() => onNavigate('account', 'wishlist')}
            style={{ position: 'relative', padding: '8px', color: '#1E2229' }}
            title="Wishlist"
          >
            <Heart size={21} color={wishlistCount > 0 ? '#FF5B60' : '#475569'} fill={wishlistCount > 0 ? '#FFF0F1' : 'none'} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: '#FF5B60',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button ("Your Giggle Basket") */}
          <button 
            onClick={onOpenCart}
            className="btn-primary"
            style={{ 
              padding: '8px 14px', 
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(255, 91, 96, 0.25)'
            }}
            title="Your Giggle Basket"
          >
            <ShoppingBag size={18} />
            <span className="desktop-only" style={{ fontWeight: 700, fontSize: '0.88rem' }}>Basket</span>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '9999px',
              padding: '1px 7px',
              fontSize: '0.78rem',
              fontWeight: 800,
            }}>
              {cartCount}
            </span>
          </button>

          {/* Account Dropdown (Desktop) */}
          <div className="desktop-only" style={{ position: 'relative' }}>
            <button 
              onClick={() => setActiveDropdown(!activeDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '9999px',
                border: '1.5px solid #EFE4DC',
                backgroundColor: '#FFFFFF',
                color: '#1E2229',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <User size={18} color="#FF5B60" />
              <span>{currentCustomer ? currentCustomer.name.split(' ')[0] : 'Sign In'}</span>
              <ChevronDown size={14} color="#64748B" />
            </button>

            {activeDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid #EFE4DC',
                padding: '8px 0',
                minWidth: '200px',
                zIndex: 200,
              }}>
                {currentCustomer ? (
                  <>
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E2229' }}>{currentCustomer.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{currentCustomer.email}</div>
                    </div>
                    <button 
                      onClick={() => { setActiveDropdown(false); onNavigate('account', 'dashboard'); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.88rem' }}
                    >
                      My GiggleThreads
                    </button>
                    <button 
                      onClick={() => { setActiveDropdown(false); onNavigate('account', 'orders'); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.88rem' }}
                    >
                      My Orders
                    </button>
                    <button 
                      onClick={() => { setActiveDropdown(false); onNavigate('account', 'wishlist'); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.88rem' }}
                    >
                      My Wishlist
                    </button>
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
                      <button 
                        onClick={() => {
                          store.logoutCustomer();
                          setActiveDropdown(false);
                          onNavigate('home');
                        }}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.88rem', color: '#EF4444' }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { setActiveDropdown(false); onNavigate('login'); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.88rem', fontWeight: 600 }}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => { setActiveDropdown(false); onNavigate('signup'); }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.88rem', color: '#FF5B60' }}
                    >
                      Join the Giggle (Sign Up)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input Bar (Visible on mobile screens <= 900px) */}
      <div className="mobile-only" style={{ padding: '0 16px 10px' }}>
        <div ref={mobileSearchRef} style={{ position: 'relative', width: '100%' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: '9999px',
            border: '1.5px solid #EFE4DC',
            padding: '7px 14px',
          }}>
            <Search size={16} color="#94A3B8" style={{ marginRight: '8px', flexShrink: 0 }} />
            <input 
              type="text"
              placeholder="Search gifts, soft toys, RC cars..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.85rem',
                color: '#1E2229',
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ color: '#94A3B8', padding: '2px' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Autocomplete Results Dropdown (Mobile) */}
          {isSearchOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: '1px solid #EFE4DC',
              padding: '8px 0',
              maxHeight: '60vh',
              overflowY: 'auto',
              zIndex: 300,
            }}>
              <div style={{ padding: '6px 14px', fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                Products ({searchResults.length})
              </div>
              {searchResults.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #F8FAFC',
                  }}
                >
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E2229', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      {product.category}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#FF5B60', fontSize: '0.88rem' }}>
                    ₹{product.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Links Sub-Navigation (Smooth swipeable scroll) */}
      <nav style={{ borderTop: '1px solid #F8ECE7', backgroundColor: '#FFFFFF' }}>
        <div className="container category-nav-scroll">
          <button 
            onClick={() => onNavigate('catalog')}
            style={{ 
              fontWeight: currentView === 'catalog' ? 700 : 600, 
              color: currentView === 'catalog' ? '#FF5B60' : '#1E2229',
              fontSize: '0.88rem',
              whiteSpace: 'nowrap'
            }}
          >
            All Products (50+)
          </button>
          {navCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onNavigate('category', cat.slug)}
              style={{
                fontSize: '0.88rem',
                fontWeight: currentView === 'category' ? 700 : 500,
                color: currentView === 'category' ? '#FF5B60' : '#475569',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Slide-over Mobile Navigation Drawer */}
      <div 
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className={`mobile-drawer-content ${isMobileMenuOpen ? 'active' : ''}`}>
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
        }}>
          <Logo variant="full" size="sm" showTagline={false} onClick={() => handleMobileNav('home')} />
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ padding: '6px', color: '#64748B', borderRadius: '50%' }}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* User Profile Card */}
        <div style={{ padding: '16px 20px', backgroundColor: '#FFF6F4', borderBottom: '1px solid #FFE4DB' }}>
          {currentCustomer ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FF5B60',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}>
                  {currentCustomer.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2229' }}>{currentCustomer.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{currentCustomer.email}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                <button 
                  onClick={() => handleMobileNav('account', 'orders')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FFE4DB',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#1E2229',
                    textAlign: 'center',
                  }}
                >
                  My Orders
                </button>
                <button 
                  onClick={() => handleMobileNav('account', 'wishlist')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FFE4DB',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#FF5B60',
                    textAlign: 'center',
                  }}
                >
                  Wishlist ({wishlistCount})
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E2229', marginBottom: '4px' }}>
                Welcome to GiggleThreads!
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>
                Sign in to track orders, save gifts &amp; checkout faster.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button 
                  onClick={() => handleMobileNav('login')}
                  className="btn btn-primary"
                  style={{ padding: '8px 12px', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleMobileNav('signup')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Links Navigation */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button 
            onClick={() => handleMobileNav('track-order')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              color: '#1E2229',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '10px',
            }}
          >
            <PackageCheck size={18} color="#FF5B60" />
            <span>Track Your Order</span>
          </button>

          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '8px 0 4px 8px' }}>
            Shop By Category
          </div>

          <button 
            onClick={() => handleMobileNav('catalog')}
            style={{ textAlign: 'left', padding: '9px 12px', fontSize: '0.9rem', fontWeight: 700, color: '#FF5B60', borderRadius: '8px' }}
          >
            🌟 All 50+ Products
          </button>

          {navCategories.map((cat) => (
            <button 
              key={cat.slug}
              onClick={() => handleMobileNav('category', cat.slug)}
              style={{
                textAlign: 'left',
                padding: '9px 12px',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: '#334155',
                borderRadius: '8px',
              }}
            >
              {cat.name}
            </button>
          ))}

          <div style={{ borderTop: '1px solid #F1F5F9', margin: '14px 0 8px' }} />

          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '4px 0 4px 8px' }}>
            Customer Care
          </div>

          <button 
            onClick={() => handleMobileNav('about')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', padding: '8px 12px', fontSize: '0.85rem', color: '#475569' }}
          >
            <Info size={16} />
            <span>About GiggleThreads</span>
          </button>

          <button 
            onClick={() => handleMobileNav('contact')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', padding: '8px 12px', fontSize: '0.85rem', color: '#475569' }}
          >
            <Phone size={16} />
            <span>Contact &amp; Support</span>
          </button>

          <button 
            onClick={() => handleMobileNav('faq')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', padding: '8px 12px', fontSize: '0.85rem', color: '#475569' }}
          >
            <HelpCircle size={16} />
            <span>FAQs &amp; Help</span>
          </button>

          {currentCustomer && (
            <button 
              onClick={() => {
                store.logoutCustomer();
                setIsMobileMenuOpen(false);
                onNavigate('home');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left',
                padding: '10px 12px',
                fontSize: '0.85rem',
                color: '#EF4444',
                marginTop: '12px',
                borderTop: '1px solid #FEE2E2',
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
