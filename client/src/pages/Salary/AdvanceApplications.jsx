import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Paper, Tab } from "@mui/material";
import { useState } from "react";
import AdminLoanTable from "./components/table/AdminLoanTable";
import AdminSalaryTable from "./components/table/AdminSallaryTable";
import { useSelector } from "react-redux";
import UserAdvanceTable from "./components/table/UserAdvanceTable";
import UserLoanTable from "./components/table/UserLoanTable";

const AdvanceApplications = () => {
  const [tabValue, setTabValue] = useState("salary");
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e, value) => {
    setTabValue(value);
  };

  return (
    <Paper>
      <TabContext value={tabValue}>
        <TabList
          onChange={handleChange}
          variant="fullWidth"
          sx={{ marginBottom: "30px" }}
        >
          <Tab label="Salary" value="salary" />
          <Tab label="Loan" value="loan" />
        </TabList>

        <TabPanel value="salary" sx={{ padding: 0 }}>
          {currentUser.role === "admin" ? (
            <AdminSalaryTable />
          ) : (
            <UserAdvanceTable />
          )}
        </TabPanel>
        <TabPanel value="loan" sx={{ padding: 0 }}>
          {currentUser.role === "admin" ? (
            <AdminLoanTable />
          ) : (
            <UserLoanTable />
          )}
        </TabPanel>
      </TabContext>
    </Paper>
  );
};

export default AdvanceApplications;
