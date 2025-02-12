import Typography from "@mui/material/Typography";
import { Box, Grid, Paper } from "@mui/material";
import BasicBarChart from "./BasicBarChart";
import BasicPieChart from "./BasicPieChart";
import BasicLineChart from "./BasicLineChart";
import { useSelector } from "react-redux";
import TaskChart from "./TaskChart";
import Top5EmployeesTable from "../../components/Tables/Top5EmployeesTable";

const ViewPerformance = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <Box display={"flex"} justifyContent={"start"} px={3} pt={6}>
        <Typography
          variant="h2"
          fontWeight={500}
          textAlign={"center"}
          color="initial"
        >
          View Performance
        </Typography>
      </Box>
      <Grid container spacing={3} px={5} py={4}>
        <Grid item xs={12} md={6}>
          <Paper>
            <BasicBarChart _currentUser={currentUser._id} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <BasicPieChart _currentUser={currentUser._id}/>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
          <BasicLineChart _currentUser={currentUser._id} />
          </Paper>
        </Grid>
        <Grid item xs={12}  >
          <Paper>
          <TaskChart _currentUser={currentUser._id} />
          </Paper>
        </Grid>
        <Grid item xs={12}  >
          <Paper>
          <Top5EmployeesTable _currentUser={currentUser._id}/>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewPerformance;
