import { Box, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";

const Unauthorized = () => {
  const theme = useTheme();
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
        401
      </Typography>
      <Typography variant="h5" gutterBottom>
        Authorization required
      </Typography>
    </Box>
  );
};

export default Unauthorized;
