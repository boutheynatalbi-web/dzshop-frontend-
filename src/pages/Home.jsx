import { useMemo, useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useSearch } from "../context/SearchContext";

const CATEGORIES = ["all", ...new Set(products.map(p => p.category))];
const MAX_PRICE = 25000;

function PriceRangeSlider({ value, onChange }) {
  const [min, max] = value;
  const pct = (v) => (v / MAX_PRICE) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{min.toLocaleString()} DZD</span>
        <span>{max.toLocaleString()} DZD</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute left-0 right-0 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="absolute h-full bg-primary-500 rounded-full"
            style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
          />
        </div>
        <input type="range" min={0} max={MAX_PRICE} step={500} value={min}
          onChange={e => { const v = Math.min(+e.target.value, max - 500); onChange([v, max]); }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
        />
        <input type="range" min={0} max={MAX_PRICE} step={500} value={max}
          onChange={e => { const v = Math.max(+e.target.value, min + 500); onChange([min, v]); }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  );
}

export default function Home({ setPage, setSelectedProduct }) {
  const { query, sort, setSort, category, setCategory, priceRange, setPriceRange, minRating, setMinRating, resetFilters, hasActiveFilters } = useSearch();
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (category !== "all") list = list.filter(p => p.category === category);
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "alpha") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, sort, category, priceRange, minRating]);

  const handleView = (id) => {
    setSelectedProduct(id);
    setPage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8 rounded-3xl overflow-hidden relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-10 text-white">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)"}}></div>
        <p className="text-primary-200 font-medium mb-2 text-sm tracking-widest uppercase">Welcome to</p>
        <h1 className="font-display text-5xl font-black mb-3">Nova<span className="text-gold-400">Mart</span></h1>
        <p className="text-primary-100 max-w-md">Discover premium Algerian & international products, curated with care.</p>
        <div className="mt-4 flex gap-3 text-sm flex-wrap">
          <span className="px-3 py-1 bg-white/20 rounded-full">🇩🇿 Made in Algeria</span>
          <span className="px-3 py-1 bg-white/20 rounded-full">✨ Premium Quality</span>
          <span className="px-3 py-1 bg-white/20 rounded-full">🚚 Fast Delivery</span>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`flex-shrink-0 w-60 space-y-6 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-800 dark:text-gray-100">Filters</h3>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">Reset all</button>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Category</p>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors capitalize ${category === cat ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    {cat === "all" ? "All Categories" : cat}
                    <span className="float-right text-xs text-gray-400">
                      {cat === "all" ? products.length : products.filter(p => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Price Range</p>
              <PriceRangeSlider value={priceRange} onChange={setPriceRange} />
            </div>

            {/* Min Rating */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Min Rating</p>
              <div className="space-y-1">
                {[0, 4, 4.5, 4.8].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${minRating === r ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    {r === 0 ? "All ratings" : (
                      <span className="flex items-center gap-1">
                        <span className="text-gold-500">{"★".repeat(Math.floor(r))}{r % 1 ? "½" : ""}</span>
                        <span>{r}+</span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Controls bar */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(f => !f)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
                Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary-500 inline-block"></span>}
              </button>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                <strong className="text-gray-800 dark:text-gray-100">{filtered.length}</strong>
                {query ? <span> results for "<span className="text-primary-600">{query}</span>"</span> : " products"}
              </p>
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:border-primary-400 cursor-pointer transition-colors"
            >
              <option value="default">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="alpha">Alphabetical (A–Z)</option>
            </select>
          </div>

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category !== "all" && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium">
                  {category}
                  <button onClick={() => setCategory("all")} className="ml-1 hover:text-red-500">✕</button>
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium">
                  {priceRange[0].toLocaleString()}–{priceRange[1].toLocaleString()} DZD
                  <button onClick={() => setPriceRange([0, MAX_PRICE])} className="ml-1 hover:text-red-500">✕</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium">
                  ★ {minRating}+
                  <button onClick={() => setMinRating(0)} className="ml-1 hover:text-red-500">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="font-medium text-lg">No products found</p>
              <button onClick={resetFilters} className="mt-3 text-sm text-primary-600 hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onView={() => handleView(p.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
