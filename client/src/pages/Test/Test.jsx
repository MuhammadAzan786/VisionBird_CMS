import { InfoOutlined } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { customColors } from "../../theme/colors";

const Test = () => {
  const [state, setState] = useState({});

  const date = {
    month: 12,
    year: 2024,
  };
  useEffect(() => {
    const calculateLeaves = async () => {
      try {
        const res = await axios.post("/api/pay/calculate_leaves", {
          date,
          id: "6757f2719e6db7999c4d695e",
        });
        setState(res.data);
      } catch (error) {
        console.log("Leaves Fetch Error");
      }
    };

    calculateLeaves();
  }, []);

  return (
    <>
      <Paper>
        <Typography variant="h2">Test route</Typography>
        {JSON.stringify(state)}
      </Paper>

      <Paper>{JSON.stringify(state.totalLeaves)}</Paper>
      <Paper>
        <Typography variant="h5" color="red">
          halfLeavesPaidCount: {state.halfLeavesPaidCount}
        </Typography>
        <br />
        <Typography variant="h5" color="red">
          halfLeavesUnpaidCount: {state.halfLeavesUnpaidCount}
        </Typography>
        <br />
        <Typography variant="h5" color="red">
          paidLeaves: {state.paidLeavesCount}
        </Typography>
        <br />
        <Typography variant="h5" color="green">
          unpaidLeaves: {state.unpaidLeavesCount}
        </Typography>
        <br />
        <Typography variant="h5" color="blue">
          Total Days IN Month: {state.totalDaysInMonth}
        </Typography>
        <br />
        <Typography variant="h5" color="purple">
          Salary Per Day: {state.salaryPerday}
        </Typography>

        <br />
        <Typography variant="h5" color="grey">
          Total Salary: {state.totalSalary}
        </Typography>
      </Paper>
    </>
  );
};

export default Test;
