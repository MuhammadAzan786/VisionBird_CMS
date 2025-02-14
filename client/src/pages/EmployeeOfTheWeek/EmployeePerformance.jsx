import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Typography, Avatar } from "@mui/material";
import axios from "../../utils/axiosInterceptor";
import { useState, useEffect } from "react";

const columns = [
  {
    field: "EmployeeName",
    headerName: "Employee Name",
    width: 240,
    renderCell: (params) => {
      const { employeeName, employeeImage, employeeID } = params.row;
      return (
        <Box display="flex" alignItems="center">
          <Avatar
            src={employeeImage || '/path/to/default-image.jpg'}
            alt={employeeName}
            sx={{ border: "5px solid #F5F5F5", width: 50, height: 50, marginRight: "8px" }}
          />
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body2" fontWeight={500}>{employeeName || "Employee Name" }</Typography>
            <Typography variant="caption" color="textSecondary">{employeeID || "Employee ID "}</Typography>
          </Box>
        </Box>
      );
    }
  },
  {
    field: "Monday",
    headerName: "Monday",
    width: 240,
    renderCell: (params) => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <span>{params.row.Mondaytotal}</span>
      </div>
    ),
  },
  { field: "Tuesday", headerName: "Tuesday", width: 200 },
  { field: "Wednesday", headerName: "Wednesday", width: 200 },
  { field: "Thursday", headerName: "Thursday", width: 200 },
  { field: "Friday", headerName: "Friday", width: 200 },
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
      return;
    }
    try {
      const response = await axios.get("/api/employee/get_employee_ids"); // Fetch only employee IDs
      const employeeIds = response.data;

      // Fetch employee details along with evaluation data
      const evaluations = await Promise.all(
        employeeIds.map(async (employeeId) => {
          const [employeeResponse, evaluationResponse] = await Promise.all([
            axios.get(`/api/employee/get_employee/${employeeId}`), // Fetch employee details
            axios.get("/api/empOfWeek/evaluations/employee/emp_week", {
              params: {
                employee_id: employeeId,
                week_no: weekNo,
              },
            }), // Fetch employee's evaluation data for the week
          ]);

          const employeeDetails = employeeResponse.data;
          const evaluationsData = evaluationResponse.data.evaluations || [];

          // Return combined data for each employee
          return {
            employeeId,
            employeeName: employeeDetails.employeeName,
            employeeImage: employeeDetails.employeeProImage?.secure_url || "", // Get profile image URL
            employeeID: employeeDetails.employeeID,
            evaluations: evaluationsData,
          };
        })
      );

      let counter = 0;
      const formattedRows = evaluations
        .filter((evaluation) => evaluation.evaluations.length > 0)
        .map((evaluation) => {
          const { employeeName, employeeImage, employeeID, evaluations } = evaluation;

          // Create an object to accumulate points for each day
          const weeklyData = {
            id: counter++,
            EmployeeName: employeeName,
            employeeImage: employeeImage,
            employeeID: employeeID,
            Mondaytotal: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            TotalWeekPoints: 0,
          };

          // Accumulate points by day
          evaluations.forEach((singleEvaluation) => {
            const evaluationDate = new Date(singleEvaluation.evaluation_date);
            const dayName = evaluationDate.toLocaleDateString("en-US", { weekday: "long" });

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
                break;
            }
            weeklyData.TotalWeekPoints += singleEvaluation.total_points;
          });

          return weeklyData;
        });

      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching employee evaluations:", error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentWeekNo = getWeekNumber(currentDate);
    setWeekNo(currentWeekNo);
    fetchEmployeeEvaluations();
  }, [weekNo]);

  return (
    <Paper>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Typography variant="h6">Performance Analytics</Typography>
        <Typography variant="h6">Week No : {weekNo}</Typography>
      </Box>

      <Box sx={{ height: "85vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          getRowId={(row) => row.employeeID} // Ensure unique row ID for each employee
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
