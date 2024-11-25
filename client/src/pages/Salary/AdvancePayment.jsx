import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Paper, Tab } from "@mui/material";

import { useState } from "react";
import AdvanceSalaryForm from "./components/forms/AdvanceSalaryForm";
import LoanForm from "./components/forms/LoanForm";

const AdvancePayment = () => {
  const [tabValue, setTabValue] = useState("salary");
  const handleTabChange = (e, value) => {
    setTabValue(value);
  };
  return (
    <Paper>
      <TabContext value={tabValue}>
        <TabList
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ marginBottom: "30px" }}
        >
          <Tab label="Salary" value="salary" />
          <Tab label="Loan" value="loan" />
        </TabList>

        <TabPanel value="salary">
          <AdvanceSalaryForm />
        </TabPanel>
        <TabPanel value="loan">
          <LoanForm />
        </TabPanel>
      </TabContext>
    </Paper>
  );
};

export default AdvancePayment;
