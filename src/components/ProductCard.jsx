import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product, onView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="card-hover fade-in bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 group">
      <div className="relative overflow-hidden cursor-pointer" onClick={onView}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Wishlist heart */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`heart-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md flex items-center justify-center ${wishlisted ? 'active' : 'text-gray-400 hover:text-red-400'}`}
        >
          <svg className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary-600/90 text-white text-xs rounded-full font-medium">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <h3 onClick={onView} className="cursor-pointer font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem] hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-gold-500 text-sm">{"★".repeat(Math.floor(product.rating))}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg text-primary-700 dark:text-primary-400">
            {product.price.toLocaleString("fr-DZ")} <span className="text-xs font-body font-normal text-gray-500">DZD</span>
          </span>
          <button
            onClick={() => addToCart(product)}
            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs rounded-xl font-medium transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
