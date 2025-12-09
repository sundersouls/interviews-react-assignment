import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useFilterStore } from "../store/filterStore";

const drawerWidth = 180;

const categories = [
  "Laptops",
  "Smartphones",
  "Tablets",
  "Accessories",
  "Audio",
  "Gaming",
  "Wearables",
  "Cameras",
];

export const Categories = () => {
  const { selectedCategory, setSelectedCategory } = useFilterStore();

  const handleCategoryClick = (category: string) => {
    // Toggle category if already selected, unselect it
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: "1px solid grey" }}>
      <List>
        {categories.map((category) => (
          <ListItem key={category} disablePadding>
            <ListItemButton
              selected={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              }}
            >
              <ListItemText primary={category} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
