import { DataGrid } from "@mui/x-data-grid";
import axios from "../../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import EmployeeNameCell from "../Grid Cells/EmployeeProfileCell";
import PropTypes from "prop-types";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useState } from "react";

const InterneeTable = ({ searchTerm }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;
  const navigateTo = (internee) => {
    navigate(`/internee-profile/${internee.id}`);
  };

  const fetchInternees = async ({ queryKey }) => {
    const [, searchTerm] = queryKey;
    const response = await axios.get(
      `/api/internee/get_internees?search=${searchTerm || ""}`
    );
    return response.data;
  };

  const updateInterneeStatus = async (data) => {
    try {
      await axios.put(`/api/internee/update_internee_status/${data.id}`, {
        interneeStatus: data.newStatus,
      });
      toast.success(`Status Updated to ${data.newStatus}`);
    } catch (error) {
      console.error("Error updating internee status:", error.message);
    }
  };

  const {
    data: internees = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["internees", searchTerm],
    queryFn: fetchInternees,
    enabled: true,
  });
  const finalinternees = Array.isArray(internees) ? internees : [];
  const mutation = useMutation({
    mutationFn: updateInterneeStatus,
    onSuccess: () => {
      queryClient.invalidateQueries("employees");
      console.log("Internee status updated successfully!");
      queryClient.invalidateQueries("activeInternees");
      queryClient.invalidateQueries("inactiveInternees");
      queryClient.refetchQueries("activeInternees");
      queryClient.refetchQueries("inactiveInternees");
    },
    onError: (error) => {
      console.error("Error updating internee status:", error.message);
    },
  });

  const interneeColumns = [
    {
      field: "firstName",
      headerName: "Internee",
      width: 300,
      renderCell: ({ row }) => (
        <EmployeeNameCell
          userId={row.internId}
          name={row.firstName}
          src={row?.interneeProImage?.secure_url}
        />
      ),
    },
    { field: "designation", headerName: "Designation", width: 250 },
    { field: "email", headerName: "Email", width: 260 },

    {
      field: "internshipFrom",
      headerName: "Internship From",
      width: 200,
      renderCell: (params) => (
        <Typography variant="inherit">
          {dayjs(params.row.internshipFrom).format("MMMM D, YYYY")}
        </Typography>
      ),
    },
    {
      field: "internshipTo",
      headerName: "Internship To",
      width: 200,
      renderCell: (params) => (
        <Typography variant="inherit">
          {dayjs(params.row.internshipTo).format("MMMM D, YYYY")}
        </Typography>
      ),
    },

    { field: "offered_By", headerName: "Offered by", width: 100 },
  ];

  const statusColumn = {
    field: "interneeStatus",
    headerName: "Status",
    width: 250,
    renderCell: (params) => {
      const { id } = params.row;
      const [status, setStatus] = useState(params.value);
      const handleChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
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
    interneeColumns.splice(3, 0, statusColumn);
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
          Loading Internees...
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
        rows={finalinternees?.map((internee) => ({
          ...internee,
          id: internee._id,
        }))}
        columns={interneeColumns}
        rowsPerPageOptions={[5, 10, 20]}
        // pageSizeOptions= {[5, 10, 20, 50]}
        onRowDoubleClick={navigateTo}
        pagination
        // autoPageSize
        sx={{ cursor: "pointer" }}
      />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

InterneeTable.propTypes = {
  searchTerm: PropTypes.any,
};
export default InterneeTable;
