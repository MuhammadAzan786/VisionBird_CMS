/* eslint-disable react/prop-types */
import { Box, Card, CardContent, Typography } from "@mui/material";
import shape from "/shape-square.svg";
const DashboardCard = ({ background, color, bgcolor, svg, count, title }) => {
  return (
    <Card
      sx={{
        background,
        color,
        borderRadius: "16px",
        position: "relative",
      }}
      elevation={0}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 0,
        }}
      >
        <Typography fontSize={100} fontWeight={500}>
          {count}
        </Typography>
        <Typography fontWeight={500} fontSize={25}>
          {title}
        </Typography>
      </CardContent>

      <Box
        component="span"
        sx={{
          bottom: -20,
          right: -30,
          width: 150,
          zIndex: 1,
          height: 150,
          opacity: 0.24,
          position: "absolute",
          flexShrink: 0,
          display: "inline-flex",
          bgcolor,
          mask: `url(${svg}) no-repeat center / contain`,
          WebkitMask: `url(${svg}) no-repeat center / contain`,
        }}
      />

      <Box
        component="span"
        sx={{
          bottom: 0,
          left: -30,
          width: 250,
          zIndex: 1,
          height: 250,
          opacity: 0.24,
          position: "absolute",
          flexShrink: 0,
          display: "inline-flex",
          bgcolor,
          mask: `url(${shape}) no-repeat center / contain`,
          WebkitMask: `url(${shape}) no-repeat center / contain`,
        }}
      />
    </Card>
  );
};

export default DashboardCard;
