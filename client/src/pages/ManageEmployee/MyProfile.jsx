import React from "react";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { Avatar, Box, Chip, Grid, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;
  const profile = currentUser.employeeProImage.secure_url;
  const profilePic = `/api/employees/${currentUser.employeeProImage}`;
  const dateformat = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dateOfBirth = dateformat(currentUser.dateOfBirth);
  const dateConfirmed = dateformat(currentUser.dateConfirmed);
  const dateJoined = dateformat(currentUser.dateOfJoining);

  return (
    <Box p={3}>
      <Box display={"flex"} alignItems={"center"} gap={4}>
        <Avatar sx={{ height: 150, width: 150 }} src={profile}>
          <PersonIcon sx={{ fontSize: 100 }} />
        </Avatar>
        <Box width={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"baseline"}>
          <Box>
            <Typography variant="h3" color="initial">
              {currentUser.employeeName}
            </Typography>
            <Typography variant="h5">{currentUser.employeeDesignation}</Typography>
          </Box>
          <Chip sx={{ fontSize: 16 }} label={role} variant="outlined" />
        </Box>
      </Box>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Personal Info */}

        <Typography component={Grid} item xs={12} gutterBottom variant="h4">
          Personal Info
        </Typography>
        <Divider component={Grid} item xs={12} />
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Cnic:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.employeeCNIC}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Date of Birth:{" "}
          <Typography variant="body1" component={"span"}>
            {dateOfBirth}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Gender:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.gender}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Marital Status:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.maritalStatus}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Father Name:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.employeeFatherName}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Disability:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.disability}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Kind of Disability:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.disabilityType ? currentUser.disabilityType : "N/A"}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Qualification:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.qualification}
          </Typography>
        </Typography>

        {/* Employee Info */}

        <Typography component={Grid} item xs={12} gutterBottom variant="h4">
          Employee Info
        </Typography>
        <Divider component={Grid} item xs={12} />

        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Employee ID:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.employeeID}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Designation:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.employeeDesignation}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Role:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.role}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} gutterBottom variant="h6" fontWeight={600}>
          Added on Slack:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.addedInSlack}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Added on WhatsApp:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.addedInWhatsApp}
          </Typography>
        </Typography>

        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Annual Leave Signed:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.annualLeavesSigned}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Appointment Letter Given:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.appointmentLetterGiven}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Attendence Biometric:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.attendanceBiometric}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Bank Account:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.bankAccount}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Bank Account Number:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.bankAccountNumber}
          </Typography>
        </Typography>

        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Date Confirmed:{" "}
          <Typography variant="body1" component={"span"}>
            {dateConfirmed}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Date of Joining:{" "}
          <Typography variant="body1" component={"span"}>
            {dateJoined}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Employee Card:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.employeeCardGiven}
          </Typography>
        </Typography>

        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Employee Password:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.employeePassword}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Local Server Account:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.localServerAccountCreated}
          </Typography>
        </Typography>

        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Policy Book Signed:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.policyBookSigned}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          On Probation Period:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.probationPeriod}
          </Typography>
        </Typography>

        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Rules & Regulation policy check:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.rulesAndRegulationsSigned}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Salary after probation period:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.salaryAfterProbationPeriod}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Salary during probation period:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.salaryInProbationPeriod}
          </Typography>
        </Typography>
        {/* Employee Info */}

        <Typography component={Grid} item xs={12} gutterBottom variant="h4">
          Contact Info
        </Typography>
        <Divider component={Grid} item xs={12} />
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Mailing Address:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.mailingAddress}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Mobile #:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.mobileNumber}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Gardian Mobile Nmber:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.guardiansMobileNumber}
          </Typography>
        </Typography>
        <Typography component={Grid} item xs={12} sm={6} md={4} variant="h6" fontWeight={600}>
          Email:{" "}
          <Typography variant="body1" component={"span"}>
            {currentUser.email}
          </Typography>
        </Typography>
      </Grid>
    </Box>
  );
};

export default Profile;
