import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import useEmployees from "../../hooks/useEmployees";
import DocumentCard from "./DocumentCard";
import useEmployeeDocuments from "../../hooks/useEmployeeDocuments";
import AddDocument from "./AddDocument";

const UploadDocuments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State to store selected employee
  const { data: employees = [], isLoading } = useEmployees(searchTerm);
  const { data: documents = [], isLoading: isDocumentsLoading } =
    useEmployeeDocuments(selectedEmployee?._id);

  return (
    <>
      <Autocomplete
        freeSolo
        options={employees}
        getOptionLabel={(option) => option?.employeeName || ""}
        loading={isLoading}
        onInputChange={(event, value) => setSearchTerm(value)}
        onChange={(event, newValue) => setSelectedEmployee(newValue)} // Update selected employee
        renderOption={(props, option) => (
          <Box component="li" {...props} display="flex" alignItems="center">
            <Avatar
              src={
                option?.employeeProImage?.secure_url || "/default-avatar.png"
              }
              alt={option?.employeeName}
              sx={{ width: 30, height: 30, marginRight: 1 }}
            />
            <Box>
              <Typography sx={{ color: "#000000de" }}>
                {option?.employeeName}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#a0a0a0" }}>
                {option?.employeeID}
              </Typography>
            </Box>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Employee"
            variant="outlined"
            helperText="Please select an employee - Search by Name and Employee ID"
            InputProps={{
              ...params.InputProps,
              startAdornment: selectedEmployee ? (
                <Avatar
                  src={
                    selectedEmployee?.employeeProImage?.secure_url ||
                    "/default-avatar.png"
                  }
                  alt="Selected Employee"
                  sx={{ width: 30, height: 30, marginRight: 1 }}
                />
              ) : null,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Box textAlign={"end"}>
        {selectedEmployee && (
          <AddDocument
            employeeId={selectedEmployee?._id}
            disabled={!selectedEmployee}
          />
        )}
      </Box>
      {/* Pass the selectedEmployee as a prop to DocumentCard */}
      <DocumentCard
        selectedEmployee={selectedEmployee?._id}
        documents={documents}
        isLoading={isDocumentsLoading}
      />
    </>
  );
};

export default UploadDocuments;
