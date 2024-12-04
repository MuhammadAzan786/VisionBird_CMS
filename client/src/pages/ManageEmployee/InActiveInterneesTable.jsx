import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomChip } from "../../components/Styled/CustomChip";
import { WordCaptitalize } from "../../utils/common";
import EmployeeNameCell from "../../components/Grid Cells/EmployeeProfileCell";
import dayjs from "dayjs";

const InActiveInterneesTable = ({ searchTerm }) => {
  const navigate = useNavigate();
  const navigateTo = (internee) => {
    navigate(`/internee-profile/${internee.id}`);
  };

  const fetchInternees = async ({ queryKey }) => {
    const [, searchTerm] = queryKey;
    const response = await axios.get(
      `/api/internee/get_inactive_internees?search=${searchTerm || ""}`
    );
    return response.data;
  };

  const {
    data: internees = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["inactiveInternees", searchTerm],
    queryFn: fetchInternees,
    enabled: true,
  });
  const finalinternees = Array.isArray(internees) ? internees : [];
  const interneeColumns = [
    {
      field: "firstName",
      headerName: "Internee",
      width: 300,
      // src={row.interneeProImage} fix internee image issue, image is not uploading
      renderCell: ({ row }) => (
        <EmployeeNameCell userId={row.internId} name={row.firstName} />
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
    {
      field: "givenOn",
      headerName: "Given On",
      width: 300,
      renderCell: (params) => (
        <Typography variant="inherit">
          {dayjs(params.row.givenOn).format("dddd, MMMM D, YYYY")}
        </Typography>
      ),
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
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        onRowDoubleClick={navigateTo}
        pagination
        autoPageSize
        sx={{ cursor: "pointer" }}
      />
    </>
  );
};

export default InActiveInterneesTable;
