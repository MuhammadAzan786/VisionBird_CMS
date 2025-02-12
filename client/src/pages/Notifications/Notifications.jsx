import { Box, Paper } from "@mui/material";
import NotificationCard from "./components/NotificationCard";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Notifications = () => {
  const { notifications, status } = useSelector((state) => state.notifications);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    toast.error("failed to fetch notifications");
  }

  return (
    <>
      <Paper>{/* <Typography>{JSON.stringify(state)}</Typography> */}</Paper>

      <Box sx={{ px: "100px" }}>
        <Paper>
          {notifications.map((item, index) => {
            return <NotificationCard key={index} {...item} />;
          })}
        </Paper>
      </Box>
    </>
  );
};

export default Notifications;