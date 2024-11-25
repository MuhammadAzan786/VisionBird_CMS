import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, CircularProgress } from "@mui/material";
import axios from "../../utils/axiosInterceptor";
import { useState, useEffect } from "react";

const columns = [
  { field: "EmployeeName", headerName: "Employee Name", width: 180 },
  { field: "TotalWeekPoints", headerName: "Total Points", width: 150 },
];

const TopEmployeePerformance = () => {
  const [weekNo, setWeekNo] = useState(null);
  const [topEmployees, setTopEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };

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
          return {
            employeeId,
            evaluations: evaluationResponse.data.evaluations || [],
          };
        })
      );

      const formattedRows = evaluations
        .filter((evaluation) => evaluation.evaluations.length > 0)
        .map((evaluation) => {
          const { evaluations } = evaluation;
          let totalPoints = evaluations.reduce(
            (sum, singleEvaluation) => sum + singleEvaluation.total_points,
            0
          );

          return {
            EmployeeName: evaluations[0]?.employee?.name || "Unknown Employee",
            TotalWeekPoints: totalPoints,
          };
        });

      const sortedEmployees = formattedRows.sort(
        (a, b) => b.TotalWeekPoints - a.TotalWeekPoints
      );
      const topFiveEmployees = sortedEmployees
        .slice(0, 5)
        .map((employee, index) => ({
          id: index,
          EmployeeName: employee.EmployeeName,
          TotalWeekPoints: employee.TotalWeekPoints,
        }));

      setTopEmployees(topFiveEmployees);
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

  useEffect(() => {
    const currentDate = new Date();
    const currentWeekNo = getWeekNumber(currentDate);
    setWeekNo(currentWeekNo);
  }, []);

  useEffect(() => {
    if (weekNo) {
      fetchEmployeeEvaluations();
    }
  }, [weekNo]);

  return (
    <Box sx={{ width: "100%", p: 1, bgcolor: "background.paper" }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
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
        <DataGrid
          rows={topEmployees}
          columns={columns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          pagination={false} // Disable default pagination
          sx={{ height: "300px" }}
        />
      )}
    </Box>
  );
};

export default TopEmployeePerformance;
