import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Switch, Rating } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { addHighlightedDate } from "../../redux/ReportDatesSlice";
import axios from "../../utils/axiosInterceptor"; 
import { useDispatch } from "react-redux";

// Dummy employee data (replace with actual data from API)

const ReportForm = ({ selectedDate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [allReportsFilled, setAllReportsFilled] = useState(false);
  const [employees, setEmployees] = useState([]);
  // Convert selectedDate to a Date object
  const date = new Date(selectedDate);
  // Format the date
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      await axios
        .get("/api/employee/get_only_employee")
        .then((response) => {
          setEmployees(response.data);
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
        });
    };
    fetchEmployees();
  }, []);

  // Initialize employee rows with rating and leave fields
  useEffect(() => {
    if (employees && employees.length > 0) {
      const initialRows = employees.map((employee) => ({
        employee_id: employee._id,
        employee_name: employee.employeeName,
        evaluation_date: selectedDate,
        mistakes_points: 0,
        work_creativity: 0,
        quality_of_work_points: 0,
        work_attitude_points: 0,
        behavior_points: 0,
        leave: false,
      }));
      setRows(initialRows);
    }
  }, [employees]);

  // Handle changes in rating or leave switch
  const handleRatingChange = (employee_id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.employee_id === employee_id ? { ...row, [field]: value } : row
      )
    );
    checkIfAllReportsFilled();
  };

  const handleLeaveChange = (employee_id, checked) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.employee_id === employee_id ? { ...row, leave: checked } : row
      )
    );
    checkIfAllReportsFilled();
  };

  // Check if all fields for every employee have been filled
  const checkIfAllReportsFilled = () => {
    const allFilled = rows.every((row) =>
      [
        "mistakes_points",
        "work_creativity",
        "quality_of_work_points",
        "work_attitude_points",
        "behavior_points",
      ].every((key) => row[key] > 0)
    );
    setAllReportsFilled(allFilled);
  };

  // Handle the form submission
  const handleSubmit = async () => {
    console.log("rows", rows);
    try {
      // Make the POST request to the backend
      const response = await axios.post("/api/empOfWeek/evaluation", {
        reportData: rows,
      });

      // Handle the response
      if (response.status === 201) {
        dispatch(addHighlightedDate(selectedDate));
        // alert("Report submitted successfully!");
        // Reset the form
        setRows([]);
        setAllReportsFilled(false);
        navigate("/performanceAnalytics");
      } else {
        alert("Failed to submit the report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting report");
    }
  };

  // Columns for the DataGrid
  const columns = [
    { field: "employee_name", headerName: "Employee Name", width: 180 },
    {
      field: "mistakes",
      headerName: "Mistakes",
      width: 180,
      renderCell: (params) => (
        <Rating
          value={params.row.value}
          onChange={(e, newValue) =>
            handleRatingChange(
              params.row.employee_id,
              "mistakes_points",
              newValue
            )
          }
        />
      ),
    },
    {
      field: "creativity",
      headerName: "Work Creativity",
      width: 180,
      renderCell: (params) => (
        <Rating
          value={params.row.value}
          onChange={(e, newValue) =>
            handleRatingChange(
              params.row.employee_id,
              "work_creativity",
              newValue
            )
          }
        />
      ),
    },
    {
      field: "quality",
      headerName: "Quality of Work",
      width: 180,
      renderCell: (params) => (
        <Rating
          value={params.row.value}
          onChange={(e, newValue) =>
            handleRatingChange(
              params.row.employee_id,
              "quality_of_work_points",
              newValue
            )
          }
        />
      ),
    },
    {
      field: "attitude",
      headerName: "Working Attitude",
      width: 180,
      renderCell: (params) => (
        <Rating
          value={params.row.value}
          onChange={(e, newValue) =>
            handleRatingChange(
              params.row.employee_id,
              "work_attitude_points",
              newValue
            )
          }
        />
      ),
    },
    {
      field: "behavior",
      headerName: "Behavior",
      width: 180,
      renderCell: (params) => (
        <Rating
          value={params.row.value}
          onChange={(e, newValue) =>
            handleRatingChange(
              params.row.employee_id,
              "behavior_points",
              newValue
            )
          }
        />
      ),
    },
    {
      field: "leave",
      headerName: "Leave",
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.row.value}
          onChange={(e) =>
            handleLeaveChange(params.row.employee_id, e.target.checked)
          }
        />
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">
        Report for {day}, {formattedDate}
      </Typography>

      {/* DataGrid for employees */}
      <Box sx={{ height: 400, mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.employee_id}
        />
      </Box>

      {/* Submit button, enabled only when all reports are filled */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={!allReportsFilled}
            onClick={handleSubmit}
          >
            Submit Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportForm;
