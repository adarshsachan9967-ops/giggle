import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { PromotionalBanners } from '../components/home/PromotionalBanners';
import { BrandIntro } from '../components/home/BrandIntro';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { OccasionSection } from '../components/home/OccasionSection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { Product } from '../types';

interface HomeViewProps {
  onNavigate: (view: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onQuickView }) => {
  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. 5 Homepage Promotional Banners */}
      <PromotionalBanners onNavigate={onNavigate} />

      {/* 3. Welcome to GiggleThreads Brand Introduction */}
      <BrandIntro />

      {/* 4. Shop by Category (8 Categories) */}
      <CategoryGrid onNavigate={onNavigate} />

      {/* 5. Occasions ("There's Always a Reason to Gift.") */}
      <OccasionSection onNavigate={onNavigate} />

      {/* 6. Featured & Bestselling Products */}
      <FeaturedSection onNavigate={onNavigate} onQuickView={onQuickView} />
    </div>
  );
};
