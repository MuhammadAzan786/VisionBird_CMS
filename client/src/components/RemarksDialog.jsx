import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const RemarksDialog = ({ open, onClose, onSubmit }) => {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    onSubmit({ remarks });
    setRemarks("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <TextField
          label="Remarks"
          fullWidth
          margin="dense"
          multiline
          rows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemarksDialog;
