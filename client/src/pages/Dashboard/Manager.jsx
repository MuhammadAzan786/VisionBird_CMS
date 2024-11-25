import React from "react";
import Typography from "@mui/material/Typography";
import EmployeesTable from "../../components/Tables/EmployeesTable";
import InterneeTable from "../../components/Tables/InterneeTable";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  TextField,
  Grid,
  IconButton,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Box,
  Button,
  Paper,
  Tab,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useState } from "react";
import axios from "../../utils/axiosInterceptor";

const Manager = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("1");
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState({
    name: true,
    email: true,
    designation: true,
    role: true,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchEmployees = async () => {
    await axios
      .get("/api/employee/all_employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  };

  const openFilterMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeFilterMenu = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFieldFilterChange = (field) => {
    setFilterField((prevField) => ({
      ...prevField,
      [field]: !prevField[field],
    }));
  };

  return (
    <Box>
      <Box
        component={Paper}
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          boxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          borderRadius: "10px",
        }}
      >
        <Box sx={{ width: "100%", typography: "body1" }}>
          <Box sx={{ display: "flex", alignItems: "center", marginY: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "100%" }}
              />
              <IconButton onClick={openFilterMenu}>
                <FilterList sx={{ color: "#666CFF" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeFilterMenu}
              >
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterField.name}
                        onChange={() => handleFieldFilterChange("name")}
                      />
                    }
                    label="Name"
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterField.email}
                        onChange={() => handleFieldFilterChange("email")}
                      />
                    }
                    label="Email"
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterField.designation}
                        onChange={() => handleFieldFilterChange("designation")}
                      />
                    }
                    label="Designation"
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterField.role}
                        onChange={() => handleFieldFilterChange("role")}
                      />
                    }
                    label="Role"
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <EmployeesTable />
        </Box>
      </Box>

      <Box
        component={Paper}
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          mt: 3,
          boxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          borderRadius: "10px",
        }}
      >
        <Box sx={{ width: "100%", typography: "body1" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginY: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "100%" }}
              />
              <IconButton onClick={openFilterMenu}>
                <FilterList sx={{ color: "#666CFF" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeFilterMenu}
              >
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterField.name}
                        onChange={() => handleFieldFilterChange("name")}
                      />
                    }
                    label="Name"
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterField.email}
                        onChange={() => handleFieldFilterChange("email")}
                      />
                    }
                    label="Email"
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterField.designation}
                        onChange={() => handleFieldFilterChange("designation")}
                      />
                    }
                    label="Designation"
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterField.role}
                        onChange={() => handleFieldFilterChange("role")}
                      />
                    }
                    label="Role"
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <InterneeTable />
        </Box>
      </Box>
    </Box>
  );
};

export default Manager;
