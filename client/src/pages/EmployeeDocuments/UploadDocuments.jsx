import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Avatar,
  Box,
} from "@mui/material";
import useEmployees from "../../hooks/useEmployees";

const UploadDocuments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: employees = [], isLoading } = useEmployees(searchTerm);

  return (
    <Autocomplete
      freeSolo
      options={employees}
      getOptionLabel={(option) => option?.employeeName || ""}
      loading={isLoading}
      onInputChange={(event, value) => setSearchTerm(value)}
      // Custom rendering for dropdown options (Shows Avatar + Name)
      renderOption={(props, option) => (
        <Box component="li" {...props} display="flex" alignItems="center">
          <Avatar
            src={option?.employeeProImage.secure_url || "/default-avatar.png"} // Use a default image if none is provided
            alt={option?.employeeName}
            sx={{ width: 30, height: 30, marginRight: 1 }}
          />
          {option?.employeeName}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Employee"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: params.inputProps.value ? (
              <Avatar
                src={
                  employees.find(
                    (emp) => emp.employeeName === params.inputProps.value
                  )?.employeeProImage.secure_url || "/default-avatar.png"
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
  );
};

export default UploadDocuments;
