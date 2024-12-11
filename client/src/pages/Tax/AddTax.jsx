import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { useMessage } from "../../components/MessageContext";
import Swal from "sweetalert2";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomOverlay from "../../components/Styled/CustomOverlay";

function AddTax({ closeModal, loadCategories }) {

  const queryclient=useQueryClient()
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
  const [data, setData] = useState({
    categoryTitle: "",
    categoryCode: "",
    categoryDescription: "",
    image: [],
    preview: null,
  });
  const { showMessage } = useMessage();

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "file" && files) {
      const fileArray = Array.from(files);
      setData((prevData) => ({
        ...prevData,
        image: fileArray,
        preview: URL.createObjectURL(fileArray[0]),
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   axios
  //     .post("/api/tax_Category/create_tax_category ", data)
  //     .then((response) => {
  //       console.log(response.data);
  //       loadCategories();
  //       closeModal();
  //       Swal.fire("Created!", "Category has been created.", "success");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       closeModal();
  //       Swal.fire("Failed!", "Category creation failed.", "error");
  //     });
  // };
  const mutation = useMutation({
    mutationFn: async (formdata) => {
      return await axios.post(
        "/api/tax_Category/create_tax_category",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
  });

  if (mutation.isPending) {
    return <CustomOverlay open ={true} />;
  }

  if (mutation.isError) {
    console.log("errr", mutation.error);
   
    Swal.fire("Failed!", "Category creation failed.", "error");
  }
  if (mutation.isSuccess) {
    closeModal();

    queryclient.invalidateQueries("tax");

    // loadCategories();

    Swal.fire("Created!", "Category has been created.", "success");
  } // if (mutation.isPending) {
  //   return <CustomOverlay />;
  // }
  // if (mutation.isSuccess) {
  //   closeModal();
  //   Swal.fire("Created!", "Category has been created.", "success");
  // }

  // if (mutation.isError) {
  //   console.log("errr", mutation.error);
  //   closeModal();
  //   Swal.fire("Failed!", "Category creation failed.", "error");
  // }
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("categoryTitle", data.categoryTitle);
    formDataToSend.append("categoryCode", data.categoryCode);
    formDataToSend.append("categoryDescription", data.categoryDescription);
    if (data.image.length > 0) {
      formDataToSend.append("image", data.image[0]); // Add the selected image file
    }

    mutation.mutate(formDataToSend);
  };

  return (
    <Box sx={style}>
      <Typography textAlign="center" variant="h5" fontWeight={600}>
        Create Category
      </Typography>

      {data.image[0] && (
        <Box textAlign={"center"} mt={3}>
          <img
            src={data.preview}
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
      )}

      <Box mt={4}>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            label="Category Title"
            name="categoryTitle"
            value={data.categoryTitle}
            onChange={handleChange}
            required
          />
          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            label="Category Code"
            name="categoryCode"
            value={data.categoryCode}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="categoryDescription"
            value={data.categoryDescription}
            onChange={handleChange}
            multiline
            required
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
            Create
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default AddTax;
