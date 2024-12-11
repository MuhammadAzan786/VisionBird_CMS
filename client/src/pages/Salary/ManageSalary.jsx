import { useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CustomDataGrid } from "./components/styled/CustomDataGrid";
import { CustomChip } from "../../components/Styled/CustomChip";
import CustomOverlay from "../../components/Styled/CustomOverlay";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SalaryReportTable = () => {
  const [year, setYear] = useState(""); // State to store selected year
  //const [loading, setLoading] = useState(false); // State to track loading status

  const queryClient = useQueryClient();
  const {
    data = [], // Default to empty array if data is undefined
    isError,
    isLoading:loading,
    error,
  } = useQuery({
    queryKey: ["salaries", year],
    queryFn: async () => {
      if (!year) return []; // Return an empty array if no year is selected
      const response = await axios.post("/api/pay/yearly_salary_report", {
        year,
      });
      return response.data || []; // Ensure response.data is returned as an array
    },
    enabled: !!year, // Prevent unnecessary queries if no year is selected
  });
  if (error) {
    toast.error(error.message)
  }

  // Define columns dynamically based on emp_id
  let columns = [
    {
      field: "employee_name",
      headerName: "Employee Name",
      width: 250,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            src={params.row.emp_img}
            alt="avatar"
            sx={{ border: "5px solid #F5F5F5", width: 50, height: 50 }}
          />
          <Stack sx={{ alignItems: "start" }}>
            <Typography fontWeight={500} fontSize={15}>
              {params.row.name}
            </Typography>
            <Typography color="#a0a0a0" fontSize={12}>
              {params.row.emp_id}
            </Typography>
          </Stack>
        </Box>
      ),
    },
  ];

  // Ensure data is available and not empty before accessing properties
  if (
    Array.isArray(data) &&
    data.length > 0 &&
    Array.isArray(data[0].monthlySalaryStatus)
  ) {
    // If monthlySalaryStatus is present in the first employee's data, create columns for each month
    const months = data[0].monthlySalaryStatus.map((monthStatus) => ({
      field: `${monthStatus.month}_status`,
      headerName: monthStatus.month,
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const label = params.row.monthlySalaryStatus.find(
          (status) => status.month === monthStatus.month
        )?.status;

        return label ? (
          <CustomChip label={label} status={label.toLowerCase()} />
        ) : null;
      },
    }));
    columns = [...columns, ...months];
  }

  const handleYearChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY");
      setYear(formattedDate);
    }
  };

  return (
    <>
      <Paper sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          style={{ marginRight: "18px", fontSize: "1.1rem", fontWeight: "500" }}
        >
          Generate Yearly Report:
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            required
            label="Select Year"
            views={["year"]}
            value={year ? dayjs(year) : null}
            onChange={handleYearChange}
          />
        </LocalizationProvider>

        <LoadingButton
          onClick={() => {}} // Remove redundant `fetchReport`
          endIcon={<SendIcon />}
          loading={loading}
          variant="outlined"
          style={{
            height: "55px",
            width: "210px",
            fontSize: "16px",
            borderRadius: "4px",
            marginLeft: "20px",
          }}
        >
          <span>Generate Report</span>
        </LoadingButton>
      </Paper>

      <Paper>
        <CustomDataGrid
          columns={columns}
          rows={data} // Ensure data is passed correctly
          disableColumnMenu
          disableColumnSorting
          rowHeight={80}
          columnHeaderHeight={45}
          disableSelectionOnClick
          hideFooter
          loading={loading}
          slots={{
            loadingOverlay: () => <CustomOverlay open={true} />,
          }}
          sx={{
            "& .MuiDataGrid-overlayWrapperInner": { position: "relative" },
          }}
        />
      </Paper>
    </>
  );
};

export default SalaryReportTable;
