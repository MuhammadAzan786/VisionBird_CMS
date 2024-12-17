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

const AppearedEvaluations = ({ searchTerm }) => {
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
      .get(`/api/interview/appeared_evaluations?search=${searchTerm || ""}`)
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
      field: "interviewRating",
      headerName: "Interview Rating",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Rating
            name={`rating-${params.row.id}`}
            value={params.value}
            readOnly
          />
          <Rating
            name={`rating-${params.row.id}`}
            value={params.value}
            readOnly
          />
        </Box>
      ),
    },
    {
      field: "testRating",
      headerName: "Test Rating",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Rating
            name={`rating-${params.row.id}`}
            value={params.value}
            readOnly
          />
          <Rating
            name={`rating-${params.row.id}`}
            value={params.value}
            readOnly
          />
        </Box>
      ),
    },
    {
      field: "overallRating",
      headerName: "Overall Rating",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Rating
            name={`rating-${params.row.id}`}
            value={params.value}
            readOnly
          />
          <Rating
            name={`rating-${params.row.id}`}
            value={params.value}
            readOnly
          />
        </Box>
      ),
    },
    {
      field: "expectedSalary",
      headerName: "Expected Salary",
      width: 200,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.95rem",
            fontWeight: "600",
            color: "#4d4d4d",
            display: "flex",
            alignItems: "center",
          }}
        >
          Rs:{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "decimal",
            maximumFractionDigits: 0,
          }).format(params.value)}
        </Typography>
      ),
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

const ResponseCell = (props) => {
  const { id, field, value } = props;
  const apiRef = useGridApiContext();
  const [option, setOption] = useState(value);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = async (event) => {
    const response = event.target.value;
    setOpen(false);
    const rowId = apiRef.current.getCellParams(id, field).id;
    try {
      const res = await axios.post(
        `/api/interview/update_interview_record/${rowId}`,
        {
          response,
        }
      );
      setOption(res.data.response);
      toast.success(res.data.msg);
    } catch (error) {
      setOption(option);
      CheckAxiosError(error, "ERROR RESPONSE UPDATE REQUEST");
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
    </Box>
  );
};

ResponseCell.propTypes = {
  id: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.string,
};

export default AppearedEvaluations;
