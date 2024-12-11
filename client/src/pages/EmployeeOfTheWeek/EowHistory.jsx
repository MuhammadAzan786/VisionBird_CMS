import { Box, Chip, TextField, Typography, Avatar, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosInterceptor";
import topBadge from "/star-medal.png";
import EmployeeNameCell from "../../components/Grid Cells/EmployeeProfileCell";
import { CustomChip } from "../../components/Styled/CustomChip";

const columns = [
  {
    field: "employeeName",
    headerName: "Employee Name",
    width: 200,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <EmployeeNameCell src={row.employeeProImage?.secure_url} userId={row.userId} name={row.name} />
    ),
  },

  {
    field: "email",
    headerName: "Employee Email",
    flex: 2,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "employeeDesignation",
    headerName: "Designation",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => <CustomChip label={params.value} status={params.value} />,
  },

  {
    field: "weekNo",
    headerName: "Week No",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "totalPoints",
    headerName: "Total Points",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
];

export default function EowHistory() {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [weekNo, setWeekNo] = useState(null); // Initialize as null for default recent week fetch
  const [maxPoints, setMaxPoints] = useState(0); // To store the highest points

  const fetchData = async () => {
    try {
      const weekQueryParam = weekNo ? `?weekNo=${weekNo}` : ""; // If weekNo is provided, append it to the query, else leave it empty for recent data
      const response = await axios.get(`/api/empOfWeek/allevaluations${weekQueryParam}`);

      // Flatten employeeTotals into separate rows
      const formattedRows = response.data.data.flatMap((item) =>
        Object.entries(item.employeeTotals).map(([key, employee]) => ({
          id: key, // Use a unique ID (e.g., employee's key)
          employeeProImage: employee.employeeProImage?.secure_url,
          name: employee.name,
          email: employee.email,
          totalPoints: employee.totalPoints,
          weekNo: item.weekNo,
          employeeDesignation: employee.employeeDesignation,
        }))
      );

      // Find the max points and sort the rows by totalPoints in descending order
      const highestPoints = Math.max(...formattedRows.map((row) => row.totalPoints));
      setMaxPoints(highestPoints);

      formattedRows.sort((a, b) => b.totalPoints - a.totalPoints); // b - a for descending order

      // Assign maxPoints value to each row so it can be accessed in renderCell
      formattedRows.forEach((row) => {
        row.maxPoints = highestPoints;
      });

      setRows(formattedRows);
      setOriginalRows(formattedRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.trim();
    setSearchText(value);

    if (value === "") {
      setWeekNo(null); // When search is empty, fetch the most recent week
    } else {
      setWeekNo(value); // Otherwise, fetch the data for the entered week number
    }
  };

  useEffect(() => {
    fetchData();
  }, [weekNo]); // Trigger fetch when weekNo changes

  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Typography variant="h6">Perfomance Analytics</Typography>
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
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
      />
    </Paper>
  );
}
