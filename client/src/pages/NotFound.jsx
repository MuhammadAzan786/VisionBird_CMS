import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
const NotFound = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt={15}
    >
      <img
        src="/vbt-logo.png"
        alt="Company Logo"
        style={{ width: 550, marginBottom: 20 }}
      />
      <Typography variant="h1" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
    </Box>
  );
};

export default NotFound;
