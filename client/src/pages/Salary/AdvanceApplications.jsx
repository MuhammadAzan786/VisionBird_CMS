import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Paper, Tab } from "@mui/material";
import { useState } from "react";
import AdminSalaryTable from "./components/table/AdminSallaryTable";
import { useSelector } from "react-redux";
import UserAdvanceTable from "./components/table/UserAdvanceTable";
import { CheckCircle, LanguageOutlined, ReportProblem } from "@mui/icons-material";

const AdvanceApplications = () => {
  const [tabValue, setTabValue] = useState("all");
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e, value) => {
    setTabValue(value);
  };

  return (
    <Paper>
      <TabContext value={tabValue}>
        <TabList onChange={handleChange} variant="fullWidth" sx={{ marginBottom: "30px" }}>
          <Tab label="All" value="all" icon={<LanguageOutlined />} />
          <Tab label="Pending" value="pending" icon={<ReportProblem />} />
          <Tab label="Active" value="active" icon={<CheckCircle />} />
        </TabList>

        <TabPanel value="all" sx={{ padding: 0 }}>
          {currentUser.role === "admin" ? (
            <AdminSalaryTable advanceStatus="all" />
          ) : (
            <UserAdvanceTable advanceStatus="all" />
          )}
        </TabPanel>
        <TabPanel value="pending" sx={{ padding: 0 }}>
          {currentUser.role === "admin" ? (
            <AdminSalaryTable advanceStatus="pending" />
          ) : (
            <UserAdvanceTable advanceStatus="pending" />
          )}
        </TabPanel>
        <TabPanel value="active" sx={{ padding: 0 }}>
          {currentUser.role === "admin" ? (
            <AdminSalaryTable advanceStatus="active" />
          ) : (
            <UserAdvanceTable advanceStatus="active" />
          )}
        </TabPanel>
      </TabContext>
    </Paper>
  );
};

export default AdvanceApplications;
