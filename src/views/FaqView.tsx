import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  // Orders
  {
    category: 'Orders',
    q: 'How do I place an order on GiggleThreads?',
    a: 'Browse our catalog of gifts, soft toys, and hampers. Select your desired product, choose any variants or add free custom personalization (such as names or dates), and click "Add to Basket" or "Buy Now". Follow the simple 3-step checkout to provide delivery details and complete your payment securely.',
  },
  {
    category: 'Orders',
    q: 'Can I modify or cancel my order after placing it?',
    a: 'Yes, orders can be cancelled or modified within 2 hours of placing them before they enter the personalization and packing queue. Reach out immediately to care@gigglethreads.com or call +91 98765 43210 with your Order Number.',
  },

  // Shipping & Delivery
  {
    category: 'Shipping',
    q: 'What are the delivery timelines and shipping charges?',
    a: 'We offer Free Express Delivery across India on all orders above ₹999. For orders below ₹999, a nominal standard shipping fee of ₹49 applies. Standard delivery takes 2 to 4 business days. Priority Express Air Shipping (1-2 days) is available at checkout for ₹149.',
  },
  {
    category: 'Shipping',
    q: 'How do I track my GiggleThreads order?',
    a: 'Once your order is dispatched, you will receive an SMS and email with your tracking number and BlueDart / Delhivery tracking link. You can also click "Track Order" in our website header or customer dashboard at any time.',
  },

  // Personalized Products
  {
    category: 'Personalization',
    q: 'How does personalization work for mugs, lamps, and cushions?',
    a: 'On eligible personalized product pages, you will find a dedicated customization field. Simply type the recipient’s name, anniversary date, or personal quote. Our artisans will laser-engrave, UV-print, or embroider your text with exact fidelity.',
  },
  {
    category: 'Personalization',
    q: 'Can I preview my personalized text before shipping?',
    a: 'Yes! The product page reflects your personalized details, and our craft team performs visual quality checks before packing. If there are any ambiguities, our team will WhatsApp you to verify spelling.',
  },

  // Gift Wrapping
  {
    category: 'Gift Wrapping',
    q: 'What is included in the GiggleThreads Signature Gift Wrap?',
    a: 'For just ₹99, your gift is enveloped in our signature gold-stamped luxury gift box, tied with a hand-knotted satin ribbon, and accompanied by a custom printed greeting card containing your personalized message.',
  },

  // Payments
  {
    category: 'Payments',
    q: 'Which payment methods does GiggleThreads support?',
    a: 'Through our secure Razorpay gateway, we accept all major UPI apps (Google Pay, PhonePe, Paytm, BHIM), Credit Cards (Visa, MasterCard, Amex, RuPay), Debit Cards, Net Banking across 50+ banks, Wallets, and Cash on Delivery (COD).',
  },
  {
    category: 'Payments',
    q: 'Is my payment information safe on GiggleThreads?',
    a: 'Absolutely. GiggleThreads operates with 256-bit bank-grade SSL encryption and PCI-DSS Level 1 certification. We never store credit card numbers or banking passwords on our servers.',
  },

  // Returns & Refunds
  {
    category: 'Returns',
    q: 'What is GiggleThreads’ return and replacement policy?',
    a: 'We offer a 7-Day Hassle-Free Replacement for any defective, damaged, or incorrect products. Simply email photo proof of the item to care@gigglethreads.com within 7 days of delivery, and our team will arrange a free courier pickup and dispatch a brand-new replacement immediately.',
  },
  {
    category: 'Returns',
    q: 'How long does a refund take to reflect in my bank account?',
    a: 'Once a return is received and inspected at our hub, approved refunds are processed within 24 to 48 hours directly to your original payment method (UPI / Bank Account), typically reflecting in 3-5 business days.',
  },
];

export const FaqView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Orders', 'Shipping', 'Personalization', 'Gift Wrapping', 'Payments', 'Returns'];

  const filteredFaqs = FAQS.filter((faq) => {
    if (selectedCategory !== 'All' && faq.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#FAF7F5' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            GOT QUESTIONS?
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#1E2229', margin: '8px 0 12px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            Everything you need to know about GiggleThreads gifting, delivery, and payments.
          </p>
        </div>

        {/* Search Input */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          border: '1.5px solid #EFE4DC',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: 'var(--shadow-xs)',
          maxWidth: '540px',
          margin: '0 auto 28px',
        }}>
          <Search size={18} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Search questions (e.g. tracking, returns, gift wrap)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.92rem',
              color: '#1E2229',
            }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '36px',
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: selectedCategory === cat ? '#FF5B60' : '#FFFFFF',
                color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                border: '1px solid #EFE4DC',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EFE4DC',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: isOpen ? '#FF5B60' : '#1E2229',
                    backgroundColor: isOpen ? '#FFFBF9' : '#FFFFFF',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                      marginLeft: '12px'
                    }} 
                  />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 22px',
                    fontSize: '0.92rem',
                    color: '#475569',
                    lineHeight: 1.7,
                    backgroundColor: '#FFFBF9',
                    borderTop: '1px solid #FFF0EB',
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
