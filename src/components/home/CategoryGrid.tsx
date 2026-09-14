import React from 'react';
import { ArrowRight } from 'lucide-react';
import { store } from '../../services/store';

interface CategoryGridProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  const categories = store.getCategories();

  return (
    <section style={{ padding: '40px 0 60px' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '32px',
          gap: '16px',
        }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              CURATED COLLECTIONS
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#1E2229' }}>
              Shop by Category
            </h2>
          </div>

          <button 
            onClick={() => onNavigate('catalog')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#FF5B60',
            }}
          >
            <span>View All 50+ Products</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 8 Category Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '22px',
        }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('category', cat.slug)}
              className="card card-hover-lift"
              style={{
                cursor: 'pointer',
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EFE4DC',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image with zoom effect */}
              <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '16px',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}>
                  {cat.itemCount}+ Gifts &amp; Toys
                </div>
              </div>

              {/* Text content */}
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E2229', marginBottom: '4px' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FF5B60', marginBottom: '8px' }}>
                  "{cat.tagline}"
                </p>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45, marginBottom: '14px', flexGrow: 1 }}>
                  {cat.description}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1E2229',
                  marginTop: 'auto',
                }}>
                  <span>Explore {cat.name}</span>
                  <ArrowRight size={14} color="#FF5B60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
