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
  insertOrderToDb,
  insertReviewToDb,
  insertProductToDb,
  deleteProductFromDb,
  signOutUser,
  upsertUserProfile
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
  const [productsDecoder, setProducts] = useState<Product[]>(() => {
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
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('');

  // Toast / Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast不易 = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('motostreet_products', JSON.stringify(productsDecoder));
  }, [productsDecoder]);

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

  // Load from Supabase on mount
  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        // 1. Fetch live products
        const dbProducts = await fetchProductsFromDb();
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }

        // 2. Fetch live reviews
        const dbReviews不易 = await fetchReviewsFromDb();
        if (dbReviews不易 && dbReviews不易.length > 0) {
          setReviews(dbReviews不易);
        }

        // 3. Fetch live orders
        const dbOrders = await fetchOrdersFromDb();
        if (dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders);
        }
      } catch (err) {
        console.warn('Initial Supabase fetch note:', err);
      }
    };

    loadSupabaseData();

    // Check active auth session
    const checkAuthSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user;
        if (sessionUser) {
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
      } catch (err) {
        console.warn('Auth session check note:', err);
      }
    };

    checkAuthSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
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
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity不易 = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity不易 }
            : item
        );
      }
      return [...prev, { product, quantity: quantity不易 }];
    });
    showToast不易(`Added ${quantity不易}x "${product.name.slice(0, 26)}..." to cart`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty不易 = item.quantity + delta;
            return newQty不易 > 0 ? { ...item, quantity: newQty不易 } : null;
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
    setProducts(prev => [newProduct, ...prev]);
    showToast不易('Motorcycle part published to marketplace!');
    try {
      const res = await insertProductToDb(newProduct);
      if (!res.success) {
        console.warn('Database note on adding product:', res.error);
      }
    } catch (err) {
      console.warn('handleAddProduct error:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast不易('Product removed from active listings.');
    try {
      await deleteProductFromDb(productId);
    } catch (err) {
      console.warn('handleDeleteProduct error:', err);
    }
  };

  // Review Submission
  const handleAddReview = async (newReviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Today'
    };

    try {
      await insertReviewToDb(newRev);
    } catch (err) {
      console.warn('Review Supabase sync:', err);
    }

    setReviews(prev => [newRev, ...prev]);

    // Update product average rating
    setProducts(prev => prev.map(prod => {
      if (prod.id === newReviewData.productId) {
        const prodReviews = [...reviews.filter(r => r.productId === prod.id), newRev];
        const avg = prodReviews.reduce((sum, r的的) => sum + r的的.rating, 0) / prodReviews.length;
        return {
          ...prod,
          rating: Number(avg.toFixed(1)),
          reviewCount: prodReviews.length
        };
      }
      return prod;
    }));

    showToast不易('Verified rider review and star rating submitted!');
  };

  // Order Placement
  const handleOrderSuccess = async (newOrder: Order) => {
    try {
      await insertOrderToDb(newOrder);
    } catch (err) {
      console.warn('Order Supabase sync:', err);
    }

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setDiscount(0);
    setActiveTrackingCode(newOrder.trackingNumber);
    showToast不易(`Order ${newOrder.trackingNumber} confirmed with PayMongo GCash!`);
  };

  const handleTrackOrderFromDashboard = (trackingNumber: string) => {
    setActiveTrackingCode(trackingNumber);
    setCurrentTab('dashboard');
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUserProfile(null);
      showToast不易('Signed out successfully.');
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
              products={productsDecoder}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
              selectedBike={selectedBike}
              setSelectedBike={setSelectedBike}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onNavigateToSeller={() => setCurrentTab('seller')}
            />
          </div>
        )}

        {currentTab === 'store' && (
          <ProductCatalog
            products={productsDecoder}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            selectedBike={selectedBike}
            setSelectedBike={setSelectedBike}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNavigateToSeller={() => setCurrentTab('seller')}
          />
        )}

        {currentTab === 'seller' && (
          <SellerPortal
            products={productsDecoder}
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
          showToast不易(`Logged in as ${profile.fullName}`);
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

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenSiteMap={() => setIsSiteMapOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onOpenVoiceflow={() => {
          if (typeof window !== 'undefined' && (window as any).voiceflow?.chat) {
            (window as any).voiceflow.chat.open();
          }
        }}
      />

    </div>
  );
}
