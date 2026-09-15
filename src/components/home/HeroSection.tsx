import React from 'react';
import { ArrowRight, Sparkles, Smile, ShieldCheck, Heart } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (view: string, param?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section style={{
      position: 'relative',
      background: 'linear-gradient(180deg, #FFF6F4 0%, #FCF8F5 100%)',
      padding: '50px 0 70px',
      overflow: 'hidden',
    }}>
      {/* Decorative ambient background blobs */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 91, 96, 0.12) 0%, rgba(255, 91, 96, 0) 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: '-60px',
        width: '340px',
        height: '340px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0) 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          alignItems: 'center',
          gap: '48px',
        }}>
          {/* Left Text Column */}
          <div style={{ maxWidth: '580px' }}>
            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #FFE4DB',
              borderRadius: '9999px',
              padding: '6px 16px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(255, 91, 96, 0.1)',
            }}>
              <Smile size={16} color="#FF5B60" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FF5B60', letterSpacing: '0.02em' }}>
                LITTLE GIFTS • BIG GIGGLES • BEAUTIFUL MEMORIES
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#1E2229',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
            }}>
              Gifts That Spark <span className="text-gradient">Giggles</span> &amp; Memories.
            </h1>

            {/* Supporting Text */}
            <p style={{
              fontSize: '1.1rem',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}>
              Discover delightful toys, thoughtful gifts and beautiful surprises made for birthdays, celebrations and all the little moments worth remembering.
            </p>

            {/* Dual CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('category', 'gifts')}
              >
                <span>SHOP GIFTS</span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate('category', 'toys')}
              >
                <span>EXPLORE TOYS</span>
              </button>
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #EFE4DC',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}>
                <ShieldCheck size={18} color="#06D6A0" />
                <span>Certified Child-Safe</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}>
                <Sparkles size={18} color="#F59E0B" />
                <span>Hand-Curated Magic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}>
                <Heart size={18} color="#FF5B60" />
                <span>50,000+ Happy Giggles</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Composition */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 24px 50px rgba(30, 34, 41, 0.14)',
              border: '6px solid #FFFFFF',
              backgroundColor: '#FFFFFF',
            }}>
              <img 
                src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1000&q=85" 
                alt="GiggleThreads Plush Teddy Bear & Gifts"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Floating Highlight Card 1 */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              padding: '10px 16px',
              borderRadius: '16px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
              border: '1px solid #EFE4DC',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: 'calc(100% - 24px)',
              animation: 'pulseSubtle 4s infinite ease-in-out',
            }}>
              <div style={{
                backgroundColor: '#FFF0F1',
                color: '#FF5B60',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
              }}>
                <Smile size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Cuddle Happiness</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E2229' }}>GiggleBear Classic Teddy</div>
              </div>
            </div>

            {/* Floating Highlight Card 2 */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              padding: '10px 16px',
              borderRadius: '16px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
              border: '1px solid #EFE4DC',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: 'calc(100% - 24px)',
            }}>
              <div style={{
                backgroundColor: '#FEF3C7',
                color: '#F59E0B',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
              }}>
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Unboxing Joy</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E2229' }}>Curated Gift Hampers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
