import { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import CreateEmployee from "./CreateEmployee";
import CreateInternee from "./CreateInternee";
import EmployeesTable from "../../components/Tables/EmployeesTable";
import InterneeTable from "../../components/Tables/InterneeTable";

const ManageEmployees = () => {
  const [value, setValue] = useState("1");
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Paper sx={{ padding: "40px" }}>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          variant="fullWidth"
          aria-label="lab API tabs example"
          sx={{ marginBottom: "30px" }}
        >
          <Tab
            component={Button}
            onClick={() => setValue("1")}
            label="Employees"
            value="1"
          />
          <Tab onClick={() => setValue("2")} label="Internees" value="2" />
        </TabList>

        <TabPanel value="1" sx={{ padding: 0 }}>
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

        <TabPanel value="2" sx={{ padding: 0 }}>
          <Box
            sx={{
              display: "flex",
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
              />
            </Box>

            <Box sx={{ width: "50%", textAlign: "end" }}>
              {role === "admin" && <CreateInternee />}
            </Box>
          </Box>
          <InterneeTable searchTerm={searchTerm} />
        </TabPanel>
      </TabContext>
    </Paper>
  );
};

export default ManageEmployees;
