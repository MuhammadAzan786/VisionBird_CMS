import { Box, Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText, styled } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { ExpandMore } from "@mui/icons-material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { palette } from "../theme/colors";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import vbtLogo from "/vbt-logo.png";

const DynamicMenu = ({ menuList, greaterthanlg, mobileOpen, hoverIndex, handleDrawerToggle }) => {
  const [openStates, setOpenStates] = useState({});
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Function for making menu links active
  const isActive = (menuItemPath) => {
    return (
      (pathname === "/" && menuItemPath === "/") || pathname === menuItemPath || pathname.startsWith(`${menuItemPath}/`)
    );
  };

  // storing labels as boolean for opening closing menuLinks
  const handleToggle = (label) => {
    setOpenStates((prev) => ({
      [label]: !prev[label],
    }));
  };

  return (
    <CustomList
      sx={{
        marginLeft: 1.5,
        marginTop: 2.2,
        marginRight: !greaterthanlg && "10px",
        overflow: "visible",
        height: "200% !important",
        scrollbarWidth: "none",
        display: "flex",
        flexDirection: "column",
        width: !greaterthanlg ? 290 : greaterthanlg ? (mobileOpen || hoverIndex ? 290 : 68) : mobileOpen ? 290 : 0,
        transition: "0.4s ease-in-out !important",
      }}
    >
      {/* Logo to be Added Start */}

      <Box
        display={"flex"}
        alignItems={"center"}
        sx={{
          display: greaterthanlg && "none",
          transition: "0.3s ease-in-out !important",
        }}
      >
        <Box
          className="h-12  mb-4  flex items-center content-center"
          sx={{
            maxWidth: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "0.3s ease-in-out !important",
            paddingX: "8px",
          }}
        >
          <img className="w-40 mt-1" src={vbtLogo} alt="logo" />

          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: "25% !important",
              color: palette.primary.main,
              background: palette.primary.light,
              transition: "0.5s ease-in-out !important",
              "&:hover": {
                color: "white",
                backgroundColor: "#005878",
              },
            }}
          >
            {mobileOpen ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
          </IconButton>
        </Box>
      </Box>
      {/* Logo to be Added End */}
      <Box
        sx={{
          transition: "0.5s ease-in-out !important",
          borderRight: "none",
        }}
      >
        {menuList.map((menuItem, index) => {
          return (
            <React.Fragment key={index}>
              {!menuItem.collapsable ? (
                <CustomListItemButton
                  selected={isActive(menuItem.path)}
                  onClick={() => {
                    navigate(menuItem.path);
                  }}
                >
                  <CustomListItemIcon>{menuItem.icon}</CustomListItemIcon>
                  <ListItemText
                    primary={menuItem.label}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  />
                </CustomListItemButton>
              ) : (
                <>
                  <CustomListItemButton
                    onClick={() => handleToggle(menuItem.label)}
                    selected={isActive(menuItem.path) || menuItem.children.some((child) => isActive(child.path))}
                  >
                    <CustomListItemIcon>{menuItem.icon}</CustomListItemIcon>
                    <ListItemText
                      primary={menuItem.label}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    />
                    <ExpandMore
                      sx={[
                        {
                          mr: -1,
                          opacity: 1,
                          transition: "0.4s ease-in-out",
                        },
                        openStates[menuItem.label]
                          ? {
                              transform: "rotate(-90deg)",
                            }
                          : {
                              transform: "rotate(0)",
                            },
                      ]}
                    />
                  </CustomListItemButton>

                  {/* ==========================colappse================= */}
                  <Collapse in={!!openStates[menuItem.label]}>
                    {menuItem.children.map((menuChild, index) => {
                      return (
                        <CustomListItemButton
                          sx={{
                            ml: 2,
                            height: "40px",
                            "&.Mui-selected": {
                              background: palette.primary.light,
                              borderRadius: ".5rem",
                              boxShadow: "0 .125rem .375rem 0 rgba(38,43,67,.14)",
                              "& .MuiListItemIcon-root": {
                                color: palette.primary.main,
                              },
                              "&:hover": {
                                background: palette.primary.light,
                              },
                              "& .MuiTypography-root": {
                                color: palette.primary.main,
                              },
                            },
                            display: (greaterthanlg && hoverIndex) || (!mobileOpen && "none"),
                          }}
                          key={index}
                          onClick={() => navigate(menuChild.path)}
                          selected={isActive(menuChild.path)}
                        >
                          <CustomListItemIcon>
                            <CircleIcon sx={{ fontSize: ".6rem" }} />
                          </CustomListItemIcon>
                          <ListItemText
                            primary={menuChild.label}
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                          />
                        </CustomListItemButton>
                      );
                    })}
                  </Collapse>
                </>
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </CustomList>
  );
};

const CustomListItemButton = styled(ListItemButton)({
  paddingLeft: 15,
  margin: 8,
  color: "#727689",

  "& .MuiTypography-root": {
    fontSize: "0.9375rem",
    fontWeight: 500,
    color: "#3b4056",
    letterSpacing: "0.15px",
  },

  "&.Mui-selected": {
    background: palette.primary.main,
    borderRadius: ".5rem",
    color: "#fff",
    boxShadow: "0 .125rem .375rem 0 rgba(38,43,67,.14)",
    "& .MuiListItemIcon-root": {
      color: "white",
    },
    "&:hover": {
      background: palette.primary.main,
    },
    "& .MuiTypography-root": {
      color: "#fff",
    },
  },
  "&:hover": {
    background: palette.primary.light,
    color: palette.primary.main,
    borderRadius: ".5rem",
  },
});

const CustomListItemIcon = styled(ListItemIcon)({
  marginRight: "18px",
  minWidth: "32px",
  color: "#33363D",
});

const CustomList = styled(List)(({ theme }) => ({
  paddingX: theme.spacing(3),
  maxHeight: "85vh", // Set a max height to enable scrolling
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
    scrollbarWidth: "none",
  },

  "&:MuiPaper-root ": {
    scrollbarWidth: "none",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: ".5rem",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#D3D4DA", // Scrollbar thumb color
    borderRadius: ".5rem",
    border: "2px solid #f1f1f1",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#BEBFC7", // Scrollbar thumb hover color
  },
}));

DynamicMenu.propTypes = {
  menuList: PropTypes.any,
  greaterthanlg: PropTypes.any,
  mobileOpen: PropTypes.any,
  hoverIndex: PropTypes.any,
  handleDrawerToggle: PropTypes.any,
};

export default DynamicMenu;
