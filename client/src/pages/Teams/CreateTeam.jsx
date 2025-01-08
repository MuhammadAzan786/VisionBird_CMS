import React, { useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "../../utils/axiosInterceptor";
import Swal from "sweetalert2";

const CreateTeam = () => {
  const searchTerm = "";

  const fetchEmployees = async ({ queryKey }) => {
    const [, searchTerm] = queryKey;
    const response = await axios.get(
      `/api/employee/get_active_employees?search=${searchTerm || ""}`
    );
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
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLeader, setTeamLeader] = useState("");
  const handleAddMember = (member) => {
    if (!teamMembers.find((m) => m._id === member._id)) {
      setTeamMembers((prev) => [...prev, member]);
    }
  };

  const handleRemoveMember = (memberId) => {
    setTeamMembers((prev) => prev.filter((m) => m._id !== memberId));
  };

  const handleTeamLeaderChange = (event) => {
    const newLeader = event.target.value;

    if (teamMembers.length === 0) {
      setTeamLeader(newLeader);
    } else {
      setTeamLeader(newLeader);

      // Filter the team members directly using the new leader ID
      const updatedTeam = teamMembers.filter(
        (person) => person._id !== newLeader
      );
      setTeamMembers(updatedTeam);
    }
  };

  const onSubmit = (data) => {
    if (!teamLeader) {
      return Swal.fire({
        title: "⚠️ Please select a team leader",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Got It",
      });
    }

    if (!teamMembers || teamMembers.length < 2) {
      return Swal.fire({
        title: "⚠️ There must be at least two employees in the team",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Got It",
      });
    }

    const formData = {
      teamName: data.teamName,
      teamLeader: teamLeader,
      teamMembers: teamMembers.map((member) => member._id),
    };

    console.log("Form Data being sent:", formData);

    axios
      .post(`/api/team/create-team`, formData)
      .then((response) => {
        Swal.fire({
          title: "🎉 Team Created Successfully!",
          html: `
            <div style="font-size: 16px; font-weight: 500;">
              Your team <b>${data.teamName}</b> has been created successfully! 🚀
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#4CAF50",
          showConfirmButton: true,
          timer: 3000,
        });

        reset({ teamName: "", teamLeader: "", teamMembers: [] });
        setTeamMembers([]);
        setTeamLeader("");
      })
      .catch((error) => {
        console.error("Error Response:", error.response);

        if (error.response?.data?.conflicts?.length > 0) {
          const conflictMessages = error.response.data.conflicts
            .map(
              (member) =>
                `<li style="margin-bottom: 5px;"><b>${member.employeeName}</b> is already in <b>${member.teamName}</b>.</li>`
            )
            .join("");

          Swal.fire({
            title: "⚠️ Employees Already in Other Teams!",
            html: `
              <div style="text-align: left; font-size: 16px;">
                The following employees are already assigned to other teams:
                <ul style="margin-top: 10px; text-align: left; list-style: none; padding: 0;">
                  ${conflictMessages}
                </ul>
              </div>
            `,
            icon: "warning",
            confirmButtonColor: "#d33",
            confirmButtonText: "Got It",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while creating the team!",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      });
  };

  const filteredEmployees = employees.filter((emp) => emp._id !== teamLeader);

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
    <Box fullWidth sx={{ height: "100%", alignContent: "center" }}>
      <Box
        sx={{
          padding: 4,
          borderRadius: "10px",
          width: "100%",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Grid item xs={12}>
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "20px",
              color: "#3b4056",
              mb: 1,
            }}
          >
            Create Team
          </Typography>
          <hr style={{ marginBottom: "20px" }} />
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                // required
                label="Team Name"
                {...register("teamName", { required: true })}
                error={!!errors.teamName}
                helperText={errors.teamName && "Team name is required"}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Team Leader</InputLabel>
                <Select
                  value={teamLeader}
                  onChange={handleTeamLeaderChange}
                  label="Team Leader"
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      {employee.employeeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" marginBottom={1}>
                Select Team Members
              </Typography>
              {teamLeader ? (
                <Grid container spacing={2}>
                  {filteredEmployees.map((employee) => (
                    <Grid item xs={12} sm={6} md={4} key={employee._id}>
                      <Paper
                        elevation={2}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          ":hover": { transform: "scale(1.05)" },
                        }}
                        onClick={() => handleAddMember(employee)}
                      >
                        <Avatar
                          src={employee.employeeProImage.secure_url}
                          alt={employee.employeeName}
                          sx={{ marginRight: 2 }}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {employee.employeeName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {employee.email}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="error">
                  Please select a team leader to enable member selection.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              {teamMembers.length > 0 ? (
                <>
                  <Typography variant="subtitle1" marginBottom={1}>
                    Team Members
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {teamMembers.map((member) => (
                      <Chip
                        key={member._id}
                        avatar={
                          <Avatar src={member.employeeProImage.secure_url} />
                        }
                        label={member.employeeName}
                        onDelete={() => handleRemoveMember(member._id)}
                      />
                    ))}
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {""}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default CreateTeam;
