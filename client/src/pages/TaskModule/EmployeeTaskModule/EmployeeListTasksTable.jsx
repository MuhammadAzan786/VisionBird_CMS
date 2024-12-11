import { useState, useEffect } from "react";
import axios from "../../../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Avatar, Box, Chip, Typography, styled } from "@mui/material";

const EmployeeListTasksTable = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  const navigateTo = (employee) => {
    navigate(`/employee-profile/${employee.id}`);
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  const StyledDataGrid = styled(DataGrid)(() => ({
    "& ::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
    },
    "& ::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      boxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
      backgroundColor: "#D3D4DA",
    },
    "& ::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#BEBFC7",
    },
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton sx={{ color: "#00AFEF" }} />
        <GridToolbarFilterButton sx={{ color: "#00AFEF" }} />
        <GridToolbarDensitySelector sx={{ color: "#00AFEF" }} />
        <GridToolbarExport sx={{ color: "#00AFEF" }} />
      </GridToolbarContainer>
    );
  };

  const employeeColumns = [
    {
      field: "employeeName",
      headerName: "Employee",
      // width: 300,
      flex: 1,

      renderCell: (params) => (
        <>
          <Avatar alt={params.row.employeeName} src={params.row.employeeProImage.secure_url} />
          <Box sx={{ ml: 3 }} display="flex" flexDirection="column">
            <Typography
              variant="inherit"
              sx={{
                fontWeight: "500",
                lineHeight: "11px",
                color: "#3b4056",
                fontSize: "0.9rem",
              }}
              display="block"
            >
              {params.row.employeeName}
            </Typography>
            <Typography variant="caption" display="block" sx={{ fontWeight: "500", color: "#767989" }}>
              {params.row.employeeID}
            </Typography>
          </Box>
        </>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      // width: 300,
      flex: 1,
    },
    {
      field: "employeeDesignation",
      headerName: "Designation",
      // width: 250,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      // width: 200,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.role}
          size="small"
          variant="filled"
          sx={{
            color: "blue",
            backgroundColor: "#ebf0fc",
            borderColor: "#E0F7FA",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        "& .MuiDataGrid-columnHeader": {
          // Target the header cells
          backgroundColor: "#00AFEF",
          color: "white",
        },
        height: 563,
        width: "100%",
      }}
    >
      <StyledDataGrid
        rows={employees.map((employee) => ({
          ...employee,
          id: employee._id,
        }))}
        columns={employeeColumns}
        slots={{ toolbar: CustomToolbar }}
        onRowDoubleClick={navigateTo}
        pagination
        autoPageSize
        sx={{ cursor: "pointer" }}
      />
    </Box>
  );
};

export default EmployeeListTasksTable;
