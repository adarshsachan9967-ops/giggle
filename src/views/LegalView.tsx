import React, { useState } from 'react';
import { ShieldCheck, FileText, RotateCcw, Truck, Ban, Cookie, Info } from 'lucide-react';

interface LegalViewProps {
  initialTab?: string;
}

export const LegalView: React.FC<LegalViewProps> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'refund', label: 'Return & Refund Policy', icon: RotateCcw },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'cancellation', label: 'Cancellation Policy', icon: Ban },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
  ];

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#FAF7F5' }}>
      <div className="container" style={{ maxWidth: '1020px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF5B60', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TRANSPARENCY &amp; TRUST
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#1E2229', margin: '8px 0 12px' }}>
            GiggleThreads Legal &amp; Policies
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Clear, honest terms designed to protect your peace of mind and gifting experience.
          </p>
        </div>

        {/* Advisory Notice */}
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '14px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#1E40AF',
          marginBottom: '32px',
        }}>
          <Info size={18} color="#3B82F6" style={{ flexShrink: 0 }} />
          <span>
            <strong>Internal Compliance Note:</strong> These policies govern GiggleThreads customer transactions. Store administrators should ensure policies are periodically reviewed with legal advisors prior to multi-state commercial operations.
          </span>
        </div>

        {/* 2-Column Tabs Layout */}
        <div className="legal-layout-grid">
          {/* Tabs Menu */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #EFE4DC',
            padding: '12px',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.86rem',
                    textAlign: 'left',
                    backgroundColor: isActive ? '#FFF0F1' : 'transparent',
                    color: isActive ? '#FF5B60' : '#475569',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Policy Text Area */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid #EFE4DC',
            boxShadow: 'var(--shadow-sm)',
            lineHeight: 1.8,
            color: '#334155',
            fontSize: '0.94rem',
          }}>
            {/* PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '8px' }}>
                  GiggleThreads Privacy Policy
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '24px' }}>
                  Last Updated: September 2026
                </div>

                <p>
                  At <strong>GiggleThreads</strong> (operated by GiggleThreads Pvt. Ltd.), we are committed to safeguarding your personal information. This Privacy Policy details how we collect, handle, and protect your information when you shop with us online.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  1. Information We Collect
                </h3>
                <p>
                  We collect information necessary to fulfill your gift orders, including your name, delivery address, contact email, recipient phone number, and personalized engraving texts. When you checkout, your payment information is directly handled by our RBI-compliant payment gateway partner, <strong>Razorpay</strong>; GiggleThreads does not store credit card numbers or PINs.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  2. Use of Your Information
                </h3>
                <p>
                  Your information is utilized solely to process your orders, schedule courier pickups, provide live shipment tracking via SMS and email, and respond to your customer care inquiries. We will never sell, rent, or lease your personal data to third-party marketers.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  3. Data Security &amp; Retention
                </h3>
                <p>
                  GiggleThreads maintains strict physical, electronic, and administrative safeguards. All communications on our storefront utilize 256-bit SSL encryption. Personalization files (such as customer photo uploads for custom mugs) are stored in secure buckets and automatically purged 60 days following successful order delivery.
                </p>
              </div>
            )}

            {/* TERMS & CONDITIONS */}
            {activeTab === 'terms' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '8px' }}>
                  Terms &amp; Conditions
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '24px' }}>
                  Last Updated: September 2026
                </div>

                <p>
                  Welcome to <strong>GiggleThreads</strong>. By accessing or using our website, products, and services, you agree to comply with and be bound by the following Terms &amp; Conditions.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  1. Product Descriptions &amp; Pricing
                </h3>
                <p>
                  We strive to ensure all product images, specifications, and prices displayed on GiggleThreads are accurate. However, slight handmade variations in wooden grain texture, hand-stitched plush toys, or color tones due to display calibrations may occur and celebrate the artisanal quality of our gifts.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  2. Order Acceptance
                </h3>
                <p>
                  Receipt of an order confirmation does not signify our final acceptance of your order. GiggleThreads reserves the right to accept or decline your order in cases of stock shortages, incorrect pricing errors, or inability to authorize payment.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  3. Intellectual Property
                </h3>
                <p>
                  All content, logos, illustrations, product descriptions, and typography on this site are the exclusive intellectual property of GiggleThreads Pvt. Ltd. and protected under applicable copyright laws.
                </p>
              </div>
            )}

            {/* RETURN & REFUND */}
            {activeTab === 'refund' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '8px' }}>
                  Return &amp; Refund Policy
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '24px' }}>
                  Our Smile Guarantee
                </div>

                <p>
                  At <strong>GiggleThreads</strong>, we want every gift to spark genuine smiles. If an item arrives damaged, defective, or incorrect, our 7-Day Hassle-Free Replacement Policy protects you.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  1. Return Eligibility
                </h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li>Products must be reported within 7 days of delivery.</li>
                  <li>Standard non-personalized toys, plushies, and games must be unused in original packaging.</li>
                  <li>Perishable items (chocolates/cookies) can only be replaced if damaged in transit.</li>
                  <li>Personalized items (custom name frames, engraved mugs) cannot be returned for change of mind, but will be promptly remade and reshipped if defective.</li>
                </ul>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  2. Refund Processing
                </h3>
                <p>
                  Upon inspection approval at our fulfillment center, refunds are initiated within 48 hours to the customer’s original payment source (UPI/Card), reflecting within 3-5 business days.
                </p>
              </div>
            )}

            {/* SHIPPING */}
            {activeTab === 'shipping' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '8px' }}>
                  Shipping &amp; Delivery Policy
                </h2>

                <p>
                  GiggleThreads partners with leading courier networks (BlueDart, Delhivery, DTDC) to ensure timely, gentle delivery of your precious surprises across 19,000+ Indian postal codes.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E2229', margin: '24px 0 10px' }}>
                  Delivery Charges
                </h3>
                <p>
                  • <strong>FREE Standard Delivery</strong> on all orders above ₹999.<br />
                  • Standard Shipping: ₹49 for orders below ₹999 (Delivery in 2 to 4 business days).<br />
                  • Priority Express Air Delivery: ₹149 (Delivery in 1 to 2 business days for metro locations).
                </p>
              </div>
            )}

            {/* CANCELLATION */}
            {activeTab === 'cancellation' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '8px' }}>
                  Order Cancellation Policy
                </h2>
                <p>
                  Because personalized products enter the custom engraving queue promptly, orders may be cancelled within <strong>2 hours</strong> of placement for a 100% full instant refund. After 2 hours, personalized items cannot be cancelled. For non-personalized items, cancellation is allowed at any time prior to courier dispatch.
                </p>
              </div>
            )}

            {/* COOKIES */}
            {activeTab === 'cookies' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '8px' }}>
                  Cookie Policy
                </h2>
                <p>
                  GiggleThreads uses essential first-party cookies and local storage to remember your Giggle Basket items, keep you securely signed in, and remember your coupon codes. We do not employ aggressive cross-site ad-tracking cookies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
