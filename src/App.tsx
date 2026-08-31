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
import { GuidesModal } from './components/GuidesModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { Footer } from './components/Footer';

import { 
  Product, 
  ProductCategory, 
  BikeModel, 
  CartItem, 
  Order, 
  ProductReview, 
  NavTab, 
  UserProfile 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  MOCK_REVIEWS, 
  INITIAL_ORDERS 
} from './data/mockProducts';
import { 
  supabase, 
  fetchProductsFromDb, 
  fetchOrdersFromDb, 
  fetchReviewsFromDb,
  fetchUserProfile,
  insertOrderToDb,
  insertReviewToDb,
  insertProductToDb,
  deleteProductFromDb,
  signOutUser,
  upsertUserProfile,
  subscribeToDatabaseChanges
} from './lib/supabase';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  
  // Auth state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('motostreet_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data State - default to empty/real products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('motostreet_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
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
  const [isGuidesOpen, setIsGuidesOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('');

  // Toast / Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('motostreet_user_profile', JSON.stringify(userProfile));
      if (userProfile.gcashNumber) {
        setUserGcash(userProfile.gcashNumber);
      }
    } else {
      localStorage.removeItem('motostreet_user_profile');
    }
  }, [userProfile]);

  // Load from Cloud Database / Server Store on mount and on visibility / periodic interval for cross-device sync
  useEffect(() => {
    const loadCloudData = async () => {
      try {
        // 1. Fetch live products
        const dbProducts = await fetchProductsFromDb();
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }

        // 2. Fetch live reviews
        const dbReviews = await fetchReviewsFromDb();
        if (dbReviews && dbReviews.length > 0) {
          setReviews(dbReviews);
        }

        // 3. Fetch live orders
        const dbOrders = await fetchOrdersFromDb();
        if (dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders);
        }
      } catch (err) {
        console.warn('Data sync note:', err);
      }
    };

    loadCloudData();

    // Realtime changes subscription from Supabase
    const unsubscribeRealtime = subscribeToDatabaseChanges({
      onProductChange: () => {
        console.log('Reloading products from realtime broadcast...');
        loadCloudData();
      },
      onReviewChange: () => {
        console.log('Reloading reviews from realtime broadcast...');
        loadCloudData();
      },
      onOrderChange: () => {
        console.log('Reloading orders from realtime broadcast...');
        loadCloudData();
      },
      onProfileChange: () => {
        console.log('Reloading profiles from realtime broadcast...');
      }
    });

    // Auto sync when user focuses tab or switches back
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        loadCloudData();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    // Periodic poll every 5 seconds so products added on one device appear without page reload
    const pollInterval = setInterval(loadCloudData, 5000);

    return () => {
      unsubscribeRealtime();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      clearInterval(pollInterval);
    };
  }, []);

  // Auth session listener
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user;
        if (sessionUser) {
          const profile = await fetchUserProfile(sessionUser.id);
          if (profile) {
            setUserProfile(profile);
            if (profile.gcashNumber) setUserGcash(profile.gcashNumber);
          } else {
            setUserProfile({
              id: sessionUser.id,
              email: sessionUser.email,
              fullName: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Rider',
              phone: sessionUser.user_metadata?.phone || '',
              gcashNumber: sessionUser.user_metadata?.gcash_number || '',
              primaryBike: sessionUser.user_metadata?.primary_bike || 'Honda Click 125i (V1 / V2 / V3)',
              isSeller: Boolean(sessionUser.user_metadata?.is_seller),
              createdAt: sessionUser.created_at,
            });
          }
        }
      } catch (err) {
        console.warn('Auth session check note:', err);
      }
    };

    checkAuthSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUserProfile(profile);
          if (profile.gcashNumber) setUserGcash(profile.gcashNumber);
        } else {
          const u = session.user;
          setUserProfile({
            id: u.id,
            email: u.email,
            fullName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Rider',
            phone: u.user_metadata?.phone || '',
            gcashNumber: u.user_metadata?.gcash_number || '',
            primaryBike: u.user_metadata?.primary_bike || 'Honda Click 125i (V1 / V2 / V3)',
            isSeller: Boolean(u.user_metadata?.is_seller),
            createdAt: u.created_at,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Cart operations & Direct Buy
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (!userProfile) {
      showToast('Please sign in or register to add parts to cart.');
      setIsAuthModalOpen(true);
      return;
    }
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
    showToast(`Added ${quantity}x "${product.name.slice(0, 26)}..." to cart`);
  };

  const handleDirectBuy = (product: Product, quantity = 1) => {
    if (!userProfile) {
      showToast('Please sign in or register to buy products.');
      setIsAuthModalOpen(true);
      return;
    }
    // Set direct buy item and open CheckoutModal directly without going through cart drawer
    setCartItems([{ product, quantity }]);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
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
  const handleAddProduct = async (newProduct: Product) => {
    if (!userProfile) {
      showToast('Please sign in or register to post parts.');
      setIsAuthModalOpen(true);
      return;
    }
    setProducts(prev => [newProduct, ...prev]);
    showToast('Motorcycle part published to marketplace!');
    try {
      await insertProductToDb(newProduct);
    } catch (err) {
      console.warn('handleAddProduct error:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!userProfile) {
      showToast('Please sign in or register to manage parts.');
      setIsAuthModalOpen(true);
      return;
    }
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product removed from active listings.');
    try {
      await deleteProductFromDb(productId);
    } catch (err) {
      console.warn('handleDeleteProduct error:', err);
    }
  };

  // Review Submission
  const handleAddReview = async (newReviewData: Omit<ProductReview, 'id' | 'date'>) => {
    if (!userProfile) {
      showToast('Please sign in or register to leave a customer review.');
      setIsAuthModalOpen(true);
      return;
    }
    const newRev: ProductReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Today'
    };

    // Calculate updated reviews and new average rating
    const otherReviews = reviews.filter(r => r.productId === newReviewData.productId);
    const prodReviews = [newRev, ...otherReviews];
    const newAvg = Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1));
    const newCount = prodReviews.length;

    // 1. Update reviews state immediately
    setReviews(prev => [newRev, ...prev.filter(r => r.id !== newRev.id)]);

    // 2. Update products state
    setProducts(prev => prev.map(prod => {
      if (prod.id === newReviewData.productId) {
        return {
          ...prod,
          rating: newAvg,
          reviewCount: newCount
        };
      }
      return prod;
    }));

    // 3. Keep selectedProduct in sync so open modal updates its rating immediately
    setSelectedProduct(prev => {
      if (prev && prev.id === newReviewData.productId) {
        return {
          ...prev,
          rating: newAvg,
          reviewCount: newCount
        };
      }
      return prev;
    });

    showToast(`⭐ ${newReviewData.rating}-Star review submitted! Product rating updated to ${newAvg}★`);

    // 4. Persist review and updated rating to server and Supabase
    try {
      await insertReviewToDb(newRev, newAvg, newCount);
    } catch (err) {
      console.warn('Review database sync:', err);
    }
  };

  // Order Placement
  const handleOrderSuccess = async (newOrder: Order) => {
    try {
      await insertOrderToDb(newOrder);
    } catch (err) {
      console.warn('Order database sync:', err);
    }

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setDiscount(0);
    setActiveTrackingCode(newOrder.trackingNumber);
    showToast(`Order ${newOrder.trackingNumber} confirmed with PayMongo GCash!`);
  };

  const handleTrackOrderFromDashboard = (trackingNumber: string) => {
    setActiveTrackingCode(trackingNumber);
    setCurrentTab('dashboard');
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUserProfile(null);
      showToast('Signed out successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white font-['Plus_Jakarta_Sans']">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedBike={selectedBike}
        setSelectedBike={setSelectedBike}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSiteMap={() => setIsSiteMapOpen(true)}
        onOpenVoiceflow={() => {
          if (typeof window !== 'undefined' && (window as any).voiceflow?.chat) {
            (window as any).voiceflow.chat.open();
          }
        }}
        onOpenGuides={() => setIsGuidesOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSync={() => setIsSyncModalOpen(true)}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-0">
            {/* Rule of Thirds Hero */}
            <HeroSection
              onSelectBike={(bike) => {
                setSelectedBike(bike);
                setCurrentTab('store');
              }}
              onExploreCatalog={() => setCurrentTab('store')}
              onOpenVoiceflow={() => {
                if (typeof window !== 'undefined' && (window as any).voiceflow?.chat) {
                  (window as any).voiceflow.chat.open();
                }
              }}
              onOpenGuides={() => setIsGuidesOpen(true)}
            />

            {/* Store Preview */}
            <ProductCatalog
              products={products}
              reviews={reviews}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
              onDirectBuy={handleDirectBuy}
              selectedBike={selectedBike}
              setSelectedBike={setSelectedBike}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onNavigateToSeller={() => setCurrentTab('seller')}
              userProfile={userProfile}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'store' && (
          <ProductCatalog
            products={products}
            reviews={reviews}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onDirectBuy={handleDirectBuy}
            selectedBike={selectedBike}
            setSelectedBike={setSelectedBike}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNavigateToSeller={() => setCurrentTab('seller')}
            userProfile={userProfile}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'seller' && (
          <SellerPortal
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            userGcash={userGcash}
            setUserGcash={setUserGcash}
            userProfile={userProfile}
            onOpenAuth={() => setIsAuthModalOpen(true)}
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
              userProfile={userProfile}
              onUpdateUserProfile={async (updated) => {
                if (userProfile) {
                  const updatedProfile = { ...userProfile, ...updated };
                  setUserProfile(updatedProfile);
                  try {
                    await upsertUserProfile(updatedProfile);
                  } catch (err) {
                    console.warn('Profile sync error:', err);
                  }
                }
              }}
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
        onDirectBuy={handleDirectBuy}
        reviews={reviews}
        onAddReview={handleAddReview}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
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
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={discount}
        onOrderSuccess={handleOrderSuccess}
        userGcash={userGcash}
        setUserGcash={setUserGcash}
        userProfile={userProfile}
        onUpdateUserProfile={(updated) => {
          setUserProfile((prev) => {
            const nextProfile: UserProfile = prev
              ? { ...prev, ...updated }
              : {
                  id: `rider-${Date.now()}`,
                  fullName: updated.fullName || 'Rider Member',
                  primaryBike: 'Honda Click 125i',
                  isSeller: false,
                  ...updated,
                };
            localStorage.setItem('motostreet_user_profile', JSON.stringify(nextProfile));
            if (nextProfile.id && !nextProfile.id.startsWith('rider-')) {
              upsertUserProfile(nextProfile);
            }
            return nextProfile;
          });
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(profile) => {
          setUserProfile(profile);
          showToast(`Logged in as ${profile.fullName}`);
        }}
      />

      <SiteMapModal
        isOpen={isSiteMapOpen}
        onClose={() => setIsSiteMapOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onOpenVoiceflow={() => {
          if (typeof window !== 'undefined' && (window as any).voiceflow?.chat) {
            (window as any).voiceflow.chat.open();
          }
        }}
      />

      <GuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
      />

      <SupabaseSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onRefreshData={async () => {
          const dbProducts = await fetchProductsFromDb();
          if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
          const dbReviews = await fetchReviewsFromDb();
          if (dbReviews && dbReviews.length > 0) setReviews(dbReviews);
          const dbOrders = await fetchOrdersFromDb();
          if (dbOrders && dbOrders.length > 0) setOrders(dbOrders);
          showToast('Data refreshed from Supabase Cloud!');
        }}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenSiteMap={() => setIsSiteMapOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenVoiceflow={() => {
          if (typeof window !== 'undefined' && (window as any).voiceflow?.chat) {
            (window as any).voiceflow.chat.open();
          }
        }}
      />

    </div>
  );
}
