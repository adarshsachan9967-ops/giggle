import React, { useState, useMemo } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { store } from '../services/store';
import { Product, ProductCategory } from '../types';
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react';

interface CatalogViewProps {
  initialCategory?: string;
  initialOccasion?: string;
  onNavigate: (view: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialCategory,
  initialOccasion,
  onNavigate,
  onQuickView,
}) => {
  const allProducts = store.getProducts();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const categories = [
    'all',
    'Toys',
    'Gifts',
    'Soft Toys',
    'Personalized',
    'Birthday',
    'Couple Gifts',
    'Gift Hampers',
    'Educational Toys',
  ];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catMatch = p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase().replace(/\s+/g, '-') ||
                         p.category.toLowerCase() === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }

      // Occasion filter
      if (initialOccasion) {
        const occMatch = p.occasions && p.occasions.some(
          (o) => o.toLowerCase().replace(/\s+/g, '-') === initialOccasion.toLowerCase().replace(/\s+/g, '-')
        );
        if (!occMatch) return false;
      }

      // Price filter
      if (selectedPriceRange === 'under-500' && p.price >= 500) return false;
      if (selectedPriceRange === '500-1000' && (p.price < 500 || p.price > 1000)) return false;
      if (selectedPriceRange === '1000-2000' && (p.price < 1000 || p.price > 2000)) return false;
      if (selectedPriceRange === 'above-2000' && p.price <= 2000) return false;

      // Badge filter
      if (selectedBadge !== 'all') {
        if (selectedBadge === 'bestseller' && !p.isBestseller && p.badge !== 'BESTSELLER') return false;
        if (selectedBadge === 'new' && !p.isNewArrival && p.badge !== 'NEW') return false;
        if (selectedBadge === 'trending' && p.badge !== 'TRENDING') return false;
        if (selectedBadge === 'personalized' && !p.isPersonalized) return false;
      }

      // Search keyword filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchCategory && !matchTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0; // featured default
    });
  }, [allProducts, selectedCategory, initialOccasion, selectedPriceRange, selectedBadge, sortBy, searchFilter]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedBadge('all');
    setSearchFilter('');
    setSortBy('featured');
  };

  return (
    <div style={{ padding: '36px 0 70px', minHeight: '80vh' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '16px' }}>
          <button onClick={() => onNavigate('home')} style={{ color: '#FF5B60', fontWeight: 600 }}>Home</button>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>Catalog</span>
          {selectedCategory !== 'all' && (
            <>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: '#1E2229', fontWeight: 600 }}>{selectedCategory}</span>
            </>
          )}
        </div>

        {/* Title and Filter Stats */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          gap: '16px',
        }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1E2229' }}>
              {selectedCategory === 'all' 
                ? (initialOccasion ? `${initialOccasion.toUpperCase()} GIFTS & TOYS` : 'All GiggleThreads Gifts & Toys') 
                : `${selectedCategory}`}
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#64748B', marginTop: '4px' }}>
              Showing {filteredProducts.length} of {allProducts.length} gifts crafted with joy and care
            </p>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: '180px', padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="featured">Featured &amp; Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout with Sidebar Filter */}
        <div className="catalog-layout-grid">
          {/* Left Sidebar Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #EFE4DC',
              padding: '20px',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid #F1F5F9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem', color: '#1E2229' }}>
                  <Filter size={16} color="#FF5B60" />
                  <span>Filters</span>
                </div>
                {(selectedCategory !== 'all' || selectedPriceRange !== 'all' || selectedBadge !== 'all' || searchFilter) && (
                  <button 
                    onClick={resetFilters}
                    style={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: 700 }}
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Keyword Search Filter */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Search Catalog
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                  <input 
                    type="text"
                    placeholder="Filter by keyword..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 30px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.85rem',
                    }}
                  />
                  {searchFilter && (
                    <button 
                      onClick={() => setSearchFilter('')}
                      style={{ position: 'absolute', right: '8px', top: '9px', color: '#94A3B8' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Category
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: selectedCategory === cat ? 700 : 500,
                        backgroundColor: selectedCategory === cat ? '#FFF0F1' : 'transparent',
                        color: selectedCategory === cat ? '#FF5B60' : '#475569',
                        transition: 'all 0.15s',
                      }}
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Price Range
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-500', label: 'Under ₹500' },
                    { id: '500-1000', label: '₹500 - ₹1,000' },
                    { id: '1000-2000', label: '₹1,000 - ₹2,000' },
                    { id: 'above-2000', label: 'Above ₹2,000' },
                  ].map((pr) => (
                    <label key={pr.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', color: '#475569' }}>
                      <input 
                        type="radio" 
                        name="price-filter"
                        checked={selectedPriceRange === pr.id}
                        onChange={() => setSelectedPriceRange(pr.id)}
                        style={{ accentColor: '#FF5B60' }}
                      />
                      <span>{pr.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Badges / Special Collections */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Collection Badge
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { id: 'all', label: 'All Badges' },
                    { id: 'bestseller', label: '🔥 Bestsellers' },
                    { id: 'new', label: '✨ New Arrivals' },
                    { id: 'trending', label: '⚡ Trending Now' },
                    { id: 'personalized', label: '❤️ Personalized' },
                  ].map((bd) => (
                    <label key={bd.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', color: '#475569' }}>
                      <input 
                        type="radio" 
                        name="badge-filter"
                        checked={selectedBadge === bd.id}
                        onChange={() => setSelectedBadge(bd.id)}
                        style={{ accentColor: '#FF5B60' }}
                      />
                      <span>{bd.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Grid */}
          <div>
            {filteredProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #EFE4DC',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
                  No Gifts Found
                </h3>
                <p style={{ color: '#64748B', maxWidth: '360px', margin: '0 auto 20px', fontSize: '0.92rem' }}>
                  We couldn't find matching products with the selected filters. Try clearing some criteria to bring back the giggles!
                </p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid-products" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
