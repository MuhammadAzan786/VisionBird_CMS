import { Box, TextField, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";

const columns = [
  { field: "name", headerName: "Employee Name", flex: 2, headerAlign: "center", align: "center" },
  { field: "employeeId", headerName: "Employee ID", flex: 2, headerAlign: "center", align: "center" },
  { field: "weekNo", headerName: "Week No", flex: 1, headerAlign: "center", align: "center" },
  { field: "totalPoints", headerName: "Total Points", flex: 1, headerAlign: "center", align: "center" },
  { field: "awardDate", headerName: "Award Date", flex: 1.5, headerAlign: "center", align: "center" },
];

export default function EowHistory() {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/empOfWeek/allevaluations`);
      console.log("API Response:", response.data); // Debugging

      const formattedRows = response.data.data.map((item) => ({
        id: item.employee_id, // Using employee_id as the unique ID
        name: item.employee_name,
        employeeId: item.employee_id,
        weekNo: item.week_no,
        totalPoints: item.total_points,
        awardDate: new Date(item.award_date).toLocaleDateString(), // Format date
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
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
        getRowId={(row) => row.id} // Ensuring unique ID
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
