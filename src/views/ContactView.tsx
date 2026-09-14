import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { store } from '../services/store';

export const ContactView: React.FC = () => {
  const { showToast } = useToast();
  const settings = store.getSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Gift Recommendation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been received! Our team will reach out within 2 hours. 💌', 'success');
  };

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#FAF7F5' }}>
      <div className="container" style={{ maxWidth: '1020px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CONNECT WITH GIGGLETHREADS
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#1E2229', margin: '8px 0 12px' }}>
            We're Here to Help.
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Whether you need help choosing a gift, tracking an order or simply have a question, the GiggleThreads team is always happy to help.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
          {/* Contact Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px',
              border: '1px solid #EFE4DC',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E2229', marginBottom: '20px' }}>
                Contact Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ backgroundColor: '#FFF0F1', color: '#FF5B60', padding: '10px', borderRadius: '50%', height: 'fit-content' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E2229' }}>Email Us</div>
                    <div style={{ color: '#475569', fontSize: '0.88rem' }}>{settings.supportEmail}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Average response time: 2 hours</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ backgroundColor: '#FEF3C7', color: '#F59E0B', padding: '10px', borderRadius: '50%', height: 'fit-content' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E2229' }}>Phone &amp; WhatsApp</div>
                    <div style={{ color: '#475569', fontSize: '0.88rem' }}>{settings.supportPhone}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Mon - Sat: 9:00 AM - 8:00 PM IST</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ backgroundColor: '#E6FBF5', color: '#06D6A0', padding: '10px', borderRadius: '50%', height: 'fit-content' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E2229' }}>Studio &amp; Dispatch Hub</div>
                    <div style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      {settings.address}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', padding: '10px', borderRadius: '50%', height: 'fit-content' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E2229' }}>Operating Hours</div>
                    <div style={{ color: '#475569', fontSize: '0.88rem' }}>Monday – Saturday: 9:00 AM – 8:00 PM</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Sunday: Order processing active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Chat Banner */}
            <div style={{
              backgroundColor: '#E6FBF5',
              border: '1.5px solid #A7F3D0',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <MessageCircle size={32} color="#059669" />
              <div>
                <div style={{ fontWeight: 800, color: '#065F46', fontSize: '0.95rem' }}>
                  Need Immediate Gifting Advice?
                </div>
                <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                  Chat with a GiggleThreads Gift Stylist on WhatsApp for instant birthday and anniversary recommendations.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid #EFE4DC',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E2229', marginBottom: '8px' }}>
              Send Us a Message
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '24px' }}>
              Drop us your query and we'll get right back to you.
            </p>

            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#FFF9F6',
                borderRadius: '16px',
                border: '1px solid #FFE4DB',
              }}>
                <CheckCircle2 size={48} color="#06D6A0" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E2229', marginBottom: '6px' }}>
                  Message Sent Successfully!
                </h4>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '18px' }}>
                  Thank you for reaching out to GiggleThreads. Our smile team will respond to <strong>{email}</strong> shortly.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Anjali Nair"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="anjali@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select 
                    className="form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Gift Recommendation">Gift Recommendation</option>
                    <option value="Order Tracking &amp; Delivery">Order Tracking &amp; Delivery</option>
                    <option value="Personalization Request">Personalization Request</option>
                    <option value="Return / Replacement">Return / Replacement</option>
                    <option value="Corporate / Bulk Hampers">Corporate / Bulk Hampers</option>
                    <option value="Other Query">Other Query</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="How can GiggleThreads help spark smiles for you today?..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{ minHeight: '120px' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  <Send size={16} />
                  <span>Send Message to Care Team</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
