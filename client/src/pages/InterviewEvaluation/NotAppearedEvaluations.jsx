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
} from "@mui/material";
import EmployeeNameCell from "../../components/Grid Cells/EmployeeProfileCell";
import { truncateText } from "../../utils/common";

const NotAppearedEvaluations = ({ searchTerm }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  console.log("data", data);
  const [loading, setLoading] = useState(false);
  const navigateTo = (data) => {
    navigate(`/evaluation-page/${data.id}`);
  };
  const fetchData = async () => {
    console.log("we are in the function");
    await axios
      .get(`/api/interview/not_appeared_evaluations?search=${searchTerm || ""}`)
      .then((response) => {
        setData(response.data.interviewData);
      })
      .catch((error) => {
        console.log("error fetching evaluations :", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const evaluation = [
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
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
      renderCell: (params) => {
        if (!params.value) {
          return (
            <Button
              variant="contained"
              onClick={() => handleModalChange(params.row)}
            >
              Add Remarks
            </Button>
          );
        }
        const truncatevalue = truncateText(params.value);
        const isValueTruncated = truncatevalue.includes("...");
        return (
          <Typography>
            {truncatevalue}
            {isValueTruncated && (
              <Button
                style={{
                  fontSize: "13px",
                  textTransform: "none",
                  textDecoration: "underline",
                  padding: 0,
                  marginTop: "-2px",
                }}
                onClick={() => handleReadClick(params.row)}
              >
                Read More
              </Button>
            )}
          </Typography>
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
        rows={data}
        columns={evaluation}
        onRowDoubleClick={navigateTo}
        getRowId={(row) => row._id}
      />
    </>
  );
};

export default NotAppearedEvaluations;
