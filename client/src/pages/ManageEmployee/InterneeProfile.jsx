import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../../utils/axiosInterceptor";
import { Box, Typography, Avatar, Divider, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { usePDF } from "react-to-pdf";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useMessage } from "../../components/MessageContext";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";

import { Link as RouterLink, MemoryRouter } from "react-router-dom";

import { useSelector } from "react-redux";

import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import ManOutlinedIcon from "@mui/icons-material/ManOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import EscalatorWarningOutlinedIcon from "@mui/icons-material/EscalatorWarningOutlined";
import AssistWalkerOutlinedIcon from "@mui/icons-material/AssistWalkerOutlined";
import BlindIcon from "@mui/icons-material/Blind";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import LocalPoliceOutlinedIcon from "@mui/icons-material/LocalPoliceOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

const InterneeProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const { showMessage } = useMessage();
  const { toPDF, targetRef } = usePDF({ filename: "profile.pdf" });
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleSuccess = () => {
    showMessage("success", "Internee Deleted successful!");
  };

  const handleError = () => {
    showMessage("error", "Internee Deleted failed!");
  };

  const getRandomColor = () => {
    const letters = "9ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  const color = getRandomColor();

  const [user, setUser] = useState([]);
  const profilePic = user.interneeProImage;
  const cnicFile = user.cnicFile;
  const appointmentletter = user.appointmentFile;
  const experienceletter = user.experienceLetter;
  const getUser = async () => {
    try {
      const response = await axios.get(`/api/internee/get_internee/${id}`);

      // Assuming response.data contains the employee data
      setUser(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error(`Server responded with status ${error.response.status}`);
        console.error(`Error message: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request made but no response received");
      } else {
        // Something else happened while setting up the request
        console.error("Error setting up the request:", error.message);
      }
      console.error("Error fetching employee data:", error);
    }
  };

  const dateformat = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dateOfBirth = dateformat(user.dob);
  const internshipfrom = dateformat(user.internshipFrom);
  const internshipto = dateformat(user.internshipTo);
  const experianceLetter = dateformat(user.givenOn);

  const handleEdit = () => {
    navigate(`/update-internee/${id}`);
  };

  const handleDelete = async () => {
    navigate("/manage-employees");
    try {
      const response = await axios.delete(
        `/api/internee/delete_internee/${id}`
      );
      handleSuccess();
    } catch (error) {
      // Handle different types of errors
      console.log("Error:", error);
      handleError();
    }
  };

  useEffect(() => {
    // Fetch user data with Axios
    getUser();
  }, []);
  return (
    <Grid width={"100%"}>
      <Grid p={3} ref={targetRef}>
        <Grid bgcolor={"white"} component={Paper} elevation={3} mb={4}>
          <Box
            sx={{
              background: color,
              height: "250px",
            }}
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"flex-end"}
          >
            {currentUser.role == "admin" && (
              <Box
                sx={{
                  background: color,
                  height: "250px",
                }}
                display={"flex"}
                justifyContent={"flex-end"}
                alignItems={"flex-end"}
              >
                <Button
                  sx={{
                    display: { xs: "none", md: "block" },
                    margin: 1,
                    fontWeight: 700,
                    fontSize: 15,
                    bgcolor: "white",
                  }}
                  color="success"
                  variant="outlined"
                  onClick={() => toPDF()}
                >
                  Download Profile
                </Button>
                <Button
                  sx={{
                    display: { xs: "none", md: "block" },
                    margin: 1,
                    fontWeight: 700,
                    fontSize: 15,
                    bgcolor: "white",
                  }}
                  variant="outlined"
                  onClick={handleEdit}
                >
                  Update Profile
                </Button>
                <Button
                  sx={{
                    display: { xs: "none", md: "block" },
                    margin: 1,
                    fontWeight: 700,
                    fontSize: 15,
                    bgcolor: "white",
                  }}
                  color="error"
                  variant="outlined"
                  onClick={handleDelete}
                >
                  Delete Profile
                </Button>
              </Box>
            )}
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "auto 1fr" }}
            mt={{ xs: "-65px", md: "-55px" }}
            pl={{ xs: 2, md: 5 }}
            height="auto"
            alignItems="center"
            p={3}
          >
            <Box mt={{ xs: "-35px", md: "-45px" }}>
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: 2,
                  border: "4px solid white",
                  margin: { xs: "0 auto", md: 0 },
                  bgcolor: "white",
                }}
                src={profilePic ? profilePic : ""}
              ></Avatar>
            </Box>

            <Box
              ml={{ xs: 0, md: 3 }}
              mt={{ xs: 2, md: 8 }}
              textAlign={{ xs: "center", md: "left" }}
            >
              <Typography fontSize={25} fontWeight={500} color={"#212F3D"}>
                {user.firstName}
              </Typography>
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems={{ xs: "center", md: "" }}
                gap={2}
                mt={2}
              >
                <Typography
                  fontSize={15}
                  color={"#5F6A6A"}
                  display="flex"
                  alignItems="center"
                >
                  <ColorLensOutlinedIcon
                    sx={{ marginRight: 1, color: "#5F6A6A" }}
                  />
                  {user.designation}
                </Typography>
                <Typography
                  fontSize={15}
                  color={"#5F6A6A"}
                  display="flex"
                  alignItems="center"
                >
                  <ManageAccountsOutlinedIcon
                    sx={{ marginRight: 1, color: "#5F6A6A" }}
                  />
                  {user.role || "INTERNEE"}
                </Typography>
                <Typography
                  fontSize={15}
                  color={"#5F6A6A"}
                  display="flex"
                  alignItems="center"
                >
                  <BadgeOutlinedIcon
                    sx={{ marginRight: 1, color: "#5F6A6A" }}
                  />
                  {user.internId}
                </Typography>
              </Box>
              <Box
                display={{ xs: "flex", md: "none" }}
                mt={3}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  onClick={() => toPDF()}
                  color="success"
                >
                  Download Profile
                </Button>
                <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  onClick={handleEdit}
                >
                  Update Profile
                </Button>
                <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete Profile
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid container p={5} elevation={3} component={Paper} gap={2}>
          <Grid item xs={12} component={Paper} p={2}>
            <Button
              sx={{
                color: "white",
                backgroundColor: "#1976d2",
                marginRight: 2,
                ":hover": {
                  color: "white",

                  backgroundColor: "rgba(25, 118, 210, 0.5)",
                },
              }}
              component={RouterLink}
              to={`/internee-profile/${id}`}
            >
              Profile
            </Button>
            {/* <Button
        sx={{
          color:"#5F6A6A",marginRight:2,
          ":hover":{
            color:'white',
            backgroundColor: "rgba(25, 118, 210, 0.5)"
          
          }
        }}
        component={RouterLink}
        to={`/portfolio/${id}`}
      >
        Portfolio
      </Button>
      {currentUser._id === id ? (
        <Button
          sx={{ 
            
          color: isActive(`/employeetaskboard/${id}`) ? '#1976d2' : '#5F6A6A',
          ":hover":{
            color:'white',
            backgroundColor: "rgba(25, 118, 210, 0.5)"
          
          }
        
        }}
          
          
          component={RouterLink}
          to={`/employeetaskboard/${id}`}
        >
          Tasks
        </Button>
      ) : (
        <Button
          sx={{ 
            ":hover":{
            color:'white',
            backgroundColor: "rgba(25, 118, 210, 0.5)"
          
          },
          color: isActive(`/employeetaskviewPause/${id}`) ? '#1976d2' : '#5F6A6A' }}
          component={RouterLink}
          to={`/employeetaskviewPause/${id}`}
        >
          Tasks
        </Button>
      )}

     */}
          </Grid>

          <Grid
            xs={12}
            md={5.85}
            item
            component={Paper}
            elevation={3}
            p={3}
            mt={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Grid item>
              <Typography fontSize={20} color={"#BFC9CA "}>
                Personal Info
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <CreditCardOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Cnic:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.cnic}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <CakeOutlinedIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Date of Birth:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {dateOfBirth}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <ManOutlinedIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Gender:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.gender}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <VolunteerActivismOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Marital Status:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.maritalStatus}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <EscalatorWarningOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Father Name:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.fatherName}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <AutoStoriesOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Qualification:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.qualification}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            xs={12}
            md={5.85}
            item
            component={Paper}
            elevation={3}
            p={2}
            mt={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Grid item>
              <Typography fontSize={20} color={"#BFC9CA "}>
                Contact Info
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <ContactMailOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Mail Address:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.mailingAddress}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <SmartphoneOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Mobile #:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.mobile}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <LocalPhoneOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Gardian Number:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.otherMobile}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <EscalatorWarningOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Gardian Relation:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.whosMobile}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <EmailOutlinedIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Email:
              </Typography>
              <Typography fontSize={13} color={"#212F3D"}>
                {user.email}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            xs={12}
            md={5.85}
            item
            gap={2}
            component={Paper}
            elevation={3}
            p={2}
            mt={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Grid item>
              <Typography fontSize={20} color={"#BFC9CA "}>
                Documents
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <CreditScoreOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Cnic Scanned Copy
              </Typography>
              <a href={cnicFile} target="_blank">
                <Button sx={{ padding: 0 }}>Click Here</Button>
              </a>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <LocalPoliceOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Appointment File{" "}
              </Typography>
              <a href={user.appointmentFile} target="_blank">
                <Button sx={{ padding: 0 }}>Click Here</Button>
              </a>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <WorkspacePremiumOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Experience Letter
              </Typography>
              <a href={user.experienceLetter} target="_blank">
                <Button sx={{ padding: 0 }}>Click Here</Button>
              </a>
            </Grid>
          </Grid>

          <Grid
            xs={12}
            md={5.85}
            item
            component={Paper}
            elevation={3}
            mt={2}
            p={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Grid item>
              <Typography fontSize={20} color={"#BFC9CA "}>
                Employee Info
              </Typography>
            </Grid>

            <Grid item display={"flex"} alignItems={"center"}>
              <HandshakeOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Date of Joining:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {internshipfrom}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <EventAvailableOutlinedIcon
                sx={{ marginRight: 1, color: "#5F6A6A" }}
              />
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                {" "}
                Ending Date :
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {internshipto}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            xs={12}
            md={5.85}
            item
            component={Paper}
            elevation={3}
            p={2}
            mt={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Grid item>
              <Typography fontSize={20} color={"#BFC9CA "}>
                Questionnaire
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Added on Slack:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.slack}
              </Typography>
            </Grid>
            <Grid item display={"flex"} alignItems={"center"}>
              <Typography
                fontSize={15}
                fontWeight={600}
                marginRight={1}
                color={"#212F3D"}
              >
                Rules policy check:
              </Typography>
              <Typography fontSize={15} color={"#212F3D"}>
                {user.rules}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InterneeProfile;
