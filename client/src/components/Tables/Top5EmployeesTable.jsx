import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, CircularProgress, Avatar } from "@mui/material";
import axios from "../../utils/axiosInterceptor";
import { useState, useEffect } from "react";

const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

const columns = [
  {
    field: "EmployeeName",
    headerName: "Employee Name",
    width: 250,
    renderCell: (params) => {
      const imageUrl = params.row.employeeProImage?.secure_url;
  
      return (
        <Box display="flex" alignItems="center">
          {/* Box for Employee Image */}
          <Box display="flex" alignItems="center" justifyContent="center" marginRight="8px">
            <Avatar
              src={imageUrl}
              alt={params.row.EmployeeName}
              sx={{ border: "5px solid #F5F5F5", width: 50, height: 50 }} 
            />
          </Box>
  
          {/* Box for Employee Name and ID */}
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body2" fontWeight={500} >{params.row.EmployeeName}</Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.employee_ID}
            </Typography>
          </Box>
        </Box>
      );
    },
  },

  { field: "TotalWeekPoints", headerName: "Evaluation Points", width: 200 ,headerAlign: "center", align: "center" },
  { field: "CompletedTasks", headerName: "Completed Tasks", width: 200 ,headerAlign: "center", align: "center" },
  { field: "CompletedTasksPoints", headerName: "Points", width: 200 ,headerAlign: "center", align: "center" },
  { field: "TotalPoints", headerName: "Total Points", width: 200 ,headerAlign: "center", align: "center" },
];

const TopEmployeePerformance = () => {
  const [weekNo, setWeekNo] = useState(null);
  const [topEmployees, setTopEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployeeEvaluations = async () => {
    setLoading(true);
    setError(null);
    if (!weekNo) {
      console.error("Week number is not set yet.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/employee/get_employee_ids");
      const employeeIds = response.data;

      const evaluations = await Promise.all(
        employeeIds.map(async (employeeId) => {
          const evaluationResponse = await axios.get(
            "/api/empOfWeek/evaluations/employee/emp_week",
            {
              params: { employee_id: employeeId, week_no: weekNo },
            }
          );
          // Fetch employee details to get the profile image
          const employeeResponse = await axios.get(`/api/employee/get_employee/${employeeId}`);
          const employeeProImage = employeeResponse.data?.employeeProImage || {};
          const employeID = employeeResponse.data?.employeeID || "Unknown Employee ID";

          return {
            employeeId,
            evaluations: evaluationResponse.data.evaluations || [],
            employeeProImage,
            employeID,
          };
        })
      );

      const formattedRows = evaluations
        .filter((evaluation) => evaluation.evaluations.length > 0)
        .map((evaluation) => {
          const { evaluations, employeeProImage, employeID } = evaluation;
          let totalPoints = evaluations.reduce(
            (sum, singleEvaluation) => sum + singleEvaluation.total_points,
            0
          );

          return {
            employeeId: evaluation.employeeId,
            EmployeeName: evaluations[0]?.employee?.name || "Unknown Employee",
            employeeProImage, // Now include the profile image
            employee_ID: employeID, // Include the employee ID
            TotalWeekPoints: totalPoints,
            dailyTasks: Array(5).fill(0),
            dailyPoints: Array(5).fill(0),
          };
        });

      const sortedEmployees = formattedRows.sort(
        (a, b) => b.TotalWeekPoints - a.TotalWeekPoints
      );

      setTopEmployees(sortedEmployees.slice(0, 5)); // Store top 5 employees
    } catch (error) {
      console.error(
        "Error fetching employee evaluations:",
        error.response || error.message || error
      );
      setError("Failed to fetch employee evaluations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyTasksAndPoints = async (employeeId) => {
    try {
      const response = await axios.get(
        `/api/task/getCompletedTasksByEmployeeIdDate/${employeeId}`
      );
      const tasks = response.data || [];

      const taskCountByDay = Array(5).fill(0);
      const pointsData = Array(5).fill(0);

      tasks.forEach((task) => {
        if (task.taskcompleteStatus === "completed" && task.updatedAt) {
          const updatedAtDate = new Date(task.updatedAt);
          const dayOfWeek = updatedAtDate.getDay(); // 0 = Sunday, 1 = Monday

          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            taskCountByDay[dayOfWeek - 1] += 1;
            pointsData[dayOfWeek - 1] += task.pointsGained;
          }
        }
      });

      return { taskCountByDay, pointsData };
    } catch (error) {
      console.error("Error fetching daily tasks and points:", error);
      return { taskCountByDay: Array(5).fill(0), pointsData: Array(5).fill(0) };
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    setWeekNo(getWeekNumber(currentDate));
  }, []);

  useEffect(() => {
    if (weekNo) {
      fetchEmployeeEvaluations();
    }
  }, [weekNo]);

  useEffect(() => {
    const updateEmployeeData = async () => {
      const updatedEmployees = await Promise.all(
        topEmployees.map(async (employee) => {
          const { taskCountByDay, pointsData } = await fetchDailyTasksAndPoints(employee.employeeId);
          return {
            ...employee,
            dailyTasks: taskCountByDay,
            dailyPoints: pointsData,
          };
        })
      );
      setTopEmployees(updatedEmployees);
    };

    if (topEmployees.length > 0) {
      updateEmployeeData();
    }
  }, [topEmployees]);

  return (
    <Box sx={{ width: "100%", p: 1, bgcolor: "background.paper" }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : topEmployees.length === 0 ? (
        <Typography variant="body1" align="center">
          No employee data available for this week.
        </Typography>
      ) : (
        <>
          <Typography gutterBottom>
            Week : {weekNo}
          </Typography>
          <DataGrid
            rows={topEmployees.map((employee, index) => ({
              id: index,
              EmployeeName: employee.EmployeeName,
              employeeProImage: employee.employeeProImage,
              employee_ID: employee.employee_ID,
              TotalWeekPoints: employee.TotalWeekPoints,
              CompletedTasks: employee.dailyTasks.reduce((acc, task) => acc + task, 0),
              CompletedTasksPoints: employee.dailyPoints.reduce((acc, point) => acc + point, 0),
              TotalPoints:
                employee.TotalWeekPoints +
                employee.dailyPoints.reduce((acc, point) => acc + point, 0),
            }))}
            columns={columns}
            pageSize={5}
            disableRowSelectionOnClick
            pagination={false}
            sx={{ height: "auto" }}
          />
        </>
      )}
    </Box>
  );
};

export default TopEmployeePerformance;