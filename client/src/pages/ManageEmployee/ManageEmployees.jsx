import { useState } from "react";
import { Box, Button, Paper, Tab, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import CreateEmployee from "./CreateEmployee";
import EmployeesTable from "../../components/Tables/EmployeesTable";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import ActiveEmployeesTable from "./ActiveEmployeesTable";
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
            <Tab
              label="All Employees"
              icon={<GroupIcon />}
              value="all_employees"
              sx={{ letterSpacing: 1 }}
            />
            <Tab
              label="Present Employees"
              icon={<CheckCircleOutlineIcon />}
              value="present_employees"
              sx={{ letterSpacing: 1 }}
            />
            <Tab
              label="Past Employees"
              icon={<HistoryIcon />}
              value="past_employees"
              sx={{ letterSpacing: 1 }}
            />
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
            </Box>

            <Box sx={{ width: "50%", textAlign: "end" }}>
              {role === "admin" && <CreateEmployee />}
            </Box>
          </Box>
          <EmployeesTable searchTerm={searchTerm} />
        </TabPanel>

        <TabPanel value="present_employees">
          <ActiveEmployeesTable />
        </TabPanel>
        <TabPanel value="past_employees">
          <InActiveEmployeesTable/>
        </TabPanel>
      </TabContext>
    </Paper>
  );
};

export default ManageEmployees;
