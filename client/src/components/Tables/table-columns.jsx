import { Avatar, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { Link } from "react-router-dom";

export const AttendenceColumn = [
  {
    field: "id",
    headerName: "Employee ID",
    width: 200,
  },
  {
    field: "employeeName",
    headerName: "Employee Name",
    width: 200,
  },
  {
    field: "fullLeave",
    headerName: "Full Day Leave",
    width: 200,
  },
  {
    field: "halfLeave",
    headerName: "Half Day Leave",
    width: 200,
  },
  {
    field: "shortLeave",
    headerName: "Short Leave",
    width: 200,
  },
];

export const SalaryColumn = [
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Link to={"/salary/123"}>
          <IconButton aria-label="Payslip" color="success">
            <ReceiptOutlinedIcon />
          </IconButton>
        </Link>
      </Box>
    ),
  },
  {
    field: "id",
    headerName: "Employee ID",
    width: 200,
  },
  {
    field: "employeeName",
    headerName: "Employee Name",
    width: 200,
  },
  {
    field: "january",
    headerName: "January",
    width: 200,
  },
  {
    field: "feburary",
    headerName: "Feburary",
    width: 200,
  },
  {
    field: "march",
    headerName: "March",
    width: 200,
  },
  {
    field: "april",
    headerName: "April",
    width: 200,
  },
  {
    field: "may",
    headerName: "May",
    width: 200,
  },
  {
    field: "june",
    headerName: "June",
    width: 200,
  },
  {
    field: "july",
    headerName: "July",
    width: 200,
  },
  {
    field: "august",
    headerName: "August",
    width: 200,
  },

  {
    field: "september",
    headerName: "September",
    width: 200,
  },
  {
    field: "october",
    headerName: "October",
    width: 200,
  },
  {
    field: "november",
    headerName: "November",
    width: 200,
  },
  {
    field: "december",
    headerName: "December",
    width: 200,
  },
];

export const employeeColumns = [
  {
    field: "employeeProImage",
    headerName: "Profile Pic",

    renderCell: (params) => <Avatar alt="Avatar" src={employeeProImage} />,
  },
  { field: "employeeID", headerName: "Employee ID", width: 200 },
  {
    field: "employeeName",
    headerName: "Employee Name",
    width: 200,
  },
  {
    field: "employeeFatherName",
    headerName: "Employee Father Name",
    width: 200,
  },
  { field: "employeeCNIC", headerName: "Employee CNIC", width: 200 },
  { field: "dateOfBirth", headerName: "Date of Birth", width: 200 },
  { field: "mailingAddress", headerName: "Mailing Address", width: 200 },
  { field: "mobileNumber", headerName: "Mobile #", width: 200 },
  {
    field: "guardiansMobileNumber",
    headerName: "Guardian Mobile #",
    width: 200,
  },
  { field: "email", headerName: "Email", width: 200 },
  { field: "maritalStatus", headerName: "Marital Status", width: 200 },
  { field: "gender", headerName: "Gender", width: 200 },
  { field: "disability", headerName: "Disability", width: 200 },
  { field: "qualification", headerName: "Qualification", width: 200 },
  { field: "dateOfJoining", headerName: "Date of Joining", width: 200 },
  { field: "dateConfirmed", headerName: "Date Confirmed", width: 200 },
  { field: "probationPeriod", headerName: "On Probation", width: 200 },
  { field: "policyBookSigned", headerName: "Signed Policy Book", width: 200 },
  {
    field: "appointmentLetterGiven",
    headerName: "Appointment Letter Given",
    width: 200,
  },
  {
    field: "rulesAndRegulationsSigned",
    headerName: "Signed Rules and Regulations",
    width: 200,
  },
  {
    field: "annualLeavesSigned",
    headerName: "Signed Annual Leave",
    width: 200,
  },
  { field: "cnicScanCopy", headerName: "Uploaded CNIC Copy", width: 200 },
  {
    field: "attendanceBiometric",
    headerName: "Biometric Attendence",
    width: 200,
  },
  {
    field: "localServerAccountCreated",
    headerName: "Local Server Account Created",
    width: 200,
  },
  { field: "addedInSlack", headerName: "Added on Slack", width: 200 },
  { field: "addedInWhatsApp", headerName: "Added on WhatsApp", width: 200 },
  { field: "employeeCardGiven", headerName: "Employee Card Given", width: 200 },
  { field: "bankAccount", headerName: "Bank Account", width: 200 },
  { field: "bankAccountNumber", headerName: "Bank Account #", width: 200 },
  {
    field: "policeCertificateUpload",
    headerName: "Uploaded Police Certificate",
    width: 200,
  },
  { field: "degreesScanCopy", headerName: "Uploaded Degrees", width: 200 },
  { field: "employeeUsername", headerName: "Employee Username", width: 200 },
  { field: "employeeDesignation", headerName: "Designation", width: 200 },
  { field: "role", headerName: "Role", width: 200 },
  { field: "_id", width: 250 },
];
