import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axiosInterceptor";
import { Box, Typography, Avatar, Button, Paper } from "@mui/material";
import { Download, Edit, Delete } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { usePDF } from "react-to-pdf";
import { useMessage } from "../../components/MessageContext";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import { useSelector } from "react-redux";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import ManOutlinedIcon from "@mui/icons-material/ManOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import EscalatorWarningOutlinedIcon from "@mui/icons-material/EscalatorWarningOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import { useQueryClient } from "@tanstack/react-query";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ViewDocumentInternee from "../../components/ViewDocumentInternee";
import AccessibleIcon from "@mui/icons-material/Accessible";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import { FolderZipOutlined } from "@mui/icons-material";
import JSZip from "jszip";

const InterneeProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const { showMessage } = useMessage();
  const { toPDF, targetRef } = usePDF({ filename: "profile.pdf" });
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const downloadZip = async () => {
    console.log("clicked", user);
    console.log("clicked", user);

    const projects = [
      ...user.appointmentFile,
      user.interneeProImage,
      ...user.experienceLetter,
      ...user.cnicFile,
      ...user.interneeCv,
    ];

    // Create a new JSZip instance
    const zip = new JSZip();
    const folder = zip.folder(`${user.firstName}_Documents`);

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
      saveAs(blob, `${user.firstName}_Documents.zip`);
    });
  };

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
  const profilePic = user?.interneeProImage?.secure_url;
  const cnicFile = user.cnicFile;
  const getUser = async () => {
    try {
      const response = await axios.get(`/api/internee/get_internee/${id}`);
      setUser(response.data);
    } catch (error) {
      if (error.response) {
        console.error(`Server responded with status ${error.response.status}`);
        console.error(`Error message: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("Request made but no response received");
      } else {
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

  const handleEdit = () => {
    navigate(`/update-internee/${id}`);
  };

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/internee/delete_internee/${id}`);
      toast.success("Interneee Deleted Successfully!");
      navigate("/manage-internees");
      queryClient.invalidateQueries("internees");
    } catch (error) {
      console.log("Error:", error);
      toast.error("error deleting internee");
    }
  };

  useEffect(() => {
    // Fetch user data with Axios
    getUser();
  }, []);
  return (
    <Grid width={"100%"}>
      <Grid p={3} ref={targetRef}>
        <Grid bgcolor={"white"} component={Paper} mb={2}>
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
                  disableRipple
                  onClick={() => toPDF()}
                >
             <Download />
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
             <Edit />
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
                                 <Delete />
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
                       <Download />
                </Button>
                <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  onClick={handleEdit}
                >
                          <Edit />
                </Button>
                <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                      <Delete />
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography fontSize={20} color="#BFC9CA">
                Personal Info
              </Typography>
              <Grid item display="flex" alignItems="center">
                <CreditCardOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Cnic:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.cnic}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <CakeOutlinedIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Date of Birth:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {dateOfBirth}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <ManOutlinedIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Gender:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.gender}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <VolunteerActivismOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Marital Status:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.maritalStatus}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <EscalatorWarningOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Father Name:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.fatherName}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <AutoStoriesOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Qualification:
                </Typography>

                <Typography fontSize={15} color="#212F3D">
                  {user.qualification}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <AccessibleIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Disability:
                </Typography>

                <Typography fontSize={15} color="#212F3D">
                  {user.disability}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <PsychologyIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Disability Type:
                </Typography>

                {user.disability === "yes" && (
                  <Typography>{user.disabilityType}</Typography>
                )}

                {user.disability === "no" && <Typography>------</Typography>}
              </Grid>
            </Paper>
            {/* Employee Info Section */}
            <Paper
              sx={{
                p: 3,
                mt: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography fontSize={20} color="#BFC9CA">
                Employee Info
              </Typography>
              <Grid item display="flex" alignItems="center">
                <HandshakeOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Date of Joining:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {internshipfrom}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <EventAvailableOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Ending Date:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {internshipto}
                </Typography>
              </Grid>
            </Paper>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} md={6}>
            {/* Contact Info Section */}
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography fontSize={20} color="#BFC9CA">
                Contact Info
              </Typography>
              <Grid item display="flex" alignItems="center">
                <ContactMailOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Mail Address:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.mailingAddress}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <SmartphoneOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Mobile #:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.mobile}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <LocalPhoneOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Guardian Number:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.otherMobile}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <EscalatorWarningOutlinedIcon
                  sx={{ marginRight: 1, color: "#5F6A6A" }}
                />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Guardian Relation:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.whosMobile}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <EmailOutlinedIcon sx={{ marginRight: 1, color: "#5F6A6A" }} />
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Email:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.email}
                </Typography>
              </Grid>
            </Paper>
            {/* Questionnaire Section */}
            <Paper
              sx={{
                p: 3,
                mt: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography fontSize={20} color="#BFC9CA">
                Questionnaire
              </Typography>
              <Grid item display="flex" alignItems="center">
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Added on Slack:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.slack}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  marginRight={1}
                  color="#212F3D"
                >
                  Rules policy check:
                </Typography>
                <Typography fontSize={15} color="#212F3D">
                  {user.rules}
                </Typography>
              </Grid>
            </Paper>
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

              {user && <ViewDocumentInternee values={user} />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InterneeProfile;
