/* eslint-disable react/prop-types */
import { Backdrop, Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { useMessage } from "../../components/MessageContext";
import Swal from "sweetalert2";
import placeholderImg from "../../assets/images/placeholder.jpeg";
import LoadingAnim from "../../components/LoadingAnim";

function UpdateTax({ closeModal, loadCategories, categoryId }) {
  const [loading, setLoading] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "1px solid #000",
    boxShadow: 24,
    py: 3,
    px: 5,
    borderRadius: "8px",
  };

  const { showMessage } = useMessage();

  // const handleSuccess = () => {
  //   showMessage("success", "Category Updated successfully!");
  // };

  // const handleError = () => {
  //   showMessage("error", "Category Updation failed!");
  // };

  const [data, setData] = useState({
    categoryTitle: "",
    categoryCode: "",
    categoryDescription: "",
    categoryImage: {
      src: placeholderImg,
      publicId: "",
    },
  });

  console.log(data.categoryImage?.publicId);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "file" && files) {
      const fileArray = Array.from(files);
      setData((prevData) => ({
        ...prevData,
        // image: fileArray,
        categoryImage: {
          ...prevData.categoryImage,
          src: URL.createObjectURL(fileArray[0]),
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("categoryTitle", data.categoryTitle);
    formDataToSend.append("categoryCode", data.categoryCode);
    formDataToSend.append("categoryDescription", data.categoryDescription);
    formDataToSend.append("publicId", data.categoryImage.publicId);

    const fileInput = event.target.elements.file;

    if (fileInput && fileInput.files.length > 0) {
      formDataToSend.append("image", fileInput.files[0]);
    }

    try {
      const response = await axios.put(
        `/api/tax_Category/update_category/${categoryId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      loadCategories();
      closeModal();
      setLoading(false);
      Swal.fire("Created!", "Category has been created.", "success");
    } catch (error) {
      console.log(error);
      closeModal();
      setLoading(false);
      Swal.fire("Failed!", "Category creation failed.", "error");
    }
  };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   axios
  //     .put(`/api/tax_Category/update_category/${categoryId}`, data)
  //     .then((response) => {
  //       console.log(response.data);
  //       loadCategories();
  //       closeModal();
  //       Swal.fire("Updated!", "Your category has been updated.", "success");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       closeModal();
  //       Swal.fire("Failed!", "File updation failed.", "error");
  //     });
  // };

  useEffect(() => {
    axios
      .get(`/api/tax_Category/get_category/${categoryId}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <Box sx={style}>
      <Typography textAlign="center" variant="h5" fontWeight={600}>
        Update Category
      </Typography>

      <Box textAlign={"center"} mt={3}>
        <img
          src={data.categoryImage.src}
          alt="selected"
          width={280}
          height={100}
          style={{
            borderRadius: "10px",
            objectFit: "cover",
            width: "100%",
            height: "130px",
          }}
        />
      </Box>

      <Box mt={4}>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            label="Category Title"
            name="categoryTitle"
            value={data.categoryTitle}
            onChange={handleChange}
          />
          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            label="Category Code"
            name="categoryCode"
            value={data.categoryCode}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Description"
            name="categoryDescription"
            value={data.categoryDescription}
            onChange={handleChange}
            multiline
            rows={4}
          />

          <input
            name="file"
            accept="image/*"
            style={{ display: "none" }}
            id="add-file"
            type="file"
            multiple
            onChange={handleChange}
          />
          <label htmlFor="add-file">
            <Button
              fullWidth
              variant="outlined"
              component="span"
              sx={{ mt: 3 }}
            >
              Upload File
            </Button>
          </label>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Submit
          </Button>
        </form>
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

export default UpdateTax;
