import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SellerPortal } from './components/SellerPortal';
import { UserDashboard } from './components/UserDashboard';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AboutContactPage } from './components/AboutContactPage';
import { SiteMapModal } from './components/SiteMapModal';
import { VoiceflowChatModal } from './components/VoiceflowChatModal';
import { GuidesModal } from './components/GuidesModal';
import { Footer } from './components/Footer';

import { 
  Product, 
  ProductCategory, 
  BikeModel, 
  CartItem, 
  Order, 
  ProductReview, 
  NavTab 
} from './types';
import { MOCK_PRODUCTS, MOCK_REVIEWS, INITIAL_ORDERS } from './data/mockProducts';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  
  // Data State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('motostreet_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('motostreet_reviews');
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('motostreet_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('motostreet_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // User Preferences
  const [selectedBike, setSelectedBike] = useState<BikeModel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [userGcash, setUserGcash] = useState<string>(() => {
    return localStorage.getItem('motostreet_gcash') || '0917-882-9310';
  });
  const [discount, setDiscount] = useState<number>(0);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSiteMapOpen, setIsSiteMapOpen] = useState<boolean>(false);
  const [isVoiceflowOpen, setIsVoiceflowOpen] = useState<boolean>(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState<boolean>(false);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('');

  // Toast / Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('motostreet_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('motostreet_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('motostreet_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('motostreet_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('motostreet_gcash', userGcash);
  }, [userGcash]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x "${product.name.slice(0, 30)}..." to cart`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Product CRUD
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast('New motorcycle part published to marketplace!');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product removed from active listings.');
  };

  // Review Submission
  const handleAddReview = (newReviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Today'
    };

    setReviews(prev => [newRev, ...prev]);

    // Update product average rating
    setProducts(prev => prev.map(prod => {
      if (prod.id === newReviewData.productId) {
        const prodReviews = [...reviews.filter(r => r.productId === prod.id), newRev];
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        return {
          ...prod,
          rating: Number(avg.toFixed(1)),
          reviewCount: prodReviews.length
        };
      }
      return prod;
    }));

    showToast('Verified review and star rating submitted!');
  };

  // Order Placement
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setDiscount(0);
    setActiveTrackingCode(newOrder.trackingNumber);
    showToast(`Order ${newOrder.trackingNumber} confirmed via PayMongo!`);
  };

  const handleTrackOrderFromDashboard = (trackingNumber: string) => {
    setActiveTrackingCode(trackingNumber);
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white font-['Plus_Jakarta_Sans']">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedBike={selectedBike}
        setSelectedBike={setSelectedBike}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSiteMap={() => setIsSiteMapOpen(true)}
        onOpenVoiceflow={() => setIsVoiceflowOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-0">
            {/* Rule of Thirds Hero Showcase */}
            <HeroSection
              onSelectBike={(bike) => {
                setSelectedBike(bike);
                setCurrentTab('store');
              }}
              onExploreCatalog={() => setCurrentTab('store')}
              onOpenVoiceflow={() => setIsVoiceflowOpen(true)}
              onOpenGuides={() => setIsGuidesOpen(true)}
            />

            {/* Featured Product Preview */}
            <ProductCatalog
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
              selectedBike={selectedBike}
              setSelectedBike={setSelectedBike}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        )}

        {currentTab === 'store' && (
          <ProductCatalog
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            selectedBike={selectedBike}
            setSelectedBike={setSelectedBike}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {currentTab === 'seller' && (
          <SellerPortal
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            userGcash={userGcash}
            setUserGcash={setUserGcash}
          />
        )}

        {currentTab === 'dashboard' && (
          <div className="space-y-0">
            <UserDashboard
              orders={orders}
              onTrackOrder={handleTrackOrderFromDashboard}
              userGcash={userGcash}
              setUserGcash={setUserGcash}
              onNavigateToStore={() => setCurrentTab('store')}
            />
            {/* Real-time Order Tracking Engine */}
            <OrderTrackingView
              orders={orders}
              selectedTrackingNumber={activeTrackingCode}
            />
          </div>
        )}

        {(currentTab === 'about' || currentTab === 'contact') && (
          <AboutContactPage
            onNavigateToStore={() => setCurrentTab('store')}
          />
        )}
      </main>

      {/* Modals and Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        discount={discount}
        setDiscount={setDiscount}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={discount}
        onOrderSuccess={handleOrderSuccess}
        userGcash={userGcash}
        setUserGcash={setUserGcash}
      />

      <SiteMapModal
        isOpen={isSiteMapOpen}
        onClose={() => setIsSiteMapOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onOpenVoiceflow={() => setIsVoiceflowOpen(true)}
      />

      <VoiceflowChatModal
        isOpen={isVoiceflowOpen}
        onClose={() => setIsVoiceflowOpen(false)}
      />

      <GuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenSiteMap={() => setIsSiteMapOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onOpenVoiceflow={() => setIsVoiceflowOpen(true)}
      />

    </div>
  );
}
