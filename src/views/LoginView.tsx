import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { store } from '../services/store';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Sparkles, Lock, Mail } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    store.loginCustomer(email);
    showToast(`Welcome back to GiggleThreads, ${email.split('@')[0]}! 🎉`, 'success');
    onNavigate('account', 'dashboard');
  };

  const handleQuickDemoLogin = () => {
    setEmail('priya.sharma@example.com');
    setPassword('giggle123');
    store.loginCustomer('priya.sharma@example.com');
    showToast('Logged in as demo customer Priya Sharma! 🎁', 'success');
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
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '36px',
        border: '1px solid #EFE4DC',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'center',
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Logo variant="full" size="md" showTagline={false} onClick={() => onNavigate('home')} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '6px' }}>
          Welcome Back to GiggleThreads!
        </h1>

        <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '28px' }}>
          Your next great gift is just a few clicks away.
        </p>

        {/* Quick Demo Fill Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          style={{
            width: '100%',
            backgroundColor: '#FFF0F1',
            border: '1.5px dashed #FF5B60',
            color: '#FF5B60',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={16} />
          <span>Quick Login with Demo Customer (Priya)</span>
        </button>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Email or Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <button 
                type="button" 
                onClick={() => showToast('Password reset link sent to your registered email.', 'info')}
                style={{ fontSize: '0.76rem', color: '#FF5B60', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              style={{ accentColor: '#FF5B60' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.82rem', color: '#64748B', cursor: 'pointer' }}>
              Remember me on this browser
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            <span>Sign In to GiggleThreads</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', fontSize: '0.85rem', color: '#64748B' }}>
          Don't have an account yet?{' '}
          <button 
            onClick={() => onNavigate('signup')} 
            style={{ color: '#FF5B60', fontWeight: 700 }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
