import { Box, TextField, Typography, Paper, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";

const columns = [
  {
    field: "name",
    headerName: "Employee Name",
    flex: 2,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      const imageUrl = params.row.employeeProImage?.secure_url; // Ensure the image URL is valid
      return (
        <Box display="flex" alignItems="left">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={params.row.name}
              style={{ width: 32, height: 32, borderRadius: "50%", marginRight: "8px" }}
            />
          ) : (
            <Avatar sx={{ width: 32, height: 32, marginRight: "8px" }} />
          )}
          <Typography>{params.row.name}</Typography>
        </Box>
      );
    },
  },
  { field: "employeeID", headerName: "Employee ID", flex: 2, headerAlign: "left", align: "left" },
  { field: "weekNo", headerName: "Week No", flex: 1, headerAlign: "left", align: "left" },
  { field: "totalPoints", headerName: "Total Points", flex: 1, headerAlign: "left", align: "left" },
  { field: "awardDate", headerName: "Award Date", flex: 1.5, headerAlign: "left", align: "left" },
];

export default function EowHistory() {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    try {
      const [evaluationsRes, employeesRes] = await Promise.all([
        axios.get("/api/empOfWeek/allevaluations"),
        axios.get("/api/employee/all_employees"),
      ]);

      const employeeMap = employeesRes.data.reduce((acc, employee) => {
        acc[employee._id] = {
          employeeID: employee.employeeID,
          employeeProImage: employee.employeeProImage || {},
        };
        return acc;
      }, {});

      const formattedRows = evaluationsRes.data.data.map((item) => ({
        id: item.employee_id,
        name: item.employee_name,
        employeeID: employeeMap[item.employee_id]?.employeeID || item.employee_id,
        employeeProImage: employeeMap[item.employee_id]?.employeeProImage || {},
        weekNo: item.week_no,
        totalPoints: item.total_points,
        awardDate: new Date(item.award_date).toLocaleDateString(),
      }));

      setRows(formattedRows);
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
      <Box sx={{  marginBottom: "30px" }}>
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
