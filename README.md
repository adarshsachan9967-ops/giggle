# GiggleThreads 🎁✨

> *"Gifts That Spark Giggles & Memories."*

A world-class, premium e-commerce platform and administrative management suite for joyful gifting, plush companions, educational toys, and curated hampers.

---

## 🌟 Features Overview

### 🛍️ Customer Storefront
- **Joyful Visual Design**: Warm, modern aesthetic with coral (`#FF5B60`), honey gold (`#FFAE33`), emerald mint (`#06D6A0`), and deep navy (`#1B2A4A`).
- **Rich Catalog (52+ Items)**: Curated products across 8 categories:
  - 🧸 *Soft Toys & Plushies*
  - 🎁 *Thoughtful Gifts*
  - ✨ *Personalized Keepsakes*
  - 🎂 *Birthday Surprises*
  - 💑 *Couple Gifts*
  - 🧺 *Luxury Gift Hampers*
  - 🧩 *Educational Toys*
  - 🚀 *Trending Toys*
- **Interactive Product Experience**:
  - High-resolution gallery with thumbnail switcher
  - Real-time pincode delivery estimator
  - Personalized name/message engraving preview
  - Signature gift wrapping option (+₹99) with wax seal & handwritten card
  - Frequently Bought Together (3-item savings bundle)
  - Detailed product story, specifications, dimensions, materials, and safety certifications
  - Customer review submission & verified badge display
- **Streamlined Checkout & Orders**:
  - Real-time "Giggle Basket" slide-out drawer with free delivery progress meter
  - Coupon system (`WELCOME10`, `SMILE20`, `FESTIVE15`, `FREESHIP`)
  - 3-step checkout with simulated Razorpay payment gateway (UPI QR, Credit/Debit Cards, NetBanking, COD)
  - Interactive confetti order confirmation with printable tax invoice
  - Live milestone order tracking (Processing → Packed → Shipped → Delivered)
  - Customer Portal ("My GiggleThreads") for managing orders, wishlists, and address books

### ⚙️ SaaS Admin Panel
- **Executive Dashboard**: 8 real-time KPI metrics, 7-day revenue trend chart, and category sales breakdown.
- **Product Management**: Full CRUD capabilities, stock levels, badge assignment, pricing, and direct ImageKit media uploads.
- **Order Operations**: Status workflow transitions (Pending → Confirmed → Shipped → Delivered), courier tracking assignment (BlueDart, Delhivery), and printable invoices.
- **Inventory & Low Stock Alerts**: Instant notifications when item inventory drops below threshold.
- **Promotions & Banners**: Create and activate discount coupons and homepage showcase banners.
- **ImageKit Media CDN**: Real-time asset optimization, dynamic transformations, and image delivery.
- **Audit Logs**: Comprehensive operational history log.

---

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite with Hot Module Replacement (HMR)
- **Styling**: Vanilla CSS Design System (`Outfit` & `Plus Jakarta Sans` typography, responsive CSS Grid, glassmorphism)
- **Media CDN**: [ImageKit.io](https://imagekit.io) with real-time WebP/AVIF transformation
- **Database Connection**: MongoDB Atlas
- **Icons**: Lucide React + custom inline SVG vector logos

---

## 🛠️ Environment Configuration

Create a `.env` file in the root directory (or use `.env.example` as a template):

```env
# MongoDB Database Configuration
MONGODB_USERNAME="adarshsachan9967_db_user"
MONGODB_PASSWORD="js094T2udfCrVNjL"
MONGODB_URI="mongodb+srv://adarshsachan9967_db_user:js094T2udfCrVNjL@giggle.kupuume.mongodb.net/?appName=giggle"

# ImageKit Media Storage & Optimization Service
IMAGEKIT_ID="avdarinn"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/avdarinn"
IMAGEKIT_PUBLIC_KEY="public_uzSklsoDFlGNoIPGFtTdcYJU32Y="
IMAGEKIT_PRIVATE_KEY="private_Zgjm0jSmxe2S76y3kkULZ5nzEvo="

# Client Vite Configuration
VITE_IMAGEKIT_ID="avdarinn"
VITE_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/avdarinn"
VITE_IMAGEKIT_PUBLIC_KEY="public_uzSklsoDFlGNoIPGFtTdcYJU32Y="
VITE_STORE_NAME="GiggleThreads"
VITE_STORE_TAGLINE="Gifts That Spark Giggles & Memories."
```

---

## 📦 Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adarshsachan9967-ops/giggle.git
   cd giggle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to explore the storefront and admin panel.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🔐 Demo Credentials

- **Admin Portal Access**: Click "Admin" in top announcement bar or footer.
  - **Admin Email**: `admin@gigglethreads.com`
  - **Admin Password**: `admin123`
  - *(Alternatively, use the 1-Click "Demo Admin Login" button)*
- **Customer Demo Access**:
  - Use the 1-Click "Fill Demo Credentials" button on the customer Login/Signup pages.

---

## 📁 Project Structure

```
giggle/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Images & local media
│   ├── components/
│   │   ├── cart/           # CartDrawer & shopping basket
│   │   ├── common/         # Logo, badges, ratings, spinners
│   │   ├── layout/         # Header, Footer, AnnouncementBar
│   │   └── product/        # ProductCard, QuickViewModal
│   ├── context/            # Toast notifications & UI context
│   ├── data/               # Seed catalog (52+ realistic products)
│   ├── services/
│   │   ├── imagekit.ts     # ImageKit URL transformations & CDN helpers
│   │   └── store.ts        # Reactive state & localStorage engine
│   ├── types/              # Complete TypeScript interfaces
│   ├── views/              # Page views (Home, Catalog, ProductDetail, Checkout, etc.)
│   │   └── admin/          # SaaS Admin Dashboard & Login
│   ├── App.tsx             # Root component & page router
│   ├── index.css           # Global design system & design tokens
│   └── main.tsx            # Vite entry point
├── .env.example            # Environment variables template
├── atlas-credentials.env   # Atlas & ImageKit configuration reference
├── package.json
└── vite.config.ts
```

---

## 📄 License

This project is proprietary and created for **GiggleThreads**. All rights reserved.
