import { useState } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useReviews } from "../context/ReviewsContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetail({ productId, setPage, setSelectedProduct }) {
  const product = products.find(p => p.id === productId);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { getReviews } = useReviews();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const reviews = getReviews(product.id);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const stockColor = product.stock <= 3 ? "text-red-500" : product.stock <= 10 ? "text-amber-500" : "text-emerald-600";
  const stockLabel = product.stock <= 3 ? `Only ${product.stock} left!` : product.stock <= 10 ? `${product.stock} in stock` : "In Stock";

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-8">
        <button onClick={() => setPage("home")} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => setPage("home")} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{product.category}</button>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
            <img key={activeImg} src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover fade-in" />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-primary-500 shadow-md" : "border-transparent opacity-60 hover:opacity-90"}`}>
                <img src={img} alt="" className="w-full h-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full w-fit mb-3">
            {product.category}
          </span>
          <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white leading-tight mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= Math.round(avgRating) ? "#f59e0b" : "#d1d5db" }} className="text-lg">★</span>
              ))}
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-200">{avgRating}</span>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-4xl font-black text-primary-700 dark:text-primary-400">{(product.price * qty).toLocaleString()}</span>
            <span className="text-gray-500 font-medium">DZD</span>
          </div>

          {/* Stock */}
          <div className={`flex items-center gap-2 text-sm font-semibold mb-5 ${stockColor}`}>
            <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
            {stockLabel}
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{product.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <span className="text-primary-500">✓</span> {spec}
              </div>
            ))}
          </div>

          {/* Qty + Actions */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors shadow-sm">−</button>
              <span className="w-6 text-center font-bold text-gray-800 dark:text-gray-100">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors shadow-sm">+</button>
            </div>
            <button onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95 text-white ${addedAnim ? "bg-emerald-500" : "bg-primary-600 hover:bg-primary-700"}`}>
              {addedAnim ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <button onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${wishlisted ? "bg-red-50 border-red-400 text-red-500" : "border-gray-200 dark:border-gray-700 text-gray-400 hover:border-red-300 hover:text-red-400"}`}>
              <svg className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>

          <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500 mt-2">
            <span>🚚 Free delivery +5000 DZD</span>
            <span>🔄 Easy returns</span>
            <span>🔒 Secure payment</span>
          </div>
        </div>
      </div>

      {/* Reviews — read only */}
      {reviews.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Customer Reviews <span className="text-primary-500 text-xl">({reviews.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{r.author}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ color: s <= r.rating ? "#f59e0b" : "#d1d5db" }} className="text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            More from <span className="text-primary-600">{product.category}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map(p => (
              <div key={p.id} onClick={() => { setSelectedProduct(p.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="cursor-pointer">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
