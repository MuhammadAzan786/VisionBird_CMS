import React, { useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import axios from "../../../utils/axiosInterceptor";
import { useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

const InterviewStatusCell = ({ value, rowId, onUpdate }) => {
  const [status, setStatus] = useState(value);
  const [openDialog, setOpenDialog] = useState(false);
  const [interviewDate, setInterviewDate] = useState(rowId.interviewCall || "");
  const [interviewTime, setInterviewTime] = useState(rowId.interviewTime || "");
  const queryClient = useQueryClient();

  const handleChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    if (newStatus === "yes") {
      setOpenDialog(true); // Open the dialog for additional fields
    } else {
      // If "No" is selected, reset values and update immediately
      updateInterviewStatus(newStatus, null, "");
    }
  };

  const updateInterviewStatus = async (newStatus, date, time) => {
    const updateData = {
      interviewCalled: newStatus,
      interviewCall: date,
      interviewTime: time,
    };

    try {
      // Make the API call to update the interview status
      await axios.put(
        `/api/interview/update_interviewCalled_status/${rowId._id}`,
        updateData
      );

      // Show success toast
      toast.success("Interview status updated successfully!");

      // Invalidate the query to refetch data
      queryClient.invalidateQueries(["pending_evaluations"]);

      // Call onUpdate to update the local state (if needed)
      onUpdate(rowId._id, updateData);
    } catch (error) {
      console.error("Error updating interview status", error);

      // Show error toast
      toast.error("Failed to update interview status. Please try again.");
    }
  };

  const handleSave = () => {
    setOpenDialog(false);
    updateInterviewStatus("yes", interviewDate, interviewTime);
  };

  const handleCancel = () => {
    console.log("status", status);
    setStatus("no"); // Reset to original values
    setOpenDialog(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Select value={status} onChange={handleChange} size="small">
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </Box>

      {/* Dialog for Date & Time Input */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Interview Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Interview Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Interview Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Toaster /> */}
    </>
  );
};

export default InterviewStatusCell;
