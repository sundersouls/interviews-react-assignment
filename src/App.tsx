import { Products } from "./components/Products.tsx";
import { Box, CssBaseline } from "@mui/material";
import SearchAppBar from "./components/SearchAppBar.tsx";
import { Categories } from "./components/Categories.tsx";

function App() {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar />
      <Box flex={1} display="flex" flexDirection="row">
        <Categories />
        <Products />
      </Box>
    </Box>
  );
}

export default App;
