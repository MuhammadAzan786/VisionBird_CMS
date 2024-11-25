import { Drawer, Toolbar, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Appbar from "./AppBar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const Sidenav = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const theme = useTheme();
  const greaterthanlg = useMediaQuery(theme.breakpoints.up("lg"));

  const drawerWidth = greaterthanlg
    ? mobileOpen || hoverIndex
      ? 400
      : 65
    : mobileOpen
    ? 290
    : 0;

  const handleMouseEnter = () => {
    setHoverIndex(true);
  };

  const handleMouseLeave = () => {
    setHoverIndex(false);
  };

  const handleDrawerToggle = () => {
    if (!mobileOpen) {
      setMobileOpen(true);
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }

    console.log(!mobileOpen); // Log the opposite of current state
  };

  const handleDrawerClose = () => {
    setMobileOpen((prevState) => !prevState); // Toggle between true and false
  };
  const drawer = (
    <div>
      {currentUser == null && navigate("/login")}

      <Navbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        handleMouseLeave={handleMouseLeave}
        handleMouseEnter={handleMouseEnter}
        hoverIndex={hoverIndex}
        mobileOpen={mobileOpen}
      />
    </div>
  );

  return (
    //MAIN
    <Box
      sx={{
        maxHeight: "100vh",
        maxWidth: "100vw !important",
      }}
    >
      <Appbar
        greaterthanlg={greaterthanlg}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        handleDrawerClose={handleDrawerClose}
        hoverIndex={hoverIndex}
        mobileOpen={mobileOpen}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* ================================ Sidebar  ================================= */}
        <Drawer
          container={
            window !== undefined ? () => window.document.body : undefined
          }
          variant={greaterthanlg ? "permanent" : "temporary"}
          open={(greaterthanlg && hoverIndex) || mobileOpen ? true : false} // Open permanently on large screens, conditionally on mobile
          //onClose= {handleDrawerToggle} // Only handle close on mobile
          onClose={() => setMobileOpen(false)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            width:
              (greaterthanlg && mobileOpen) || hoverIndex ? "314px" : "92px",

            transition: "0.4s ease-in-out !important",
            "& .MuiDrawer-paper": {
              top: greaterthanlg ? "5rem" : "0",
              left: "0",
              border: "none",
              scrollbarWidth: "none",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* ================================ Main Body ================================= */}
        <Box
          sx={{
            width: "100%",
            marginRight: "20px",
            marginLeft: !greaterthanlg && "20px",
            minHeight: "calc(100vh - 5rem)",
            scrollbarWidth: "thin !important",
            overflow: "hidden",
          }}
        >
          <Toolbar
            sx={{
              height: "5rem",
            }}
          />
          <Box
            sx={{
              backgroundColor: "background.default",
              width: "100%",
              borderRadius: "8px 8px 0px 0px",
            }}
          >
            <Stack
              spacing={5}
              sx={{
                padding: 5,
              }}
            >
              {children}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidenav;
