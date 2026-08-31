import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Bike, 
  ShieldCheck, 
  Truck, 
  Store, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Send,
  UserCheck,
  Zap,
  Lock,
  LogIn
} from 'lucide-react';
import { Product, ProductReview, UserProfile } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onDirectBuy?: (product: Product, quantity: number) => void;
  reviews: ProductReview[];
  onAddReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;
  userProfile?: UserProfile | null;
  onOpenAuth?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectBuy,
  reviews,
  onAddReview,
  userProfile,
  onOpenAuth,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'fitment'>('specs');
  
  // Review form state
  const [reviewerName, setReviewerName] = useState(userProfile?.fullName || '');
  const [reviewBike, setReviewBike] = useState(userProfile?.primaryBike || 'Honda Click 125i (V1 / V2 / V3)');
  const [starRating, setStarRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (userProfile?.fullName) {
      setReviewerName(userProfile.fullName);
    }
    if (userProfile?.primaryBike) {
      setReviewBike(userProfile.primaryBike);
    }
  }, [userProfile]);

  const productReviews = reviews.filter(r => r.productId === product.id);
  const averageRating = productReviews.length > 0
    ? (productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length).toFixed(1)
    : product.rating.toFixed(1);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile && onOpenAuth) {
      onOpenAuth();
      return;
    }
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    onAddReview({
      productId: product.id,
      userName: reviewerName.trim() || userProfile?.fullName || 'Verified Rider',
      rating: starRating,
      comment: reviewComment.trim(),
      bikeModel: reviewBike.trim() || userProfile?.primaryBike || 'Motorcycle',
      verifiedPurchase: true,
    });

    setReviewSubmitted(true);
    setReviewComment('');
    setTimeout(() => {
      setReviewSubmitted(false);
      setActiveTab('reviews');
    }, 1500);
  };

  const handleBuyNowClick = () => {
    if (!userProfile && onOpenAuth) {
      onOpenAuth();
      return;
    }
    if (onDirectBuy) {
      onDirectBuy(product, quantity);
      onClose();
    } else {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  const handleAddToCartClick = () => {
    if (!userProfile && onOpenAuth) {
      onOpenAuth();
      return;
    }
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto relative">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Product Information Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-7 border-b border-neutral-850">
          
          {/* Left Media (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 relative">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-sm text-neutral-200 border border-neutral-700 text-xs font-semibold">
                {product.condition}
              </span>
            </div>

            {/* Seller Info Card */}
            <div className="rounded-xl bg-neutral-900/70 border border-neutral-800 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-red-950 text-red-400 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">{product.seller.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-neutral-400">{product.seller.location} • {product.seller.rating}⭐</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-semibold">
                  GCash Verified
                </span>
              </div>
            </div>
          </div>

          {/* Right Product Details & Buy Form (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-amber-400">{averageRating}</span>
                  <span className="text-neutral-400">({productReviews.length} verified reviews)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] leading-snug">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-black text-red-500 font-['Outfit']">
                  ₱{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through">
                    ₱{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  In Stock ({product.stock} units)
                </span>
              </div>

              {/* Description summary */}
              <p className="text-xs sm:text-sm text-neutral-300 font-['Plus_Jakarta_Sans'] leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Fitment highlights */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Verified Compatible Models
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibleBikes.map((bike, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-800 flex items-center gap-1 font-medium"
                    >
                      <Bike className="w-3.5 h-3.5 text-red-500" />
                      <span>{bike}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 border-t border-neutral-850 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-neutral-400">Quantity:</span>
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-300 hover:text-white font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-white min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-neutral-300 hover:text-white font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-neutral-500">
                  Subtotal: <strong className="text-white">₱{(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleBuyNowClick}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>⚡ Buy Now (₱{(product.price * quantity).toLocaleString()})</span>
                </button>

                <button
                  onClick={handleAddToCartClick}
                  className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-4 h-4 text-red-400" />
                  <span>Add to Cart</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 bg-neutral-900/60 rounded-xl px-3 py-2 border border-neutral-800">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Fast Metro Manila & Province Delivery • GCash / PayMongo Protected</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Section: Specs, Reviews, Write a Review */}
        <div className="p-5 sm:p-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'specs' 
                  ? 'bg-neutral-800 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Technical Specs
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                activeTab === 'reviews' 
                  ? 'bg-neutral-800 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 text-[10px]">
                {productReviews.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('fitment')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'fitment' 
                  ? 'bg-neutral-800 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Fitment Guide
            </button>
          </div>

          {/* Tab 1: Specs */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <div key={idx} className="flex justify-between p-3 rounded-lg bg-neutral-900/60 border border-neutral-850 text-xs">
                  <span className="text-neutral-400 font-medium">{key}</span>
                  <span className="text-white font-bold text-right">{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Reviews & Write a Review */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Write a Review Card */}
              <div className="rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase">
                      Write a Customer Review
                    </h3>
                  </div>
                  <span className="text-[11px] text-amber-400 font-semibold">
                    Rate 1 to 5 Stars
                  </span>
                </div>

                {!userProfile ? (
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white font-['Outfit'] uppercase">
                        Account Required to Review
                      </h4>
                      <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                        Sign in or register an account to leave a verified rating and share your feedback on this product with the community.
                      </p>
                    </div>
                    {onOpenAuth && (
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In or Register to Review</span>
                      </button>
                    )}
                  </div>
                ) : reviewSubmitted ? (
                  <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Maraming salamat! Your product review has been submitted and posted.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    {/* Star Selector */}
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                        Your Rating:
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setStarRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-neutral-600 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`w-6 h-6 ${
                                (hoverRating || starRating) >= star 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-neutral-700'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-amber-400 ml-2">
                          {hoverRating || starRating} of 5 Stars ({starRating === 5 ? 'Excellent 🚀' : starRating >= 4 ? 'Great 👍' : 'Average'})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                          Your Name or Display Alias:
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g., Alex Santos or MotoFan"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                          Motorcycle / Bike Model (Optional):
                        </label>
                        <input
                          type="text"
                          value={reviewBike}
                          onChange={(e) => setReviewBike(e.target.value)}
                          placeholder="e.g., Honda Click 125i, Yamaha Aerox, NMAX, etc."
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                        Review & Feedback:
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts on build quality, fitment, performance, packaging, or installation..."
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Product Review</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Community & Customer Reviews ({productReviews.length})
                </h4>

                {productReviews.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">
                    Be the first customer to review this part! Fill out the star rating above.
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-red-950 text-red-400 font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white">{rev.userName}</span>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                              <UserCheck className="w-3 h-3" />
                              <span>Verified User {rev.bikeModel ? `• ${rev.bikeModel}` : ''}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'}`} 
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 font-['Plus_Jakarta_Sans'] leading-relaxed">
                        "{rev.comment}"
                      </p>

                      <div className="text-[10px] text-neutral-500">
                        Reviewed on {rev.date}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* Tab 3: Fitment Details */}
          {activeTab === 'fitment' && (
            <div className="rounded-xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-['Outfit'] flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-red-500" />
                <span>Bolt-On Fitment Compatibility Matrix</span>
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed font-['Plus_Jakarta_Sans']">
                This item is manufactured according to Japanese and Thai performance standards. Direct fitment guaranteed for all models listed below without crankcase or chassis cutting:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {product.compatibleBikes.map((bike, idx) => (
                  <li key={idx} className="text-xs text-neutral-300 flex items-center gap-2 p-2 rounded bg-neutral-950 border border-neutral-850">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{bike}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
