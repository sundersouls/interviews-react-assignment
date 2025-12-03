import { Cart, Products } from "./components/Products.tsx";
import { Box, CssBaseline } from "@mui/material";
import SearchAppBar from "./components/SearchAppBar.tsx";
import { Categories } from "./components/Categories.tsx";
import ScrollView from "./components/ScrollView.tsx";
import { useState } from "react";

function App() {
  const [cart, setCart] = useState<Cart>();

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar
        quantity={cart?.totalItems || 0}
        price={cart?.totalPrice || 0}
      />
      <Box flex={1} display="flex" flexDirection="row">
        <Categories />
        <ScrollView>
          <Products onCartChange={onCartChange} />
        </ScrollView>
      </Box>
    </Box>
  );
}

export default App;
