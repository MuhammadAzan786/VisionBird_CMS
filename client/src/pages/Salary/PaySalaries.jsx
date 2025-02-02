import axios from "../../utils/axiosInterceptor";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ReceiptLongOutlined, RemoveRedEye } from "@mui/icons-material";
import { getWorkingDays, WordCaptitalize } from "../../utils/common";
import { CustomChip } from "../../components/Styled/CustomChip";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogContentText,
  Tab,
  Stack,
  Paper,
  Modal,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ViewSalary from "./ViewSalary";

const PaySalaries = () => {
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState("all");

  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState(null);
  const [employeeDetails, setEmployeeDetails] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState("cash");

  const [salaryId, setSalaryId] = useState();
  const [viewModel, setViewModal] = useState(false);

  const toggleViewModal = async (id) => {
    setSalaryId(id);
    setViewModal(!viewModel);
  };

  const handleViewModalClose = () => {
    setViewModal(false);
  };

  const [errorText, setErrorText] = React.useState();
  const [open, setOpen] = React.useState(false);

  const [selectedDate, setSelectedDate] = React.useState({
    month: dayjs().format("MM"),
    year: dayjs().format("YYYY"),
  });
  const [paidDate, setPaidDate] = useState(dayjs());

  console.log("paidDate", paidDate);

  const [totalWorkingDays, setTotalWorkingDays] = React.useState(
    getWorkingDays(Number(selectedDate.year), Number(selectedDate.month) - 1).toString()
  );

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  //Set new date to selectedDate state
  const handleDateChange = (newDate) => {
    const selectedMonthName = dayjs(newDate).format("MM"); // Get month as a single-digit string
    const selectedYear = dayjs(newDate).format("YYYY"); // Get full year as string

    setSelectedDate({ month: selectedMonthName, year: selectedYear });

    // Set working days for the selected year/month
    const workingDays = getWorkingDays(Number(selectedYear), Number(selectedMonthName) - 1);
    setTotalWorkingDays(workingDays);

    //If year/month changes set paid date to 1 of that year/month
    setPaidDate(dayjs(new Date(selectedYear, selectedMonthName - 1, 1)));
  };

  const handleWorkingDaysChange = (event) => {
    setTotalWorkingDays(event.target.value);
  };

  const { data: { paidEmployees = [], unpaidEmployees = [], allEmployees = [] } = {} } = useQuery({
    queryKey: ["paysalary", selectedDate.month, selectedDate.year],
    queryFn: async () => {
      if (!selectedDate.month || !selectedDate.year) {
        throw new Error("Invalid date selected");
      }

      const response = await axios.post("/api/pay/paid_unpaid_salary_report", {
        month: selectedDate.month,
        year: selectedDate.year,
      });

      console.log("API Response:", response.data);
      return response.data;
    },
    enabled: !!selectedDate.month && !!selectedDate.year, // Prevent unnecessary queries
  });

  //Show employee details when double clicked
  const navigateTo = (employee) => {
    navigate(`/employee-profile/${employee.id}`);
  };

  // Open & Close DialogBox
  const handleOpen = (employeeId) => {
    setErrorText("");
    setSelectedEmployeeId(employeeId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: "employee_name",
      headerName: "Employee Name",
      width: 250,

      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",
              gap: 1,
            }}
          >
            <Avatar
              src={params.row.employeeProImage.secure_url}
              alt="avatar"
              sx={{ border: "5px solid #F5F5F5", width: 50, height: 50 }}
            />
            <Stack sx={{ alignItems: "start", gap: "0" }}>
              <Typography fontWeight={500} fontSize={15} sx={{ fontFamily: "Poppins, sans-serif" }}>
                {params.row.employeeName}
              </Typography>
              <Typography color="#a0a0a0" fontSize={12}>
                {params.row.employeeID}
              </Typography>
            </Stack>
          </Box>
        );
      },
    },
    {
      field: "employeeDesignation",
      headerName: "Designation",
      width: 200,
      ...colStyle,
      renderCell: (params) => <CustomChip label={params.value} status={params.value} />,
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      ...colStyle,
    },
    {
      field: "employee_sallary",
      headerName: "Sallary (PKR)",
      width: 150,
      ...colStyle,
      renderCell: (params) => {
        if (params.row.probationPeriod === "yes") {
          return <>{params.row.BasicPayInProbationPeriod}</>;
        } else {
          return <>{params.row.BasicPayInProbationPeriod}</>;
        }
      },
    },
    {
      field: "salary_status",
      headerName: "Status",
      width: 150,
      ...colStyle,
      renderCell: (params) => {
        return <CustomChip label={WordCaptitalize(params.value)} status={params.value} />;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 150,
      ...colStyle,
      renderCell: (params) => {
        return params.row.salary_status === "unpaid" ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<ReceiptLongOutlined />}
            sx={{ borderRadius: "100px", fontFamily: "Poppins, sans-serif" }}
            onClick={() => {
              setEmployeeDetails(params.row);
              handleOpen(params.id);
            }}
          >
            Generate
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={<RemoveRedEye />}
            sx={{ borderRadius: "100px", fontFamily: "Poppins, sans-serif" }}
            onClick={() => toggleViewModal(params.row.salary_id)}
          >
            View
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Modal open={viewModel} onClose={handleViewModalClose} sx={{ overflowY: "scroll", scrollbarWidth: "none" }}>
        <ViewSalary salary_id={salaryId} />
      </Modal>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                required
                sx={{ width: "100%" }}
                label="Select Month & Year *"
                views={["year", "month"]}
                openTo="month"
                value={dayjs(selectedDate.year + selectedDate.month)}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              required
              id="total_working_days"
              name="total_working_days"
              label="Total Working Days"
              type="number"
              variant="outlined"
              value={totalWorkingDays}
              onChange={handleWorkingDaysChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                required
                sx={{ width: "100%" }}
                label="Select Paid Date *"
                value={paidDate}
                onChange={(date) => {
                  console.log("onchange", date);
                  setPaidDate(date);
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TabContext value={tabValue}>
          {/* Box is placed to align selected month to the right */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            <TabList onChange={handleTabValue}>
              <Tab label="All" value="all" sx={{ letterSpacing: 1 }} />
              <Tab label="Unpaid" value="unpaid" sx={{ letterSpacing: 1 }} />
              <Tab label="Paid" value="paid" sx={{ letterSpacing: 1 }} />
            </TabList>
            <Typography>{` ${dayjs(new Date(selectedDate.year, selectedDate.month - 1)).format(
              "MMMM, YYYY"
            )}`}</Typography>
          </Box>

          <TabPanel value="all" sx={{ padding: "0" }}>
            <DataGrid
              columns={columns}
              rows={
                allEmployees.length < 0
                  ? []
                  : allEmployees.map((employee) => {
                      return { ...employee, id: employee._id };
                    })
              }
              onRowDoubleClick={navigateTo}
              sx={{ height: "500px" }}
            />
          </TabPanel>
          <TabPanel value="unpaid" sx={{ padding: "0" }}>
            <DataGrid
              columns={columns}
              rows={
                unpaidEmployees.length < 0
                  ? []
                  : unpaidEmployees.map((employee) => {
                      return { ...employee, id: employee._id };
                    })
              }
              onRowDoubleClick={navigateTo}
              sx={{ height: "500px" }}
            />
          </TabPanel>

          <TabPanel value="paid" sx={{ padding: "0" }}>
            <DataGrid
              columns={columns}
              rows={
                paidEmployees.length < 0
                  ? []
                  : paidEmployees.map((employee) => {
                      return { ...employee, id: employee._id };
                    })
              }
              onRowDoubleClick={navigateTo}
              sx={{ height: "500px" }}
            />
          </TabPanel>
        </TabContext>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();

            if (totalWorkingDays === "") {
              setErrorText("Total working days is empty");
              return;
            } else if (paidDate === "") {
              setErrorText("Paid date is empty");
              return;
            }

            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            console.log("FORM DATA KA DATA", formJson);

            let queryParams = {
              ...formJson,
              ...selectedDate,
              totalWorkingDays,
              paidDate,
              paymentMethod,
            };

            const { chequeNumber, otherDetails } = formJson;

            if (paymentMethod === "other") {
              queryParams = {
                ...queryParams,
                otherDetails,
              };
            } else if (paymentMethod === "cheque") {
              queryParams = {
                ...queryParams,
                chequeNumber,
              };
            } else {
              queryParams = {
                ...queryParams,
              };
            }

            const queryString = new URLSearchParams(queryParams).toString();

            navigate(`/salary/${selectedEmployeeId}?${queryString}`, {
              replace: false,
              state: { employeeDetails },
            });
          },
        }}
      >
        <DialogTitle>Please fillout all the fields correctly.</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "red", display: "flex", justifyContent: "center" }}>
            {errorText}
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="incentive"
            name="incentive"
            label="Incentive"
            placeholder="PKR"
            type="number"
            fullWidth
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="extraBonusAmount"
            name="extraBonusAmount"
            label="Extra Bonus Amount"
            placeholder="PKR"
            type="number"
            fullWidth
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="extraBonusRemarks"
            name="extraBonusRemarks"
            label="Extra Amount Remarks"
            type="text"
            fullWidth
            variant="outlined"
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="payment-method-label">Payment Method *</InputLabel>
            <Select
              required
              id="payment_method"
              name="payment_method"
              labelId="payment-method-label"
              label="Payment Method"
              variant="outlined"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <MenuItem value={"cheque"}>Cheque</MenuItem>
              <MenuItem value={"cash"}>Cash</MenuItem>
              <MenuItem value={"other"}>Other</MenuItem>
            </Select>
          </FormControl>
          {paymentMethod === "other" && (
            <TextField
              required
              margin="dense"
              id="otherDetails"
              name="otherDetails"
              label="Other Payment Method"
              type="text"
              fullWidth
              variant="outlined"
            />
          )}

          {paymentMethod === "cheque" && (
            <TextField
              required
              margin="dense"
              id="chequeNumber"
              name="chequeNumber"
              label="Cheque Number"
              type="number"
              fullWidth
              variant="outlined"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const colStyle = {
  headerAlign: "center",
  align: "center",
};

export default PaySalaries;
