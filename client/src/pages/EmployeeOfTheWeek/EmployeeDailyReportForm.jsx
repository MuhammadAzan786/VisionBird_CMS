import React, { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Toaster, toast } from "react-hot-toast"; // Importing react-hot-toast
import axios from "../../utils/axiosInterceptor";
import CalendarComponent from "./CalendarComponent";
import ReportForm from "./ReportForm";

const EmployeeDailyReportForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [evaluationPermission, setEvaluationPermission] = useState(false);

  const handleSelectDate = async (date) => {
    try {
      const formattedDate = new Date(date);
      const isoString = new Date(
        formattedDate.getTime() - formattedDate.getTimezoneOffset() * 60000
      ).toISOString();
      console.log(isoString);
      setSelectedDate(isoString);

      // Make the API call to check report existence
      const response = await axios.get(
        `/api/empOfWeek/checkReportExists/${isoString}`
      );

      const { message, evaluation_permission } = response.data;
      console.log("evaluation_permission", evaluation_permission);
      console.log("message", message);

      if (evaluation_permission === true) {
        // Open the modal only if evaluation_permission is true
        setEvaluationPermission(true);
        setOpen(true);
      } else {
        // Show the toast message if permission is denied
        toast.error(message);
        setEvaluationPermission(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("API error:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper>
      <Typography
        sx={{
          color: "#3b4056",
          fontWeight: "500",
          fontSize: "24px",
          lineHeight: "38px",
          mb: 5,
        }}
        gutterBottom
      >
        Employee Daily Report Submission
      </Typography>

      <CalendarComponent onSelectDate={handleSelectDate} />

      <Dialog
        open={open && evaluationPermission}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          Report Submission
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedDate && <ReportForm selectedDate={selectedDate} />}
        </DialogContent>
      </Dialog>

      {/* Toast container for notifications */}
      <Toaster position="bottom-right" reverseOrder={false} />
    </Paper>
  );
};

export default EmployeeDailyReportForm;
