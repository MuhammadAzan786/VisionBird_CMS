import CircleIcon from "@mui/icons-material/Circle";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { Howl } from "howler";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInterceptor";

import InfoIcon from "@mui/icons-material/Info";
import manAvatar from "../../assets/images/dummy.jpg";

// Redux
import { clearSocket, initializeSocket } from "../../redux/socketSlice";
import { signOut } from "../../redux/user/userSlice";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { setCelebrationData, setShowCelebration } from "../../redux/celebrationSlice";

//VBT FULL LOGO
import halfLogo from "/logo.png";
import fullLogo from "/vbt-logo.png";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { palette } from "../../theme/colors";

import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";


export default function Appbar({ mobileOpen, greaterthanlg, handleDrawerToggle }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = React.useState([]);
  const [totalNotifications, setTotalNotifications] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  const [permission, setPermission] = React.useState(Notification.permission);
  const [navScroll, setNavScroll] = useState();
  const [notificationTimeout, setNotificationTimeout] = useState(null);
  const notificationSound = new Howl({
    src: ["/notificationsound.wav"], // Path to your sound file
    volume: 1, // Adjust volume (0.0 to 1.0)
    preload: true, // Preload the sound to avoid delays
  });

  useEffect(() => {
    if (permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        setPermission(permission);
      });
    }
  }, [permission]);

  useEffect(() => {
    if (socket) {
      const handleNotification = (data) => {
        // console.log("notification data", data)
        setNotifications((prev) => [...prev, data]);
        setTotalNotifications((prev) => prev + 1);
        notificationSound.play();
        // Determine how to handle each notification based on NotificationName
        switch (data.NotificationName) {
          case "Leave_Notification":
            handleLeaveNotification(data);
            break;
          case "Task_Notification":
            handleTaskNotification(data);
            break;
          case "eowNotification":
            handleEOWNotification(data);
            break;
          // Add more cases as needed for different notification types
          default:
            handleDefaultNotification(data);
        }
      };

      socket.on("notification", handleNotification);

      return () => {
        socket.off("notification", handleNotification);
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const offset = window.scrollY;
      setNavScroll(offset);
    });
  }, []);

  // Function to handle leave notifications
  const handleLeaveNotification = (data) => {
    if (permission === "granted") {
      const notification = new Notification("Leave Request Notification", {
        body: `Leave Request: ${data.message}`,
        icon: "/leave-icon.png", // Customize icon for leave notification
      });

      notification.onclick = () => {
        // console.log("in leave notification");
        navigate(`/view-leave/${data.leave_id}`);
        deleteNotification(data._id);

        if (document.visibilityState === "hidden") {
          window.focus();
        }
      };
    }
  };

  // Function to handle task notifications
  const handleTaskNotification = (data) => {
    const notification = new Notification("Task Update", {
      body: `Task: ${data.message}`,
      icon: "/task-icon.png", // Customize icon for task notification
    });

    notification.onclick = () => {
      navigate(`/employeetaskboard/${currentUser._id}`);
      deleteNotification(data._id);

      if (document.visibilityState === "hidden") {
        window.focus();
      }
    };
  };

  // handleEOWNotification
  const handleEOWNotification = (data) => {
    const notification = new Notification("Employee of week Notification", {
      body: `Employee of the Week: ${data.message}`,
      icon: "/task-icon.png", // Customize icon for task notification
    });

    notification.onclick = () => {
      dispatch(setCelebrationData(data));
      dispatch(setShowCelebration(true));
      deleteNotification(data._id);

      if (document.visibilityState === "hidden") {
        window.focus();
      }
    };
  };

  // Default notification handler for unknown notification types

  const handleDefaultNotification = (data) => {
    if (permission === "granted") {
      const notification = new Notification("New Notification!", {
        body: data.message,
        icon: "/default-notification-icon.png", // Default icon for notifications
      });

      notification.onclick = () => {
        // Handle default behavior
        deleteNotification(data._id);

        if (document.visibilityState === "hidden") {
          window.focus();
        }
      };
    }
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data); // Make sure this updates the state correctly
    };
  
    fetchNotifications();
  }, []); // Add dependencies if needed, like currentUser or employee_id
  
  const deleteNotification = (notificationId) => {
    setTotalNotifications((prev) => (prev > 0 ? prev - 1 : 0));
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification._id !== notificationId)
    );

    axios
      .delete(`/api/notification/delete/${notificationId}`)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    dispatch(clearSocket());
    localStorage.removeItem("persist:user");
    dispatch(signOut());
    navigate("/login");
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (notifications.length === 0) {
      // Automatically close the notification after 3 seconds if there are no notifications
      const timeout = setTimeout(() => {
        setOpen(false);
      }, 3000);

      setNotificationTimeout(timeout);

      return () => clearTimeout(timeout); // Clean up the timeout on unmount
    }
  }, [notifications]);
  return (

    <MuiAppBar elevation={0} sx={{ backgroundColor: "white", paddingX: "10px" }}>
      <Toolbar
        sx={{
          backgroundColor: "white",
          height: "5rem",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "0.4s ease-in-out",
        }}
      >
        {/* {grea terthanlg && */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "" }}>
          <Box
            sx={{
              display: "flex",
              marginLeft: !isSmallScreen && -1.6,
              transition: "0.3s ease-in-out !important",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <img
              className="h-12"
              style={{
                marginRight: "2.5rem",
                marginTop: !isSmallScreen && "1vh",
              }}
              src={!isSmallScreen ? fullLogo : halfLogo}
              alt="logo"
            />

            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: "25% !important",
                height: "3rem",
                width: "3rem",
                color: palette.primary.main,
                background: palette.primary.light,
                transition: "0.5s ease-in-out !important",
                "&:hover": {
                  color: "white",
                  backgroundColor: palette.primary.main,
                },
              }}
            >
              {mobileOpen ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
            </IconButton>
          </Box>

          <Box>
            <Box
              sx={{
                marginLeft: "1vw",

                alignItems: "center",
                display: greaterthanlg ? "flex" : "none",
              }}
            >
              <CircleIcon
                sx={{
                  fontSize: ".6rem",
                  color: "#72E128",
                  marginRight: "0.3rem",
                }}
              />
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: "600" }}>
                {currentUser.employeeName}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box display={"flex"} alignItems={"center"} gap={1}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Tooltip
          PopperProps={{ disablePortal: true }}
          onClose={() => setOpen(false)}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={
            <Box sx={{ maxHeight: 400, overflow: "auto" }}>
              <List>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <React.Fragment key={notification._id}>
                      {index !== 0 && <Divider component="li" sx={{ borderColor: "white" }} />}
                      <ListItem sx={{ padding: 1, display: "flex", alignItems: "center", height: 50 }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 0,
                            backgroundColor: "red !important",
                          }}
                          onClick={() => {
                            let path = "/";
                            const isAdmin = currentUser.role === "admin";
                            switch (notification.NotificationName) {
                              case "Leave_Notification":
                                path = `/view-leave/${notification.leave_id}`;
                                break;
                              case "Task_Notification":
                                path = isAdmin
                                  ? `/employeetaskviewPause/${notification.employee_id}`
                                  : `/employeetaskboard/${notification.employee_id}`;
                                break;
                              default:
                                path = "/";
                            }
                            navigate(path);
                            setOpen(false);
                            deleteNotification(notification._id);
                          }}
                        >
                          <InfoIcon />
                          <Typography sx={{ textAlign: "start" }} marginLeft={1} variant="caption">
                            {notification.message}
                          </Typography>
                        </button>
                      </ListItem>
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No Notifications" />
                  </ListItem>
                )}
              </List>
            </Box>
          }
        >
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              "&:hover": {
                background: "none",
              },
            }}
          >
            {/* Show the badge dot only if there are notifications */}
            {notifications.length > 0 ? (
              <Badge
                color="warning"
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#FF4D49", // Custom badge background color
                    color: "yellow", // Custom badge text color
                    position: "absolute",
                    top: "0.4rem",
                    right: "0.4rem",
                    border: "0.001rem solid #fff", // Border for badge
                  },
                }}
              >
                <Box
                  sx={{
                    padding: "5px",
                    borderRadius: "25%",
                    color: palette.primary.main,
                    width: "3rem",
                    backgroundColor: palette.primary.light,
                    transition: "0.5s ease-in-out",
                    "&:hover": {
                      color: "white",
                      backgroundColor: palette.primary.main,
                    },
                  }}
                >
                  <i className="ri-notification-2-line"></i>
                </Box>
              </Badge>
            ) : (
              <Box
                sx={{
                  padding: "5px",
                  borderRadius: "25%",
                  color: palette.primary.main,
                  width: "3rem",
                  backgroundColor: palette.primary.light,
                  transition: "0.5s ease-in-out",
                  "&:hover": {
                    color: "white",
                    backgroundColor: palette.primary.main,
                  },
                }}
              >
                <i className="ri-notification-2-line"></i>
              </Box>
            )}
          </IconButton>
        </Tooltip>
      </ClickAwayListener>

      <Badge
        color="success.light"
        variant="dot"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "#72E128",
            color: "yellow",
            position: "absolute",
            bottom: "0.3rem",
            right: "0.3rem",
            width: "11px",
            height: "11px",
            border: "0.125rem solid #fff",
            borderRadius: "50%",
          },
        }}
      >
        <Avatar
          src={currentUser.employeeProImage?.secure_url || manAvatar}
          onClick={handleMenuClick}
          sx={{
            cursor: "pointer",
            marginLeft: "auto",
            width: "3rem",
            height: "3rem",
          }}
        />
      </Badge>

      <Menu sx={{ mt: 1.8, ml: "-25px" }} anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
        <MenuItem
          sx={{ ml: 1, mr: 1 }}
          component={Link}
          to={`/employee-profile/${currentUser._id}`}
          onClick={handleClose}
        >
          <PersonIcon />
          <Typography sx={{ ml: 2 }}>Profile</Typography>
        </MenuItem>
        <MenuItem sx={{ ml: 1, mr: 1 }} onClick={handleLogout}>
          <LogoutOutlinedIcon />
          <Typography sx={{ ml: 2 }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>

      </Toolbar>
    </MuiAppBar>
  );
}

Appbar.propTypes = {
  menuList: PropTypes.any,
  greaterthanlg: PropTypes.any,
  mobileOpen: PropTypes.any,
  hoverIndex: PropTypes.any,
  handleDrawerToggle: PropTypes.any,
};
