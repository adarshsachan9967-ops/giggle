import React from 'react';
import { store } from '../../services/store';

interface OccasionSectionProps {
  onNavigate: (view: string, param?: string) => void;
}

export const OccasionSection: React.FC<OccasionSectionProps> = ({ onNavigate }) => {
  const occasions = store.getOccasions();

  return (
    <section style={{ padding: '50px 0 60px', backgroundColor: '#FFF6F2' }}>
      <div className="container">
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            CELEBRATE EVERY MOMENT
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)', fontWeight: 800, color: '#1E2229', marginBottom: '10px' }}>
            There's Always a Reason to Gift.
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.5 }}>
            From milestone birthdays to spontaneous Tuesday surprises, explore gifts tailored for every smile-worthy occasion.
          </p>
        </div>

        {/* 12 Occasion Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '16px',
        }}>
          {occasions.map((occ) => (
            <div
              key={occ.id}
              onClick={() => onNavigate('occasion', occ.slug)}
              className="card card-hover-lift"
              style={{
                cursor: 'pointer',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EFE4DC',
                textAlign: 'center',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                marginBottom: '10px',
                backgroundColor: '#F8FAFC',
                border: '3px solid #FFF0F1',
              }}>
                <img 
                  src={occ.image} 
                  alt={occ.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy" 
                />
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E2229', marginBottom: '4px' }}>
                {occ.name}
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.3 }}>
                {occ.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
