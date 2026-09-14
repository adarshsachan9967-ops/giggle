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

export function App() {
  // Navigation Routing State
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  // Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(Boolean(store.getAdminSession()));

  useEffect(() => {
    // Direct URL support for admin access (e.g. /admin or #admin)
    const checkAdminRoute = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setCurrentView('admin');
      }
    };
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    const unsub = store.subscribe(() => {
      setIsAdminLoggedIn(Boolean(store.getAdminSession()));
    });
    return () => {
      unsub();
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync admin hash for easy bookmarking without public links
    if (view === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Dynamic Title Management
    if (view === 'home') {
      document.title = 'GiggleThreads | Gifts, Toys & Smiles for Every Occasion';
    } else if (view === 'product' && param) {
      const prod = store.getProductBySlug(param);
      document.title = prod ? `${prod.title} — GiggleThreads` : 'GiggleThreads';
    } else if (view === 'admin') {
      document.title = 'GiggleThreads Admin Portal';
    } else {
      document.title = `${view.charAt(0).toUpperCase() + view.slice(1)} — GiggleThreads`;
    }
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
