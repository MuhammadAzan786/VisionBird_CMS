import { Box, Button, Grid, Paper, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import axios from "../../utils/axiosInterceptor";
import dayjs from "dayjs";
import { getCurrentMonth } from "../../utils/common";
import toast from "react-hot-toast";
import Invoice from "./components/Invoice";

const Salary = () => {
  const { toPDF, targetRef } = usePDF({ filename: "Salary.pdf" });
  const location = useLocation();
  const { employeeDetails } = location.state || {};

  const queryParams = new URLSearchParams(location.search);
  const queryParamsData = Object.fromEntries(queryParams.entries());

  const {
    paidDate,
    extraBonusAmount,
    extraBonusRemarks,
    incentive,
    totalWorkingDays,
    month: salary_month,
    year: salary_year,
    paymentMethod,
    chequeNumber = null,
    otherDetails = null,
  } = queryParamsData;

  const [salaryDetails, setSalaryDetails] = useState({
    incentive,
    paymentMethod,
    paidDate,
  });

  const paymentDetails = {
    paymentMethod,
    ...(chequeNumber ? { chequeNumber } : {}),
    ...(otherDetails ? { otherDetails } : {}),
  };

  const [leaveDetails, setLeaveDetails] = useState([]);
  const [workDetails, setWorkDetails] = useState({ totalWorkingDays });

  const bonusDetails = {
    extraBonusAmount,
    extraBonusRemarks,
  };

  const [loanDetails, setLoanDetails] = useState({ isLoanActive: false });

  const [netSalaryBeforeTax, setNetSalaryBeforeTax] = useState(0);

  const [netSalary, setNetSalary] = useState(0);

  const fetchSalaryDetails = async () => {
    await axios
      .post(`/api/pay/view_salary`, {
        salary_month,
        salary_year,
        incentive,
        extraBonusAmount,
        employeeDetails,
        totalWorkingDays,
      })
      .then((response) => {
        console.log("View Data", response.data);
        setSalaryDetails((prev) => {
          return {
            ...prev,
            ...response.data.salaryDetails,
          };
        });
        setLeaveDetails(response.data.leaveDetails);
        setWorkDetails((prev) => {
          return { ...prev, ...response.data.workDetails };
        });

        setNetSalary(response.data.netSalary);
        setLoanDetails(response.data.loanDetails);
        setNetSalaryBeforeTax(response.data.netSalaryBeforeTax);
      })
      .catch((error) => {
        console.error("Error fetching salary data:", error);
      });
  };

  const saveSalaryDetails = async () => {
    await axios
      .post(`/api/pay/pay_salary`, {
        userId: employeeDetails._id,
        salary_month,
        salary_year,
        paidDate,
        salaryDetails,
        paymentDetails,
        workDetails,
        leaveDetails,
        bonusDetails,
        loanDetails,
        netSalary,
      })
      .then()
      .catch((error) => {
        console.error("Error fetching salary data:", error);
        toast.error("Error Generating Salary");
      });
  };

  useEffect(() => {
    fetchSalaryDetails();
  }, []);

  return (
    <Box p={3}>
      <Box marginBottom={2} display={"flex"} justifyContent={"right"}>
        <Button
          variant="contained"
          onClick={() => {
            toPDF();
            saveSalaryDetails();
          }}
        >
          Save Details & Download Slip
        </Button>
      </Box>

      <Invoice
        ref={targetRef}
        workDetails={workDetails}
        paymentDetails={paymentDetails}
        employeeDetails={employeeDetails}
        salaryDetails={salaryDetails}
        leaveDetails={leaveDetails}
        bonusDetails={bonusDetails}
        loanDetails={loanDetails}
        netSalary={netSalary}
        paidDate={paidDate}
        salary_month={salary_month}
        salary_year={salary_year}
      />
    </Box>
  );
};

// const DivStyled = styled("div")(() => ({
//   border: "1px solid #ccc",
//   padding: "10px",
//   textAlign: "center",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
// }));

// const HeadingStyled = styled("div")(({ bgColor }) => ({
//   marginTop: 10,
//   marginBottom: 0,
//   backgroundColor: bgColor || "#145DA0",
//   textAlign: "center",
//   padding: "8px",
// }));

export default Salary;
