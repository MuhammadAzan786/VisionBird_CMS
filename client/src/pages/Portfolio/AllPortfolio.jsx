import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Grid,
  Backdrop,
  Pagination,
  FormHelperText,
  Paper,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import axios from "../../utils/axiosInterceptor";
import { Link, useNavigate } from "react-router-dom";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { saveAs } from "file-saver";
import { useMessage } from "../../components/MessageContext";
import LoadingAnim from "../../components/LoadingAnim";

const AllPortfolio = () => {
  const { showMessage } = useMessage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("searchTerm", searchTerm);

  const navigate = useNavigate();

  // Fetch all posts
  const getAllPosts = async (page = 1) => {
    setLoading(true);
    await axios
      .get(`/api/posts/get_all_emp_posts?search=${searchTerm || ""}&page=${page}`)
      .then((response) => {
        setProjects(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setLoading(false);
      })
      .catch((error) => {
        showMessage(error, "Failed to load posts!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllPosts(currentPage);
  }, [searchTerm, currentPage]);

  const downloadImage = (url) => {
    saveAs(url, url.split("/").pop());
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSuccess = () => showMessage("success", "Project deleted successfully!");
  const handleError = () => showMessage("error", "Project deletion failed!");

  const deletePost = async (id) => {
    setLoading(true);
    await axios
      .delete(`/api/posts/delete_post/${id}`)
      .then(() => {
        setProjects((prevProjects) => prevProjects.filter((post) => post._id !== id));
        handleSuccess();
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        handleError();
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    deletePost(id);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormHelperText sx={{ marginTop: 1, color: "text.secondary" }}>
            You can search by Project Id and Project Title
          </FormHelperText>
        </Grid>
      </Grid>

      {/* Masonry Layout for displaying projects */}
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 3 }} spacing={2}>
        {projects.map((project) => (
          <Card
            key={project._id}
            sx={{
              maxWidth: "100%",
              position: "relative",
              cursor: "pointer",
              "&:hover .hoverContent": {
                opacity: 1,
                visibility: "visible",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "250px",
                overflow: "hidden",
                borderRadius: "5px",
                boxShadow: 3,
              }}
            >
              <img
                src={project.project_images[0]}
                alt={project.project_title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                className="hoverContent"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  padding: "10px",
                  opacity: 1,
                  visibility: "hidden",
                  transition: "opacity 0.3s, visibility 0.3s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.3rem",
                  }}
                >
                  <Link to={`/project/${project._id}`} style={{ textDecoration: "none" }}>
                    <IconButton
                      sx={{
                        color: "#fff",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        "&:hover": {
                          backgroundColor: "#fff",
                          color: "#000",
                        },
                      }}
                    >
                      <VisibilityIcon sx={{ width: "18px", height: "18px" }} />
                    </IconButton>
                  </Link>
                  <IconButton
                    sx={{
                      color: "#fff",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      "&:hover": { backgroundColor: "#fff", color: "#000" },
                    }}
                    onClick={() => downloadImage(project.project_images[0])}
                  >
                    <CloudDownloadIcon sx={{ width: "18px", height: "18px" }} />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: "#fff",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      "&:hover": { backgroundColor: "#fff", color: "#000" },
                    }}
                    onClick={() => handleDelete(project._id)}
                  >
                    <DeleteOutlineIcon sx={{ width: "18px", height: "18px" }} />
                  </IconButton>
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: "0.9rem",
                        sm: "1rem",
                        md: "1.1rem",
                        lg: "1.2rem",
                      },
                    }}
                  >
                    {project.project_title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1rem" },
                    }}
                  >
                    {project.project_description.split(" ").slice(0, 4).join(" ")}{" "}
                    {project.project_description.split(" ").length > 4 && " ..."}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Profile Image and Name */}
            <Box
              display="flex"
              alignItems="center"
              py={1}
              sx={{
                cursor: "pointer",
                flexDirection: "row",
                gap: "0.5rem",
              }}
              onClick={() => navigate(`/employee-profile/${project.employee_obj_id._id}`)}
            >
              <Avatar
                src={project.employee_obj_id?.employeeProImage.secure_url}
                alt={project.employee_obj_id?.employeeName.secure_url}
                sx={{
                  width: { xs: 15, sm: 20 },
                  height: { xs: 15, sm: 20 },
                }}
              />
              <Typography
                sx={{
                  color: "#222",
                  fontWeight: "700",
                  fontSize: { xs: "0.8rem", sm: "0.9rem", lg: "0.9rem" },
                }}
              >
                {project.employee_obj_id?.employeeName}
              </Typography>
            </Box>
          </Card>
        ))}
      </Masonry>
      <Grid container sx={{ marginTop: 5 }}>
        <Grid item xs={12}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            sx={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Grid>
      </Grid>
      {loading && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <LoadingAnim />
        </Backdrop>
      )}
    </>
  );
};

export default AllPortfolio;
