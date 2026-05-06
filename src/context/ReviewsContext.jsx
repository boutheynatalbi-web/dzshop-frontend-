import { createContext, useContext, useState, useEffect } from "react";

const ReviewsContext = createContext();

const SEED_REVIEWS = {
  1: [
    { id: 1, author: "Karim B.", rating: 5, comment: "Amazing sound quality, the noise cancellation is unreal!", date: "2026-02-10" },
    { id: 2, author: "Sara M.", rating: 5, comment: "Best headphones I've ever owned. Worth every dinar.", date: "2026-01-28" },
    { id: 3, author: "Yacine D.", rating: 4, comment: "Great sound, comfortable for long sessions. Slightly heavy.", date: "2026-01-15" },
  ],
  3: [
    { id: 1, author: "Amira K.", rating: 5, comment: "Tracks everything perfectly. Battery lasts a full week!", date: "2026-02-18" },
    { id: 2, author: "Omar T.", rating: 4, comment: "Love the GPS feature for my morning runs.", date: "2026-02-01" },
  ],
  5: [
    { id: 1, author: "Nadia H.", rating: 5, comment: "Absolutely beautiful. A true piece of Algerian art.", date: "2026-03-01" },
    { id: 2, author: "Riad B.", rating: 5, comment: "The craftsmanship is outstanding. Unique and high quality.", date: "2026-02-20" },
  ],
};

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem("novamart_reviews");
      return stored ? JSON.parse(stored) : SEED_REVIEWS;
    } catch { return SEED_REVIEWS; }
  });

  useEffect(() => {
    localStorage.setItem("novamart_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const getReviews = (productId) => reviews[productId] || [];

  const addReview = (productId, review) => {
    setReviews(prev => ({
      ...prev,
      [productId]: [
        { ...review, id: Date.now(), date: new Date().toISOString().split("T")[0] },
        ...(prev[productId] || []),
      ],
    }));
  };

  return (
    <ReviewsContext.Provider value={{ getReviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export const useReviews = () => useContext(ReviewsContext);
