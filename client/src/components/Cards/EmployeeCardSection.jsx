import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import BlockIcon from "@mui/icons-material/Block";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import GroupsIcon from "@mui/icons-material/Groups";
import { format } from "date-fns";
import GroupIcon from "@mui/icons-material/Group";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const EmployeeCardSection = () => {
  const formattedDate = format(new Date(), "MMMM dd, yyyy");
  return (
    <>
      <Box mb={1} width={"100%"}>
        <Box width={"100%"}>
          <Typography
            variant="body1"
            textAlign={"end"}
            sx={{ fontWeight: "500" }}
          >
            {formattedDate}
          </Typography>
        </Box>
      </Box>
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
                <GroupsIcon sx={{ fontSize: "3.2rem", color: "#01204E" }} />
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
                Employees
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
                92
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
                <GroupIcon sx={{ fontSize: "3.2rem", color: "#41B06E" }} />
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
                Internees
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
                45
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
                <BurstModeIcon sx={{ fontSize: "3.2rem", color: "#481E14" }} />
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
                Portfolios
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
                57
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
                <PersonSearchIcon
                  sx={{ fontSize: "3.2rem", color: "#E8751A" }}
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
                Interview Evaluations
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
                85
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeCardSection;
