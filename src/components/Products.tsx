import { useEffect, useState, useRef, useCallback, memo } from "react";
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
  Chip,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "./Loading.tsx";
import { HeavyComponent } from "./HeavyComponent.tsx";
import { useFilterStore } from "../store/filterStore";

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

  const {
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
    hasActiveFilters,
  } = useFilterStore();

  const loadProducts = useCallback(
    async (pageNum: number) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: PAGE_LIMIT.toString(),
        });

        if (searchQuery) {
          params.append("q", searchQuery);
        }

        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        if (minPrice !== null) {
          params.append("minPrice", minPrice.toString());
        }

        if (maxPrice !== null) {
          params.append("maxPrice", maxPrice.toString());
        }

        if (sortBy) {
          params.append("sortBy", sortBy);
        }

        const response = await fetch(`/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts((prev) =>
          pageNum === 0 ? data.products : [...prev, ...data.products],
        );
        setHasMore(data.hasMore);
        setPage(pageNum);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [searchQuery, selectedCategory, minPrice, maxPrice, sortBy],
  );

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    loadProducts(0);
  }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy, loadProducts]);

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

  function addToCart(productId: number, quantity: number) {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            loading: true,
          };
        }
        return product;
      }),
    );
    fetch("/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    }).then(async (response) => {
      if (response.ok) {
        const cart = await response.json();
        setProducts(
          products.map((product) => {
            if (product.id === productId) {
              return {
                ...product,
                itemInCart: (product.itemInCart || 0) + quantity,
                loading: false,
              };
            }
            return product;
          }),
        );
        onCartChange(cart);
      }
    });
  }

  const ProductCard = memo(
    ({
      product,
      onAddToCart,
    }: {
      product: Product;
      onAddToCart: (id: number, qty: number) => void;
    }) => {
      // with this its rerender is seems to be optimal. idk how i will do virtual list tho i dont have much time left. ig i will try to speedrun it by ai tho i am not sure how to properly to implement it. Also coud done 4 challenge it is seems to be easier. But again i have no tiime. I wasnt in right place to do it in meantime while i had some time.
      return (
        <Grid key={product.id} item xs={4}>
          {/* Do not remove this */}
          <HeavyComponent />
          <Card style={{ width: "100%" }}>
            <CardMedia component="img" height="150" image={product.imageUrl} />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
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
                  textAlign="center"
                >
                  {product.loading && <CircularProgress size={20} />}
                </Box>
                <IconButton
                  disabled={product.loading}
                  aria-label="delete"
                  size="small"
                  onClick={() => onAddToCart(product.id, -1)}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <Typography variant="body1" component="div" mx={1}>
                  {product.itemInCart || 0}
                </Typography>

                <IconButton
                  disabled={product.loading}
                  aria-label="add"
                  size="small"
                  onClick={() => onAddToCart(product.id, 1)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.product.id === nextProps.product.id &&
        prevProps.product.itemInCart === nextProps.product.itemInCart &&
        prevProps.product.loading === nextProps.product.loading
      );
    },
  );

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
        <Grid container justifyContent="center" p={2} spacing={2}>
          {hasActiveFilters() && (
            <Grid item xs={12}>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                bgcolor="background.paper"
                borderRadius={1}
              >
                <Typography variant="body2" fontWeight="bold">
                  Active Filters:
                </Typography>

                {searchQuery && (
                  <Chip
                    label={`Search: "${searchQuery}"`}
                    onDelete={() => setSearchQuery("")}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}

                {selectedCategory && (
                  <Chip
                    label={`Category: ${selectedCategory}`}
                    onDelete={() => setSelectedCategory(null)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}

                {minPrice !== null && (
                  <Chip
                    label={`Min: $${minPrice}`}
                    onDelete={() => setMinPrice(null)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}

                {maxPrice !== null && (
                  <Chip
                    label={`Max: $${maxPrice}`}
                    onDelete={() => setMaxPrice(null)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}

                {sortBy && (
                  <Chip
                    label={`Sort: ${sortBy.replace(/_/g, " ")}`}
                    onDelete={() => setSortBy(null)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}

                <Button
                  size="small"
                  onClick={clearFilters}
                  startIcon={<CloseIcon />}
                  sx={{ ml: "auto" }}
                >
                  Clear All
                </Button>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" gap={2} alignItems="center">
                <Typography variant="body2">Price Range:</Typography>

                <TextField
                  type="number"
                  placeholder="Min"
                  size="small"
                  value={minPrice ?? ""}
                  onChange={(e) =>
                    setMinPrice(e.target.value ? Number(e.target.value) : null)
                  }
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
                  }}
                  sx={{ width: 120 }}
                />

                <Typography variant="body2">to</Typography>

                <TextField
                  type="number"
                  placeholder="Max"
                  size="small"
                  value={maxPrice ?? ""}
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? Number(e.target.value) : null)
                  }
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
                  }}
                  sx={{ width: 120 }}
                />
              </Box>
              <Box display="flex" gap={2} alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Sort by:</Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <Select
                      value={sortBy || ""}
                      onChange={(e) => setSortBy(e.target.value || null)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Default</em>
                      </MenuItem>
                      <MenuItem value="price_asc">Price: Low → High</MenuItem>
                      <MenuItem value="price_desc">Price: High → Low</MenuItem>
                      <MenuItem value="name_asc">Name: A → Z</MenuItem>
                      <MenuItem value="name_desc">Name: Z → A</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Showing {products.length} results
                </Typography>
              </Box>
            </Box>
          </Grid>

          {error && products.length === 0 && (
            <Grid item xs={12}>
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
            </Grid>
          )}

          {loading && products.length === 0 ? (
            <Loading />
          ) : products.length === 0 ? (
            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={4}
              >
                <Typography variant="h6" gutterBottom>
                  No products found
                </Typography>
                {hasActiveFilters() && (
                  <Button
                    onClick={clearFilters}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            </Grid>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))
          )}

          {loading && products.length > 0 && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            </Grid>
          )}

          {!hasMore && products.length > 0 && !loading && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" p={4}>
                <Typography variant="body2" color="text.secondary">
                  You've reached the end
                </Typography>
              </Box>
            </Grid>
          )}

          {error && products.length > 0 && (
            <Grid item xs={12}>
              <Box p={2}>
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};
