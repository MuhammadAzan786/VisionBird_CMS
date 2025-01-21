import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Backdrop,
  Typography,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import LoadingAnim from "../../components/LoadingAnim";

const AddDocument = ({ employeeId }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return await axios.post(
        "/api/employee-documents/uploadDocument",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    onMutate: () => {
      setOpen(false);
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-documents", employeeId]);
      setLoading(false);
      setDocumentName("");
      setFile(null);

      Swal.fire({
        icon: "success",
        title: "Upload Successful",
        text: "The document has been uploaded successfully.",
      });
    },
    onError: (error) => {
      setLoading(false);
      setDocumentName("");
      setFile(null);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "An error occurred while uploading the document.";
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorMessage,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file || !documentName) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please provide a document name and select a file.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("documentName", documentName);
    formData.append("file", file);

    uploadMutation.mutate(formData);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<CloudUpload />}
      >
        Upload Document
      </Button>
      <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
        Upload a document in PDF, DOCX, PNG or JPG format.
        <br /> (File Size must be less then 10MB)
      </Typography>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Document Name"
              variant="outlined"
              fullWidth
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />

            <Button variant="outlined" component="label">
              Select File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Typography sx={{ fontSize: "0.9rem", color: "#333333" }}>
              File Size must be less then 10MB
            </Typography>

            {file && <Box mt={1}>{file.name}</Box>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#333333" }}>
            Cancel
          </Button>
          <Button onClick={handleUpload} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <LoadingAnim color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default AddDocument;
