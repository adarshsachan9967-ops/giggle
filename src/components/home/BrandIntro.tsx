import React from 'react';
import { Heart, Sparkles, Smile, Gift } from 'lucide-react';

export const BrandIntro: React.FC = () => {
  return (
    <section style={{ padding: '60px 0 40px' }}>
      <div className="container">
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '48px',
          border: '1px solid #EFE4DC',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle side accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '6px',
            height: '100%',
            background: 'linear-gradient(180deg, #FF5B60 0%, #F59E0B 100%)',
          }} />

          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#FF5B60',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}>
              <Smile size={18} />
              <span>THE GIGGLETHREADS PHILOSOPHY</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800,
              color: '#1E2229',
              marginBottom: '20px',
              fontFamily: 'var(--font-heading)',
            }}>
              Welcome to <span className="text-gradient">GiggleThreads</span>
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: '#475569',
              lineHeight: 1.7,
              marginBottom: '16px',
            }}>
              At <strong>GiggleThreads</strong>, we believe the best gifts are the ones that create a moment. From playful toys and cuddly companions to thoughtful personalized surprises, we make it easy to find something that brings a genuine smile.
            </p>

            <p style={{
              fontSize: '1.05rem',
              color: '#475569',
              lineHeight: 1.7,
              marginBottom: '32px',
            }}>
              Whether you're celebrating a birthday, anniversary, festival, friendship or simply saying <em>"I'm thinking of you"</em>, GiggleThreads helps you make every occasion a little more magical.
            </p>

            {/* Core Values / Smiles Pillars */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              paddingTop: '24px',
              borderTop: '1px dashed #EFE4DC',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#FFF0F1', color: '#FF5B60', padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                  <Smile size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2229' }}>Joy First</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Designed to make eyes light up</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#FEF3C7', color: '#F59E0B', padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                  <Sparkles size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2229' }}>Careful Craft</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Heirloom quality materials</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#E6FBF5', color: '#06D6A0', padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                  <Heart size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2229' }}>Gift-Wrapped Love</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Personalized notes &amp; bows</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                  <Gift size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2229' }}>Guaranteed Giggles</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Smiles or we make it right</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
