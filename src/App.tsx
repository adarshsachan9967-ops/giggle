import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/product/QuickViewModal';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { AccountView } from './views/AccountView';
import { LoginView } from './views/LoginView';
import { SignupView } from './views/SignupView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { FaqView } from './views/FaqView';
import { LegalView } from './views/LegalView';
import { TrackOrderView } from './views/TrackOrderView';
import { NotFoundView } from './views/NotFoundView';
import { AdminLogin } from './views/admin/AdminLogin';
import { AdminPanel } from './views/admin/AdminPanel';
import { store } from './services/store';
import { Product } from './types';

interface RouteInfo {
  view: string;
  param?: string;
}

const getPathForRoute = (view: string, param?: string): string => {
  switch (view) {
    case 'home':
      return '/';
    case 'product':
      return param ? `/product/${encodeURIComponent(param)}` : '/catalog';
    case 'category':
      return param ? `/category/${encodeURIComponent(param)}` : '/catalog';
    case 'occasion':
      return param ? `/occasion/${encodeURIComponent(param)}` : '/catalog';
    case 'order-success':
      return param ? `/order-success/${encodeURIComponent(param)}` : '/';
    case 'track-order':
      return param ? `/track-order/${encodeURIComponent(param)}` : '/track-order';
    case 'account':
      return param && param !== 'dashboard' ? `/account/${encodeURIComponent(param)}` : '/account';
    case 'login':
      return param ? `/login?redirect=${encodeURIComponent(param)}` : '/login';
    case 'signup':
      return param ? `/signup?redirect=${encodeURIComponent(param)}` : '/signup';
    case 'admin':
      return '/admin';
    default:
      return `/${view}`;
  }
};

const parseRouteFromLocation = (): RouteInfo => {
  if (typeof window === 'undefined') {
    return { view: 'home' };
  }

  // Check admin hash
  if (window.location.hash === '#admin') {
    return { view: 'admin' };
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);

  if (pathname === '/' || pathname === '') {
    return { view: 'home' };
  }

  // /product/:slug or /products/:slug
  const productMatch = pathname.match(/^\/(?:product|products)\/([^/]+)/i);
  if (productMatch) {
    return { view: 'product', param: decodeURIComponent(productMatch[1]) };
  }

  // /category/:slug
  const categoryMatch = pathname.match(/^\/category\/([^/]+)/i);
  if (categoryMatch) {
    return { view: 'category', param: decodeURIComponent(categoryMatch[1]) };
  }

  // /occasion/:slug
  const occasionMatch = pathname.match(/^\/occasion\/([^/]+)/i);
  if (occasionMatch) {
    return { view: 'occasion', param: decodeURIComponent(occasionMatch[1]) };
  }

  // /order-success/:orderId
  const orderSuccessMatch = pathname.match(/^\/order-success\/([^/]+)/i);
  if (orderSuccessMatch) {
    return { view: 'order-success', param: decodeURIComponent(orderSuccessMatch[1]) };
  }

  // /track-order/:orderId
  const trackMatch = pathname.match(/^\/track-order\/([^/]+)/i);
  if (trackMatch) {
    return { view: 'track-order', param: decodeURIComponent(trackMatch[1]) };
  }

  // /account/:tab
  const accountMatch = pathname.match(/^\/account\/([^/]+)/i);
  if (accountMatch) {
    return { view: 'account', param: decodeURIComponent(accountMatch[1]) };
  }

  const cleanPath = pathname.replace(/^\//, '').toLowerCase();

  if (cleanPath === 'login') {
    const redirect = searchParams.get('redirect') || undefined;
    return { view: 'login', param: redirect };
  }

  if (cleanPath === 'signup') {
    const redirect = searchParams.get('redirect') || undefined;
    return { view: 'signup', param: redirect };
  }

  const knownRoutes = [
    'catalog', 'checkout', 'order-success', 'account', 'about', 'contact',
    'faq', 'privacy-policy', 'terms-conditions', 'refund-policy',
    'shipping-policy', 'track-order', 'admin'
  ];

  if (knownRoutes.includes(cleanPath)) {
    return { view: cleanPath };
  }

  // Check if pathname is a direct product slug
  const prod = store.getProductBySlug(cleanPath);
  if (prod) {
    return { view: 'product', param: cleanPath };
  }

  return { view: 'not-found' };
};

const updateDocumentTitle = (view: string, param?: string) => {
  if (view === 'home') {
    document.title = 'GiggleThreads | Gifts, Toys & Smiles for Every Occasion';
  } else if (view === 'product' && param) {
    const prod = store.getProductBySlug(param);
    document.title = prod ? `${prod.title} — GiggleThreads` : 'Product Details — GiggleThreads';
  } else if (view === 'category' && param) {
    const formatted = param.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    document.title = `${formatted} — GiggleThreads`;
  } else if (view === 'occasion' && param) {
    const formatted = param.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    document.title = `${formatted} Gifts — GiggleThreads`;
  } else if (view === 'admin') {
    document.title = 'GiggleThreads Admin Portal';
  } else {
    const formatted = view.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    document.title = `${formatted} — GiggleThreads`;
  }
};

export function App() {
  const initialRoute = parseRouteFromLocation();
  // Navigation Routing State
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [viewParam, setViewParam] = useState<string | undefined>(initialRoute.param);

  // Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(Boolean(store.getAdminSession()));

  useEffect(() => {
    updateDocumentTitle(currentView, viewParam);

    const handlePopState = () => {
      const route = parseRouteFromLocation();
      setCurrentView(route.view);
      setViewParam(route.param);
      setIsCartOpen(false);
      setQuickViewProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateDocumentTitle(route.view, route.param);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    const unsub = store.subscribe(() => {
      setIsAdminLoggedIn(Boolean(store.getAdminSession()));
    });
    return () => {
      unsub();
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigate = (view: string, param?: string, replaceHistory = false) => {
    const targetPath = getPathForRoute(view, param);
    const currentPath = window.location.pathname + window.location.search;

    if (currentPath !== targetPath) {
      if (replaceHistory) {
        window.history.replaceState({ view, param }, '', targetPath);
      } else {
        window.history.pushState({ view, param }, '', targetPath);
      }
    }

    // Sync admin hash for easy bookmarking without public links
    if (view === 'admin' && !window.location.pathname.startsWith('/admin')) {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin' && view !== 'admin') {
      window.history.replaceState(null, '', targetPath);
    }

    setCurrentView(view);
    setViewParam(param);
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateDocumentTitle(view, param);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  // Dedicated Render View Logic
  const renderContent = () => {
    // Admin Experience
    if (currentView === 'admin') {
      if (!isAdminLoggedIn) {
        return (
          <AdminLogin 
            onLoginSuccess={() => setIsAdminLoggedIn(true)}
            onNavigateHome={() => handleNavigate('home')}
          />
        );
      }
      return (
        <AdminPanel 
          onNavigateHome={() => handleNavigate('home')}
          onLogout={() => {
            store.logoutAdmin();
            setIsAdminLoggedIn(false);
            handleNavigate('home');
          }}
        />
      );
    }

    // Customer Storefront Experience
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} onQuickView={handleQuickView} />;

      case 'catalog':
        return <CatalogView onNavigate={handleNavigate} onQuickView={handleQuickView} />;

      case 'category':
        return (
          <CatalogView 
            initialCategory={viewParam} 
            onNavigate={handleNavigate} 
            onQuickView={handleQuickView} 
          />
        );

      case 'occasion':
        return (
          <CatalogView 
            initialOccasion={viewParam} 
            onNavigate={handleNavigate} 
            onQuickView={handleQuickView} 
          />
        );

      case 'product':
        return (
          <ProductDetailView 
            productSlug={viewParam || ''} 
            onNavigate={handleNavigate} 
            onQuickView={handleQuickView} 
          />
        );

      case 'checkout':
        if (!store.isCustomerLoggedIn()) {
          return (
            <LoginView 
              redirectTo="checkout" 
              onNavigate={handleNavigate} 
            />
          );
        }
        return (
          <CheckoutView 
            onNavigate={handleNavigate} 
            onOrderSuccess={(orderId) => handleNavigate('order-success', orderId)} 
          />
        );

      case 'order-success':
        return (
          <OrderSuccessView 
            orderId={viewParam || ''} 
            onNavigate={handleNavigate} 
          />
        );

      case 'account':
        return <AccountView initialTab={viewParam || 'dashboard'} onNavigate={handleNavigate} />;

      case 'login':
        return <LoginView redirectTo={viewParam} onNavigate={handleNavigate} />;

      case 'signup':
        return <SignupView redirectTo={viewParam} onNavigate={handleNavigate} />;

      case 'about':
        return <AboutView onNavigate={handleNavigate} />;

      case 'contact':
        return <ContactView />;

      case 'faq':
        return <FaqView />;

      case 'privacy-policy':
        return <LegalView initialTab="privacy" />;

      case 'terms-conditions':
        return <LegalView initialTab="terms" />;

      case 'refund-policy':
        return <LegalView initialTab="refund" />;

      case 'shipping-policy':
        return <LegalView initialTab="shipping" />;

      case 'track-order':
        return <TrackOrderView initialOrderNumber={viewParam} onNavigate={handleNavigate} />;

      default:
        return <NotFoundView onNavigate={handleNavigate} />;
    }
  };

  // If in admin view, don't show customer header and footer
  const isAdminView = currentView === 'admin';

  return (
    <ToastProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {!isAdminView && (
          <Header 
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        <main style={{ flex: 1 }}>
          {renderContent()}
        </main>

        {!isAdminView && (
          <Footer onNavigate={handleNavigate} />
        )}

        {/* Global Slide-over Cart Drawer ("Your Giggle Basket") */}
        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal 
            product={quickViewProduct}
            onClose={handleCloseQuickView}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
