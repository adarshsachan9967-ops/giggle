import React from 'react';
import { Smile, ArrowRight, Home, ShoppingBag } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      backgroundColor: '#FAF7F5',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        {/* Playful Illustration Element */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#FFF0F1',
          color: '#FF5B60',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(255, 91, 96, 0.2)',
        }}>
          <Smile size={52} />
        </div>

        <div style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          color: '#1E2229',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1,
          marginBottom: '8px',
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
          fontWeight: 800,
          color: '#1E2229',
          marginBottom: '12px',
        }}>
          Oops! This Page Took a Little Detour.
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: '#475569',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}>
          We couldn't find what you were looking for, but there's always another reason to giggle at <strong>GiggleThreads</strong>.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('home')}
          >
            <Home size={18} />
            <span>Back to Home</span>
          </button>

          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('catalog')}
          >
            <ShoppingBag size={18} />
            <span>Shop Gifts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
