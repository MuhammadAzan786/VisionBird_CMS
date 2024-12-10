import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Alert, Box, CircularProgress, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInterceptor";
import { WordCaptitalize } from "../../utils/common";
import EmployeeNameCell from "../Grid Cells/EmployeeProfileCell";
import { CustomChip } from "../Styled/CustomChip";

const EmployeesTable = ({ searchTerm }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;
  const navigateTo = (employee) => {
    navigate(`/employee-profile/${employee.id}`);
  };

  const fetchEmployees = async ({ queryKey }) => {
    const [, searchTerm] = queryKey;
    const response = await axios.get(`/api/employee/get_managers_employees?search=${searchTerm || ""}`);
    return response.data;
  };

  const updateEmployeeStatus = async (data) => {
    try {
      await axios.put(`/api/employee/update_employee_status/${data.id}`, {
        employeeStatus: data.newStatus,
      });
      toast.success(`Status Updated to ${data.newStatus}`);
    } catch (error) {
      console.error("Error updating employee status:", error.message);
    }
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
  const finalemployees = Array.isArray(employees) ? employees : [];
  const mutation = useMutation({
    mutationFn: updateEmployeeStatus, // Pass the mutation function
    onSuccess: () => {
      console.log("Employee status updated successfully!");
      queryClient.invalidateQueries("activeEmployees");
      queryClient.invalidateQueries("inactiveEmployees");
      queryClient.refetchQueries("activeEmployees");
      queryClient.refetchQueries("inactiveEmployees");
    },
    onError: (error) => {
      console.error("Error updating employee status:", error.message);
    },
  });

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

  const employeeStatus = {
    field: "employeeStatus",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      const { id } = params.row;
      // console.log("idddd", id);
      const [status, setStatus] = React.useState(params.value);
      // console.log(status);
      const handleChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        // Trigger the mutation to update the status
        const data = { id, newStatus };
        mutation.mutate(data);
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
          <MenuItem value="active">
            <Box display="flex" alignItems="center">
              <RadioButtonCheckedIcon sx={{ color: "green", marginRight: 1 }} />
              Active
            </Box>
          </MenuItem>
          <MenuItem value="inactive">
            <Box display="flex" alignItems="center">
              <RadioButtonCheckedIcon sx={{ color: "red", marginRight: 1 }} />
              Inactive
            </Box>
          </MenuItem>
        </Select>
      );
    },
  };

  if (role === "admin") {
    employeeColumns.splice(3, 0, employeeStatus);
  }

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
    <>
      <DataGrid
        rows={finalemployees?.map((employee) => ({
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
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

EmployeesTable.propTypes = {
  searchTerm: PropTypes.any,
};

export default EmployeesTable;
