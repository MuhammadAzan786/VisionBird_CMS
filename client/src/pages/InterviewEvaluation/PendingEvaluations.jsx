import { DataGrid, useGridApiContext } from "@mui/x-data-grid";
import axios from "../../../src/utils/axiosInterceptor";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileDownloadTwoToneIcon from "@mui/icons-material/FileDownloadTwoTone";
import WorkIcon from "@mui/icons-material/Work";
import { Close, RadioButtonChecked } from "@mui/icons-material";

import {
  Box,
  IconButton,
  Rating,
  TextField,
  MenuItem,
  Button,
  Typography,
  ListItemIcon,
  ListItemText,
  Chip,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import EmployeeNameCell from "../../components/Grid Cells/EmployeeProfileCell";
import { truncateText } from "../../utils/common";
import AppearedFormDialog from "../../components/AppearedFormDialog";
import RemarksDialog from "../../components/RemarksDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

const PendingEvaluations = ({ searchTerm }) => {
  const navigate = useNavigate();
  const fetchData = async ({ queryKey }) => {
    const [, searchTerm] = queryKey;
    const response = await axios.get(
      `/api/interview/pending_evaluations?search=${searchTerm || ""}`
    );

    return response.data.interviewData;
  };

  const downloadImage = (url) => {
    saveAs(url, url.split("/").pop());
  };

  const navigateTo = (data) => {
    navigate(`/evaluation-page/${data.id}`);
  };

  const {
    data: evaluations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pending_evaluations", searchTerm],
    queryFn: fetchData,
    enabled: true,
  });

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

  const evaluation = [
    {
      field: "cv",
      headerName: "CV",
      renderCell: (params) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
          <a
            onClick={() => downloadImage(params.row.CvUpload)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton
              aria-label="open CV"
              color="primary"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FileDownloadTwoToneIcon
                style={{
                  fontSize: "2.2rem",
                  transform: isHovered ? "rotate(-120deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </IconButton>
          </a>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 250,
      //email is provided instead
      renderCell: (params) => (
        <EmployeeNameCell userId={params.row.email} name={params.value} />
      ),
    },

    {
      field: "contact",
      headerName: "Mobile Number",
      width: 200,
      renderCell: (params) => {
        return (
          <Typography
            sx={{ fontSize: "0.95rem", fontWeight: "500", color: "#4d4d4d" }}
          >
            {params.value}
          </Typography>
        );
      },
    },

    {
      field: "qualification",
      headerName: "Qualification",
      width: 200,
      renderCell: (params) => {
        return (
          <Typography
            sx={{ fontSize: "0.95rem", fontWeight: "500", color: "#4d4d4d" }}
          >
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "workExp",
      headerName: "Experience",
      width: 200,
      renderCell: (params) => {
        if (params.value === "yes") {
          return (
            <Chip
              label="Experienced"
              color="success"
              variant="outlined"
              sx={{ backgroundColor: "#f0f6f0" }}
            />
          );
        } else {
          return (
            <Chip
              label="Fresher"
              color="error"
              variant="outlined"
              sx={{ backgroundColor: "#f5e0df" }}
            />
          );
        }
      },
    },
    {
      field: "applyFor",
      headerName: "Apply for",
      width: 200,
      renderCell: (params) => {
        if (params.value === "Internship") {
          return (
            <Typography
              sx={{ fontSize: "0.95rem", fontWeight: "600", color: "#5a5a5a" }}
            >
              <SchoolIcon style={{ marginRight: 6, color: "#257180" }} />{" "}
              Internship
            </Typography>
          );
        } else {
          return (
            <Typography
              sx={{ fontSize: "0.95rem", fontWeight: "600", color: "#5a5a5a" }}
            >
              {" "}
              <WorkIcon style={{ marginRight: 6, color: "#B17457" }} />
              Permanent
            </Typography>
          );
        }
      },
    },
    {
      field: "internshipType",
      headerName: "Internship Type",
      width: 200,
      renderCell: (params) => {
        if (params.value !== "") {
          return (
            <Typography
              sx={{ fontSize: "0.95rem", fontWeight: "500", color: "#4d4d4d" }}
            >
              {params.value}
            </Typography>
          );
        } else {
          return (
            <Typography sx={{ fontWeight: "800", color: "#4d4d4d" }}>
              ---------
            </Typography>
          );
        }
      },
    },
    {
      field: "appliedOn",
      headerName: "Applied On",
      width: 200,
      renderCell: (params) => {
        const appliedOn = new Date(params.value);
        const formatedDate = appliedOn.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        });
        return (
          <Typography
            sx={{ fontSize: "0.95rem", fontWeight: "500", color: "#4d4d4d" }}
          >
            {formatedDate}
          </Typography>
        );
      },
    },
    {
      field: "interviewCall",
      headerName: "Interview date",
      width: 200,
      renderCell: (params) => {
        const interviewCall = new Date(params.value);
        const interviewDate = interviewCall.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        });
        return (
          <Typography
            sx={{ fontSize: "0.95rem", fontWeight: "500", color: "#4d4d4d" }}
          >
            {interviewDate}
          </Typography>
        );
      },
    },
    {
      field: "interviewTime",
      headerName: "Interview Time",
      width: 200,
      renderCell: (params) => {
        const [hour, minute] = params.value.split(":").map(Number);
        const isPM = hour >= 12;
        const formattedHour = (hour % 12 || 12).toString().padStart(2, "0"); // Ensure the hour has a leading zero if needed
        const suffix = isPM ? "PM" : "AM";

        // Optional: Add a decorative element or icon
        return (
          <div style={{ display: "flex", alignItems: "center", color: "#333" }}>
            <span style={{ marginRight: "4px", fontSize: "1.3rem" }}>🕒</span>{" "}
            {/* Clock icon */}
            <span>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  color: "#4d4d4d",
                }}
              >
                {`${formattedHour}:${minute
                  .toString()
                  .padStart(2, "0")} ${suffix}`}
              </Typography>
            </span>
          </div>
        );
      },
    },
    {
      field: "response",
      headerName: "Response",
      width: 200,
      renderCell: ResponseCell,
    },
    {
      field: "expertiseAndSkills",
      headerName: "Expertise",
      width: 300, // Adjust width as needed
      renderCell: (params) => {
        // Assuming the data is a comma-separated string like "React JS, Node JS"
        const skills = params.value.split(",").map((skill) => skill.trim());

        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              padding: "4px",
              // backgroundColor: "#f5f5f5", // Light background to highlight skills
              borderRadius: "8px", // Rounded corners for aesthetics
            }}
          >
            {skills.map((skill, index) => (
              <div
                key={index}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#f0f0f0", // Neutral background for each skill
                  borderRadius: "4px", // Rounded corners
                  fontSize: "0.875rem", // Font size for readability
                  color: "#333", // Text color
                  fontWeight: "bold",
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataGrid
        sx={{
          cursor: "pointer",
          [`& .MuiDataGrid-cell[data-field='response']:focus, 
          & .MuiDataGrid-cell[data-field='response']:focus-within`]: {
            outline: "none",
          },
        }}
        rows={evaluations}
        columns={evaluation}
        onRowDoubleClick={navigateTo}
        getRowId={(row) => row._id}
      />
      <Toaster />
    </>
  );
};

const ResponseCell = (props) => {
  const { id, field, value } = props;
  const apiRef = useGridApiContext();
  const [option, setOption] = useState(value);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [remarksOpen, setRemarksOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (event) => {
    const response = event.target.value;
    setOpen(false);

    if (response === "appeared") {
      setFormOpen(true); // Open the form dialog for 'Appeared'
    } else if (response === "notAppeared") {
      setRemarksOpen(true); // Open the remarks dialog for 'Not Appeared'
    }
  };

  const updateStatus = async (response, additionalData = {}, id, field) => {
    const rowId = apiRef.current.getCellParams(id, field).id;

    const updatePayload = {
      response,
      ...additionalData,
    };

    try {
      const res = await axios.put(
        `/api/interview/update_record_when_appeared/${rowId}`,
        updatePayload
      );
      toast.success(`Status Updated to ${response}`);
    } catch (error) {
      toast.error("Failed to update status. Please try again later.");
      console.error("Error updating employee status:", error.message);
    }
  };

  const AppearedMutation = useMutation({
    mutationFn: ({ response, additionalData, id, field }) =>
      updateStatus(response, additionalData, id, field),

    onSuccess: () => {
      setFormOpen(false);
      queryClient
        .invalidateQueries({
          queryKey: ["pending_evaluations"],
          exact: false,
        })
        .then(() => {
          console.log("Query invalidation completed successfully.");
        })
        .catch((error) => {
          console.error("Error invalidating queries:", error.message);
        });
    },

    onError: (error) => {
      toast.error("Failed to update status. Please try again later.");
      console.error("Mutation error:", error.message);
      setFormOpen(false);
    },
  });

  const notAppearedUpdateStatus = async (
    response,
    additionalData = {},
    id,
    field
  ) => {
    const rowId = apiRef.current.getCellParams(id, field).id;

    const updatePayload = {
      response,
      expectedSalary: 0,
      testRating: 0,
      interviewRating: 0,
      ...additionalData,
    };

    try {
      const res = await axios.put(
        `/api/interview/update_record_when_appeared/${rowId}`,
        updatePayload
      );
      toast.success(`Status Updated to ${response}`);
    } catch (error) {
      toast.error("Failed to update status. Please try again later.");
      console.error("Error updating employee status:", error.message);
    }
  };

  const notAppearedMutation = useMutation({
    mutationFn: ({ response, additionalData, id, field }) =>
      notAppearedUpdateStatus(response, additionalData, id, field),
    onSuccess: () => {
      setFormOpen(false);
      queryClient
        .invalidateQueries({
          queryKey: ["pending_evaluations"],
          exact: false,
        })
        .then(() => {
          console.log("Query invalidation completed successfully.");
        })
        .catch((error) => {
          console.error("Error invalidating queries:", error.message);
        });
    },

    onError: (error) => {
      toast.error("Failed to update status. Please try again later.");
      console.error("Mutation error:", error.message);
      setFormOpen(false);
    },
  });

  const handleFormSubmit = (response, additionalData) => {
    if (additionalData) {
      AppearedMutation.mutate({ response, additionalData, id, field });
    }
  };

  const handleRemarksSubmit = (response, additionalData) => {
    if (additionalData) {
      notAppearedMutation.mutate({ response, additionalData, id, field });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Select
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        fullWidth
        value={option}
        onChange={handleChange}
        sx={{
          height: "100%",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: "10px",
          },
        }}
      >
        <MenuItem value={"pending"}>
          <ListItemIcon sx={{ minWidth: 0, color: "#FF8C00" }}>
            <RadioButtonChecked />
          </ListItemIcon>
          <ListItemText primary={"Pending"} />
        </MenuItem>

        <MenuItem value={"appeared"}>
          <ListItemIcon sx={{ minWidth: 0, color: "#2E8B57" }}>
            <RadioButtonChecked />
          </ListItemIcon>
          <ListItemText primary={"Appeared"} />
        </MenuItem>

        <MenuItem value={"notAppeared"}>
          <ListItemIcon sx={{ minWidth: 0, color: "#6A5ACD" }}>
            <RadioButtonChecked />
          </ListItemIcon>
          <ListItemText primary={"Not Appeared"} />
        </MenuItem>
      </Select>

      {/* Dialog for additional form fields when 'Appeared' is selected */}
      <AppearedFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(additionalData) =>
          handleFormSubmit("appeared", additionalData)
        }
      />

      {/* Dialog for remarks when 'Not Appeared' is selected */}
      <RemarksDialog
        open={remarksOpen}
        onClose={() => setRemarksOpen(false)}
        onSubmit={(additionalData) =>
          handleRemarksSubmit("notAppeared", additionalData)
        }
      />
    </Box>
  );
};

ResponseCell.propTypes = {
  id: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.string,
};

export default PendingEvaluations;
