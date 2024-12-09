import {
  Avatar,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  styled,
  Tab,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { customColors } from "../theme/colors";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Close, InsertDriveFile } from "@mui/icons-material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { saveAs } from "file-saver";

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
          }}
        >
          {/* <PictureAsPdfIcon/> */}
          {image?.original_file_name?.split(".").pop() === "pdf" ? (
            <PictureAsPdfIcon
              sx={{ fontSize: "10rem", cursor: "pointer" }}
              onClick={() => {
                if (!image?.secure_url) {
                  console.error("No URL available to save.");
                  return;
                }

                // Extract the file extension
                const fileExtension = image.original_file_name
                  ?.split(".")
                  .pop()
                  .toLowerCase();

                // Check if the file is a valid type to save
                const allowedFileTypes = [
                  "txt",
                  "pdf",
                  "xlsx",
                  "xls",
                  "doc",
                  "docx",
                ];
                if (allowedFileTypes.includes(fileExtension)) {
                  const link = document.createElement("a");
                  link.href = image.secure_url; // File URL
                  link.download =
                    image.original_file_name || `download.${fileExtension}`; // File name for saving
                  document.body.appendChild(link); // Append link to DOM
                  link.click(); // Trigger click to download the file
                  document.body.removeChild(link); // Clean up the DOM
                } else {
                  console.error("Unsupported file type or not a document.");
                }
              }}
            />
          ) : (
            <img style={{}} src={image?.secure_url} alt="Uploaded content" />
          )}
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
            {/* {values.cnicScanCopy.length > 0 && ( */}
            <MediaList
              data={values.cnicScanCopy}
              setImage={setImage}
              // handleDelete={handleDelete}
            />
            {/* )} */}
          </CustomTabPanel>

          <CustomTabPanel value="policeCertificateUpload" sx={{ padding: "0" }}>
            {/* {values.policeCertificateUpload.length > 0 && ( */}
            <MediaList
              data={values.policeCertificateUpload}
              setImage={setImage}
              // handleDelete={handleDelete}
            />
            {/* )} */}
          </CustomTabPanel>

          <CustomTabPanel value="degreesScanCopy" sx={{ padding: "0" }}>
            {/* {values.degreesScanCopy.length > 0 && ( */}
            <MediaList
              data={values.degreesScanCopy}
              setImage={setImage}
              // handleDelete={handleDelete}
            />
            {/* )} */}
          </CustomTabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

const MediaList = ({ data, handleDelete, setImage }) => {
  return (
    <Box sx={{ marginTop: "20px" }}>
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
            {item.resource_type === "image" ? (
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
