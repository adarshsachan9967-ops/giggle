import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'white' | 'admin' | 'invoice';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 140, height: 36, iconSize: 28 };
      case 'lg': return { width: 220, height: 56, iconSize: 44 };
      case 'xl': return { width: 260, height: 68, iconSize: 52 };
      case 'md':
      default: return { width: 180, height: 46, iconSize: 36 };
    }
  };

  const dim = getDimensions();

  // Color schemes
  const isWhite = variant === 'white';
  const isAdmin = variant === 'admin';
  const isInvoice = variant === 'invoice';

  const coralColor = isWhite ? '#FFFFFF' : '#FF5B60';
  const darkColor = isWhite ? '#F1F5F9' : (isAdmin ? '#0F172A' : '#1E2229');
  const goldColor = isWhite ? '#FDE047' : '#F59E0B';
  const tagColor = isWhite ? 'rgba(255,255,255,0.85)' : '#6B7280';

  if (variant === 'compact') {
    return (
      <div 
        className={`inline-flex items-center cursor-pointer ${className}`}
        onClick={onClick}
        title="GiggleThreads"
        style={{ display: 'inline-flex', alignItems: 'center', cursor: onClick ? 'pointer' : 'default' }}
      >
        <svg 
          width={dim.iconSize} 
          height={dim.iconSize} 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="14" fill={isWhite ? 'rgba(255,255,255,0.2)' : 'url(#gtLogomarkGrad)'} />
          {/* Thread / Ribbon gift knot */}
          <path d="M16 17 C16 12, 22 12, 24 17 C26 12, 32 12, 32 17 C32 22, 24 26, 24 26 C24 26, 16 22, 16 17 Z" fill={goldColor} />
          <circle cx="24" cy="18" r="2.5" fill="#FFFFFF" />
          {/* Smile arc */}
          <path d="M14 27 C18 35, 30 35, 34 27" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="13" cy="26" r="2" fill={goldColor} />
          <circle cx="35" cy="26" r="2" fill={goldColor} />
          <defs>
            <linearGradient id="gtLogomarkGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF6B6B" />
              <stop offset="1" stopColor="#E84855" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div 
      className={`logo-container ${className}`} 
      onClick={onClick}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      <svg 
        width={dim.iconSize} 
        height={dim.iconSize} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="48" height="48" rx="14" fill={isWhite ? 'rgba(255,255,255,0.2)' : 'url(#gtGradFull)'} />
        {/* Ribbon Bow / Thread Knot */}
        <path d="M16 17 C16 12, 22 12, 24 17 C26 12, 32 12, 32 17 C32 22, 24 26, 24 26 C24 26, 16 22, 16 17 Z" fill={goldColor} />
        <circle cx="24" cy="18" r="2.5" fill="#FFFFFF" />
        {/* Playful Smile Arc */}
        <path d="M14 27 C18 35, 30 35, 34 27" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="13" cy="26" r="2" fill={goldColor} />
        <circle cx="35" cy="26" r="2" fill={goldColor} />
        <defs>
          <linearGradient id="gtGradFull" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B6B" />
            <stop offset="1" stopColor="#E84855" />
          </linearGradient>
        </defs>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ 
          fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", 
          fontWeight: 800, 
          fontSize: size === 'sm' ? '1.15rem' : (size === 'lg' ? '1.65rem' : (size === 'xl' ? '1.95rem' : '1.35rem')),
          letterSpacing: '-0.025em',
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          <span style={{ color: coralColor }}>Giggle</span>
          <span style={{ color: darkColor }}>Threads</span>
          <span style={{ 
            display: 'inline-block', 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            backgroundColor: goldColor,
            marginBottom: '4px',
            marginLeft: '1px'
          }} />
        </div>

        {(showTagline || isInvoice) && (
          <span style={{ 
            fontSize: size === 'sm' ? '0.65rem' : '0.72rem', 
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: tagColor, 
            fontWeight: 500,
            letterSpacing: '0.01em',
            marginTop: '3px'
          }}>
            Gifts That Spark Giggles &amp; Memories.
          </span>
        )}
      </div>
    </div>
  );
};
