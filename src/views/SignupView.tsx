import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { store } from '../services/store';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';

interface SignupViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    const cust = store.loginCustomer(email);
    store.updateCustomerProfile({ name: fullName, phone });
    showToast(`Yay! Welcome to GiggleThreads, ${fullName}! 🎉`, 'success');
    onNavigate('account', 'dashboard');
  };

  const handleGoogleSignup = () => {
    const demoEmail = 'google.user@gigglethreads.com';
    store.loginCustomer(demoEmail);
    store.updateCustomerProfile({ name: 'Alex Rivera' });
    showToast('Signed in via Google account!', 'success');
    onNavigate('account', 'dashboard');
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      backgroundColor: '#FAF7F5',
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '36px',
        border: '1px solid #EFE4DC',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <Logo variant="full" size="md" showTagline={false} onClick={() => onNavigate('home')} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '6px' }}>
          Join the Giggle!
        </h1>

        <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '24px' }}>
          Create your GiggleThreads account and make gifting easier.
        </p>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            color: '#1E2229',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>or register with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="e.g. Maya Kapoor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="maya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="tel" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
            <span>Create Account</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #F1F5F9', fontSize: '0.85rem', color: '#64748B' }}>
          Already part of the family?{' '}
          <button 
            onClick={() => onNavigate('login')} 
            style={{ color: '#FF5B60', fontWeight: 700 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
