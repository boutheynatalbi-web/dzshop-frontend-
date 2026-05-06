import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SearchProvider } from "./context/SearchContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";

function AppContent() {
  const [page, setPage] = useState("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSetPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
      <Navbar page={page} setPage={handleSetPage} setCartOpen={setCartOpen} />
      <div className="flex-1">
        {page === "home" && <Home setPage={handleSetPage} setSelectedProduct={setSelectedProduct} />}
        {page === "wishlist" && <Wishlist setPage={handleSetPage} />}
        {page === "login" && <Login setPage={handleSetPage} />}
        {page === "product" && selectedProduct && (
          <ProductDetail
            productId={selectedProduct}
            setPage={handleSetPage}
            setSelectedProduct={(id) => { setSelectedProduct(id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />
        )}
      </div>
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      <Footer setPage={handleSetPage} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <CartProvider>
          <WishlistProvider>
            <ReviewsProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </ReviewsProvider>
          </WishlistProvider>
        </CartProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}