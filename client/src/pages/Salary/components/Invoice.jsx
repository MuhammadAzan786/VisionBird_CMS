import { Box, Grid, Paper, styled, Typography } from "@mui/material";

const Invoice = ({ salaryData }) => {
  return (
    <Box p={3}>
      <Paper sx={{ p: 4 }}>
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

        {/* ==================================================Full & Final Settlement =========================================== */}
        <Grid container spacing={1} style={{ marginTop: 5 }}>
          <Grid item xs={12}>
            <BlueDivStyled bgColor="#C00000">
              <Typography style={{ color: "white" }} variant={"h7"} fontWeight={700}>
                Full & Final Settlement of Dues
              </Typography>
              <Typography style={{ color: "white" }} variant={"h7"} fontWeight={700}>
                For the Month of ali
              </Typography>
            </BlueDivStyled>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Employee / Internee Name:</Typography>
                  <Typography>{salaryData.employeeName}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Employee / Internee Code:</Typography>
                  <Typography>{salaryData.employeeID}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Designation:</Typography>
                  <Typography>{salaryData.employeeDesignation}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Bank Account Number:</Typography>
                  <Typography>{salaryData.bankAccountNumber}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Date Join:</Typography>
                  <Typography>{salaryData.dateOfJoining}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>CNIC #:</Typography>
                  <Typography>{salaryData.employeeCNIC}</Typography>
                </DivStyled>
              </Grid>

              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Cheque Number:</Typography>
                  <Typography>asd</Typography>
                </DivStyled>
              </Grid>

              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Payment Method:</Typography>
                  <Typography>asd</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Date of Birth:</Typography>
                  <Typography>{salaryData.dateOfBirth}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={6}>
                <DivStyled>
                  <Typography fontWeight={700}>Gender:</Typography>
                  <Typography>{salaryData.gender}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <DivStyled>
                  <Typography fontWeight={700}>Address:</Typography>
                  <Typography>{salaryData.mailingAddress}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Working Days by Company:</Typography>
                  <Typography>asd</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Days Worked:</Typography>
                  <Typography>asd</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Incentive:</Typography>
                  <Typography>PKR {salaryData.incentive}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Basic Pay:</Typography>
                  <Typography>{salaryData.BasicPayAfterProbationPeriod}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Allowences:</Typography>
                  <Typography>{salaryData.AllowancesAfterProbationPeriod}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Gross Salary:</Typography>
                  <Typography>PKR {salaryData.gross_salary}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          {/* ================================================== Leave Information =========================================== */}
          <Grid item xs={12}>
            <BlueDivStyled bgColor="#145DA0">
              <Typography fontWeight={700} fontSize={18} style={{ color: "white" }}>
                Leave Information
              </Typography>
            </BlueDivStyled>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Short /Half Leave:</Typography>
                  <Typography>{salaryData.Half_leaves}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Casual Leave:</Typography>
                  <Typography>0</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Sick Leave:</Typography>
                  <Typography>0</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Without Pay Leave:</Typography>
                  <Typography>asda</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Cash Leave:</Typography>
                  <Typography>asda</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Other/Yearly Leave:</Typography>
                  <Typography>0</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Net Salary:</Typography>
                  <Typography>PKR {salaryData.net_salary}</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          {/* ==================================================Extra / Bonus =========================================== */}
          <Grid item xs={12}>
            <BlueDivStyled bgColor="#145DA0">
              <Typography fontWeight={700} fontSize={18} style={{ color: "white" }}>
                Extra / Bonus
              </Typography>
            </BlueDivStyled>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <DivStyled>
                  <Typography fontWeight={700}>Extra Bonus Amount:</Typography>
                  <Typography>PKR {salaryData.extra_bonus}</Typography>
                </DivStyled>
              </Grid>
              <Grid item xs={8}>
                <DivStyled>
                  <Typography fontWeight={700}>Extra Amount Remarks:</Typography>
                  <Typography>TODO:</Typography>
                </DivStyled>
              </Grid>
            </Grid>
          </Grid>

          {/* ================================ Payment Information ================================ */}

          {/* ================================ Payment Information ================================ */}

          {/* ==================================================Net Amount Paid =========================================== */}

          <Grid item xs={12}>
            <BlueDivStyled bgColor="#C00000" sx={{ display: "flex", justifyContent: "space-around", padding: "10px" }}>
              <Typography fontWeight={700} fontSize={23} style={{ color: "white", display: "inline-block" }}>
                Net Amount Paid:
              </Typography>
              <Typography fontWeight={700} fontSize={23} style={{ color: "white", display: "inline-block" }}>
                PKR asda
              </Typography>
            </BlueDivStyled>
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
                  <Typography>asdadas</Typography>
                </DivStyled>
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
                  All Previous/Current dues cleared up to the date mentioned here. So this is Full and Final Payment
                  from Vision Bird Technologies, Gujrat.
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
                  <Typography fontWeight={700}>Employee&apos;s/Internee&apos;s Signature</Typography>
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
                  <Typography fontWeight={700}>Thumb Impression</Typography>
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
                  <Typography fontWeight={700}>CEO Signature with Stamp</Typography>
                </div>
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

const BlueDivStyled = styled("div")(({ bgColor }) => ({
  marginTop: 10,
  marginBottom: 0,
  backgroundColor: bgColor || "#145DA0",
  textAlign: "center",
  padding: "8px",
}));
export default Invoice;
