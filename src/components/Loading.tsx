import { Box, CircularProgress } from "@mui/material";
// typical loading comp
export default function Loading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" padding={4}>
      <CircularProgress />
    </Box>
  );
}
