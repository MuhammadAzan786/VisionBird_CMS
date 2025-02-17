import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { DeleteOutline, GetAppOutlined } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { downloadFile } from "../../utils/download/downloadFile";

const DocumentCard = ({ selectedEmployee, documents, isLoading }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (docId) => {
      return await axios.delete(
        `/api/employee-documents/deleteDocument/${docId}`
      );
    },
    onMutate: () => {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait while the document is being deleted.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents", selectedEmployee]);

      if (documents.length === 1) {
        queryClient.resetQueries(["documents", selectedEmployee]);
      }

      Swal.fire(
        "Deleted!",
        "The document has been deleted successfully.",
        "success"
      );
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete the document.", "error");
    },
  });

  const handleDelete = (docId) => {
    deleteMutation.mutate(docId);
  };

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={100}
        >
          <CircularProgress />
        </Box>
      ) : documents?.length > 0 ? (
        <Grid container spacing={2}>
          {documents.map((doc, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ borderRadius: "5px" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ color: "#333" }}
                    >
                      {doc?.documentName || "Untitled Document"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <IconButton
                        sx={{
                          color: "#007bff",
                          transition: "0.3s",
                          "&:hover": { backgroundColor: "#007bff33" },
                        }}
                        onClick={() => downloadFile(doc.documentUrl)}
                      >
                        <GetAppOutlined sx={{ fontSize: 30 }} />
                      </IconButton>
                      <IconButton
                        sx={{
                          color: "#dc3545",
                          "&:hover": { backgroundColor: "#dc354533" },
                        }}
                        onClick={() => handleDelete(doc._id)}
                      >
                        <DeleteOutline sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Uploaded on:{" "}
                    {new Date(doc.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No documents found.
        </Typography>
      )}
    </Box>
  );
};

export default DocumentCard;
