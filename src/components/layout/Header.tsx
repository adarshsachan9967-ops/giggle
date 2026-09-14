import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingBag, Heart, User, 
  Menu, X, Sparkles, ChevronDown, PackageCheck 
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
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
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
    onNavigate('product', slug);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      {/* Top Announcement Bar */}
      <div style={{
        backgroundColor: '#1E2229',
        color: '#FFFFFF',
        padding: '7px 0',
        fontSize: '0.8rem',
        fontWeight: 500,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} color="#FFB300" />
            <span>
              <strong>Special Launch Offer:</strong> Use code <span style={{ color: '#FFB300', fontWeight: 700 }}>GIGGLE10</span> for 10% off • Free Delivery on orders above ₹999!
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => onNavigate('track-order')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#E2E8F0', fontSize: '0.8rem' }}
            >
              <PackageCheck size={14} />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px', gap: '24px' }}>
        {/* Mobile menu toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ display: 'none' }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Logo 
          variant="full" 
          size="md" 
          showTagline={true} 
          onClick={() => onNavigate('home')} 
        />

        {/* Live Search Bar */}
        <div ref={searchRef} style={{ position: 'relative', flex: '1', maxWidth: '520px' }}>
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

          {/* Autocomplete Results Dropdown */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Wishlist Button */}
          <button 
            onClick={() => onNavigate('account', 'wishlist')}
            style={{ position: 'relative', padding: '8px', color: '#1E2229' }}
            title="Wishlist"
          >
            <Heart size={22} color={wishlistCount > 0 ? '#FF5B60' : '#475569'} fill={wishlistCount > 0 ? '#FFF0F1' : 'none'} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: '#FF5B60',
                color: '#FFFFFF',
                fontSize: '0.7rem',
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
              padding: '10px 18px', 
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(255, 91, 96, 0.3)'
            }}
            title="Your Giggle Basket"
          >
            <ShoppingBag size={19} />
            <span style={{ fontWeight: 700 }}>Basket</span>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '9999px',
              padding: '2px 8px',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}>
              {cartCount}
            </span>
          </button>

          {/* Account Dropdown */}
          <div style={{ position: 'relative' }}>
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

      {/* Category Links Sub-Navigation */}
      <nav style={{ borderTop: '1px solid #F8ECE7', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '28px', overflowX: 'auto', padding: '10px 20px' }}>
          <button 
            onClick={() => onNavigate('catalog')}
            style={{ 
              fontWeight: currentView === 'catalog' ? 700 : 600, 
              color: currentView === 'catalog' ? '#FF5B60' : '#1E2229',
              fontSize: '0.9rem',
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
                fontSize: '0.9rem',
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
    </header>
  );
};
