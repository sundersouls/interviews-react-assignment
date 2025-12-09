import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Loading from "./Loading.tsx";
import { HeavyComponent } from "./HeavyComponent.tsx";

export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
};

export type Cart = {
  items: Product[];
  totalPrice: number;
  totalItems: number;
};

const PAGE_LIMIT = 20;

export const Products = ({
  onCartChange,
}: {
  onCartChange: (cart: Cart) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Load products function
  const loadProducts = useCallback(async (pageNum: number) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/products?page=${pageNum}&limit=${PAGE_LIMIT}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      
      setProducts((prev) => 
        pageNum === 0 ? data.products : [...prev, ...data.products]
      );
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadProducts(0);
  }, [loadProducts]);

  // Scroll handler for infinite scroll
  const endReached = useCallback(() => {
    if (!loading && hasMore && !loadingRef.current) {
      loadProducts(page + 1);
    }
  }, [loading, hasMore, page, loadProducts]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      endReached();
    }
  }, [endReached]);

  // Add to cart with proper state management
  const addToCart = useCallback((productId: number, quantity: number) => {
    // Optimistic update - show loading on specific product
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, loading: true }
          : product
      )
    );

    fetch("/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    })
      .then(async (response) => {
        if (response.ok) {
          const cart = await response.json();
          
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    itemInCart: (product.itemInCart || 0) + quantity,
                    loading: false,
                  }
                : product
            )
          );
          
          onCartChange(cart);
        } else {
          throw new Error("Failed to update cart");
        }
      })
      .catch((err) => {
        console.error("Cart update failed:", err);
        // Revert loading state on error
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, loading: false }
              : product
          )
        );
      });
  }, [onCartChange]);

  return (
    <Box
      style={{
        display: "flex",
        flexGrow: 1,
        position: "relative",
        width: "100%",
        minHeight: 0,
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          inset: 0,
          overflowY: "auto",
        }}
        ref={scrollRef}
        onScroll={onScroll}
      >
        {/* Error State */}
        {error && products.length === 0 && (
          <Box p={4}>
            <Alert 
              severity="error" 
              onClose={() => {
                setError(null);
                loadProducts(0);
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Initial Loading State */}
        {loading && products.length === 0 && <Loading />}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            p={4}
          >
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
          </Box>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <Grid container spacing={2} p={2} justifyContent="center">
            {products.map((product) => (
              <Grid key={product.id} item xs={12} sm={6} md={4}>
                <HeavyComponent />
                <Card style={{ width: "100%", height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={product.imageUrl}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Typography variant="h6" component="div">
                      ${product.price}
                    </Typography>
                    <Box flexGrow={1} />
                    <Box
                      position="relative"
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <Box
                        position="absolute"
                        left={0}
                        right={0}
                        top={0}
                        bottom={0}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {product.loading && <CircularProgress size={20} />}
                      </Box>
                      <IconButton
                        disabled={product.loading || product.itemInCart === 0}
                        aria-label="remove from cart"
                        size="small"
                        onClick={() => addToCart(product.id, -1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <Typography variant="body1" component="div" mx={1}>
                        {product.itemInCart || 0}
                      </Typography>

                      <IconButton
                        disabled={product.loading}
                        aria-label="add to cart"
                        size="small"
                        onClick={() => addToCart(product.id, 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Loading More Indicator */}
        {loading && products.length > 0 && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {/* End of List Message */}
        {!hasMore && products.length > 0 && !loading && (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography variant="body2" color="text.secondary">
              You've reached the end
            </Typography>
          </Box>
        )}

        {/* Error while loading more */}
        {error && products.length > 0 && (
          <Box p={2}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};