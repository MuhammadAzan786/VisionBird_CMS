import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Paper,
  FormHelperText,
} from "@mui/material";
import axios from "../../utils/axiosInterceptor";
import { Link, Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(searchTerm);
  const role = currentUser.role;

  console.log(id, currentUser._id);

  const getAllPosts = async () => {
    await axios
      .get(`/api/posts/get_all_posts/${id}?search=${searchTerm || ""}`)
      .then((response) => {
        setProjects(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        showMessage("error", "Failed to load posts!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const downloadProjects = async () => {
    console.log(projects);
    const zip = new JSZip();
    const folder = zip.folder("projects");
    for (const project of projects) {
      console.log("this is project ");
      console.log(project);
      const response = await fetch(project.project_images);
      console.log('res',response);
      const blob = await response.blob();

      // Add each file to the folder inside the zip
      for (const img of project.project_images) {
        folder.file(img.split("/").pop(), blob);
      }
    }
    await zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, `projects.zip`);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, [searchTerm]);

  const ResponsiveTextField = styled(TextField)(({ theme }) => ({
    width: "40%",
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  }));
  {
    if (currentUser.role == "employee" && currentUser._id != id)
      return <Navigate to="/unauthorized" />;
    else {
      return (
        <Box p={0} sx={{ userSelect: "none" }}>
          <Box
            mt={0}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={1}
          >
            {role != "employee" ? (
              <Link to={"/all-portfolio-page"}>
                <Button startIcon={<KeyboardReturnIcon />} variant="outlined">
                  Back to All Portfolio
                </Button>
              </Link>
            ) : (
              ""
            )}

            <Box>
              <Button
                variant="contained"
                onClick={downloadProjects}
                startIcon={
                  <DownloadIcon
                    sx={{
                      transition: "transform 0.3s ease", // Smooth transition for rotation
                    }}
                  />
                }
                sx={{
                  "&:hover": {
                    "& .MuiSvgIcon-root": {
                      transform: "rotate(-180deg)", // Rotate icon 90 degrees on button hover
                    },
                  },
                }}
              >
                Download Projects
              </Button>

              {(role === "manager" || role === "employee") &&
                id === currentUser._id && (
                  <Link to={"/create-project"}>
                    <Button variant="outlined" sx={{ marginLeft: 1 }}>
                      Create Project
                    </Button>
                  </Link>
                )}
            </Box>
          </Box>
          <Box component={Paper} p={3} mt={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Portfolio</Typography>
              <Box>
                <TextField
                  id="search"
                  label="Search"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Box>
            </Box>

            {Array.isArray(projects) && projects.length === 0 ? (
              <Box
                height={"50vh"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography
                  textAlign={"center"}
                  fontSize={70}
                  fontWeight={900}
                  color={"#BFC9CA"}
                >
                  No Projects
                </Typography>
              </Box>
            ) : (
              <Box>
                <Grid container spacing={5} mt={0}>
                  {projects?.map((project) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      component={Link}
                      key={project._id}
                      to={`/project/${project._id}`}
                    >
                      <Card>
                        <CardMedia
                          sx={{ height: 200 }}
                          image={project.project_images[0]}
                          title={`${project.project_images[0]}`}
                        />
                      </Card>

                      <Typography
                        fontWeight={600}
                        color={"grey"}
                        gutterBottom
                        mt={1}
                        ml={1}
                      >
                        {project.project_title}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Box>
      );
    }
  }
};

export default Portfolio;
