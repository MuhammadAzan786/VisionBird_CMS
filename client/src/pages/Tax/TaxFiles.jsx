import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddFiles from "./AddFiles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { Link, useParams } from "react-router-dom";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import axios from "../../utils/axiosInterceptor";
import Swal from "sweetalert2";
import FolderDeleteIcon from "@mui/icons-material/FolderDelete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { saveAs } from "file-saver";
import JSZip from "jszip";
function TaxFiles() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickDate = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDate = () => {
    setAnchorEl(null);
  };

  const openDate = Boolean(anchorEl);
  const dateID = openDate ? "date-picker-popover" : undefined;

  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDateChange = (field, date) => {
    setSelectedDates({
      ...selectedDates,
      [field]: date ? dayjs(date).format("YYYY-MM-DD") : null,
    });
  };
  console.log(selectedDates);

  const handleFilter = () => {
    getFilteredFiles();
    handleCloseDate();
    setFilter(true);
  };

  const getFilteredFiles = () => {
    axios
      .post(`/api/tax_File/filter_files/${id}`, selectedDates)
      .then((response) => setFiles(response.data))
      .catch((err) => console.log(err));
  };

  const getFiles = async () => {
    try {
      const response = await axios.get(`/api/tax_File/get_all_files/${id}`);
      if (Array.isArray(response.data.files)) {
        setFiles(response.data.files);
        setFilter(false);
      } else {
        console.error("Response data is not an array:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (event, fileId) => {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(fileId);
        axios
          .delete(`/api/tax_File/delete_file/${fileId}`)
          .then(() => {
            setFiles(files.filter((item) => item._id !== fileId));
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Failed!", "File deletion failed.", "error");
          });
      }
    });
  };

  const downloadFilteredFiles = async () => {
    console.log(`Downloading`);
    console.log(files);

    // Check if 'files' is an array
    if (!Array.isArray(files)) {
      console.error("Expected files to be an array:", files);
      return; // Exit if it's not an array
    }

    // Loop through each object in the files array
    for (const fileObject of files) {
      const { file } = fileObject; // Get the array of files in each object

      // Ensure 'file' is an array
      if (!Array.isArray(file)) {
        console.error("Expected file to be an array :", file);
        continue; // Skip to the next iteration
      }
      const zip = new JSZip();
      const folder = zip.folder("my_files"); // Create a folder inside the zip
      try {
        for (const individualFile of file) {
          const { secureUrl } = individualFile; // Extract the originalName and secureUrl
          const response = await fetch(secureUrl);
          const blob = await response.blob();

          // Add each file to the folder inside the zip
          folder.file(secureUrl.split("/").pop(), blob);
        }
        // After all files are added, generate and download the zip
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "files.zip"); // Save the zip file
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
      // Loop through each file in the file array
    }
  };

  // const downloadImage = (url) => {
  //   console.log("downloading image")
  //   saveAs(url, url.split('/').pop()); // Saves the image using its original filename
  // };

  // const downloadFiles = async (file) => {
  //   try {
  //     file.forEach((url) => {
  //       console.log( "downloading file",url)
  //       downloadImage(url.secureUrl)
  //     });
  //   }

  const downloadFiles = async (file) => {
    const zip = new JSZip();
    const folder = zip.folder("my_files"); // Create a folder inside the zip

    try {
      for (const fileObject of file) {
        const { secureUrl, originalName } = fileObject; // Ensure you get the file URL and name

        // Fetch the file data as blob
        const response = await fetch(secureUrl);
        const blob = await response.blob();

        // Add each file to the folder inside the zip
        folder.file(originalName || secureUrl.split("/").pop(), blob);
      }

      // After all files are added, generate and download the zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "files.zip"); // Save the zip file
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };
  const [categoryee, setCategory] = useState({});
  const getCategory = async () => {
    try {
      const category = await axios.get(`/api/tax_Category/get_category/${id}`);
      setCategory(category.data);
      console.log(categoryee);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFiles();
    getCategory();
  }, []);

  return (
    <Box p={"12px"} sx={{ userSelect: "none" }}>
      <Link to={"/tax"}>
        <Button startIcon={<KeyboardReturnIcon />}>Back</Button>
      </Link>

      <Card
        sx={{
          marginBottom: "12px",
          marginTop: "10px",
          borderRadius: "10px",
          boxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          WebkitBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          MozBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
        }}
      >
        <CardContent>
          <Box display={"flex"} justifyContent={"space-between"} alignContent={"center"} alignItems={"center"}>
            <Box>
              <Typography variant="h5">{categoryee.categoryTitle} Files</Typography>
              <Typography variant="body2">{categoryee.categoryCode}</Typography>
            </Box>
            <Box>
              <Button sx={{ mx: 1 }} onClick={handleOpen} variant="outlined">
                <NoteAddIcon sx={{ marginRight: "8px" }} />
                Add Files
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Modal open={open} onClose={handleClose} closeAfterTransition aria-labelledby="" aria-describedby="">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <AddFiles closeModal={handleClose} loadFiles={getFiles} />
        </Box>
      </Modal>

      <Box
        component={Paper}
        sx={{
          borderRadius: "10px",
          boxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          WebkitBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          MozBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
        }}
        p={4}
      >
        <Button sx={{ marginX: 1, marginBottom: 2 }} onClick={handleClickDate} variant="outlined">
          <FilterAltIcon sx={{ marginRight: "5px" }} />
          Filter
        </Button>
        <Button sx={{ marginX: 1, marginBottom: 2 }} onClick={getFiles} variant="outlined" color="error">
          <FilterAltOffIcon sx={{ marginRight: "5px" }} />
          Remove Filter
        </Button>
        {filter && (
          <Button
            sx={{ marginX: 1, marginBottom: 2 }}
            onClick={downloadFilteredFiles}
            variant="outlined"
            color="success"
          >
            <SimCardDownloadIcon sx={{ marginRight: "5px" }} />
            Download Filtered Files
          </Button>
        )}
        <Popover
          id={dateID}
          open={openDate}
          anchorEl={anchorEl}
          onClose={handleCloseDate}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box sx={{ margin: 2 }} display={"flex"} gap={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Typography variant="subtitle1"></Typography>
              <DatePicker
                label="Start Date"
                value={selectedDates.startDate ? dayjs(selectedDates.startDate) : null}
                onChange={(date) => handleDateChange("startDate", date)}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
              <DatePicker
                label="End Date"
                value={selectedDates.endDate ? dayjs(selectedDates.endDate) : null}
                onChange={(date) => handleDateChange("endDate", date)}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
            <Box m={1} display={"flex"} justifyContent={"right"}>
              <Button variant="contained" onClick={handleFilter}>
                Filter
              </Button>
            </Box>
          </Box>
        </Popover>

        <Box>
          <List>
            {files.map((file, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={file.file[0].originalName}
                    secondary={dayjs(file.file_date).format("DD MMMM, YYYY")}
                  />
                  <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Link to={`/tax-file-view/${file._id}`}>
                      <VisibilityOutlinedIcon
                        sx={{
                          mx: 1,
                          fontSize: "1.3rem",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.2)",
                          },
                        }}
                        color="primary"
                      />
                    </Link>
                    <DownloadIcon
                      sx={{
                        mx: 1,
                        fontSize: "1.3rem",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                      }}
                      color="success"
                      onClick={() => downloadFiles(file.file)}
                    />
                    <DeleteOutlineIcon
                      sx={{
                        mx: 1,
                        fontSize: "1.3rem",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                      }}
                      color="error"
                      onClick={(event) => handleDelete(event, file._id)}
                    />
                  </Box>
                </ListItem>
                {index < files.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
}

export default TaxFiles;
