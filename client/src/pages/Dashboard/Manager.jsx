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
    <>
      <Paper>
        <EmployeesTable />
      </Paper>

      <Paper>
        <InterneeTable />
      </Paper>
    </>
  );
};

export default Manager;
