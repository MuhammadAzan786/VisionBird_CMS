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

const ViewDocumentInternee = ({ values }) => {
  console.log("in docxxxxxx");
  console.log("in doc", values);
  console.log(values.interneeProImage);
  const [tabValue, setTabValue] = useState("interneeProImage");
  const [image, setImage] = useState({});

  useEffect(() => {
    setImage(values?.interneeProImage);
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
                  console.error("No URL available to download.");
                  return;
                }
                const link = document.createElement("a");
                link.href = image.secure_url; // Ensure this is the correct URL for downloading the file
                link.download = image.original_file_name || "download.pdf"; // Use original file name or default to "download.pdf"
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
          ) : (
            <img
              style={{
                objectFit: "contain",
                height: "100%",
              }}
              src={image?.secure_url}
              alt="Uploaded content"
            />
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
              <Tab label="Profile image" value="interneeProImage" />
              <Tab label="CNIC" value="cnicFile" sx={{ letterSpacing: 1 }} />
              <Tab
                label="Experience Letter"
                value="experienceLetter"
                sx={{ letterSpacing: 1 }}
              />
              <Tab
                label="Appointment"
                value="appointmentFile"
                sx={{ letterSpacing: 1 }}
              />
            </TabList>
          </Box>

          {/* =======================================Tab Panel =================================== */}

          <CustomTabPanel value="interneeProImage">
            {values.interneeProImage &&
              Object.keys(values.interneeProImage).length > 0 && (
                <MediaList
                  data={[values.interneeProImage]}
                  setImage={setImage}
                />
              )}
          </CustomTabPanel>

          <CustomTabPanel value="cnicFile">
            {/* {values.cnicFile.length > 0 && ( */}
            <MediaList
              data={values.cnicFile}
              setImage={setImage}
              // handleDelete={handleDelete}
            />
            {/* )} */}
          </CustomTabPanel>

          <CustomTabPanel value="experienceLetter">
            {/* {values.experienceLetter.length > 0 && ( */}
            <MediaList
              data={values.experienceLetter}
              setImage={setImage}
              // handleDelete={handleDelete}
            />
            {/* )} */}
          </CustomTabPanel>

          <CustomTabPanel value="appointmentFile">
            {/* {values.appointmentFile.length > 0 && ( */}
            <MediaList
              data={values.appointmentFile}
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

export default ViewDocumentInternee;
