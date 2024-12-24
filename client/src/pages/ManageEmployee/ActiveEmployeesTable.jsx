import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeNameCell from "../../components/Grid Cells/EmployeeProfileCell";
import { CustomChip } from "../../components/Styled/CustomChip";
import { WordCaptitalize } from "../../utils/common";

const ActiveEmployeesTable = ({ searchTerm }) => {
  const navigate = useNavigate();
  const navigateTo = (employee) => {
    navigate(`/employee-profile/${employee.id}`);
  };

  const fetchEmployees = async ({ queryKey }) => {
    const [, searchTerm] = queryKey;
    const response = await axios.get(`/api/employee/get_active_employees?search=${searchTerm || ""}`);
    return response.data;
  };
  const {
    data: employees = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["activeEmployees", searchTerm],
    queryFn: fetchEmployees,
    enabled: true,
  });
  const finalemployees = Array.isArray(employees) ? employees : [];
  const employeeColumns = [
    {
      field: "employeeName",
      headerName: "Employee",
      flex: 1,
      renderCell: ({ row }) => (
        <EmployeeNameCell src={row.employeeProImage?.secure_url} userId={row.employeeID} name={row.employeeName} />
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
      renderCell: (params) => <CustomChip label={WordCaptitalize(params.value)} size="small" status={params.value} />,
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
      rows={finalemployees?.map((employee) => ({
        ...employee,
        id: employee._id,
      }))}
      columns={employeeColumns}
      onRowDoubleClick={navigateTo}
      pagination
      sx={{
        cursor: "pointer",
      }}
      disableRowSelectionOnClick
    />
  );
};

export default ActiveEmployeesTable;
