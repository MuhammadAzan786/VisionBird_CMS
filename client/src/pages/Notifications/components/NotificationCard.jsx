/* eslint-disable react/prop-types */
import { Avatar, Box, Typography } from "@mui/material";
import placeholder from "../../../assets/images/dummy.jpg";

const NotificationCard = ({ message = "ali", from }) => {
  const imageSrc = from.employeeProImage.secure_url || placeholder;

  return (
    <Box
      sx={{
        display: "flex",

        alignItems: "center",
        gap: "10px",
        marginBottom: 5,
      }}
    >
      <Avatar src={imageSrc} sx={{ width: 60, height: 60 }} />
      <div>
        <Typography variant="h6" fontSize={18}>
          Haider
        </Typography>
        <Typography variant="body1" color="grey">
          {message}
        </Typography>
      </div>
    </Box>
  );
};

export default NotificationCard;