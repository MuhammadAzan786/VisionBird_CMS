import React, { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { Paper, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Test = () => {
  // State to hold the selected date
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate); // Update the state with the selected date
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <Paper>
          <h4>Selected Date (ISO format):</h4>
          <p>{selectedDate ? selectedDate.toISOString() : "No date selected"}</p>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default Test;
