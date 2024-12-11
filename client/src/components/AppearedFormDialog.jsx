import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Rating,
} from "@mui/material";

const AppearedFormDialog = ({ open, onClose, onSubmit }) => {
  const [expectedSalary, setExpectedSalary] = useState("");
  const [testRating, setTestRating] = useState(0);
  const [interviewRating, setInterviewRating] = useState(0);
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    onSubmit({ expectedSalary, testRating, interviewRating, remarks });
    setExpectedSalary("");
    setTestRating(0);
    setInterviewRating(0);
    setRemarks("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          <TextField
            label="Expected Salary"
            type="number"
            fullWidth
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
          />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ minWidth: "140px", fontWeight: "500" }}>
              Test Rating:
            </Typography>
            <Rating
              name="test-rating"
              value={testRating}
              precision={0.5}
              onChange={(e, newValue) => setTestRating(newValue)}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ minWidth: "140px", fontWeight: "500" }}>
              Interview Rating:
            </Typography>
            <Rating
              name="interview-rating"
              value={interviewRating}
              precision={0.5}
              onChange={(e, newValue) => setInterviewRating(newValue)}
            />
          </Box>

          <TextField
            label="Remarks"
            multiline
            rows={4}
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "end", pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#263238", borderColor: "#263238" }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppearedFormDialog;
