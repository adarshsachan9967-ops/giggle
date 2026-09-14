import React from 'react';
import { Smile, Heart, Sparkles, ShieldCheck, Gift, Award, Users } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#FAF7F5' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Hero Banner */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFF0F1',
            color: '#FF5B60',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '16px',
          }}>
            <Smile size={16} />
            <span>THE GIGGLETHREADS JOURNEY</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#1E2229',
            lineHeight: 1.2,
            marginBottom: '18px',
          }}>
            We Believe Every Gift Should Tell a Story.
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.7, maxWidth: '720px', margin: '0 auto' }}>
            At <strong>GiggleThreads</strong>, we craft joyful toys, cuddly companions, and bespoke keepsakes that turn everyday celebrations into forever memories.
          </p>
        </div>

        {/* Feature Story Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '44px',
          border: '1px solid #EFE4DC',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '40px',
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E2229', marginBottom: '16px' }}>
            How GiggleThreads Began
          </h2>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
            GiggleThreads was born from a simple realization: in an era of hurried digital gift cards and impersonal plastic trinkets, the heart-melting excitement of unwrapping a truly thoughtful gift was slowly disappearing. We wanted to build a sanctuary where gifts aren’t just purchased, but treasured.
          </p>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
            From our design workshop in Bengaluru, our team of passionate artisans, child-development educators, and storytellers handpick, test, and package every single toy, cuddle bear, and personalized frame. We treat each box as if it were being opened by our own family.
          </p>
          <blockquote style={{
            backgroundColor: '#FFF9F6',
            borderLeft: '4px solid #FF5B60',
            padding: '18px 24px',
            borderRadius: '0 14px 14px 0',
            fontSize: '1.05rem',
            fontStyle: 'italic',
            color: '#1E2229',
            fontWeight: 600,
            margin: '24px 0',
          }}>
            "A gift shouldn't just sit on a shelf. It should spark a giggle, warm a hug, and whisper to someone that they are deeply loved."
          </blockquote>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '20px', border: '1px solid #EFE4DC' }}>
            <div style={{ backgroundColor: '#FFF0F1', color: '#FF5B60', padding: '12px', borderRadius: '50%', width: 'fit-content', marginBottom: '16px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Uncompromising Safety</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
              Every toy meets stringent BIS and international EN-71 non-toxic certifications. Splinter-free woods, lead-free pigments, and hypoallergenic velveteen fabrics only.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '20px', border: '1px solid #EFE4DC' }}>
            <div style={{ backgroundColor: '#FEF3C7', color: '#F59E0B', padding: '12px', borderRadius: '50%', width: 'fit-content', marginBottom: '16px' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Handcrafted Personalization</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
              Our master laser engravers and embroidery specialists add names, dates, and custom notes with millimeter precision and artisanal warmth.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '20px', border: '1px solid #EFE4DC' }}>
            <div style={{ backgroundColor: '#E6FBF5', color: '#06D6A0', padding: '12px', borderRadius: '50%', width: 'fit-content', marginBottom: '16px' }}>
              <Gift size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Signature Presentation</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
              Every GiggleThreads surprise is nestled in bespoke tissue shredding, tied with our signature satin ribbon, and accompanied by hand-written greeting cards.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '20px', border: '1px solid #EFE4DC' }}>
            <div style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', padding: '12px', borderRadius: '50%', width: 'fit-content', marginBottom: '16px' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Customer First, Always</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
              Dedicated human support via WhatsApp, email and phone. If your gift doesn’t inspire a genuine smile, our team moves mountains to make it right.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div style={{
          backgroundColor: '#1E2229',
          color: '#FFFFFF',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
            Ready to Spark a Smile Today?
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '480px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
            Explore our curated catalog of toys, plush companions, hampers, and personalized gifts.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => onNavigate('catalog')}>
            Explore GiggleThreads Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
