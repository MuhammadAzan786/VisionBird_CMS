import { Box, FormHelperText, Paper, Tab } from "@mui/material";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import InterneeTable from "../../components/Tables/InterneeTable";
import { useSelector } from "react-redux";
import CreateInternee from "./CreateInternee";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ActiveInterneesTable from "./ActiveInterneesTable";
import InActiveInterneesTable from "./InActiveInterneesTable";

const ManageInternees = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [tabValue, setTabValue] = useState("all_internees");
  const role = currentUser.role;

  const [searchTerm, setSearchTerm] = useState("");

  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Paper sx={{ padding: "40px" }}>
        <TabContext value={tabValue}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            <TabList onChange={handleTabValue}>
              <Tab
                label="All internees"
                icon={<GroupIcon />}
                value="all_internees"
                sx={{ letterSpacing: 1 }}
              />
              <Tab
                label="Present internees"
                icon={<CheckCircleOutlineIcon />}
                value="present_internees"
                sx={{ letterSpacing: 1 }}
              />
              <Tab
                label="Past internees"
                icon={<HistoryIcon />}
                value="past_internees"
                sx={{ letterSpacing: 1 }}
              />
            </TabList>
          </Box>

          {/* Tab panels */}
          <TabPanel value="all_internees" sx={{ p: 0 }}>
            {" "}
            <Box
              sx={{
                display: "flex",
                // alignItems: "center",
                justifyContent: "space-between",
                marginY: 2,
              }}
            >
              <Box sx={{ width: "50%" }}>
                {/* Search bar */}

                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                    },
                  }}
                />
                <FormHelperText sx={{ marginTop: 1, color: "text.secondary" }}>
                  Search by Internee Name or Internee Id (XXX-XXX).
                </FormHelperText>
              </Box>

              <Box sx={{ width: "50%", textAlign: "end" }}>
                {role === "admin" && <CreateInternee />}
              </Box>
            </Box>
            <InterneeTable searchTerm={searchTerm} />
          </TabPanel>
          <TabPanel value="present_internees" sx={{ p: 0 }}>
            <Box>
              <Box sx={{ width: "50%", my: 2 }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                    },
                  }}
                />
                <FormHelperText sx={{ marginTop: 1, color: "text.secondary" }}>
                  Search by Internee Name or Internee Id (XXX-XXX).
                </FormHelperText>
              </Box>
              <ActiveInterneesTable searchTerm={searchTerm} />
            </Box>
          </TabPanel>
          <TabPanel value="past_internees" sx={{ p: 0 }}>
            <Box>
              <Box sx={{ width: "50%", my: 2 }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                    },
                  }}
                />
                <FormHelperText sx={{ marginTop: 1, color: "text.secondary" }}>
                  Search by Internee Name or Internee Id (XXX-XXX).
                </FormHelperText>
              </Box>

              {/* <InActiveEmployeesTable searchTerm={searchTerm} /> */}
              <InActiveInterneesTable searchTerm={searchTerm} />
            </Box>
          </TabPanel>
        </TabContext>
      </Paper>
    </>
  );
};

export default ManageInternees;
