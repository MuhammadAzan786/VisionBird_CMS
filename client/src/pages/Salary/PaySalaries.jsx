import axios from "../../utils/axiosInterceptor";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ReceiptLongOutlined } from "@mui/icons-material";
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
} from "@mui/material";

const PaySalaries = () => {
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState("all");

  const [paidEmp, setPaidEmp] = React.useState([]);
  const [unpaidEmp, setUnpaidEmp] = React.useState([]);
  const [allEmp, setallEmp] = React.useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState("Cash");

  const [errorText, setErrorText] = React.useState();
  const [open, setOpen] = React.useState(false);

  const [selectedDate, setSelectedDate] = React.useState({
    month: dayjs().format("MM"), // Initialize with current month as a single-digit string
    year: dayjs().format("YYYY"), // Initialize with current year as a string
  });
  const [paidDate, setPaidDate] = React.useState(dayjs());
  const [totalWorkingDays, setTotalWorkingDays] = React.useState(
    getWorkingDays(
      Number(selectedDate.year),
      Number(selectedDate.month) - 1
    ).toString()
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
    const workingDays = getWorkingDays(
      Number(selectedYear),
      Number(selectedMonthName) - 1
    );
    setTotalWorkingDays(workingDays);

    //If year/month changes set paid date to 1 of that year/month
    setPaidDate(dayjs(new Date(selectedYear, selectedMonthName - 1, 1)));
  };

  const handlePaidDateChange = (date) => {
    if (date) {
      setPaidDate(dayjs(date));
    }
  };

  const handleWorkingDaysChange = (event) => {
    setTotalWorkingDays(event.target.value);
  };

  //Get Paid & Unpaid empolyee details
  const fetchEmployees = async () => {
    await axios
      .post("/api/pay/paid_unpaid_salary_report", {
        month: selectedDate.month,
        year: selectedDate.year,
      })
      .then((response) => {
        const { paidEmployees, unpaidEmployees, allEmployees } = response.data;

        // Save the arrays separately
        setPaidEmp(paidEmployees);
        setUnpaidEmp(unpaidEmployees);
        setallEmp(allEmployees);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  };

  //Fetch Paid & Unpaid Employee if selectedDate Change
  useEffect(() => {
    fetchEmployees();
  }, [selectedDate]);

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
              src={params.row.employeeProImage}
              alt="avatar"
              sx={{ border: "5px solid #F5F5F5", width: 50, height: 50 }}
            />
            <Stack sx={{ alignItems: "start", gap: "0" }}>
              <Typography
                fontWeight={500}
                fontSize={15}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
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
      renderCell: (params) => (
        <CustomChip label={params.value} status={params.value} />
      ),
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
        return (
          <CustomChip
            label={WordCaptitalize(params.value)}
            status={params.value}
          />
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 150,
      ...colStyle,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<ReceiptLongOutlined />}
          disabled={params.row.salary_status === "paid"}
          sx={{ borderRadius: "100px", fontFamily: "Poppins, sans-serif" }}
          onClick={() => handleOpen(params.id)}
        >
          Generate
        </Button>
      ),
    },
  ];

  return (
    <>
      <Link to={"/manage-salaries"}>
        <Button startIcon={<KeyboardReturnIcon />}>
          Back to Salaries Table
        </Button>
      </Link>

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
                value={!paidDate ? null : dayjs(paidDate)}
                onChange={handlePaidDateChange}
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
            <Typography>{` ${dayjs(
              new Date(selectedDate.year, selectedDate.month - 1)
            ).format("MMMM, YYYY")}`}</Typography>
          </Box>

          <TabPanel value="all" sx={{ padding: "0" }}>
            <DataGrid
              columns={columns}
              rows={
                allEmp.length < 0
                  ? []
                  : allEmp.map((employee) => {
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
                unpaidEmp.length < 0
                  ? []
                  : unpaidEmp.map((employee) => {
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
                paidEmp.length < 0
                  ? []
                  : paidEmp.map((employee) => {
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

            const {
              incentive,
              extra_bonus_amount,
              extra_amount_remarks,
              payment_method,
              other_payment_method,
              cheque_number,
            } = formJson;

            let queryString = "";

            if (payment_method === "Other") {
              queryString = new URLSearchParams({
                incentive,
                extra_bonus_amount,
                extra_amount_remarks,
                paymentMethod: other_payment_method,
                totalWorkingDays,
                paidDate,

                ...selectedDate,
              }).toString();
            } else if (payment_method === "Cheque") {
              queryString = new URLSearchParams({
                incentive,
                extra_bonus_amount,
                extra_amount_remarks,
                paymentMethod: payment_method,
                totalWorkingDays,
                chequeNumber: cheque_number,
                paidDate,
                ...selectedDate,
              }).toString();
            } else {
              queryString = new URLSearchParams({
                incentive,
                extra_bonus_amount,
                extra_amount_remarks,
                paymentMethod: payment_method,
                totalWorkingDays,
                paidDate,
                ...selectedDate,
              }).toString();
            }

            navigate(`/salary/${selectedEmployeeId}?${queryString}`, {
              replace: false,
            });
          },
        }}
      >
        <DialogTitle>Please fillout all the fields correctly.</DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{ color: "red", display: "flex", justifyContent: "center" }}
          >
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
            id="extra_bonus_amount"
            name="extra_bonus_amount"
            label="Extra Bonus Amount"
            placeholder="PKR"
            type="number"
            fullWidth
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="extra_amount_remarks"
            name="extra_amount_remarks"
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
              <MenuItem value={"Cheque"}>Cheque</MenuItem>
              <MenuItem value={"Cash"}>Cash</MenuItem>
              <MenuItem value={"iNet Banking"}>iNet Banking</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
          </FormControl>
          {paymentMethod === "Other" && (
            <TextField
              required
              margin="dense"
              id="other_payment_method"
              name="other_payment_method"
              label="Other Payment Method"
              type="text"
              fullWidth
              variant="outlined"
            />
          )}

          {paymentMethod === "Cheque" && (
            <TextField
              required
              margin="dense"
              id="cheque_number"
              name="cheque_number"
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
