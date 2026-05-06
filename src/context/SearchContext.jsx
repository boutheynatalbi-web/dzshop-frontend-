import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [minRating, setMinRating] = useState(0);

  const resetFilters = () => {
    setCategory("all");
    setPriceRange([0, 25000]);
    setMinRating(0);
    setSort("default");
  };

  const hasActiveFilters = category !== "all" || priceRange[0] > 0 || priceRange[1] < 25000 || minRating > 0;

  return (
    <SearchContext.Provider value={{
      query, setQuery,
      sort, setSort,
      category, setCategory,
      priceRange, setPriceRange,
      minRating, setMinRating,
      resetFilters, hasActiveFilters,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
