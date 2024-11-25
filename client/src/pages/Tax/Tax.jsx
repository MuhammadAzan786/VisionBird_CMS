/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import AddTax from "./AddTax";
import bg from "/project.png";
import axios from "../../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UpdateIcon from "@mui/icons-material/Update";
import UpdateTax from "./UpdateTax";
import { useMessage } from "../../components/MessageContext";
import placeholderImg from "../../assets/images/placeholder.jpeg";
import Swal from "sweetalert2";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Modal,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";

function Tax() {
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const handleUpdateOpen = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width:570px)");
  const { showMessage } = useMessage();

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(-1);
  };

  // const handleSuccess = () => {
  //   showMessage("success", "Category Deleted successfully!");
  // };

  // const handleError = () => {
  //   showMessage("error", "Category Deletion failed!");
  // };

  const getCategories = () => {
    setLoading(true);
    axios
      .get("/api/tax_Category/get_categories")
      .then((response) => {
        setLoading(false);
        console.log("cechk", response.data.categories[0].categoryImage.src);
        setData(response.data.categories);
        setCategories(response.data.totalCategories);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You wont be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axios
          .delete(`/api/tax_Category/delete_category/${id}`)
          .then((response) => {
            console.log(response.data);
            setData(data.filter((item) => item._id !== id));
            setCategories(categories - 1);
            setLoading(false);
            Swal.fire("Deleted!", "Your category has been deleted.", "success");
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            Swal.fire("Failed!", "Category deletion failed.", "error");
          });
      }
    });
  };

  const navigate = useNavigate();
  const handleAddFile = (fileId) => {
    navigate(`/tax-files/${fileId}`);
  };

  return (
    <>
      <Paper>
        <Grid container alignItems={"center"}>
          <Grid item xs={6} md={6}>
            <Button onClick={handleOpen} variant="outlined">
              Create Category
            </Button>
          </Grid>
          {!isSmallScreen && (
            <Grid item xs={6} md={6} textAlign={"end"}>
              <Typography variant="body2" fontWeight={700}>
                Total Tax Categories :<span> {categories}</span>
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* ===============modal for adding new Categories ============ */}
      <Modal open={open} onClose={handleClose}>
        <div>
          <AddTax closeModal={handleClose} loadCategories={getCategories} />
        </div>
      </Modal>

      <Paper>
        <Grid container spacing={2}>
          {data.map((file, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              onClick={() => {
                cardClick(file._id);
              }}
              style={{ cursor: "pointer" }}
              key={file._id}
            >
              <Card
                sx={{
                  maxWidth: 600,
                }}
              >
                <CardMedia
                  sx={{ height: 140, borderRadius: "5px" }}
                  image={(data && file.categoryImage.src) || placeholderImg}
                  title={file.categoryTitle}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    fontSize={16}
                    fontWeight={700}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoveredIndex === index
                      ? file.categoryTitle
                      : file.categoryTitle.split(" ").slice(0, 2).join(" ")}
                    {file.categoryTitle.split(" ").length > 2 &&
                    hoveredIndex !== index
                      ? " ..."
                      : ""}
                  </Typography>
                  <Typography variant="body2">{file.categoryCode}</Typography>
                </CardContent>

                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  paddingX={1}
                  paddingBottom={1}
                >
                  <Box>
                    <DeleteOutlineIcon
                      sx={{
                        fontSize: "1.3rem",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                        marginLeft: 0.5,
                      }}
                      color="error"
                      onClick={() => handleDelete(file._id)}
                    />

                    <UpdateIcon
                      sx={{
                        fontSize: "1.3rem",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                        marginLeft: 0.7,
                      }}
                      color="success"
                      onClick={() => handleUpdateOpen(file._id)}
                    />
                  </Box>
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => handleAddFile(file._id)}
                    >
                      Add Files
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
          <Modal open={updateOpen} onClose={handleUpdateClose}>
            <div>
              <UpdateTax
                closeModal={handleUpdateClose}
                loadCategories={getCategories}
                categoryId={selectedCategoryId}
              />
            </div>
          </Modal>
        </Grid>
      </Paper>
    </>
  );
}

export default Tax;
