/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Backdrop, Box, Button, TextField, Typography } from "@mui/material";
import axios from "../../utils/axiosInterceptor";
import { useMessage } from "../../components/MessageContext";
import Swal from "sweetalert2";
import placeholderImg from "../../assets/images/placeholder.jpeg";
import LoadingAnim from "../../components/LoadingAnim";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomOverlay from "../../components/Styled/CustomOverlay";

function UpdateTax({ closeModal, loadCategories, categoryId }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    py: 3,
    px: 5,
    borderRadius: "8px",
  };

  const { showMessage } = useMessage();

  const [data, setData] = useState({
    categoryTitle: "",
    categoryCode: "",
    categoryDescription: "",
    categoryImage: {
      src: placeholderImg,
      publicId: "",
    },
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "file" && files) {
      const fileArray = Array.from(files);
      setData((prevData) => ({
        ...prevData,
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

  const mutation = useMutation({
    mutationFn: async (formDataToSend) => {
      await axios.put(
        `/api/tax_Category/update_category/${categoryId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tax"]);
      closeModal();
      Swal.fire("Updated", "Your category has been updated.", "success");
    },
    onError: () => {
      Swal.fire("Failed!", "Category updation failed.", "error");
    },
  });
  // if (mutation.isPending) {
  //   <CustomOverlay />;
  // }
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("categoryTitle", data.categoryTitle);
    formDataToSend.append("categoryCode", data.categoryCode);
    formDataToSend.append("categoryDescription", data.categoryDescription);
    formDataToSend.append("publicId", data.categoryImage.publicId);

    const fileInput = event.target.elements.file;
    if (fileInput && fileInput.files.length > 0) {
      formDataToSend.append("image", fileInput.files[0]);
    }

    mutation.mutate(formDataToSend);
  };

  useEffect(() => {
    axios
      .get(`/api/tax_Category/get_category/${categoryId}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, [categoryId]);

  return (
    <>
      {mutation.isPending ? (
        <CustomOverlay open={ true} />
      ) : (
        <Box sx={style}>
          <Typography textAlign="center" variant="h5" fontWeight={600}>
            Update Category
          </Typography>

          <Box textAlign={"center"} mt={3}>
            <img
              src={data.categoryImage.src}
              alt="selected"
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
              >
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
      )}
    </>
  );
}

export default UpdateTax;
