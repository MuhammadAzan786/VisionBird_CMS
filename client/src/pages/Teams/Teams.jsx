import * as React from "react"; 
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, CircularProgress, IconButton, Snackbar, Alert, Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../utils/axiosInterceptor";
import { useState, useEffect } from "react";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/team/teams");
      const teamData = await Promise.all(response.data.map(async (team) => {
        // Fetch team leader details
        const teamLeader = team.teamLeader ? await axios.get(`/api/employee/get_employee/${team.teamLeader._id}`) : null;

        // Fetch team member details
        const teamMembers = await Promise.all(
          team.teamMembers.map(async (member) => {
            const memberDetails = await axios.get(`/api/employee/get_employee/${member._id}`);
            return {
              employeeName: memberDetails.data?.employeeName || "Unknown",
              employeeProImage: memberDetails.data?.employeeProImage?.secure_url || "", // Fetch profile image
              employeeID: memberDetails.data?.employeeID || "Unknown",
            };
          })
        );

        return {
          id: team._id,
          teamName: team.teamName,
          teamLeader: teamLeader ? {
            employeeName: teamLeader.data?.employeeName || "Unknown",
            employeeProImage: teamLeader.data?.employeeProImage?.secure_url || "",
            employeeID: teamLeader.data?.employeeID || "Unknown",
          } : {},
          teamMembers: teamMembers,
          createdAt: new Date(team.createdAt).toLocaleDateString(),
        };
      }));
      setTeams(teamData);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError("Failed to fetch team data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/team/delete-team/${id}`);
      setTeams(prevTeams => prevTeams.filter(team => team.id !== id));
      setToast({ open: true, message: "Team deleted successfully!", severity: "success" });
    } catch (error) {
      setToast({ open: true, message: "Failed to delete team.", severity: "error" });
    }
  };

  // Define columns including the delete action
  const columns = [
    { field: "teamName", headerName: "Team Name", width: 200 },
    {
      field: "teamLeader",
      headerName: "Team Leader",
      width: 300,
      renderCell: (params) => {
        const { employeeProImage, employeeName, employeeID } = params.row.teamLeader || {};
        const imageUrl = employeeProImage || '/path/to/default-image.jpg'; // Use a fallback image here
        
        return (
          <Box display="flex" alignItems="center">
            <Avatar
              src={imageUrl}
              alt={employeeName}
              sx={{ border: "5px solid #F5F5F5", width: 50, height: 50, marginRight: "8px" }}
            />
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="body2" fontWeight={500}>{employeeName}</Typography>
              <Typography variant="caption" color="textSecondary">{employeeID}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "teamMembers",
      headerName: "Team Members",
      width: 300,
      renderCell: (params) => {
        const members = params.row.teamMembers || [];
        return (
          <Box display="flex" flexDirection="column">
            {members.map((member, index) => {
              const { employeeProImage, employeeName, employeeID } = member;
              const imageUrl = employeeProImage || '/path/to/default-image.jpg'; // Fallback for team members

              return (
                <Box key={index} display="flex" alignItems="center" marginBottom="8px">
                  <Avatar
                    src={imageUrl}
                    alt={employeeName}
                    sx={{ border: "5px solid #F5F5F5", width: 30, height: 30, marginRight: "8px" }}
                  />
                  <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography variant="body2" fontWeight={500}>{employeeName}</Typography>
                    <Typography variant="caption" color="textSecondary">{employeeID}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        );
      },
    },
    { field: "createdAt", headerName: "Created At", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    }
  ];

  return (
    <Box sx={{ width: "100%", p: 2, bgcolor: "background.paper" }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={teams.length > 0 ? teams : []} // Always show table with column names
          columns={columns}
          pageSize={5}
          disableRowSelectionOnClick
          pagination={false}
          getRowHeight={() => 'auto'} // Set row height to auto
          noRowsLabel="No rows available"
          sx={{
            height: "auto",
            '& .MuiDataGrid-cell': {
              padding: '12px', 
            },
            '& .MuiDataGrid-row': {
              paddingTop: '8px', 
              paddingBottom: '8px', 

            }
          }}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Teams;
