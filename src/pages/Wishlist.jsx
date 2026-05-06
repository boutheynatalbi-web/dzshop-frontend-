import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist({ setPage }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black text-gray-800 dark:text-gray-100 mb-1">My Wishlist</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 fade-in">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-12 h-12 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-6">Save items you love by clicking the heart icon</p>
          <button onClick={() => setPage("home")} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map(item => (
            <div key={item.id} className="card-hover fade-in bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{item.category}</p>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 mb-3">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-primary-700 dark:text-primary-400">
                    {item.price.toLocaleString()} <span className="text-xs font-body font-normal text-gray-500">DZD</span>
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-xl font-medium transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
