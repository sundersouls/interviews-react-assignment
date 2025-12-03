import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

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
  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: "1px solid grey" }}>
      <List>
        {
          // categories doesnt work for some reason and searchbar too.
          categories.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))
        }
      </List>
    </Box>
  );
};
