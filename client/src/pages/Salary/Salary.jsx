import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import axios from "../../utils/axiosInterceptor";
import dayjs from "dayjs";
import { getCurrentMonth } from "../../utils/common";

const Salary = () => {
  const { toPDF, targetRef } = usePDF({ filename: "Salary.pdf" });
  const navigate = useNavigate();

  const [queryParamsData, setQueryParamsData] = useState({});
  const [salaryDetails, setSalaryDetails] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});

  const { id } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const incentive = queryParams.get("incentive");
  const extraBonus = queryParams.get("extra_bonus_amount");
  const extraAmountRemarks = queryParams.get("extra_amount_remarks");
  const paymentMethod = queryParams.get("paymentMethod");
  const chequeNumber = queryParams.get("chequeNumber");
  const totalWorkingDays = queryParams.get("totalWorkingDays");
  const paidDate = queryParams.get("paidDate");
  const month = queryParams.get("month");
  const year = queryParams.get("year");

  const saveSalaryDetails = async () => {
    await axios
      .post(`/api/pay/pay_salary/${id}`, {
        button: "Post_Salary",
        salary_month: queryParamsData.month,
        salary_year: queryParamsData.year,
        incentive: queryParamsData.incentive,
        extra_bonus: queryParamsData.extraBonus,
        payment_method: queryParamsData.paymentMethod,
        cheque_number: queryParamsData.chequeNumber,
        extra_amount_remarks: queryParamsData.extraAmountRemarks,
      })
      .then((response) => {
        console.log(response);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching salary data:", error);
      });
  };

  const fetchSalaryDetails = async () => {
    await axios
      .post(`/api/pay/pay_salary/${id}`, {
        button: "Show_Salary_Details",
        salary_month: queryParamsData.month,
        salary_year: queryParamsData.year,
        Half_leaves: queryParamsData.halfLeaves,
        Full_leaves: queryParamsData.fullLeaves,
        paid_leaves: queryParamsData.paidLeaves,
        unpaid_leaves: queryParamsData.unpaidLeaves,
        incentive: queryParamsData.incentive,
        extra_bonus: queryParamsData.extraBonus,
      })
      .then((response) => {
        setSalaryDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching salary data:", error);
      });
  };

  const fetchEmployeeDetails = async () => {
    await axios
      .get(`/api/employee/get_employee/${id}`)
      .then((response) => {
        setEmployeeDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  };

  useEffect(() => {
    fetchEmployeeDetails();

    setQueryParamsData({
      id,
      incentive,
      extraBonus,
      paymentMethod,
      extraAmountRemarks,
      chequeNumber,
      totalWorkingDays,
      paidDate,
      month,
      year,
    });
  }, []);

  useEffect(() => {
    console.log(queryParamsData);
    fetchSalaryDetails();
  }, [queryParamsData]);

  useEffect(() => {
    console.log(queryParamsData);
    console.log("salry detail", salaryDetails);
  }, [salaryDetails]);

  useEffect(() => {
    console.log(employeeDetails);
  }, [employeeDetails]);

  return (
    <Box p={3}>
      <Box marginBottom={2} display={"flex"} justifyContent={"right"}>
        <Button
          variant="contained"
          onClick={() => {
            toPDF();
            saveSalaryDetails();
            navigate("/pay-salaries");
          }}
        >
          Save Details & Download Slip
        </Button>
      </Box>

      <Paper sx={{ p: 4 }} ref={targetRef}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <img style={{ height: 80 }} src="/vbt-logo.png" alt="logo" />
          <Box textAlign={"right"}>
            <Typography variant="body2">
              B-343, Street Pagganwala, Near Cheema Masjid, Shadman Colony,
              Gujrat, Pakistan.
            </Typography>
            <Typography variant="body2">
              Mobile: (0322, 0346, 0335) 5930603
            </Typography>
            <Typography variant="body2">
              Landline: +92-53-3709168 | +92-53-3728469
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={1} style={{ marginTop: 5 }}>
          <Grid item xs={12}>
            <div
              style={{
                marginBottom: 0,
                backgroundColor: "#C00000",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                padding: "8px",
              }}
            >
              <Typography
                style={{ color: "white" }}
                variant={"h7"}
                fontWeight={700}
              >
                Full & Final Settlement of Dues
              </Typography>
              <Typography
                style={{ color: "white" }}
                variant={"h7"}
                fontWeight={700}
              >
                For the Month of {getCurrentMonth(queryParamsData.month)},{" "}
                {queryParamsData.year}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    // textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Employee / Internee Name:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {employeeDetails.employeeName}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Employee / Internee Code:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {employeeDetails.employeeID}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Designation:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {employeeDetails.employeeDesignation}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Bank Account Number:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {employeeDetails.bankAccountNumber}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Date Join:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {/* {employeeDetails.dateOfJoining} */}
                    {dayjs(employeeDetails.dateOfJoining).format("DD/MM/YYYY")}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    CNIC #:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {employeeDetails.employeeCNIC}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Cheque Number:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {queryParamsData.chequeNumber}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Payment Method:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {queryParamsData.paymentMethod}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Date of Birth:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {/* {employeeDetails.dateOfBirth} */}
                    {dayjs(employeeDetails.dateOfBirth).format("DD/MM/YYYY")}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Gender:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {employeeDetails.gender}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Address:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {employeeDetails.mailingAddress}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Working Days by Company:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {salaryDetails.working_days_without_weekends}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Days Worked:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {salaryDetails.total_days_worked}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Incentive:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    PKR {queryParamsData.incentive}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Basic Pay:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    PKR {salaryDetails.basicPay}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Allowences:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    PKR {salaryDetails.allowances}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Gross Salary:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    PKR {salaryDetails.grossSalary}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <div
              style={{
                marginTop: 20,
                marginBottom: 0,
                backgroundColor: "#145DA0",
                textAlign: "center",
                padding: "8px",
              }}
            >
              <Typography
                fontWeight={700}
                fontSize={18}
                style={{ color: "white" }}
              >
                Leave Information
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Short /Half Leave:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {salaryDetails.unpaid_half_leaves}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Casual Leave:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>0</Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Sick Leave:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>0</Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Without Pay Leave:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {salaryDetails.unpaid_fullday_leaves}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Cash Leave:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {salaryDetails.paidLeaves}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Other/Yearly Leave:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>0</Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Net Salary:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    PKR {salaryDetails.net_salary}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <div
              style={{
                marginTop: 10,
                marginBottom: 0,
                backgroundColor: "#145DA0",
                textAlign: "center",
                padding: "8px",
              }}
            >
              <Typography
                fontWeight={700}
                fontSize={18}
                style={{ color: "white" }}
              >
                Extra / Bonus
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Extra Bonus Amount:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    PKR {queryParamsData.extraBonus}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={8}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Extra Amount Remarks:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {queryParamsData.extraAmountRemarks}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          {/* ================================ Payment Information ================================ */}

          {salaryDetails.loan && (
            <>
              <Grid item xs={12}>
                <div
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    backgroundColor: "#145DA0",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    fontSize={18}
                    style={{ color: "white" }}
                  >
                    Advance Payment Information
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ display: "inline-block" }}
                        fontWeight={700}
                      >
                        Loan Taken:
                      </Typography>

                      <Typography style={{ display: "inline-block" }}>
                        PKR {salaryDetails.loan.loan_amount}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ display: "inline-block" }}
                        fontWeight={700}
                      >
                        Loan Remaining:
                      </Typography>
                      <Typography style={{ display: "inline-block" }}>
                        PKR {salaryDetails.loan.loan_left}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={4}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ display: "inline-block" }}
                        fontWeight={700}
                      >
                        Loan Deducted:
                      </Typography>
                      <Typography
                        style={{
                          display: "inline-block",
                          color: "red",
                        }}
                      >
                        PKR {salaryDetails.loan.loan_deducted}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          {salaryDetails.advanceSalary && (
            <>
              <Grid item xs={12}>
                <div
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    backgroundColor: "#145DA0",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    fontSize={18}
                    style={{ color: "white" }}
                  >
                    Advance Payment Information advance salary
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ display: "inline-block" }}
                        fontWeight={700}
                      >
                        Advance Salary Taken:
                      </Typography>

                      <Typography style={{ display: "inline-block" }}>
                        {salaryDetails.advanceSalary.advance_salary_months}
                        {salaryDetails.advanceSalary.advance_salary_months > 1
                          ? " Months"
                          : " Month"}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ display: "inline-block" }}
                        fontWeight={700}
                      >
                        Advance Salary Remaining:
                      </Typography>
                      <Typography style={{ display: "inline-block" }}>
                        {salaryDetails.advanceSalary.advance_salary_left}
                        {salaryDetails.advanceSalary.advance_salary_left > 1
                          ? " Months"
                          : " Month"}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={4}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ display: "inline-block" }}
                        fontWeight={700}
                      >
                        Advance Salary Deducted:
                      </Typography>
                      <Typography
                        style={{
                          display: "inline-block",
                          color: "red",
                        }}
                      >
                        {salaryDetails.advanceSalary.advance_salary_deducted}{" "}
                        Month
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {/* ================================ Payment Information ================================ */}

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
              <Typography
                fontWeight={700}
                fontSize={23}
                style={{ color: "white", display: "inline-block" }}
              >
                Net Amount Paid:
              </Typography>
              <Typography
                fontWeight={700}
                fontSize={23}
                style={{ color: "white", display: "inline-block" }}
              >
                PKR {salaryDetails.net_salary}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Paid By:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    Irfan Mahmood (CEO)
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Paid Date:
                  </Typography>
                  <Typography style={{ display: "inline-block" }}>
                    {dayjs(queryParamsData.paidDate).format(
                      "dddd, MMMM D, YYYY"
                    )}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid item xs={12}>
              <div
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "3px",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography style={{}} variant="body2">
                  All Previous/Current dues cleared up to the date mentioned
                  here. So this is Full and Final Payment from Vision Bird
                  Technologies, Gujrat.
                </Typography>
              </div>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{ marginTop: 130 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Employee&apos;s/Internee&apos;s Signature
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    Thumb Impression
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    style={{ display: "inline-block" }}
                    fontWeight={700}
                  >
                    CEO Signature with Stamp
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Salary;
