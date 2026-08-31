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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Could not fetch profile from Supabase profiles table:', error.message);
      return null;
    }

    if (!data) return null;

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
      return false;
    }
    return true;
  } catch (err) {
    console.warn('upsertUserProfile error:', err);
    return false;
  }
}

// ==========================================
// 2. PRODUCTS (User / Seller Listings)
// ==========================================

export async function fetchProductsFromDb(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProducts error (table may need creation):', error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    return data.map((item: any) => ({
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
    }));
  } catch (err) {
    console.warn('fetchProductsFromDb exception:', err);
    return [];
  }
}

export async function insertProductToDb(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
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

    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.warn('insertProductToDb upsert error:', error.message, error.details);
      
      // Fallback try simple insert without conflict option if table has no explicit unique key constraint
      const { error: simpleInsertErr } = await supabase
        .from('products')
        .insert([payload]);

      if (simpleInsertErr) {
        console.warn('insertProductToDb fallback insert error:', simpleInsertErr.message);
        return { success: false, error: simpleInsertErr.message };
      }
    }
    return { success: true };
  } catch (err: any) {
    console.warn('insertProductToDb exception:', err);
    return { success: false, error: err.message || 'Unknown database error' };
  }
}

export async function deleteProductFromDb(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.warn('deleteProductFromDb error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('deleteProductFromDb exception:', err);
    return false;
  }
}

// ==========================================
// 3. ORDERS (PayMongo & Customer Orders)
// ==========================================

export async function fetchOrdersFromDb(userEmail?: string): Promise<Order[]> {
  try {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (userEmail) {
      query = query.eq('customer_email', userEmail);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('fetchOrdersFromDb error:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((ord: any) => ({
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
    }));
  } catch (err) {
    console.warn('fetchOrdersFromDb exception:', err);
    return [];
  }
}

export async function insertOrderToDb(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
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
      console.warn('insertOrderToDb main order upsert error, trying insert:', orderError.message);
      const { error: simpleOrderErr } = await supabase
        .from('orders')
        .insert([orderPayload]);

      if (simpleOrderErr) {
        console.warn('insertOrderToDb main order error:', simpleOrderErr.message);
        return { success: false, error: simpleOrderErr.message };
      }
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

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsPayload);

      if (itemsError) {
        console.warn('insertOrderToDb items error:', itemsError.message);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.warn('insertOrderToDb exception:', err);
    return { success: false, error: err.message || 'Database error' };
  }
}

// ==========================================
// 4. REVIEWS
// ==========================================

export async function fetchReviewsFromDb(productId?: string): Promise<ProductReview[]> {
  try {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (productId) {
      query = query.eq('product_id', productId);
    }
    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((rev: any) => ({
      id: rev.id,
      productId: rev.product_id,
      userName: rev.user_name || 'Rider',
      userAvatar: rev.user_avatar,
      rating: Number(rev.rating),
      comment: rev.comment,
      date: rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent',
      bikeModel: rev.bike_model || 'Motorcycle',
      verifiedPurchase: Boolean(rev.verified_purchase),
    }));
  } catch (err) {
    console.warn('fetchReviewsFromDb exception:', err);
    return [];
  }
}

export async function insertReviewToDb(review: ProductReview): Promise<boolean> {
  try {
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
      const { error: simpleErr } = await supabase
        .from('reviews')
        .insert([payload]);
      return !simpleErr;
    }
    return true;
  } catch (err) {
    console.warn('insertReviewToDb exception:', err);
    return false;
  }
}
