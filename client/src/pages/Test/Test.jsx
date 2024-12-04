/* eslint-disable react/prop-types */
import { Close, CloudUpload, InsertDriveFile } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
} from "@mui/material";
import { useState } from "react";
import { cloudinaryConfig } from "../../utils/cloudinaryConfig";

// import placeholder from "../../assets/images/placeholder.jpeg";

const Test = ({ values, setFieldValue, parentFolder = "Other", folderName, tempFilesRef, deletedFilesRef }) => {
  const [tabValue, setTabValue] = useState("employeeProImage");
  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  const sendtoCloudinary = async (file) => {
    const isImage = /image\/(jpeg|png|gif|bmp|svg|webp|tiff)/i.test(file.type);
    const resourceType = isImage ? "image" : "raw";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("context", `original_filename=${file.name}`);
    formData.append("folder", `${parentFolder}/${folderName}`);
    formData.append("upload_preset", cloudinaryConfig.upload_preset);

    try {
      const response = await fetch(cloudinaryConfig.getApiUrl(resourceType), {
        method: "POST",
        body: formData,
      });

      // Handle the response
      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const CloudinaryData = await response.json();

      const { secure_url, resource_type, public_id, context } = CloudinaryData;

      const original_file_name = context?.custom?.original_filename;

      const baseFileMetadata = { public_id, secure_url, original_file_name, resource_type };

      console.log("ye file hai upload jo hui", baseFileMetadata);

      // For all new uploads Garbage Files collector
      tempFilesRef.current.push(public_id);

      if (tabValue === "employeeProImage") {
        deletedFilesRef.current.push(values.employeeProImage.public_id);
        console.log("ye profile image", deletedFilesRef.current);

        setFieldValue("employeeProImage", baseFileMetadata);
        return;
      }
      if (tabValue === "cnicScanCopy") {
        setFieldValue("cnicScanCopy", [...(values.cnicScanCopy || []), baseFileMetadata]);
        return;
      }
      if (tabValue === "policeCertificateUpload") {
        setFieldValue("policeCertificateUpload", [...(values.policeCertificateUpload || []), baseFileMetadata]);
        return;
      }

      if (tabValue === "degreesScanCopy") {
        setFieldValue("degreesScanCopy", [...(values.degreesScanCopy || []), baseFileMetadata]);
        return;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDelete = async (public_id) => {
    // =================== TODO
    deletedFilesRef.current.push(public_id);
    console.log("deleted files red", deletedFilesRef);

    const currentData = values[tabValue];
    if (Array.isArray(currentData)) {
      const updatedData = currentData.filter((item) => item.public_id !== public_id);
      setFieldValue(tabValue, updatedData);
    } else {
      setFieldValue(tabValue, {});
    }

    // const currentData = values.degreesScanCopy;
    // const updatedData = currentData.filter((item) => item.public_id !== public_id);
    // setFieldValue("degreesScanCopy", updatedData);
    // setFieldValue('degreesScanCopy',)
    // await axios.delete("/api/employee/delete_documents", {
    //   params: { public_id },
    // });
  };

  return (
    <Paper sx={{ width: "620px", height: "90vh" }}>
      <Box>
        <Box
          sx={{
            height: "250px",
            border: "2px dashed #005878",
            borderRadius: "8px",
            color: "#005878",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <input
            type="file"
            name="file"
            onChange={(event) => {
              Array.from(event.target.files).forEach((file) => sendtoCloudinary(file));
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
          {/* <i class="fas fa-cloud-upload-alt"></i> */}
          <CloudUpload sx={{ width: "100px", height: "100px" }} />
          <label htmlFor="file" style={{ fontWeight: "500" }}>
            Browse File to Upload
          </label>
        </Box>

        <TabContext value={tabValue}>
          <Box
            sx={{
              marginTop: 5,
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
              <Tab label="CNIC" value="cnicScanCopy" sx={{ letterSpacing: 1 }} />
              <Tab label="Police Certificate" value="policeCertificateUpload" sx={{ letterSpacing: 1 }} />
              <Tab label="Qualification" value="degreesScanCopy" sx={{ letterSpacing: 1 }} />
            </TabList>
          </Box>

          {/* =======================================Tab Panel =================================== */}

          <TabPanel value="employeeProImage" sx={{ padding: "0" }}>
            {/* {profileImage.length > 0 && <MediaList data={profileImage} handleDelete={handleDelete} />} */}
            {Object.keys(values.employeeProImage).length > 0 && (
              <MediaList data={[values.employeeProImage]} handleDelete={handleDelete} />
            )}
          </TabPanel>

          <TabPanel value="cnicScanCopy" sx={{ padding: "0" }}>
            {values.cnicScanCopy.length > 0 && <MediaList data={values.cnicScanCopy} handleDelete={handleDelete} />}
          </TabPanel>

          <TabPanel value="policeCertificateUpload" sx={{ padding: "0" }}>
            {values.policeCertificateUpload.length > 0 && (
              <MediaList data={values.policeCertificateUpload} handleDelete={handleDelete} />
            )}
          </TabPanel>

          <TabPanel value="degreesScanCopy" sx={{ padding: "0" }}>
            {values.degreesScanCopy.length > 0 && (
              <MediaList data={values.degreesScanCopy} handleDelete={handleDelete} />
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </Paper>
  );
};

const MediaList = ({ data, handleDelete }) => {
  return (
    <Box sx={{ marginTop: "20px" }}>
      <List>
        {data.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              border: "1px solid #e8ebee",
              borderRadius: "8px",
              backgroundColor: "#00587824",
              mb: 2,
            }}
            secondaryAction={
              <IconButton edge="end" sx={{ color: "red" }} onClick={() => handleDelete(item.public_id)}>
                <Close />
              </IconButton>
            }
          >
            {item.resource_type === "image" ? (
              <ListItemAvatar>
                <Avatar src={item.secure_url} alt="asd" sx={{ borderRadius: 2 }} />
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

export default Test;
