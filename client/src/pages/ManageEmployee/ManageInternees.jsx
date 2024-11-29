import { Box, Paper } from "@mui/material";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import InterneeTable from "../../components/Tables/InterneeTable";
import { useSelector } from "react-redux";
import CreateInternee from "./CreateInternee";

const ManageInternees = () => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.role;

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Paper sx={{ padding: "40px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginY: 2,
          }}
        >
          <Box sx={{ width: "50%" }}>
            {/* Search bar */}
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
            />
          </Box>

          <Box sx={{ width: "50%", textAlign: "end" }}>
            {role === "admin" && <CreateInternee />}
          </Box>
        </Box>
        <InterneeTable searchTerm={searchTerm} />
      </Paper>
    </>
  );
};

export default ManageInternees;
