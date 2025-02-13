import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Typography } from "@mui/material";
import axios from "../../utils/axiosInterceptor";
import { useState, useEffect } from "react";
const columns = [
  {
    field: "EmployeeName",
    headerName: "Employee Name",
    width: 240,
  },
  {
    field: "Monday",
    headerName: "Monday",
    width: 240,
    renderCell: (params) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span>{params.row.Mondaytotal} </span>

      </div>
    ),
  },
  { field: "Tuesday", headerName: "Tuesday", width: '200' },
  { field: "Wednesday", headerName: "Wednesday", width: '200' },
  { field: "Thursday", headerName: "Thursday", width: '200' },
  { field: "Friday", headerName: "Friday", width: '200' },
  { field: "TotalWeekPoints", headerName: "Total Week Points", width: 206 },
];
const EmployeePerformance = () => {
  const [weekNo, setWeekNo] = useState(null);
  const [rows, setRows] = useState([]);
  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };
  const fetchEmployeeEvaluations = async () => {
    if (!weekNo) {
      console.error("Week number is not set yet.");
      return; // Early return if weekNo is not available
    }
    try {
      const response = await axios.get("/api/employee/get_employee_ids"); // Fetch only employee IDs
      const employeeIds = response.data;
      console.log("employeeIds", employeeIds);
      const evaluations = await Promise.all(
        employeeIds.map(async (employeeId) => {
          console.log("fetching  ", weekNo);
          const evaluationResponse = await axios.get(
            "/api/empOfWeek/evaluations/employee/emp_week",
            {
              params: {
                // Use params to send query parameters
                employee_id: employeeId,
                week_no: weekNo,
              },
            }
          );
          console.log(evaluationResponse.data);
          return {
            employeeId,
            evaluations: evaluationResponse.data.evaluations || [],
          };
        })
      );
      let counter = 0;
      const formattedRows = evaluations
        .filter((evaluation) => evaluation.evaluations.length > 0)
        .map((evaluation) => {
          const { employeeId, evaluations } = evaluation;
          // Create an object to accumulate points for each day
          const weeklyData = {
            id: counter++,
            EmployeeName: evaluations[0].employee.name, // Use the name from the first evaluation
            Mondaytotal: 0,
            Mondaylate: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            TotalWeekPoints: 0,
          };
          // Iterate over each evaluation to accumulate points by day
          evaluations.forEach((singleEvaluation) => {
            // Renamed eval to singleEvaluation
            const evaluationDate = new Date(singleEvaluation.evaluation_date);
            const dayName = evaluationDate.toLocaleDateString("en-US", {
              weekday: "long",
            });

            switch (dayName) {
              case "Monday":
                weeklyData.Mondaytotal += singleEvaluation.total_points;
                break;
              case "Tuesday":
                weeklyData.Tuesday += singleEvaluation.total_points;
                break;
              case "Wednesday":
                weeklyData.Wednesday += singleEvaluation.total_points;
                break;
              case "Thursday":
                weeklyData.Thursday += singleEvaluation.total_points;
                break;
              case "Friday":
                weeklyData.Friday += singleEvaluation.total_points;
                break;
              default:
                break; // Handle cases for Saturday/Sunday or any other days as needed
            }
            // Add to the total points for the week
            weeklyData.TotalWeekPoints += singleEvaluation.total_points;
          });
          return weeklyData;
        });
      setRows(formattedRows);
      console.log("formattedRows", formattedRows);
    } catch (error) {
      console.error("Error fetching employee evaluations:", error);
    }
  };
  useEffect(() => {
    const currentDate = new Date();
    const currentWeekNo = getWeekNumber(currentDate);
    setWeekNo(currentWeekNo);
    fetchEmployeeEvaluations(); // Fetch data for every employee of the current week
  }, [weekNo]);
  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h6">Perfomance Analytics</Typography>
        <Typography variant="h6">Week No : {weekNo}</Typography>
      </Box>

      <Box sx={{ height: "85vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          getRowId={(row) => row.EmployeeName}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnFilter
          slots={{
            headerFilterMenu: null,
          }}
        />
      </Box>
    </Paper>
  );
};

export default EmployeePerformance;
