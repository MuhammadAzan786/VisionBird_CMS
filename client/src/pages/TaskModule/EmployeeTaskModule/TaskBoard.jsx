import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "../../../utils/axiosInterceptor";
import { initializeSocket } from "../../../redux/socketSlice";
import { useDispatch } from "react-redux";
import { Grid, Box, Typography, Paper } from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { colorCombinations } from "../../../theme/colors";

const useStyles = makeStyles({
  TaskBoxHeading: {
    backgroundColor: "#FFFFFF",
    color: "#353a4d",
    display: "flex",
  },
});

const TaskBoard = () => {
  const classes = useStyles();
  const { currentUser } = useSelector((state) => state.user);
  const [assignTasks, setAssignTasks] = useState(0);
  const [completeTasks, setCompletedTasks] = useState(0);
  const [inProgTasks, setInProgressTasks] = useState(0);
  const [lateTask, setLateTask] = useState(0);

  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();

  const fetchTasks = async () => {
    try {
      const { data: assignedTasks } = await axios.get(
        `/api/task/getAssignedTasksByEmployeeIdDate/${currentUser._id}`
      );
      setAssignTasks(assignedTasks.length);

      const { data: completedTasks } = await axios.get(
        `/api/task/getCompletedTasksByEmployeeIdDate/${currentUser._id}`
      );
      setCompletedTasks(completedTasks.length);

      const { data: inProgressTasks } = await axios.get(
        `/api/task/getInProgressTasksByEmployeeIdDate/${currentUser._id}`
      );
      setInProgressTasks(inProgressTasks.length);

      const { data: lateTasks } = await axios.get(
        `/api/task/getLateTasksByEmployeeIdDate/${currentUser._id}`
      );
      setLateTask(lateTasks.length);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (socket) {
      const handlefetchTasks = () => {
        fetchTasks();
      };
      socket.on("statusUpdated", handlefetchTasks);
      socket.on("taskAssigned", handlefetchTasks);
      socket.on("notification", handlefetchTasks);
      socket.on("TaskResumed", handlefetchTasks);
      socket.on("pauseReqAccepted", handlefetchTasks);

      return () => {
        socket.off("statusUpdated", handlefetchTasks);
        socket.off("taskAssigned", handlefetchTasks);
        socket.off("notification", handlefetchTasks);
        socket.off("TaskResumed", handlefetchTasks);
        socket.off("pauseReqAccepted", handlefetchTasks);
      };
    } else {
      dispatch(initializeSocket(currentUser._id));
    }
  }, [socket, dispatch]);

  return (
    <Grid container spacing={5} sx={{ height: "100%" }}>
      {/* Assigned Tasks */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.TaskBoxHeading}>
          <Box>
            <ContentPasteIcon
              sx={{
                ...colorCombinations.main,
                padding: "5px",

                fontSize: "2.8rem",
                borderRadius: "10px",
                marginRight: "20px",
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: "450", fontSize: "1.2rem" }}
            >
              Assigned
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "#8A8D9A",
                fontWeight: "400",
                lineHeight: "13px",
              }}
            >
              {assignTasks} Tasks
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* In Progress Tasks */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.TaskBoxHeading}>
          <Box>
            <ArrowOutwardIcon
              sx={{
                ...colorCombinations.yellow,
                padding: "5px",

                fontSize: "2.8rem",
                borderRadius: "10px",
                marginRight: "20px",
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: "450", fontSize: "1.2rem" }}
            >
              In Progress
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "#8A8D9A",
                fontWeight: "400",
                lineHeight: "13px",
              }}
            >
              {inProgTasks} Tasks
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Completed Tasks */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.TaskBoxHeading}>
          <Box>
            <CheckCircleOutlineIcon
              sx={{
                ...colorCombinations.green,
                padding: "5px",
                fontSize: "2.8rem",
                borderRadius: "10px",
                marginRight: "20px",
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: "450", fontSize: "1.2rem" }}
            >
              Completed
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "#8A8D9A",
                fontWeight: "400",
                lineHeight: "13px",
              }}
            >
              {completeTasks} Tasks
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Late Tasks */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.TaskBoxHeading}>
          <Box>
            <ErrorOutlineIcon
              sx={{
                ...colorCombinations.red,
                padding: "5px",

                fontSize: "2.8rem",
                borderRadius: "10px",
                marginRight: "20px",
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: "450", fontSize: "1.2rem" }}
            >
              Late
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "#8A8D9A",
                fontWeight: "400",
                lineHeight: "13px",
              }}
            >
              {lateTask ? lateTask : 0} Tasks
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TaskBoard;
