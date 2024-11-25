import { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import {
  Grid,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  useMediaQuery,
  Tooltip,
  Paper,
  Stack,
} from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import TaskBoard from "../TaskModule/EmployeeTaskModule/TaskBoard";
import BasicLineChart from "../Performance/BasicLineChart";
import Top5EmployeesTable from "../../components/Tables/Top5EmployeesTable";
import EmployeeTaskTable from "../TaskModule/EmployeeTaskModule/EmployeeTaskBoard";
import { useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info"; // Add an info icon for tooltips
import { colorCombinations, customColors, palette } from "../../theme/colors";

const Employee = ({
  classes,
  assignTasks,
  inProgTasks,
  completeTasks,
  lateTask,
  employeeId,
}) => {
  const [totalLeaves, setTotalLeaves] = useState(null);
  const [totalPosts, setTotalPosts] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);
  const [errorLeaves, setErrorLeaves] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { currentUser } = useSelector((state) => state.user);

  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm")); // Handle responsiveness

  // Date and time formatting
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date()); // Updates currentDate every second
    }, 1000); // Run every 1 second

    return () => clearInterval(interval);
  }, []);

  // Fetch posts by employee ID
  useEffect(() => {
    const fetchPosts = async () => {
      const searchTerm = "";
      try {
        const postsResponse = await axios.get(
          `/api/posts/get_all_posts/${currentUser._id}?search=${searchTerm}`
        );
        console.log(postsResponse.data); // Check the response structure
        // Set totalPosts based on the length of the posts array
        setTotalPosts(postsResponse.data.length);
        setLoadingPosts(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setErrorPosts("Failed to load portfolio");
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [currentUser._id]);

  // Fetch leaves
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const year = new Date().getFullYear(); // Get current year
        const month = new Date().getMonth() + 1; // Get current month (1-based)

        const leavesResponse = await axios.get(
          `/api/leave/my-leaves/${currentUser._id}?year=${year}&month=${month}`
        );
        setTotalLeaves(leavesResponse.data.length); // Assuming response is an array of leaves
        setLoadingLeaves(false);
      } catch (error) {
        console.error("Error fetching leaves:", error);
        setErrorLeaves("Failed to load leaves");
        setLoadingLeaves(false);
      }
    };

    fetchLeaves();
  }, [currentUser._id]);

  const renderStatBox = (IconComponent, label, value, loading, error) => {
    let iconStyles;

    if (label === "Total Portfolio") {
      iconStyles = {
        backgroundColor: palette.primary.light,
        color: palette.primary.main,
        borderRadius: "10px",
        padding: "12px",
        width: "50px",
        height: "50px",
      };
    } else if (label === "Total Leaves") {
      iconStyles = {
        ...colorCombinations.red,
        borderRadius: "10px",
        padding: "12px",
        width: "50px",
        height: "50px",
      };
    }

    return (
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "120px",
        }}
      >
        <IconButton
          sx={{
            marginRight: 1,
            transition: "all 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.1)" },
          }}
          disableRipple
          disableFocusRipple
        >
          <IconComponent sx={iconStyles} />
        </IconButton>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {label}
          </Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#26C6F9" }} />
          ) : error ? (
            <Alert severity="error" sx={{ fontSize: "0.75rem", marginTop: 1 }}>
              {error}
            </Alert>
          ) : (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color:
                  label === "Total Leaves"
                    ? customColors.red
                    : palette.primary.main,
                textAlign: "center",
              }}
            >
              {value !== null ? value : "N/A"}
            </Typography>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Stack spacing={5}>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Employee Dashboard
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatDate(currentDate)} {/* Time updates dynamically */}
        </Typography>
      </Paper>

      <Box>
        <TaskBoard
          classes={classes}
          assignTasks={assignTasks}
          inProgTasks={inProgTasks}
          completeTasks={completeTasks}
          lateTask={lateTask}
        />
      </Box>

      {/* Performance Overview and Pie Chart */}
      <Box>
        <Grid container spacing={5}>
          <Grid item xs={12} md={8}>
            <Paper>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Performance Overview
              </Typography>
              <BasicLineChart />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ height: "100%" }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Top 5 Employees of the Week
                <Tooltip
                  title="These are the top-performing employees based on their weekly evaluations"
                  arrow
                >
                  <IconButton size="small" sx={{ ml: 2 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Top5EmployeesTable />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            {renderStatBox(
              FolderOpenOutlinedIcon,
              "Total Portfolio",
              totalPosts,
              loadingPosts,
              errorPosts
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderStatBox(
              MeetingRoomIcon,
              "Total Leaves",
              totalLeaves,
              loadingLeaves,
              errorLeaves
            )}
          </Grid>
        </Grid>
      </Box>

      <Paper>
        <EmployeeTaskTable />
      </Paper>
    </Stack>
  );
};

export default Employee;
