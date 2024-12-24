/* eslint-disable react/prop-types */
import { Close, CloudUpload, InsertDriveFile } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
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
import { useState } from "react";
import { customColors } from "../../theme/colors";
import { cloudinaryConfig } from "../../utils/cloudinaryConfig";
import { AXIOS_CLODUDINARY } from "../../utils/axios/axiosCloudinary";

import CustomOverlay from "../../components/Styled/CustomOverlay";

const UploadFiles = ({
  values,
  setFieldValue,
  parentFolder = "Other",
  folderName,
  tempFilesRef,
  deletedFilesRef,
}) => {
  const [tabValue, setTabValue] = useState("employeeProImage");
  const [progress, setProgress] = useState();
  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log("Progress Number", progress);

  const sendtoCloudinary = async (filesList) => {
    const filesArray = Array.from(filesList);
    const cloudinaryResponses = await Promise.all(
      filesArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("context", `original_filename=${file.name}`);
        formData.append("folder", `${parentFolder}/${folderName}`);
        formData.append("upload_preset", cloudinaryConfig.upload_preset);

        try {
          const response1 = await AXIOS_CLODUDINARY.post(
            "/auto/upload",
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const percentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );

                setProgress(percentage);
              },
            }
          );
          console.log("Axios Response", response1.data);

          const { secure_url, resource_type, public_id, context } =
            response1.data;

          tempFilesRef.current.push(public_id);

          return {
            secure_url,
            resource_type,
            public_id,
            original_file_name: context?.custom?.original_filename,
          };
        } catch (error) {
          console.error("Error uploading image:", error);
          return null;
        }
      })
    );

    setProgress(0);

    const successfulUploads = cloudinaryResponses.filter(
      (response) => response !== null
    );

    console.log("Succesfull uplaods", successfulUploads);

    if (tabValue === "employeeProImage") {
      // checking if its not null for. bcz it will push a null
      if (values.employeeProImage.public_id !== undefined) {
        deletedFilesRef.current.push(values.employeeProImage.public_id);
      }
      setFieldValue("employeeProImage", successfulUploads[0]);
      return;
    } else {
      setFieldValue(tabValue, [...values[tabValue], ...successfulUploads]);
    }

    console.log("Cloudinary Upload Results:", successfulUploads);
    return successfulUploads;
  };

  const handleDelete = async (public_id) => {
    // =================== TODO
    deletedFilesRef.current.push(public_id);
    console.log("Files to be Deleted: ", deletedFilesRef);

    const currentData = values[tabValue];
    if (Array.isArray(currentData)) {
      const updatedData = currentData.filter(
        (item) => item.public_id !== public_id
      );
      setFieldValue(tabValue, updatedData);
    } else {
      // this case is for profile image
      setFieldValue(tabValue, {});
    }
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
          <input
            type="file"
            name="file"
            multiple={tabValue !== "employeeProImage"}
            onChange={(event) => {
              sendtoCloudinary(event.target.files);
            }}
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              height: "100%",
              width: "100%",
              cursor: "pointer",
              opacity: 0,
            }}
          />

          <CloudUpload sx={{ width: "100px", height: "100px" }} />
          <label htmlFor="file" style={{ fontWeight: "500" }}>
            Browse File to Upload
          </label>
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

          <CustomTabPanel value="employeeProImage">
            <Box sx={{ marginTop: "20px" }}>
              <List>
                {Object.keys(values.employeeProImage).length > 0 && (
                  <MediaList
                    data={[values.employeeProImage]}
                    handleDelete={handleDelete}
                  />
                )}
                {progress > 0 && <CustomOverlay open={true} />}
              </List>
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value="cnicScanCopy">
            <Box sx={{ marginTop: "20px" }}>
              <List>
                {values.cnicScanCopy.length > 0 && (
                  <MediaList
                    data={values.cnicScanCopy}
                    handleDelete={handleDelete}
                  />
                )}
                {progress > 0 && <CustomOverlay open={true} />}
              </List>
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value="employeeCv">
            <Box sx={{ marginTop: "20px" }}>
              <List>
                {values.employeeCv?.length > 0 && (
                  <MediaList
                    data={values.employeeCv}
                    handleDelete={handleDelete}
                  />
                )}
                {progress > 0 && <CustomOverlay open={true} />}
              </List>
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value="policeCertificateUpload">
            {values.policeCertificateUpload.length > 0 && (
              <MediaList
                data={values.policeCertificateUpload}
                handleDelete={handleDelete}
              />
            )}
            {progress > 0 && <CustomOverlay open={true} />}
          </CustomTabPanel>

          <CustomTabPanel value="degreesScanCopy">
            {values.degreesScanCopy.length > 0 && (
              <MediaList
                data={values.degreesScanCopy}
                handleDelete={handleDelete}
              />
            )}
            {progress > 0 && <CustomOverlay open={true} />}
          </CustomTabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

const MediaList = ({ data, handleDelete }) => {
  const allowedFileTypes = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp"];
  return (
    <>
      {data.map((item, index) => {
        return (
          <ListItem
            key={index}
            sx={{
              border: "1px solid #e8ebee",
              borderRadius: "8px",
              backgroundColor: "#00587824",
              mb: 2,
            }}
            secondaryAction={
              <IconButton
                edge="end"
                sx={{ color: "red" }}
                onClick={() => handleDelete(item.public_id)}
              >
                <Close />
              </IconButton>
            }
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
        );
      })}
    </>
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

export default UploadFiles;
