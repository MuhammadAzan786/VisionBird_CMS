import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { CustomChip } from "../Styled/CustomChip";
import { WordCaptitalize } from "../../utils/common";
import EmployeeNameCell from "../Grid Cells/EmployeeProfileCell";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

const EmployeesTable = ({ searchTerm }) => {
  const navigate = useNavigate();
  const navigateTo = (employee) => {
    navigate(`/employee-profile/${employee.id}`);
  };

  const fetchEmployees = async ({ queryKey }) => {
    const [, searchTerm] = queryKey;
    const response = await axios.get(
      `/api/employee/get_managers_employees?search=${searchTerm || ""}`
    );
    return response.data;
  };

  const {
    data: employees = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees", searchTerm],
    queryFn: fetchEmployees,
    enabled: true,
  });

  const handleStatusUpdate = async (id, newStatus, setRows) => {
    try {
      // Update the status in your database
      await axios.put(`/api/employees/${id}`, { status: newStatus });

      // Update the rows locally to reflect the change
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, employeeStatus: newStatus } : row
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error updating status.");
    }
  };

  const employeeColumns = [
    {
      field: "employeeName",
      headerName: "Employee",
      flex: 1,
      renderCell: ({ row }) => (
        <EmployeeNameCell
          src={row.employeeProImage}
          userId={row.employeeID}
          name={row.employeeName}
        />
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "employeeDesignation",
      headerName: "Designation",
      flex: 1,
    },
    {
      field: "qualification",
      headerName: "Qualification",
      flex: 1,
    },

    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <CustomChip
          label={WordCaptitalize(params.value)}
          size="small"
          status={params.value}
        />
      ),
    },
    {
      field: "employeeStatus",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const { id } = params.row;
        const [status, setStatus] = React.useState(params.value);
        console.log(status);
        const handleChange = async (event) => {
          const newStatus = event.target.value;
          setStatus(newStatus);
          await handleStatusUpdate(id, newStatus, params.api.setRows); // API call
        };

        return (
          <Select
            value={status}
            onChange={handleChange}
            size="small"
            variant="outlined"
            sx={{
              minWidth: 120,
              backgroundColor: "white",
              borderRadius: 1,
            }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="h6" color="text.secondary">
          Loading Employees...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          padding: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400, textAlign: "center" }}>
          <Typography variant="h6">Error</Typography>
          <Typography>{error.message}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <DataGrid
      rows={employees.map((employee) => ({
        ...employee,
        id: employee._id,
      }))}
      columns={employeeColumns}
      onRowDoubleClick={navigateTo}
      pagination
      autoPageSize
      sx={{
        cursor: "pointer",
      }}
      disableRowSelectionOnClick
    />
  );
};

EmployeesTable.propTypes = {
  searchTerm: PropTypes.any,
};

export default EmployeesTable;
