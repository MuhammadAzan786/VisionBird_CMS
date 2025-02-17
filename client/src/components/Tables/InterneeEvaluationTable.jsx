import { useState } from "react";
import { Link } from "react-router-dom";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AddIcon from "@mui/icons-material/Add";
import TalentAquisition from "../../pages/InterviewEvaluation/components/TalentAquisition";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";

import { FormHelperText, Grid, Modal, Paper, Tab } from "@mui/material";

import { Box, TextField, Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import PendingEvaluations from "../../pages/InterviewEvaluation/PendingEvaluations";
import AppearedEvaluations from "../../pages/InterviewEvaluation/AppearedEvaluations";
import NotAppearedEvaluations from "../../pages/InterviewEvaluation/NotAppearedEvaluations";

const InterneeEvaluationTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [talentModalOpen, setTalentModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState("pending_evaluations");

  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleTalentAquistion = () => {
    setTalentModalOpen(!talentModalOpen);
  };

  const handleTalentModalClose = () => {
    setTalentModalOpen(false);
  };

  return (
    <>
      {/* Filtered Modal */}
      <Modal open={talentModalOpen} onClose={handleTalentModalClose}>
        <TalentAquisition />
      </Modal>
      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Field Section */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ borderRadius: "5px" }}
            />
            <FormHelperText sx={{ marginTop: 1, color: "text.secondary" }}>
              Search by name, contact number (e.g., 0310-7747768), or CNIC
              (e.g., 34201-8603239-7).
            </FormHelperText>
          </Grid>

          {/* Button Section */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 1,
                mb: 1,
              }}
            >
              <Button
                component={Link}
                to="/evaluation-form"
                variant="outlined"
                size="large"
                sx={{ textTransform: "none" }}
              >
                <AddIcon sx={{ mr: 1 }} /> Evaluation Form
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 1,
              }}
            >
              <Button
                onClick={toggleTalentAquistion}
                variant="contained"
                size="large"
                sx={{ textTransform: "none" }}
              >
                <PersonSearchIcon sx={{ mr: 1 }} /> Talent Acquisition
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TabContext value={tabValue}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            <TabList onChange={handleTabValue}>
              <Tab
                label="Pending Evaluations"
                icon={<PendingActionsOutlinedIcon />}
                value="pending_evaluations"
                sx={{ letterSpacing: 1 }}
              />
              <Tab
                label="Appeared Evaluations"
                icon={<TaskAltOutlinedIcon />}
                value="appeared_evaluations"
                sx={{ letterSpacing: 1 }}
              />
              <Tab
                label="Not Appeared"
                icon={<EventBusyOutlinedIcon />}
                value="not_appeared"
                sx={{ letterSpacing: 1 }}
              />
            </TabList>
          </Box>

          <TabPanel value="pending_evaluations">
            <PendingEvaluations searchTerm={searchTerm} />
          </TabPanel>
          <TabPanel value="appeared_evaluations">
            {" "}
            <AppearedEvaluations searchTerm={searchTerm} />
          </TabPanel>
          <TabPanel value="not_appeared">
            {" "}
            <NotAppearedEvaluations searchTerm={searchTerm} />
          </TabPanel>
        </TabContext>
      </Paper>
    </>
  );
};

export default InterneeEvaluationTable;
