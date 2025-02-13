import { Box, TextField, Typography, Paper, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";

const columns = [
  {
    field: "name",
    headerName: "Employee Name",
    flex: 2,
    minWidth: 200,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      const imageUrl = params.row.employeeProImage?.secure_url;

      return (
        <Box display="flex" alignItems="center">
          {/* Box for Employee Image */}
          <Box display="flex" alignItems="center" justifyContent="center" marginRight="8px">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={params.row.name}
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
            ) : (
              <Avatar sx={{ width: 32, height: 32 }} />
            )}
          </Box>

          {/* Box for Employee Name and ID */}
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body2">{params.row.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.employeeID}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  
  { field: "weekNo",    minWidth: 200, headerName: "Week No", flex: 1, headerAlign: "left", align: "left" },
  { field: "pointsGained",    minWidth: 200, headerName: "Task Points", flex: 1, headerAlign: "left", align: "left" },
  { field: "completedTasks",    minWidth: 200, headerName: "Completed Tasks", flex: 1, headerAlign: "left", align: "left" },
  { field: "totalPoints",    minWidth: 200, headerName: "Total Points", flex: 1, headerAlign: "left", align: "left" },
  { field: "awardDate",     minWidth: 200,headerName: "Award Date", flex: 1.5, headerAlign: "left", align: "left" },
];

export default function EowHistory() {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    try {
      // Fetch evaluations and employee data in parallel
      const [evaluationsRes, employeesRes] = await Promise.all([
        axios.get("/api/empOfWeek/allevaluations"),
        axios.get("/api/employee/all_employees"),
      ]);

      console.log("Evaluations API Response:", evaluationsRes.data);
      console.log("Employees API Response:", employeesRes.data);

      // Assuming evaluations data is in evaluationsRes.data.data (adjust if needed)
      const evaluationsArray = evaluationsRes.data.data || [];
      if (evaluationsArray.length === 0) {
        console.warn("No evaluations found");
      }

      const employeeMap = employeesRes.data.reduce((acc, employee) => {
        acc[employee._id] = {
          employeeID: employee.employeeID,
          employeeProImage: employee.employeeProImage || {},
        };
        return acc;
      }, {});

      // Map over each evaluation item and fetch tasks for each employee
      const evaluationsWithTaskData = await Promise.all(
        evaluationsArray.map(async (item) => {
          try {
            const taskResponse = await axios.get(
              `/api/task/getCompletedTasksByEmployeeIdDate/${item.employee_id}`
            );
            const completedTasks = taskResponse.data || [];
            const totalTaskPoints = completedTasks.reduce(
              (sum, task) =>
                task.taskcompleteStatus === "completed" ? sum + task.pointsGained : sum,
              0
            );
            return {
              id: item.employee_id,
              name: item.employee_name,
              employeeID: employeeMap[item.employee_id]?.employeeID || item.employee_id,
              employeeProImage: employeeMap[item.employee_id]?.employeeProImage || {},
              weekNo: item.week_no,
              totalPoints: item.total_points + totalTaskPoints,
              pointsGained: totalTaskPoints,
              completedTasks: completedTasks.filter(task => task.taskcompleteStatus === "completed").length, // Count completed tasks
              awardDate: new Date(item.award_date).toLocaleDateString(),
            };
          } catch (taskError) {
            console.error(`Error fetching tasks for employee ${item.employee_id}:`, taskError);
            // Return the evaluation data without task info if task API fails
            return {
              id: item.employee_id,
              name: item.employee_name,
              employeeID: employeeMap[item.employee_id]?.employeeID || item.employee_id,
              employeeProImage: employeeMap[item.employee_id]?.employeeProImage || {},
              weekNo: item.week_no,
              totalPoints: item.total_points,
              pointsGained: 0,
              completedTasks: 0, // No completed tasks if there is an error fetching task data
              awardDate: new Date(item.award_date).toLocaleDateString(),
            };
          }
        })
      );

      console.log("Formatted Rows:", evaluationsWithTaskData);
      setRows(evaluationsWithTaskData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.trim();
    setSearchText(value);

    if (value === "") {
      fetchData(); // Re-fetch all data when search is cleared
    } else {
      setRows((prevRows) => prevRows.filter((row) => row.weekNo.toString() === value));
    }
  };

  return (
    <Paper>
      <Box sx={{ marginBottom: "30px" }}>
        <Typography variant="h6">Performance Analytics</Typography>
        <TextField
          label="Search Week No"
          variant="outlined"
          size="small"
          value={searchText}
          type="number"
          onChange={handleSearch}
          sx={{ width: 300 }}
        />
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
