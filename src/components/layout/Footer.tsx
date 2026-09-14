import React, { useState } from 'react';
import { 
  Mail, ShieldCheck, Truck, RotateCcw, HeartHandshake, CheckCircle2 
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Yay! You are now subscribed to GiggleThreads smiles! 🎉', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer style={{ backgroundColor: '#181C24', color: '#E2E8F0', marginTop: 'auto', borderTop: '1px solid #282E3A' }}>
      {/* Value Proposition Bar */}
      <div style={{ borderBottom: '1px solid #282E3A', padding: '36px 0', backgroundColor: '#1E232D' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(255, 91, 96, 0.15)',
                color: '#FF5B60',
                padding: '12px',
                borderRadius: '50%',
                display: 'flex',
              }}>
                <Truck size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>Free Express Delivery</div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>On all orders above ₹999 across India</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                padding: '12px',
                borderRadius: '50%',
                display: 'flex',
              }}>
                <RotateCcw size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>7-Day Easy Returns</div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Hassle-free replacements &amp; refunds</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(6, 214, 160, 0.15)',
                color: '#06D6A0',
                padding: '12px',
                borderRadius: '50%',
                display: 'flex',
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>100% Safe &amp; Non-Toxic</div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Certified BIS &amp; EN-71 child safety safe</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                padding: '12px',
                borderRadius: '50%',
                display: 'flex',
              }}>
                <HeartHandshake size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>Curated With Love</div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Every gift sparks joy &amp; real giggles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container" style={{ padding: '64px 20px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
          gap: '40px',
        }}>
          {/* Brand Info */}
          <div>
            <Logo variant="white" size="lg" showTagline={true} onClick={() => onNavigate('home')} />
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '16px', maxWidth: '320px' }}>
              At <strong>GiggleThreads</strong>, we believe the best gifts are the ones that create a moment. From cuddly companions to thoughtful personalized surprises, we craft smiles worth remembering.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href="#instagram" style={{ color: '#94A3B8', padding: '8px', backgroundColor: '#282E3A', borderRadius: '50%', display: 'flex' }} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#facebook" style={{ color: '#94A3B8', padding: '8px', backgroundColor: '#282E3A', borderRadius: '50%', display: 'flex' }} aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#twitter" style={{ color: '#94A3B8', padding: '8px', backgroundColor: '#282E3A', borderRadius: '50%', display: 'flex' }} aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#youtube" style={{ color: '#94A3B8', padding: '8px', backgroundColor: '#282E3A', borderRadius: '50%', display: 'flex' }} aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '18px', fontWeight: 700 }}>Shop</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li><button onClick={() => onNavigate('category', 'toys')} style={{ color: 'inherit' }}>Toys</button></li>
              <li><button onClick={() => onNavigate('category', 'gifts')} style={{ color: 'inherit' }}>Gifts</button></li>
              <li><button onClick={() => onNavigate('category', 'soft-toys')} style={{ color: 'inherit' }}>Soft Toys</button></li>
              <li><button onClick={() => onNavigate('category', 'personalized')} style={{ color: 'inherit' }}>Personalized Gifts</button></li>
              <li><button onClick={() => onNavigate('category', 'gift-hampers')} style={{ color: 'inherit' }}>Gift Hampers</button></li>
              <li><button onClick={() => onNavigate('category', 'birthday')} style={{ color: 'inherit' }}>Birthday Gifts</button></li>
              <li><button onClick={() => onNavigate('catalog')} style={{ color: 'inherit' }}>New Arrivals</button></li>
              <li><button onClick={() => onNavigate('catalog')} style={{ color: 'inherit' }}>Best Sellers</button></li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '18px', fontWeight: 700 }}>Help</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li><button onClick={() => onNavigate('contact')} style={{ color: 'inherit' }}>Contact Us</button></li>
              <li><button onClick={() => onNavigate('faq')} style={{ color: 'inherit' }}>FAQ</button></li>
              <li><button onClick={() => onNavigate('shipping-policy')} style={{ color: 'inherit' }}>Shipping Policy</button></li>
              <li><button onClick={() => onNavigate('refund-policy')} style={{ color: 'inherit' }}>Returns &amp; Refunds</button></li>
              <li><button onClick={() => onNavigate('track-order')} style={{ color: 'inherit' }}>Track Order</button></li>
              <li><button onClick={() => onNavigate('account', 'dashboard')} style={{ color: 'inherit' }}>My Account</button></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '18px', fontWeight: 700 }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li><button onClick={() => onNavigate('about')} style={{ color: 'inherit' }}>About Us</button></li>
              <li><button onClick={() => onNavigate('about')} style={{ color: 'inherit' }}>Careers</button></li>
              <li><button onClick={() => onNavigate('privacy-policy')} style={{ color: 'inherit' }}>Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms-conditions')} style={{ color: 'inherit' }}>Terms &amp; Conditions</button></li>
              <li><button onClick={() => onNavigate('admin')} style={{ color: '#FF5B60', fontWeight: 600 }}>Admin Portal</button></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '8px', fontWeight: 700 }}>
              Get More Giggles in Your Inbox
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
              Sign up for new arrivals, special offers and gift inspiration.
            </p>

            {isSubscribed ? (
              <div style={{
                backgroundColor: 'rgba(6, 214, 160, 0.15)',
                color: '#06D6A0',
                padding: '12px 16px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                <CheckCircle2 size={18} />
                <span>You're on the list for giggles!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <input 
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      borderRadius: '9999px',
                      backgroundColor: '#282E3A',
                      border: '1px solid #3B4252',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '11px', borderRadius: '9999px' }}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid #282E3A',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.8rem',
          color: '#64748B',
        }}>
          <div>
            &copy; {new Date().getFullYear()} <strong>GiggleThreads</strong>. All rights reserved. Made with love for little moments and big smiles.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Razorpay Secure Payments (UPI, Cards, NetBanking, COD)</span>
            <span>•</span>
            <button onClick={() => onNavigate('privacy-policy')} style={{ color: 'inherit' }}>Privacy</button>
            <button onClick={() => onNavigate('terms-conditions')} style={{ color: 'inherit' }}>Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
