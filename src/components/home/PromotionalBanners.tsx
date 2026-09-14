import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { store } from '../../services/store';
import { Banner } from '../../types';

interface PromotionalBannersProps {
  onNavigate: (view: string, param?: string) => void;
}

export const PromotionalBanners: React.FC<PromotionalBannersProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<Banner[]>(store.getBanners().filter((b) => b.active));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      setBanners(store.getBanners().filter((b) => b.active));
    };
    const unsub = store.subscribe(update);
    return unsub;
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleCtaClick = () => {
    // Parse ctaUrl
    if (currentBanner.ctaUrl.startsWith('/category/')) {
      const cat = currentBanner.ctaUrl.replace('/category/', '');
      onNavigate('category', cat);
    } else {
      onNavigate('catalog');
    }
  };

  return (
    <section style={{ padding: '30px 0 20px' }}>
      <div className="container">
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          minHeight: '340px',
          backgroundColor: '#1E2229',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
        }}>
          {/* Background image with overlay gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${currentBanner.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.75)',
            transition: 'background-image 0.5s ease',
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.2) 100%)',
          }} />

          {/* Banner Content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '48px 56px',
            maxWidth: '650px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '340px',
          }}>
            {currentBanner.badge && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 91, 96, 0.25)',
                border: '1px solid rgba(255, 91, 96, 0.5)',
                color: '#FFA8AB',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '14px',
                width: 'fit-content',
              }}>
                {currentBanner.badge}
              </div>
            )}

            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '12px',
              fontFamily: 'var(--font-heading)',
            }}>
              {currentBanner.title}
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: '#E2E8F0',
              lineHeight: 1.5,
              marginBottom: '26px',
            }}>
              {currentBanner.subtitle}
            </p>

            <button 
              className="btn btn-primary"
              style={{ width: 'fit-content', padding: '12px 26px', fontSize: '1rem' }}
              onClick={handleCtaClick}
            >
              <span>{currentBanner.ctaText}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Controls: Prev / Next buttons */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '28px',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <button 
              onClick={handlePrev}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              aria-label="Previous campaign banner"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Indicator dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {banners.map((b, i) => (
                <div 
                  key={b.id}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: currentIndex === i ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: currentIndex === i ? '#FF5B60' : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              aria-label="Next campaign banner"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
