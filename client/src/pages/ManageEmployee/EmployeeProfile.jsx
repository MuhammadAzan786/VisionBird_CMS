import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axiosInterceptor";
import { Box, Typography, Button, Paper, Backdrop } from "@mui/material";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { usePDF } from "react-to-pdf";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
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
import { useMessage } from "../../components/MessageContext";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingAnim from "../../components/LoadingAnim";
import ViewDocuments from "../../components/ViewDocuments";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FolderZipOutlined } from "@mui/icons-material";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { customColors } from "../../theme/colors";

const EmployeeProfile = () => {
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "profile.pdf" });
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const queryClient = useQueryClient();

  const { currentUser } = useSelector((state) => state.user);

  const downloadZip = async () => {
    console.log("clicked", user);
    console.log("clicked", user);

    // Assuming `user` contains the arrays/objects like policeCertificateUpload[], cnicScanCopy[], etc.
    const projects = [
      ...user.policeCertificateUpload, // Array of objects with secure_url
      user.employeeProImage, // Object with secure_url (e.g., { secure_url: "..." })
      ...user.degreesScanCopy, // Array of objects with secure_url
      ...user.cnicScanCopy, // Array of objects with secure_url
    ];

    // Create a new JSZip instance
    const zip = new JSZip();
    const folder = zip.folder(`${user.employeeName}_Documents`);

    // Function to handle file addition to the zip
    const addFileToZip = async (fileUrl, fileName) => {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      folder.file(fileName, blob);
    };

    // Iterate through each project (either object with secure_url or array of objects with secure_url)
    for (const project of projects) {
      // If it's a single object (like employeeProImage) with a 'secure_url'
      if (project?.secure_url) {
        const fileName = project?.secure_url.split("/").pop();
        await addFileToZip(project?.secure_url, fileName);
      }
      // If it's an array of objects (like policeCertificateUpload[], cnicScanCopy[], etc.)
      else if (Array.isArray(project)) {
        for (const item of project) {
          if (item?.secure_url) {
            const fileName = item?.secure_url.split("/").pop();
            await addFileToZip(item?.secure_url, fileName);
          }
        }
      }
    }

    // Generate the ZIP file and trigger the download
    await zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, `${user.employeeName}_Documents.zip`);
    });
    //  const projects= // policeCertificateUpload[] ,employeeProImage{secure_url },degreesScanCopy[], cnicScanCopy[]

    //   const zip = new JSZip();
    //   const folder = zip.folder("projects");
    //   for (const project of projects) {
    //     console.log("this is project ");
    //     console.log(project);
    //     const response = await fetch(project.project_images);
    //     console.log("res", response);
    //     const blob = await response.blob();

    //     // Add each file to the folder inside the zip
    //     for (const img of project.project_images) {
    //       folder.file(img.split("/").pop(), blob);
    //     }
    //   }
    //   await zip.generateAsync({ type: "blob" }).then(function (blob) {
    //     saveAs(blob, `projects.zip`);
    //   });
  };
  const handleSuccess = () => {
    showMessage("success", "Employee Deleted successful!");
  };

  const handleError = () => {
    showMessage("error", "Employee Deleted failed!");
  };

  const dateformat = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`/api/employee/get_employee/${id}`);
      console.log("ress", response);
      setUser(response.data);

      console.log("user data", response.data);
      // console.log(response.data.length);
    } catch (error) {
      if (error.response) {
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
  console.log("user is ", user);

  const dateOfBirth = dateformat(user.dateOfBirth);
  const dateConfirmed = dateformat(user.dateConfirmed);
  const dateJoined = dateformat(user.dateOfJoining);
  useEffect(() => {
    getUser();
  }, []);

  const handleEdit = () => {
    navigate(`/update-employee-profile/${id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    await axios
      .delete(`/api/employee/delete_employee/${id}`)
      .then(() => {
        setLoading(false);
        toast.success("Employee Deleted Successfully!");
        queryClient.invalidateQueries("employees");
        navigate("/manage-employees");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error("Error Deleting Employee");
      });
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

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  {
    if (currentUser.role == "employee" && currentUser._id != id) {
      return <Navigate to="/unauthorized" />;
    } else {
      return (
        <Box p={1} width={"100%"}>
          <Box p={3} ref={targetRef}>
            <Box bgcolor={"white"} component={Paper} mb={4}>
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
                      disableRipple
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
                    src={user?.employeeProImage?.secure_url || ""}
                  ></Avatar>
                </Box>

                <Box
                  ml={{ xs: 0, md: 3 }}
                  mt={{ xs: 2, md: 8 }}
                  textAlign={{ xs: "center", md: "left" }}
                >
                  <Typography fontSize={25} fontWeight={500} color={"#212F3D"}>
                    {user.employeeName}
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
                      {user.employeeDesignation}
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
                      {user.role}
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
                      {user.employeeID}
                    </Typography>
                  </Box>
                  {currentUser.role == "admin" && (
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
                  )}
                </Box>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {currentUser.role == "admin"}
              <Grid
                item
                xs={12}
                sx={{
                  marginLeft: 2,
                }}
                component={Paper}
                p={2}
              >
                <Button
                  // sx={{
                  //   color: "white",
                  //   backgroundColor: customColors.mainAlpha,
                  //   marginRight: 2,
                  //   ":hover": {
                  //     color: "white",
                  //     backgroundColor: customColors.main,
                  //   },
                  // }}
                  variant="contained"
                  sx={{ marginRight: 2 }}
                  component={RouterLink}
                  to={`/employee-profile/${id}`}
                >
                  Profile
                </Button>

                <Button
                  // sx={{
                  //   color: "#5F6A6A",
                  //   marginRight: 2,
                  //   ":hover": {
                  //     color: "white",
                  //     backgroundColor: "rgba(25, 118, 210, 0.5)",
                  //   },
                  // }}
                  sx={{
                    marginRight: 2,
                    ":hover": {
                      // color: "white",
                      backgroundColor: customColors.mainAlpha,
                    },
                  }}
                  component={RouterLink}
                  to={
                    currentUser.role == "admin" && currentUser._id == id
                      ? "/all-portfolio-page"
                      : `/portfolio/${id}`
                  }
                >
                  Portfolio
                </Button>
                <Button
                  // sx={{
                  //   color: isActive(`/employeetaskboard/${id}`)
                  //     ? "#1976d2"
                  //     : "#5F6A6A",
                  //   ":hover": {
                  //     color: "white",
                  //     backgroundColor: "rgba(25, 118, 210, 0.5)",
                  //   },
                  // }}
                  sx={{
                    marginRight: 2,
                    ":hover": {
                      // color: "white",
                      backgroundColor: customColors.mainAlpha,
                    },
                  }}
                  component={RouterLink}
                  to={
                    (currentUser.role !== "employee" &&
                      currentUser._id == id) ||
                    user.role == "manager"
                      ? "/all-tasks"
                      : `/employeetaskboard/${id}`
                  }
                >
                  Tasks
                </Button>
              </Grid>

              <Grid item xs={12} md={5.5}>
                <Grid container gap={2} component={Paper} p={2}>
                  <Grid item xs={12}>
                    <Typography fontSize={20} color={"#BFC9CA "}>
                      Personal Info
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                      {user.employeeCNIC}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <CakeOutlinedIcon
                      sx={{ marginRight: 1, color: "#5F6A6A" }}
                    />
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
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <ManOutlinedIcon
                      sx={{ marginRight: 1, color: "#5F6A6A" }}
                    />
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
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                      {user.employeeFatherName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <AssistWalkerOutlinedIcon
                      sx={{ marginRight: 1, color: "#5F6A6A" }}
                    />
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Disability:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.disability}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <BlindIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Kind of Disability:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.disabilityType ? user.disabilityType : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                <Grid container gap={2} component={Paper} p={2} mt={2}>
                  <Grid item xs={12}>
                    <Typography fontSize={20} color={"#BFC9CA "}>
                      Contact Info
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                      {user.mobileNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                      {user.guardiansMobileNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <EmailOutlinedIcon
                      sx={{ marginRight: 1, color: "#5F6A6A" }}
                    />
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
                {/* <Grid container gap={2} component={Paper} p={2} mt={2}>
                  <Grid item xs={12}>
                    <Typography fontSize={20} color={"#BFC9CA "}>
                      Documents
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                    <a href={cnic} target="_blank">
                      <Button sx={{ padding: 0 }}>Click Here</Button>
                    </a>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <LocalPoliceOutlinedIcon
                      sx={{ marginRight: 1, color: "#5F6A6A" }}
                    />
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Police Certificate
                    </Typography>
                    <a href={policecertificate} target="_blank">
                      <Button sx={{ padding: 0 }}>Click Here</Button>
                    </a>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <WorkspacePremiumOutlinedIcon
                      sx={{ marginRight: 1, color: "#5F6A6A" }}
                    />
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Degree Certificate
                    </Typography>
                    <a href={degree} target="_blank">
                      <Button sx={{ padding: 0 }}>Click Here</Button>
                    </a>
                  </Grid>
                </Grid> */}
              </Grid>

              <Grid item xs={12} md={6.5}>
                <Grid container gap={2} component={Paper} p={2}>
                  <Grid item xs={12}>
                    <Typography fontSize={20} color={"#BFC9CA "}>
                      Employee Info
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                      Date Confirmed:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {dateConfirmed}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
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
                      {dateJoined}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <AccountBalanceOutlinedIcon
                      sx={{ marginRight: 1, color: "#5F6A6A" }}
                    />
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Bank Account Number:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.bankAccountNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display={"flex"} alignItems={"center"}>
                    <LockOutlinedIcon
                      sx={{ marginRight: 1, color: "#5F6A6A" }}
                    />
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Employee Password:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.employeePassword}
                    </Typography>
                  </Grid>
                  {user.probationPeriod === "yes" ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} display="flex" alignItems="center">
                        <MonetizationOnOutlinedIcon
                          sx={{ marginRight: 1, color: "#5F6A6A" }}
                        />
                        <Typography
                          fontSize={15}
                          fontWeight={600}
                          marginRight={1}
                          color="#212F3D"
                        >
                          Basic Pay In Probation Period :
                        </Typography>
                        <Typography fontSize={15} color="#212F3D">
                          {user.BasicPayInProbationPeriod}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} display="flex" alignItems="center">
                        <CurrencyExchangeOutlinedIcon
                          sx={{ marginRight: 1, color: "#5F6A6A" }}
                        />
                        <Typography
                          fontSize={15}
                          fontWeight={600}
                          marginRight={1}
                          color="#212F3D"
                        >
                          Allowances In Probation Period :
                        </Typography>
                        <Typography fontSize={15} color="#212F3D">
                          {user.AllowancesInProbationPeriod}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={12} display="flex" alignItems="center">
                        <MonetizationOnOutlinedIcon
                          sx={{ marginRight: 1, color: "#5F6A6A" }}
                        />
                        <Typography
                          fontSize={15}
                          fontWeight={600}
                          marginRight={1}
                          color="#212F3D"
                        >
                          Basic Pay:
                        </Typography>
                        <Typography fontSize={15} color="#212F3D">
                          {user.BasicPayAfterProbationPeriod}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} display="flex" alignItems="center">
                        <CurrencyExchangeOutlinedIcon
                          sx={{ marginRight: 1, color: "#5F6A6A" }}
                        />
                        <Typography
                          fontSize={15}
                          fontWeight={600}
                          marginRight={1}
                          color="#212F3D"
                        >
                          Allowances:
                        </Typography>
                        <Typography fontSize={15} color="#212F3D">
                          {user.AllowancesAfterProbationPeriod}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Grid>

                <Grid container gap={2} component={Paper} p={2} mt={2}>
                  <Grid item xs={12}>
                    <Typography fontSize={20} color={"#BFC9CA "}>
                      Questionnaire
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Added on Slack:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.addedInSlack}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Attendence Biometric:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.attendanceBiometric}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Added on WhatsApp:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.addedInWhatsApp}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Annual Leave Signed:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.annualLeavesSigned}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Bank Account:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.bankAccount}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Appointment Letter Given:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.appointmentLetterGiven}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Employee Card:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.employeeCardGiven}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Local Server Account:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.localServerAccountCreated}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Policy Book Signed:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.policyBookSigned}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      On Probation Period:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.probationPeriod}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      marginRight={1}
                      color={"#212F3D"}
                    >
                      Rules policy check:
                    </Typography>
                    <Typography fontSize={15} color={"#212F3D"}>
                      {user.rulesAndRegulationsSigned}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container gap={2} component={Paper} p={5} mt={2}>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            fontWeight: "600",

                            color: "#3b4056",
                            mb: 3,
                          }}
                          fontSize={20}
                          color={"#BFC9CA "}
                        >
                          Documents
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          endIcon={<FolderZipOutlined />}
                          onClick={downloadZip}
                        >
                          Download All
                        </Button>
                      </Grid>
                    </Grid>

                    {user && <ViewDocuments values={user} />}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {loading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <LoadingAnim />
            </Backdrop>
          )}
        </Box>
      );
    }
  }
};

export default EmployeeProfile;
