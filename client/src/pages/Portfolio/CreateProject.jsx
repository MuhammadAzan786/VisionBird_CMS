import { useState } from "react";
import axios from "../../utils/axiosInterceptor";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Backdrop,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMessage } from "../../components/MessageContext";
import LoadingAnim from "../../components/LoadingAnim";

const CreateProject = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_obj_id: currentUser._id,
    project_id: "",
    project_title: "",
    project_description: "",
    project_url: "",
    project_images: [],
  });
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const handleSuccess = () => {
    showMessage("success", "Project Created successfully!");
  };

  const handleError = () => {
    showMessage("error", "Project Creation failed!");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      project_images: [...prevFormData.project_images, ...files],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("employee_obj_id", formData.employee_obj_id);
    formDataToSend.append("project_id", formData.project_id);
    formDataToSend.append("project_title", formData.project_title);
    formDataToSend.append("project_description", formData.project_description);
    formDataToSend.append("project_url", formData.project_url);
    for (let i = 0; i < formData.project_images.length; i++) {
      formDataToSend.append("project_images", formData.project_images[i]);
    }

    axios
      .post("/api/posts/createPostImg", formDataToSend)
      .then((response) => {
        console.log("Response:", response.data);
        navigate(`/portfolio/${currentUser._id}`);
        handleSuccess();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        handleError();
        setLoading(false);
      });
  };

  return (
    <Box p={3}>
      <Container component="main" maxWidth="md">
        <Paper elevation={2} sx={{ padding: "35px" }}>
          <Typography
            component="h1"
            variant="h5"
            textAlign={"center"}
            pb={2}
            sx={{ fontWeight: "600", color: "#666666" }}
          >
            Create Project
          </Typography>
          <form className="w-full mt-3" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="project_id"
                  label="Project ID"
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="project_title"
                  label="Title"
                  name="project_title"
                  value={formData.project_title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="project_description"
                  label="Description"
                  name="project_description"
                  multiline
                  rows={4}
                  value={formData.project_description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="project_url"
                  label="Project URL"
                  name="project_url"
                  value={formData.project_url}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="project_images"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="project_images">
                  <Button
                    variant="contained"
                    sx={{ color: "#fff" }}
                    component="span"
                  >
                    Upload Images
                  </Button>
                </label>
              </Grid>
              {formData.project_images.map((image, index) => (
                <Grid item key={index} xs={12}>
                  <Typography>{image.name}</Typography>
                </Grid>
              ))}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                color: "#fff",
                backgroundColor: "#1E3E62",
                "&:hover": { backgroundColor: "#4b6581" },
              }}
            >
              Create Project
            </Button>
          </form>
        </Paper>
      </Container>
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
};

export default CreateProject;
