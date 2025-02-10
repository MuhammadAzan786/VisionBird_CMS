import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import BlockIcon from "@mui/icons-material/Block";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { format } from "date-fns";

const EmployeeTaskHeader = () => {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#dee0e2",
              borderRadius: "3px",
            }}
            py={1}
            px={2}
          >
            <Box sx={{ height: "100%" }}>
              <Box
                sx={{
                  height: "100%",
                  padding: "4px",
                  backgroundColor: "#f1f1f2",
                  borderRadius: "5px",
                }}
              >
                <AssignmentTurnedInIcon
                  sx={{ fontSize: "3.2rem", color: "#FF6500" }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                textAlign: "end",
                minWidth: 0,
                ml: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "700",
                  color: "#181818",
                  fontSize: { xs: "1.2rem", md: "1rem", lg: "1rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block", // Ensure display block
                }}
              >
                Assigned Tasks
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "700",
                  textAlign: "end",
                  color: "#3f454c",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block", // Ensure display block
                }}
              >
                94
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#dee0e2",
              borderRadius: "3px",
            }}
            py={1}
            px={2}
          >
            <Box sx={{ height: "100%" }}>
              <Box
                sx={{
                  height: "100%",
                  padding: "4px",
                  backgroundColor: "#f1f1f2",
                  borderRadius: "5px",
                }}
              >
                <TrendingUpIcon sx={{ fontSize: "3.2rem", color: "#A91D3A" }} />
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                textAlign: "end",
                minWidth: 0,
                ml: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "700",
                  color: "#181818",
                  fontSize: { xs: "1.2rem", md: "1rem", lg: "1rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block", // Ensure display block
                }}
              >
                In Progress Tasks
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "700",
                  textAlign: "end",
                  color: "#3f454c",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block", // Ensure display block
                }}
              >
                56
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#dee0e2",
              borderRadius: "3px",
            }}
            py={1}
            px={2}
          >
            <Box sx={{ height: "100%" }}>
              <Box
                sx={{
                  height: "100%",
                  padding: "4px",
                  backgroundColor: "#f1f1f2",
                  borderRadius: "5px",
                }}
              >
                <DonutLargeIcon sx={{ fontSize: "3.2rem", color: "#0E46A3" }} />
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                textAlign: "end",
                minWidth: 0,
                ml: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "700",
                  color: "#181818",
                  fontSize: { xs: "1.2rem", md: "1rem", lg: "1rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block", // Ensure display block
                }}
              >
                Completed Tasks
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "700",
                  textAlign: "end",
                  color: "#3f454c",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block", // Ensure display block
                }}
              >
                87
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#dee0e2",
              borderRadius: "3px",
            }}
            py={1}
            px={2}
          >
            <Box sx={{ height: "100%" }}>
              <Box
                sx={{
                  height: "100%",
                  padding: "4px",
                  backgroundColor: "#f1f1f2",
                  borderRadius: "5px",
                }}
              >
                <BlockIcon sx={{ fontSize: "3.2rem", color: "#B80000" }} />
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                textAlign: "end",
                minWidth: 0,
                ml: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "700",
                  color: "#181818",
                  fontSize: { xs: "1.2rem", md: "1rem", lg: "1rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block", // Ensure display block
                }}
              >
                Late Tasks
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "700",
                  textAlign: "end",
                  color: "#3f454c",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block", // Ensure display block
                }}
              >
                32
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeTaskHeader;