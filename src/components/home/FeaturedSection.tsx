import React, { useState } from 'react';
import { ProductCard } from '../product/ProductCard';
import { store } from '../../services/store';
import { Product } from '../../types';
import { ArrowRight } from 'lucide-react';

interface FeaturedSectionProps {
  onNavigate: (view: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onNavigate, onQuickView }) => {
  const [activeTab, setActiveTab] = useState<'bestseller' | 'trending' | 'new' | 'personalized'>('bestseller');
  const allProducts = store.getProducts();

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'bestseller':
        return allProducts.filter((p) => p.isBestseller || p.badge === 'BESTSELLER').slice(0, 8);
      case 'trending':
        return allProducts.filter((p) => p.badge === 'TRENDING' || p.isFeatured).slice(0, 8);
      case 'new':
        return allProducts.filter((p) => p.isNewArrival || p.badge === 'NEW').slice(0, 8);
      case 'personalized':
        return allProducts.filter((p) => p.isPersonalized || p.category === 'Personalized').slice(0, 8);
      default:
        return allProducts.slice(0, 8);
    }
  };

  const displayedProducts = getFilteredProducts();

  return (
    <section style={{ padding: '60px 0' }}>
      <div className="container">
        {/* Header & Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          gap: '20px',
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              MOST LOVED SURPRISES
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#1E2229' }}>
              Giggle-Worthy Favorites
            </h2>
          </div>

          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            padding: '4px',
            borderRadius: '9999px',
            border: '1.5px solid #EFE4DC',
          }}>
            <button
              onClick={() => setActiveTab('bestseller')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'bestseller' ? '#FF5B60' : 'transparent',
                color: activeTab === 'bestseller' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              Bestsellers 🔥
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'trending' ? '#FF5B60' : 'transparent',
                color: activeTab === 'trending' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              Trending ⚡
            </button>

            <button
              onClick={() => setActiveTab('new')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'new' ? '#FF5B60' : 'transparent',
                color: activeTab === 'new' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              New Arrivals ✨
            </button>

            <button
              onClick={() => setActiveTab('personalized')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'personalized' ? '#FF5B60' : 'transparent',
                color: activeTab === 'personalized' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              Personalized ❤️
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid-products">
          {displayedProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('catalog')}
          >
            <span>Explore Entire GiggleThreads Catalog (50+ Products)</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
