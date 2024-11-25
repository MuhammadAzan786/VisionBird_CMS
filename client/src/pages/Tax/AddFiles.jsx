import { Box, Button, Typography, TextField, Paper } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { useParams } from "react-router-dom";
import { useMessage } from "../../components/MessageContext";
import Swal from "sweetalert2";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // For file icon
import ImageIcon from "@mui/icons-material/Image"; // For image icon

function AddFiles({ closeModal, loadFiles }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    date: "",
    files: [],
  });
  const { showMessage } = useMessage();

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setFormData({
      ...formData,
      date: formattedDate,
    });
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files); // Convert FileList to array
    setFormData({
      ...formData,
      files: filesArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("file_date", formData.date);
    formData.files.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const response = await axios.post(
        `/api/tax_File/add_file/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      loadFiles();
      closeModal();
      Swal.fire("Created!", "Your file has been created.", "success");
    } catch (error) {
      console.error(error);
      closeModal();
      Swal.fire("Failed!", "File creation failed.", "error");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 1,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Box>
        <Typography
          textAlign="center"
          fontWeight={600}
          gutterBottom
          sx={{
            color: "#4d4d4d",
            fontSize: "1.8rem",
          }}
        >
          Add Files
        </Typography>
        <Box marginBottom={4}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Select Date"
                    onChange={handleDateChange}
                    sx={{ width: "100%", borderRadius: 1 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        required
                      />
                    )}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <input
              accept="image/*, .pdf"
              style={{ display: "none" }}
              id="add-file"
              type="file"
              multiple
              required
              onChange={handleFileChange}
            />
            <label htmlFor="add-file">
              <Button fullWidth variant="outlined" component="span">
                Upload File
              </Button>
            </label>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ marginTop: "10px" }}
            >
              ADD
            </Button>
          </form>
          {/* Display selected files below the upload button */}
          <Box mt={3}>
            <Typography variant="h6">Selected Files:</Typography>
            <Box display="flex" flexWrap="wrap" mt={1}>
              {formData.files.map((file, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: 4,
                        marginRight: 8,
                      }}
                    />
                  ) : (
                    <InsertDriveFileIcon
                      sx={{ width: 50, height: 50, marginRight: 2 }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default AddFiles;
