import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, FormHelperText, Paper, Tab, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import EmployeesTable from "../../components/Tables/EmployeesTable";
import ActiveEmployeesTable from "./ActiveEmployeesTable";
import CreateEmployee from "./CreateEmployee";
import InActiveEmployeesTable from "./InActiveEmployeesTable";

const ManageEmployees = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [tabValue, setTabValue] = useState("all_employees");
  const role = currentUser.role;

  const [searchTerm, setSearchTerm] = useState("");

  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
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
            <Tab label="All Employees" icon={<GroupIcon />} value="all_employees" sx={{ letterSpacing: 1 }} />
            <Tab
              label="Present Employees"
              icon={<CheckCircleOutlineIcon />}
              value="present_employees"
              sx={{ letterSpacing: 1 }}
            />
            <Tab label="Past Employees" icon={<HistoryIcon />} value="past_employees" sx={{ letterSpacing: 1 }} />
          </TabList>
        </Box>

        {/* Tab panels */}
        <TabPanel value="all_employees" sx={{ p: 0 }}>
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
                Search by Employee Name or Employee Id (XXX-XXX).
              </FormHelperText>
            </Box>

            <Box sx={{ width: "50%", textAlign: "end" }}>{role === "admin" && <CreateEmployee />}</Box>
          </Box>
          <EmployeesTable searchTerm={searchTerm} />
        </TabPanel>

        <TabPanel value="present_employees" sx={{ p: 0 }}>
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
                Search by Employee Name or Employee Id (XXX-XXX).
              </FormHelperText>
            </Box>
            <ActiveEmployeesTable searchTerm={searchTerm} />
          </Box>
        </TabPanel>
        <TabPanel value="past_employees" sx={{ p: 0 }}>
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
                Search by Employee Name or Employee Id (XXX-XXX).
              </FormHelperText>
            </Box>

            <InActiveEmployeesTable searchTerm={searchTerm} />
          </Box>
        </TabPanel>
      </TabContext>
    </Paper>
  );
};

export default ManageEmployees;
