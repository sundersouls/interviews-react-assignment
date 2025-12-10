import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string | null;
  setSearchQuery: (query: string) => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  setSortBy: (sortBy: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

export type CartProduct = {
  product: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    category: string;
  };
  quantity: number;
};

export type Cart = {
  items: CartProduct[];
  totalPrice: number;
  totalItems: number;
};

interface CartState {
  cart: Cart;

  setCart: (cart: Cart) => void;
  addOptimistic: (product: CartProduct["product"], quantity: number) => void;
  removeOptimistic: (product: CartProduct["product"], quantity: number) => void;
  getCart: () => Cart;
  clearCart: () => void;
}

const initializeFiltersFromURL = (): Pick<
  FilterState,
  "searchQuery" | "selectedCategory" | "minPrice" | "maxPrice" | "sortBy"
> => {
  const url = new URL(window.location.href);
  const search = url.searchParams.get("search");
  const category = url.searchParams.get("category");
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");
  const sortBy = url.searchParams.get("sortBy");

  return {
    searchQuery: search ?? "",
    selectedCategory: category ?? null,
    minPrice: minPrice ? Number(minPrice) : null,
    maxPrice: maxPrice ? Number(maxPrice) : null,
    sortBy: sortBy ?? null,
  };
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: {
    items: [],
    totalPrice: 0,
    totalItems: 0,
  },

  setCart: (cart) => set({ cart }),

  getCart: () => get().cart,

  addOptimistic: (product, quantity) => {
    const { cart } = get();

    const existing = cart.items.find((i) => i.product.id === product.id);

    let newItems;

    if (existing) {
      newItems = cart.items.map((i) =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + quantity }
          : i,
      );
    } else {
      newItems = [...cart.items, { product, quantity }];
    }

    set({
      cart: {
        items: newItems,
        totalItems: cart.totalItems + quantity,
        totalPrice: cart.totalPrice + product.price * quantity,
      },
    });
  },

  removeOptimistic: (product, quantity) => {
    const { cart } = get();

    const existing = cart.items.find((i) => i.product.id === product.id);

    let newItems;

    if (existing) {
      newItems = cart.items.map((i) =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity - quantity }
          : i,
      );
    } else {
      newItems = [...cart.items, { product, quantity: -quantity }];
    }

    set({
      cart: {
        items: newItems,
        totalItems: cart.totalItems - quantity,
        totalPrice: cart.totalPrice - product.price * quantity,
      },
    });
  },

  clearCart: () =>
    set({
      cart: { items: [], totalItems: 0, totalPrice: 0 },
    }),
}));

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      ...initializeFiltersFromURL(),

      setSearchQuery: (query) => {
        set({ searchQuery: query });
        const s = get();
        updateURL(query, s.selectedCategory, s.minPrice, s.maxPrice, s.sortBy);
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
        const s = get();
        updateURL(s.searchQuery, category, s.minPrice, s.maxPrice, s.sortBy);
      },

      setMinPrice: (price) => {
        set({ minPrice: price });
        const s = get();
        updateURL(
          s.searchQuery,
          s.selectedCategory,
          price,
          s.maxPrice,
          s.sortBy,
        );
      },

      setMaxPrice: (price) => {
        set({ maxPrice: price });
        const s = get();
        updateURL(
          s.searchQuery,
          s.selectedCategory,
          s.minPrice,
          price,
          s.sortBy,
        );
      },

      setSortBy: (sortBy) => {
        set({ sortBy });
        const s = get();
        updateURL(
          s.searchQuery,
          s.selectedCategory,
          s.minPrice,
          s.maxPrice,
          sortBy,
        );
      },

      clearFilters: () => {
        set({
          searchQuery: "",
          selectedCategory: null,
          minPrice: null,
          maxPrice: null,
          sortBy: null,
        });
        updateURL("", null, null, null, null);
      },

      hasActiveFilters: () => {
        const s = get();
        return Boolean(
          s.searchQuery ||
          s.selectedCategory ||
          s.minPrice !== null ||
          s.maxPrice !== null ||
          s.sortBy !== null,
        );
      },
    }),
    {
      name: "filter-storage",
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
      }),
    },
  ),
);

function updateURL(
  search?: string,
  category?: string | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  sortBy?: string | null,
) {
  const url = new URL(window.location.href);

  const setOrDelete = (key: string, value: string | null | undefined) => {
    if (value && value !== "") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  };

  setOrDelete("search", search ?? null);
  setOrDelete("category", category ?? null);
  setOrDelete("minPrice", minPrice !== null ? String(minPrice) : null);
  setOrDelete("maxPrice", maxPrice !== null ? String(maxPrice) : null);
  setOrDelete("sortBy", sortBy ?? null);

  window.history.replaceState({}, "", url.toString());
}
