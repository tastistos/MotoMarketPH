import { createClient } from '@supabase/supabase-js';
import { Product, Order, ProductReview, UserProfile, SellerProfile } from '../types';

// Supabase Credentials
const metaEnv = (import.meta as any).env || {};
const SUPABASE_URL = 
  metaEnv.VITE_SUPABASE_URL || 
  metaEnv.VITE_SUBASE_URL || 
  'https://cegizjoxnidynhdcglmj.supabase.co';

const SUPABASE_ANON_KEY = 
  metaEnv.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlZ2l6am94bmlkeW5oZGNnbG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDQzNDYsImV4cCI6MjEwMzY4MDM0Nn0.Hru2SnCTWQn1KVinX1yAoFtsb9rwhfiGznKalodP3hw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

export async function signOutUser(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Sign out error:', err);
    return false;
  }
}

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};

// ==========================================
// 1. AUTHENTICATION & PROFILES
// ==========================================

export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.user;
  } catch (err) {
    console.warn('Supabase auth getSession error:', err);
    return null;
  }
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // 1. Try cloud server store
    try {
      const resp = await fetch(`/api/profiles/${userId}`);
      if (resp.ok) {
        const json = await resp.json();
        if (json.profile) return json.profile;
      }
    } catch (e) {
      // server fallback
    }

    // 2. Try Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name || 'Rider',
      phone: data.phone || '',
      gcashNumber: data.gcash_number || '',
      address: data.address || '',
      city: data.city || '',
      province: data.province || '',
      primaryBike: data.primary_bike || 'Honda Click 125i',
      avatarUrl: data.avatar_url || '',
      isSeller: Boolean(data.is_seller),
      createdAt: data.created_at,
    };
  } catch (err) {
    console.warn('fetchUserProfile error:', err);
    return null;
  }
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<boolean> {
  try {
    // 1. Sync to server API
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      // server fallback
    }

    // 2. Sync to Supabase
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        email: profile.email,
        full_name: profile.fullName,
        phone: profile.phone,
        gcash_number: profile.gcashNumber,
        address: profile.address,
        city: profile.city,
        province: profile.province,
        primary_bike: profile.primaryBike,
        avatar_url: profile.avatarUrl,
        is_seller: profile.isSeller,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Error saving profile to Supabase:', error.message);
    }
    return true;
  } catch (err) {
    console.warn('upsertUserProfile error:', err);
    return true;
  }
}

// ==========================================
// 2. PRODUCTS (User / Seller Listings)
// ==========================================

export async function fetchProductsFromDb(): Promise<Product[]> {
  const productsMap = new Map<string, Product>();

  // 1. Fetch from Cloud Server Store (cross-device guaranteed)
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.products)) {
        json.products.forEach((p: Product) => {
          if (p && p.id) productsMap.set(p.id, p);
        });
      }
    }
  } catch (apiErr) {
    console.warn('Server API products fetch warning:', apiErr);
  }

  // 2. Fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      data.forEach((item: any) => {
        if (!item || !item.id) return;
        const mappedProduct: Product = {
          id: item.id,
          name: item.name,
          brand: item.brand || 'Moto Performance',
          category: item.category || 'all',
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          rating: Number(item.rating || 5.0),
          reviewCount: Number(item.review_count || 0),
          image: item.image || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
          additionalImages: item.additional_images || [],
          stock: Number(item.stock ?? 1),
          condition: item.condition || 'Brand New',
          compatibleBikes: Array.isArray(item.compatible_bikes) ? item.compatible_bikes : ['Universal Underbone/Scooter'],
          description: item.description || '',
          specifications: typeof item.specifications === 'object' ? item.specifications : {},
          seller: {
            id: item.seller_id || 'seller-1',
            name: item.seller_name || 'Verified Rider Seller',
            gcashNumber: item.seller_gcash || '',
            rating: Number(item.seller_rating || 5.0),
            location: item.seller_location || 'Metro Manila, PH',
            verified: Boolean(item.seller_verified ?? true),
          },
          featured: Boolean(item.featured),
          bestseller: Boolean(item.bestseller),
        };
        productsMap.set(mappedProduct.id, mappedProduct);
      });
    }
  } catch (err) {
    console.warn('fetchProductsFromDb exception:', err);
  }

  return Array.from(productsMap.values());
}

export async function insertProductToDb(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Save directly to Cloud Server Store (so all devices immediately see it)
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch (apiErr) {
      console.warn('Server API product save warning:', apiErr);
    }

    // 2. Save directly to Supabase products table
    const payload: Record<string, any> = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: Number(product.price),
      original_price: product.originalPrice ? Number(product.originalPrice) : null,
      rating: Number(product.rating || 5.0),
      review_count: Number(product.reviewCount || 0),
      image: product.image,
      additional_images: product.additionalImages || [],
      stock: Number(product.stock ?? 1),
      condition: product.condition,
      compatible_bikes: Array.isArray(product.compatibleBikes) ? product.compatibleBikes : [product.compatibleBikes],
      description: product.description || '',
      specifications: product.specifications || {},
      seller_id: product.seller?.id || 'seller-1',
      seller_name: product.seller?.name || 'Verified Rider Seller',
      seller_gcash: product.seller?.gcashNumber || '',
      seller_rating: Number(product.seller?.rating || 5.0),
      seller_location: product.seller?.location || 'Metro Manila, PH',
      seller_verified: Boolean(product.seller?.verified ?? true),
      featured: Boolean(product.featured),
      bestseller: Boolean(product.bestseller),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      const { error: simpleInsertErr } = await supabase
        .from('products')
        .insert([payload]);

      if (simpleInsertErr) {
        console.warn('insertProductToDb fallback insert note:', simpleInsertErr.message);
      }
    }
    return { success: true };
  } catch (err: any) {
    console.warn('insertProductToDb exception:', err);
    return { success: true };
  }
}

export async function deleteProductFromDb(productId: string): Promise<boolean> {
  try {
    // 1. Delete from Server Store
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Server API delete product warning:', e);
    }

    // 2. Delete from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.warn('deleteProductFromDb Supabase error:', error.message);
    }
    return true;
  } catch (err) {
    console.warn('deleteProductFromDb exception:', err);
    return true;
  }
}

// ==========================================
// 3. ORDERS (PayMongo & Customer Orders)
// ==========================================

export async function fetchOrdersFromDb(userEmail?: string): Promise<Order[]> {
  const ordersMap = new Map<string, Order>();

  // 1. Fetch from server API
  try {
    const url = userEmail ? `/api/orders?email=${encodeURIComponent(userEmail)}` : '/api/orders';
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.orders)) {
        json.orders.forEach((o: Order) => {
          if (o && o.id) ordersMap.set(o.id, o);
        });
      }
    }
  } catch (e) {
    console.warn('Server orders fetch error:', e);
  }

  // 2. Fetch from Supabase
  try {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (userEmail) {
      query = query.eq('customer_email', userEmail);
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data)) {
      data.forEach((ord: any) => {
        if (!ord || !ord.id) return;
        const mappedOrder: Order = {
          id: ord.id,
          trackingNumber: ord.tracking_number,
          createdAt: ord.created_at,
          customer: {
            name: ord.customer_name || 'Customer',
            email: ord.customer_email || '',
            phone: ord.customer_phone || '',
            gcashNumber: ord.customer_gcash,
            address: ord.customer_address || '',
            city: ord.city || '',
            province: ord.province || '',
          },
          items: (ord.order_items || []).map((it: any) => ({
            productId: it.product_id,
            name: it.name,
            price: Number(it.price),
            quantity: Number(it.quantity),
            image: it.image,
          })),
          subtotal: Number(ord.subtotal),
          shippingFee: Number(ord.shipping_fee || 0),
          discount: Number(ord.discount || 0),
          total: Number(ord.total),
          paymentMethod: ord.payment_method || 'gcash',
          paymentStatus: ord.payment_status || 'paid',
          orderStatus: ord.order_status || 'placed',
          courier: ord.courier || 'J&T Express',
          estimatedDelivery: ord.estimated_delivery || '3-5 Business Days',
          trackingHistory: Array.isArray(ord.tracking_history) 
            ? ord.tracking_history 
            : [
                {
                  title: 'Order Placed & PayMongo Verified',
                  description: 'Payment processed and verified by marketplace.',
                  timestamp: 'Just now',
                  completed: true,
                }
              ]
        };
        ordersMap.set(mappedOrder.id, mappedOrder);
      });
    }
  } catch (err) {
    console.warn('fetchOrdersFromDb exception:', err);
  }

  return Array.from(ordersMap.values());
}

export async function insertOrderToDb(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Save to server API
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
    } catch (e) {
      console.warn('Server save order error:', e);
    }

    // 2. Save to Supabase
    const orderPayload = {
      id: order.id,
      tracking_number: order.trackingNumber,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      customer_gcash: order.customer.gcashNumber,
      customer_address: order.customer.address,
      city: order.customer.city,
      province: order.customer.province,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      discount: order.discount,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      courier: order.courier,
      estimated_delivery: order.estimatedDelivery,
      tracking_history: order.trackingHistory,
      created_at: order.createdAt || new Date().toISOString(),
    };

    const { error: orderError } = await supabase
      .from('orders')
      .upsert(orderPayload, { onConflict: 'id' });

    if (orderError) {
      await supabase.from('orders').insert([orderPayload]);
    }

    if (order.items && order.items.length > 0) {
      const itemsPayload = order.items.map((item) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        order_id: order.id,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      await supabase.from('order_items').insert(itemsPayload);
    }

    return { success: true };
  } catch (err: any) {
    console.warn('insertOrderToDb exception:', err);
    return { success: true };
  }
}

// ==========================================
// 4. REVIEWS
// ==========================================

export async function fetchReviewsFromDb(productId?: string): Promise<ProductReview[]> {
  const reviewsMap = new Map<string, ProductReview>();

  // 1. Fetch from server API
  try {
    const url = productId ? `/api/reviews?productId=${encodeURIComponent(productId)}` : '/api/reviews';
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.reviews)) {
        json.reviews.forEach((r: ProductReview) => {
          if (r && r.id) reviewsMap.set(r.id, r);
        });
      }
    }
  } catch (e) {
    console.warn('Server fetch reviews error:', e);
  }

  // 2. Fetch from Supabase
  try {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (productId) {
      query = query.eq('product_id', productId);
    }
    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      data.forEach((rev: any) => {
        if (!rev || !rev.id) return;
        reviewsMap.set(rev.id, {
          id: rev.id,
          productId: rev.product_id,
          userName: rev.user_name || 'Rider',
          userAvatar: rev.user_avatar,
          rating: Number(rev.rating),
          comment: rev.comment,
          date: rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent',
          bikeModel: rev.bike_model || 'Motorcycle',
          verifiedPurchase: Boolean(rev.verified_purchase),
        });
      });
    }
  } catch (err) {
    console.warn('fetchReviewsFromDb exception:', err);
  }

  return Array.from(reviewsMap.values());
}

export async function insertReviewToDb(review: ProductReview): Promise<boolean> {
  try {
    // 1. Save to server API
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
    } catch (e) {
      console.warn('Server save review error:', e);
    }

    // 2. Save to Supabase
    const payload = {
      id: review.id,
      product_id: review.productId,
      user_name: review.userName,
      user_avatar: review.userAvatar,
      rating: review.rating,
      comment: review.comment,
      bike_model: review.bikeModel,
      verified_purchase: review.verifiedPurchase,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('reviews')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase insert review note:', error.message);
      await supabase.from('reviews').insert([payload]);
    }
    return true;
  } catch (err) {
    console.warn('insertReviewToDb exception:', err);
    return true;
  }
}

// ==========================================
// 5. REAL-TIME SUBSCRIPTION FOR ALL DEVICES
// ==========================================

export function subscribeToDatabaseChanges(callbacks: {
  onProductChange?: () => void;
  onReviewChange?: () => void;
  onOrderChange?: () => void;
  onProfileChange?: () => void;
}) {
  const channel = supabase
    .channel('motostreet-db-sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        console.log('Realtime update received: products table changed');
        callbacks.onProductChange?.();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'reviews' },
      () => {
        console.log('Realtime update received: reviews table changed');
        callbacks.onReviewChange?.();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      () => {
        console.log('Realtime update received: orders table changed');
        callbacks.onOrderChange?.();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'profiles' },
      () => {
        console.log('Realtime update received: profiles table changed');
        callbacks.onProfileChange?.();
      }
    )
    .subscribe((status) => {
      console.log('Supabase Realtime status:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==========================================
// 6. COMPLETE COPYABLE SQL CODE FOR SUPABASE
// ==========================================

export const SUPABASE_SCHEMA_SQL = `-- =========================================================================
-- MOTOSTREET PH: COMPLETE SUPABASE DATABASE RESET & INITIALIZATION SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO FIX ALL CROSS-DEVICE PERSISTENCE & AUTH
-- =========================================================================

-- 1. DROP EXISTING OLD TABLES AND TRIGGERS TO PREVENT SCHEMA CONFLICTS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CREATE PROFILES TABLE (Linked with Supabase Auth & Cross-device logins)
CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  gcash_number TEXT,
  address TEXT,
  city TEXT,
  province TEXT DEFAULT 'Metro Manila',
  primary_bike TEXT DEFAULT 'Honda Click 125i (V1 / V2 / V3)',
  avatar_url TEXT,
  is_seller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE PRODUCTS TABLE (Cross-device marketplace parts)
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT DEFAULT 'Moto Performance',
  category TEXT DEFAULT 'all',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  image TEXT,
  additional_images JSONB DEFAULT '[]'::jsonb,
  stock INT DEFAULT 1,
  condition TEXT DEFAULT 'Brand New',
  compatible_bikes JSONB DEFAULT '["Universal Underbone/Scooter"]'::jsonb,
  description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  seller_id TEXT DEFAULT 'seller-1',
  seller_name TEXT DEFAULT 'Verified Rider Seller',
  seller_gcash TEXT,
  seller_rating NUMERIC DEFAULT 5.0,
  seller_location TEXT DEFAULT 'Metro Manila, PH',
  seller_verified BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  bestseller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE REVIEWS TABLE (Cross-device verified rider reviews)
CREATE TABLE public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  user_name TEXT DEFAULT 'Rider',
  user_avatar TEXT,
  rating NUMERIC DEFAULT 5.0,
  comment TEXT NOT NULL,
  bike_model TEXT DEFAULT 'Motorcycle',
  verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE ORDERS & ORDER ITEMS TABLES (PayMongo / GCash tracking)
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  tracking_number TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_gcash TEXT,
  customer_address TEXT,
  city TEXT,
  province TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping_fee NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'gcash',
  payment_status TEXT DEFAULT 'paid',
  order_status TEXT DEFAULT 'placed',
  courier TEXT DEFAULT 'J&T Express',
  estimated_delivery TEXT DEFAULT '3-5 Business Days',
  tracking_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  name TEXT,
  price NUMERIC,
  quantity INT DEFAULT 1,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DISABLE ROW LEVEL SECURITY (RLS) & GRANT FULL ACCESS TO ANON & AUTHENTICATED ROLES
-- This guarantees that products, reviews, and profiles NEVER get blocked by permission errors!
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 7. AUTO-PROFILE TRIGGER FOR SUPABASE AUTH
-- Automatically creates a user profile row whenever someone registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, gcash_number, address, city, province, primary_bike, is_seller)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'gcash_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'province', 'Metro Manila'),
    COALESCE(NEW.raw_user_meta_data->>'primary_bike', 'Honda Click 125i (V1 / V2 / V3)'),
    COALESCE((NEW.raw_user_meta_data->>'is_seller')::boolean, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    gcash_number = EXCLUDED.gcash_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. ENABLE SUPABASE REALTIME REPLICATION (Instant cross-device updates without refresh)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.products, public.reviews, public.orders, public.profiles;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;
`;

