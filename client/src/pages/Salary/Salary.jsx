import { Box, Button, Grid, Paper, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import axios from "../../utils/axiosInterceptor";
import dayjs from "dayjs";
import { getCurrentMonth } from "../../utils/common";
import toast from "react-hot-toast";

const Salary = () => {
  const { toPDF, targetRef } = usePDF({ filename: "Salary.pdf" });
  const navigate = useNavigate();
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
            // navigate("/pay-salaries");
          }}
        >
          Save Details & Download Slip
        </Button>
      </Box>

      <Paper sx={{ p: 4 }} ref={targetRef}>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <img style={{ height: 80 }} src="/vbt-logo.png" alt="logo" />
          <Box textAlign={"right"}>
            <Typography variant="body2">
              B-343, Street Pagganwala, Near Cheema Masjid, Shadman Colony, Gujrat, Pakistan.
            </Typography>
            <Typography variant="body2">Mobile: (0322, 0346, 0335) 5930603</Typography>
            <Typography variant="body2">Landline: +92-53-3709168 | +92-53-3728469</Typography>
          </Box>
        </Box>

        <Grid container spacing={1} style={{ marginTop: 5 }}>
          <Grid item xs={12}>
            <HeadingStyled
              sx={{
                padding: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#C00000",
                color: "white",
              }}
            >
              <Typography variant={"h7"} fontWeight={700}>
                Full & Final Settlement of Dues
              </Typography>
              <Typography variant={"h7"} fontWeight={700}>
                For the Month of {getCurrentMonth(salary_month)}, {salary_year}
              </Typography>
            </HeadingStyled>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Employee / Internee Name:</Typography>
                  <Typography>{employeeDetails.employeeName}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Employee / Internee Code:</Typography>
                  <Typography>{employeeDetails.employeeID}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Designation:</Typography>
                  <Typography>{employeeDetails.employeeDesignation}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Bank Account Number:</Typography>
                  <Typography>{employeeDetails.bankAccountNumber || "None"}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Date Join:</Typography>
                  <Typography>
                    {/* {employeeDetails.dateOfJoining} */}
                    {dayjs(employeeDetails.dateOfJoining).format("DD/MM/YYYY")}
                  </Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>CNIC #:</Typography>
                  <Typography>{employeeDetails.employeeCNIC}</Typography>
                </DivStyled>
              </Grid>

              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Cheque Number:</Typography>
                  <Typography>{paymentDetails.chequeNumber ?? "None"}</Typography>
                </DivStyled>
              </Grid>

              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Payment Method:</Typography>
                  <Typography sx={{ textTransform: "capitalize" }}>{paymentDetails.paymentMethod}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Date of Birth:</Typography>
                  <Typography>{dayjs(employeeDetails.dateOfBirth).format("DD/MM/YYYY")}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Gender:</Typography>
                  <Typography sx={{ textTransform: "capitalize" }}>{employeeDetails.gender}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <DivStyled>
                  <Typography fontWeight={700}>Address:</Typography>
                  <Typography>{employeeDetails.mailingAddress}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Working Days by Company:</Typography>
                  <Typography>{workDetails.totalWorkingDays}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Days Worked:</Typography>
                  <Typography>{workDetails.daysWorked}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Incentive:</Typography>
                  <Typography>PKR {salaryDetails.incentive}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Basic Pay:</Typography>
                  <Typography>PKR {salaryDetails.basicPay}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Allowences:</Typography>
                  <Typography>PKR {salaryDetails.allowances}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Gross Salary:</Typography>
                  <Typography>PKR {salaryDetails.grossSalary}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>
          {/* =================================================Leaves =============================================== */}
          <Grid item xs={12}>
            <HeadingStyled bgColor="#145DA0">
              <Typography fontWeight={700} fontSize={18} style={{ color: "white" }}>
                Leave Information
              </Typography>
            </HeadingStyled>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {leaveDetails?.map((item, index) => {
                return (
                  <Grid item xs={4} key={index}>
                    <DivStyled>
                      <Typography fontWeight={700}>{item.label}</Typography>
                      <Typography> {item.value}</Typography>
                    </DivStyled>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          {/* ===========================leaves */}
          <Grid item xs={12}>
            <HeadingStyled bgColor="#145DA0">
              <Typography fontWeight={700} fontSize={18} style={{ color: "white" }}>
                Extra / Bonus
              </Typography>
            </HeadingStyled>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Extra Bonus Amount:</Typography>
                  <Typography>PKR {bonusDetails.extraBonusAmount || 0}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={8}>
                <DivStyled>
                  <Typography fontWeight={700}>Extra Amount Remarks:</Typography>
                  <Typography>{bonusDetails.extraBonusRemarks || "None"}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>
          {/* ========================================check test */}
          <Grid item xs={12}>
            <div
              style={{
                marginTop: 10,
                marginBottom: 0,
                backgroundColor: "#C00000",
                display: "flex",
                justifyContent: "space-around",
                padding: "10px",
              }}
            >
              <Typography fontWeight={700} fontSize={23} style={{ color: "white", display: "inline-block" }}>
                Net Amount Paid Before Tax:
              </Typography>
              <Typography fontWeight={700} fontSize={23} style={{ color: "white", display: "inline-block" }}>
                PKR {netSalaryBeforeTax}
              </Typography>
            </div>
          </Grid>

          {/* ========================================check test */}

          <Grid item xs={12}>
            <div
              style={{
                marginTop: 10,
                marginBottom: 0,
                backgroundColor: "#C00000",
                display: "flex",
                justifyContent: "space-around",
                padding: "10px",
              }}
            >
              <Typography fontWeight={700} fontSize={23} style={{ color: "white", display: "inline-block" }}>
                Net Amount Paid:
              </Typography>
              <Typography fontWeight={700} fontSize={23} style={{ color: "white", display: "inline-block" }}>
                PKR {netSalary}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Paid By:</Typography>
                  <Typography>Irfan Mahmood (CEO)</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Paid Date:</Typography>
                  <Typography>{dayjs(salaryDetails.paidDate).format("dddd, MMMM D, YYYY")}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid item xs={12}>
              <DivStyled sx={{ padding: "3px", border: "none", borderBottom: "1px solid #ccc" }}>
                <Typography variant="body2">
                  All Previous/Current dues cleared up to the date mentioned here. So this is Full and Final Payment
                  from Vision Bird Technologies, Gujrat.
                </Typography>
              </DivStyled>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{ marginTop: 130 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <DivStyled sx={{ justifyContent: "center", border: "none", borderTop: "1px solid #ccc" }}>
                  <Typography fontWeight={700}>Employee&apos;s/Internee&apos;s Signature</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled sx={{ justifyContent: "center", border: "none", borderTop: "1px solid #ccc" }}>
                  <Typography fontWeight={700}>Thumb Impression</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled sx={{ justifyContent: "center", border: "none", borderTop: "1px solid #ccc" }}>
                  <Typography fontWeight={700}>CEO Signature with Stamp</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

const DivStyled = styled("div")(() => ({
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const HeadingStyled = styled("div")(({ bgColor }) => ({
  marginTop: 10,
  marginBottom: 0,
  backgroundColor: bgColor || "#145DA0",
  textAlign: "center",
  padding: "8px",
}));

export default Salary;
