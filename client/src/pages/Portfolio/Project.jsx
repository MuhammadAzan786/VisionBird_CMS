import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import { Box, Stack, Typography, Button, Paper, Grid, Avatar, Backdrop } from "@mui/material";
import { usePDF } from "react-to-pdf";
import axios from "../../utils/axiosInterceptor";
import { useMessage } from "../../components/MessageContext";
import { useSelector } from "react-redux";
import { CalendarToday } from "@mui/icons-material";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import JSZip from "jszip";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingAnim from "../../components/LoadingAnim";

const ShakingButton = styled(Button)({
  "&:hover .icon": {
    animation: "shake 0.5s ease-in-out infinite",
  },
  "@keyframes shake": {
    "0%, 100%": { transform: "translateX(0)" },
    "25%": { transform: "translateX(-2px)" },
    "50%": { transform: "translateX(2px)" },
    "75%": { transform: "translateX(-2px)" },
  },
});

const Project = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { toPDF, targetRef } = usePDF({ filename: "Project.pdf" });
  const { id } = useParams();
  const [empProject, setEmpProject] = useState([]);
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    showMessage("success", "Project Deleted successfully!");
  };

  const handleError = () => {
    showMessage("error", "project Deletion failed!");
  };

  const getEmpPost = async () => {
    try {
      const response = await axios.get(`/api/posts/PostDataById/${id}`);
      setEmpProject(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadImages = async () => {
    const zip = new JSZip();
    const folder = zip.folder("files"); // Create a folder inside the zip

    try {
      for (const secureUrl of empProject.project_images) {
        // Fetch the file data as blob
        const response = await fetch(secureUrl);
        const blob = await response.blob();

        // Add each file to the folder inside the zip
        folder.file(secureUrl.split("/").pop(), blob);
      }

      // After all files are added, generate and download the zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "projects.zip"); // Save the zip file
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const deletePost = async () => {
    setLoading(true);
    await axios
      .delete(`/api/posts/delete_post/${id}`)
      .then(() => {
        setLoading(false);
        navigate(`/portfolio/${empProject.employee_obj_id?._id}`);
        handleSuccess();
      })
      .catch(() => {
        setLoading(false);
        handleError();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getEmpPost();
  }, []);

  const hanldeDelete = () => [deletePost()];

  // if (currentUser.role === "employee" && currentUser._id !== id) {
  //   return <Navigate to="/unauthorized" />;
  // } else {
  return (
    <Box sx={{ userSelect: "none" }}>
      <Box width={"100%"} display={"flex"} justifyContent={"end"} gap={2} alignItems={"center"} mb={2}>
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Button
            variant="contained"
            onClick={downloadImages}
            startIcon={
              <DownloadIcon
                sx={{
                  transition: "transform 0.3s ease",
                }}
              />
            }
            sx={{
              backgroundColor: "#03346e",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1c487d",
                "& .MuiSvgIcon-root": {
                  transform: "rotate(-180deg)", // Rotate icon 90 degrees on button hover
                },
              },
            }}
          >
            Download
          </Button>

          <ShakingButton variant="outlined" onClick={hanldeDelete} color="error">
            <DeleteIcon className="icon" style={{ marginRight: 8 }} />
            Delete
          </ShakingButton>
        </Box>
      </Box>

      <Box p={0} mx={"auto"} ref={targetRef}>
        <Paper elevation={5} sx={{ padding: "35px" }}>
          <Grid container spacing={4}>
            {/* Left section for project image */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2} sx={{ boxShadow: 4 }}>
                {empProject.project_images && empProject.project_images.length > 0 && (
                  <img
                    key={empProject.project_images[0]}
                    src={empProject.project_images[0]}
                    alt="project"
                    className="mx-auto w-full"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </Stack>
            </Grid>

            {/* Right section for title, description, and other details */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  padding: 3,
                  borderRadius: "5px",
                  boxShadow: 2,
                  backgroundColor: "#fff",
                  mb: 3,
                }}
              >
                {/* Employee Info Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 3,
                    borderBottom: "1px solid #ddd",
                    pb: 2,
                  }}
                >
                  <Avatar
                    src={empProject.employee_obj_id?.employeeProImage.secure_url}
                    alt={empProject.employee_obj_id?.employeeName}
                    sx={{
                      width: 50,
                      height: 50,
                      border: "2px solid #ddd",
                      marginRight: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Made by: <strong>{empProject.employee_obj_id?.employeeName}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email: <strong>{empProject.employee_obj_id?.email}</strong>
                    </Typography>
                  </Box>
                </Box>

                {/* Project Title & Created At */}
                <Box sx={{ marginTop: 2 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      backgroundColor: "#f0f0f0",
                      borderRadius: "5px",
                      py: "12px",
                      mb: 1,
                      fontWeight: "600",
                    }}
                  >
                    <CalendarToday fontSize="small" sx={{ color: "text.secondary" }} />
                    Created At:{" "}
                    {empProject.createdAt
                      ? new Date(empProject.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date not available"}
                  </Typography>
                </Box>

                <Typography
                  fontWeight={600}
                  gutterBottom
                  sx={{
                    color: "#666666",
                    fontSize: "1.3rem",
                    fontWeight: "400",
                  }}
                >
                  {empProject.project_title}
                </Typography>
                <Typography
                  sx={{
                    color: "primary.main",
                    mb: 1,
                    // textDecoration: "underline",
                    ":hover": {
                      color: "secondary.main",
                    },
                  }}
                >
                  <a href={empProject.project_url} target="_blank" rel="noopener noreferrer" color="inherit">
                    {empProject.project_url}
                  </a>
                </Typography>
                {/* Project Description */}
                <Box sx={{ marginBottom: 3 }}>
                  <Typography variant="body1" paragraph sx={{ color: "#333" }}>
                    {empProject.project_description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      {loading && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <LoadingAnim />
        </Backdrop>
      )}
    </Box>
  );
};
// };

export default Project;
