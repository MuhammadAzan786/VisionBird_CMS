import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  styled,
  Tab,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { customColors } from "../theme/colors";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Close,
  DeleteOutline,
  DescriptionOutlined,
  DocumentScannerOutlined,
  DownloadOutlined,
  FolderZip,
  FolderZipOutlined,
  InsertDriveFile,
  VisibilityOutlined,
} from "@mui/icons-material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { downloadFile } from "../utils/download/downloadFile";
import { Link } from "react-router-dom";

const ViewDocuments = ({ values }) => {
  console.log("in docxxxxxx");
  console.log("in doc", values);
  console.log(values.employeeProImage);
  const [tabValue, setTabValue] = useState("employeeProImage");
  const [image, setImage] = useState({});

  useEffect(() => {
    setImage(values?.employeeProImage);
  }, [values]);
  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  const allowedFileTypes = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp"];
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={5}>
        <Box
          sx={{
            height: "400px",
            border: "2px dashed #005878",
            borderRadius: "8px",
            color: "#005878",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            backgroundColor: customColors.mainAlpha,
            cursor: "pointer",
            transition: "all 0.4s", // You can keep general transition if you want for other properties
            "&:hover .hoverContent": {
              opacity: 1, // Make the hover content visible
              visibility: "visible", // Ensure visibility when hovered
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* If the image is a PDF */}
            {!allowedFileTypes.includes(
              image?.original_file_name?.split(".").pop()
            ) ? (
              <DescriptionOutlined
                sx={{
                  fontSize: "20rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!image?.secure_url) {
                    console.error("No URL available to save.");
                    return;
                  }

                  // Extract file extension
                  const fileExtension = image.original_file_name
                    ?.split(".")
                    .pop()
                    .toLowerCase();

                  // Allowed file types for image

                  if (!allowedFileTypes.includes(fileExtension)) {
                    const url = image.secure_url; // File URL
                    downloadFile(url);
                  } else {
                    toast.error("Unsupported file type or not a document.");
                  }
                }}
              />
            ) : (
              <img
                style={{
                  objectFit: "contain",
                  height: "100%",
                  width: "100%", // Ensure it scales properly
                }}
                src={image?.secure_url}
                alt="Uploaded content"
              />
            )}
            <Box
              className="hoverContent"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: customColors.mainAlpha,
                color: "white",
                padding: "10px",
                opacity: 0, // Initially hidden
                visibility: "hidden", // Initially hidden
                transition: "opacity 0.4s ease-in-out", // Apply opacity transition with ease-in-out
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  alignItems: "end",
                  justifyContent: "start",
                }}
              >
                <IconButton
                  sx={{
                    fontSize: "3rem", // Adjusted for better visibility
                    margin: "10px",
                    color: customColors.main,
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: customColors.main,
                      color: "white",
                    },
                  }}
                  onClick={() => downloadFile(image?.secure_url)}
                >
                  <DownloadOutlined sx={{ fontSize: "2.6rem" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} lg={7}>
        <TabContext value={tabValue}>
          <Box
            sx={{
              mx: 1,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            {/* =======================================Tab List =================================== */}

            <TabList onChange={handleTabValue}>
              <Tab label="Profile image" value="employeeProImage" />
              <Tab
                label="CNIC"
                value="cnicScanCopy"
                sx={{ letterSpacing: 1 }}
              />
              <Tab label="CV" value="employeeCv" sx={{ letterSpacing: 1 }} />
              <Tab
                label="Police Certificate"
                value="policeCertificateUpload"
                sx={{ letterSpacing: 1 }}
              />
              <Tab
                label="Qualification"
                value="degreesScanCopy"
                sx={{ letterSpacing: 1 }}
              />
            </TabList>
          </Box>

          {/* =======================================Tab Panel =================================== */}

          <CustomTabPanel
            value="employeeProImage"
            sx={{ padding: "0", height: "100%" }}
          >
            {values.employeeProImage &&
              Object.keys(values.employeeProImage).length > 0 && (
                <MediaList
                  data={[values.employeeProImage]}
                  setImage={setImage}
                />
              )}
          </CustomTabPanel>

          <CustomTabPanel
            value="cnicScanCopy"
            sx={{ padding: "0", height: "100%" }}
          >
            <MediaList data={values.cnicScanCopy} setImage={setImage} />
          </CustomTabPanel>

          <CustomTabPanel
            value="employeeCv"
            sx={{ padding: "0", height: "100%" }}
          >
            <MediaList data={values.employeeCv} setImage={setImage} />
          </CustomTabPanel>

          <CustomTabPanel value="policeCertificateUpload" sx={{ padding: "0" }}>
            <MediaList
              data={values.policeCertificateUpload}
              setImage={setImage}
            />
          </CustomTabPanel>

          <CustomTabPanel value="degreesScanCopy" sx={{ padding: "0" }}>
            <MediaList data={values.degreesScanCopy} setImage={setImage} />
          </CustomTabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

const MediaList = ({ data, handleDelete, setImage }) => {
  const allowedFileTypes = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp"];
  return (
    <Box>
      <List>
        {data.map((item, index) => (
          <ListItem
            onClick={() => {
              setImage(item);
            }}
            key={index}
            sx={{
              cursor: "pointer",
              border: "1px solid #e8ebee",
              borderRadius: "8px",
              backgroundColor: "#00587824",
              mb: 2,
            }}
          >
            {allowedFileTypes.includes(
              item?.original_file_name?.split(".").pop()
            ) ? (
              <ListItemAvatar>
                <Avatar
                  src={item.secure_url}
                  alt="asd"
                  sx={{ borderRadius: 2 }}
                />
              </ListItemAvatar>
            ) : (
              <ListItemIcon>
                <InsertDriveFile sx={{ color: "#005878" }} />
              </ListItemIcon>
            )}
            <ListItemText primary={item.original_file_name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
const CustomTabPanel = styled(TabPanel)(({ theme }) => ({
  padding: "0",
  paddingRight: "40px",
  maxHeight: "300px",
  overflowY: "auto",
  "::-webkit-scrollbar": {
    backgroundColor: "transparent",
    height: "10px",
    width: "10px",
  },
  "::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
    borderRadius: "10px",
    backgroundColor: "#F5F5F5",
  },
  "::-webkit-scrollbar-thumb": {
    borderRadius: "10px",
    boxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
    backgroundColor: theme.palette.primary.main,
    width: "6px",
  },
}));

export default ViewDocuments;
