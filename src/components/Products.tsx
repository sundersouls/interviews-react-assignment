import { useEffect, useState } from "react";
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
export const Products = ({
  onCartChange,
}: {
  onCartChange: (cart: Cart) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/products?limit=200")
      .then((response) => response.json())
      .then((data) => (setProducts(data.products), setLoading(false)));
  }, []);

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

  return (
    <Box overflow="scroll" height="100%">
      <Grid container spacing={2} p={2} justifyContent="center" height="100%">
        {loading && products.length === 0 ? (
          // added some cases loading state etc. still need to make 1st challenge to make products load as person scroll.
          <Loading />
        ) : products.length === 0 ? (
          <Typography variant="h6">No products found</Typography>
        ) : (
          products.map((product) => (
            // fixed key error by adding key prop to Grid and put all components in components directory.
            <Grid key={product.id} item xs={4}>
              {/* Do not remove this */}
              <HeavyComponent />
              <Card style={{ width: "100%" }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={product.imageUrl}
                />
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
                      onClick={() => addToCart(product.id, -1)}
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
                      onClick={() => addToCart(product.id, 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};
