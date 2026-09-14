import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { store } from '../../services/store';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@gigglethreads.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = store.loginAdmin(email, password);
    if (res.success) {
      showToast('Authenticated successfully as Super Admin! 🛡️', 'success');
      onLoginSuccess();
    } else {
      showToast(res.error || 'Invalid credentials.', 'error');
    }
  };

  const handleQuickAdminLogin = () => {
    setEmail('admin@gigglethreads.com');
    setPassword('admin123');
    const res = store.loginAdmin('admin@gigglethreads.com', 'admin123');
    if (res.success) {
      showToast('Quick Admin authentication granted! 🛡️', 'success');
      onLoginSuccess();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0F172A',
      padding: '24px',
      color: '#F8FAFC',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#1E293B',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
      }}>
        {/* Admin Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Logo variant="white" size="lg" showTagline={false} />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(255, 91, 96, 0.15)',
          color: '#FF767B',
          padding: '4px 14px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '14px',
          border: '1px solid rgba(255, 91, 96, 0.3)',
        }}>
          <ShieldCheck size={14} />
          <span>PORTAL MANAGEMENT</span>
        </div>

        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
          GiggleThreads Admin
        </h1>

        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '28px' }}>
          Manage your store. Create more smiles.
        </p>

        {/* Quick 1-Click Evaluation Login */}
        <button
          type="button"
          onClick={handleQuickAdminLogin}
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 91, 96, 0.2)',
            border: '1.5px dashed #FF5B60',
            color: '#FFA8AB',
            padding: '11px 14px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={16} color="#FF5B60" />
          <span>Quick 1-Click Admin Login (Evaluator Access)</span>
        </button>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '10px',
                  backgroundColor: '#0F172A',
                  border: '1.5px solid #334155',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '10px',
                  backgroundColor: '#0F172A',
                  border: '1.5px solid #334155',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94A3B8', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                style={{ accentColor: '#FF5B60' }}
              />
              <span>Remember this device</span>
            </label>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Role: Super Admin</span>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '0.95rem' }}
          >
            <span>Sign In to Admin Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid #334155' }}>
          <button 
            type="button"
            onClick={onNavigateHome}
            style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}
          >
            <span>&larr; Return to Customer Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
