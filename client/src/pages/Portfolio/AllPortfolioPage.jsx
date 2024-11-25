import React, { useState } from "react";
import { Box, Paper, Tab, Tabs } from "@mui/material";

import AllPortfolio from "./AllPortfolio";
import AllPortfolioEmployees from "./AllPortfolioEmployees";

function AllPortfolioPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mt: 2, mb: "30px" }}
      >
        <Tab label="All" />
        <Tab label="Employees" />
      </Tabs>
      {tabValue === 0 && <AllPortfolio />}
      {tabValue === 1 && <AllPortfolioEmployees />}
    </Paper>
  );
}

export default AllPortfolioPage;
