import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Avatar, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../../utils/axiosInterceptor";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ShutterSpeedIcon from "@mui/icons-material/ShutterSpeed";
import EmployeeTaskTimer from "./EmployeeTaskTimer"; // Assuming you have EmployeeTaskTimer component
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { initializeSocket } from "../../../redux/socketSlice";

const fetchTaskTimes = async (taskId) => {
  try {
    const response = await axios.get(`/api/task/getTaskById/${taskId}`);
    const taskTimes = response.data;
    const startTime = taskTimes.taskStartTime;
    const endTime = taskTimes.taskcompleteTime;
    const taskTime = taskTimes.taskTime;

    return { startTime, endTime, taskTime };
  } catch (error) {
    console.error("Error fetching task times:", error);
    return null;
  }
};

const updateTaskCompleteStatus = async (taskId, TaskStatus) => {
  const response = await axios.put(
    "/api/task/taskCompleteStatusUpdate",

    {
      id: taskId,
      taskCompleteStatus: TaskStatus,
    }
  );
};

const columns = (handleStatusChange) => [
  {
    field: "taskTicketNo",
    headerName: "Ticket No",
   minWidth: 200,
    sortable: false,
    headerAlign: "center",
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: "AssignedBy",
    headerName: "Assigned By",
    width: 200,
    sortable: false,
    headerAlign: "center",
    renderCell: (params) => {
      const [managerName, setManagerName] = useState("");
      const [managerEmail, setManagerEmail] = useState("");
      const [ManagerProfilePic, setManagerProfilePic] = useState("");

      useEffect(() => {
        const fetchManagerData = async () => {
          const managerId = params.row.manager_obj_id;
          try {
            const response = await axios.get(`/api/employee/get_employee/${managerId}`);
            const manager = response.data;
            setManagerName(manager.employeeName);
            setManagerEmail(manager.email);
            setManagerProfilePic(manager.employeeProImage.secure_url);
          } catch (error) {
            console.error("Error fetching manager data", error);
          }
        };
        fetchManagerData();
      }, [params.row.manager_obj_id]);

      return (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ marginRight: "10px" }}>
              {ManagerProfilePic ? (
                <Avatar alt="Avatar" sx={{ width: 28, height: 28 }} src={ManagerProfilePic} />
              ) : (
                <Skeleton variant="circular" width={28} height={28} />
              )}
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: "700", fontSize: "0.8rem" }}>
                {managerName}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {managerEmail}
              </Typography>
            </Box>
          </Box>
        </>
      );
    },
  },
  {
    field: "taskPriority",
    headerName: "Task Priority",
    minWidth: 200,

    editable: true,
    renderCell: (params) => {
      let color, backgroundColor;
      switch (params.value) {
        case "Urgent":
          color = "#d74444";
          backgroundColor = "#fbeaea";
          break;
        case "Normal":
          color = "#9AEA66";
          backgroundColor = "#E8FADD";
          break;
        default:
          color = "default";
      }
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Chip
            label={params.value}
            sx={{
              backgroundColor,
              color,
              fontSize: "0.7rem",
              fontWeight: "600",
              paddingX: "10px",
            }}
          />
        </Box>
      );
    },
  },
  {
    field: "taskTime",
    headerName: "Time",
    minWidth: 200,
    headerAlign: "center",

    renderCell: (params) => {
      const { taskStartTime, taskTime } = params.row;
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <EmployeeTaskTimer
            taskStartTime={taskStartTime} // Pass taskStartTime from row data
            totalDuration={taskTime} // Assuming taskTime is total duration in seconds
            taskStatus={params.row.taskStatus} // Pass taskStatus from row data
          />
        </Box>
      );
    },
  },
  {
    field: "taskStatus",
    headerName: "Status",
    minWidth: 200,
    headerAlign: "center",
    cellClassName: "centeredCell",

    renderCell: (params) => {
      const [anchorEl, setAnchorEl] = useState(null);
      const open = Boolean(anchorEl);

      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      const onChangeStatus = async (status) => {
        console.log(params.row.pauseRequestStatus);
        handleStatusChange(params.row._id, status, params.row.pauseRequestStatus);
        handleClose();
      };

      let color, backgroundColor;
      switch (params.value) {
        case "Not Started":
          color = "#757575";
          backgroundColor = "#eeeeee";
          break;
        case "In Progress":
          color = "#ffa726";
          backgroundColor = "#fff3e0";
          break;
        case "Paused":
          color = "#f57c00";
          backgroundColor = "#ffe0b2";
          break;

        case "Completed":
          color = "#66bb6a";
          backgroundColor = "#e8f5e9";
          break;
        default:
          color = "#000";
          backgroundColor = "#f0f0f0";
      }
      return (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingX: "20px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
              }}
            >
              <Chip
                label={params.value}
                sx={{
                  backgroundColor,
                  color,
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  paddingX: "25px",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20%",
              }}
            >
              <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>

              <Menu id="long-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => onChangeStatus("In Progress")}>In Progress</MenuItem>

                <MenuItem onClick={() => onChangeStatus("PauseRequest")}>Pause Request</MenuItem>

                <MenuItem onClick={() => onChangeStatus("ResumeRequest")}>Resume Task</MenuItem>

                <MenuItem onClick={() => onChangeStatus("Completed")}>Completed</MenuItem>
              </Menu>
            </Box>
          </Box>
        </>
      );
    },
  },
  {
    field: "CompleteStatus",
    headerName: "Complete Status",
    minWidth: 200,
    headerAlign: "center",
    renderCell: (params) => {
      const [status, setStatus] = useState({
        label: "Task Uncomplete",
        icon: <ShutterSpeedIcon />,
        color: "#9e9e9e",
        backgroundColor: "#e0e0e0",
      });

      useEffect(() => {
        const calculateStatus = async () => {
          console.log(params.row.taskStatus);
          if (params.row.taskStatus !== "Completed") {
            setStatus({
              label: "Task Uncomplete",
              icon: <ShutterSpeedIcon />,
              color: "#9e9e9e",
              backgroundColor: "#e0e0e0",
            });
            return;
          }
          const taskTimes = await fetchTaskTimes(params.row._id);
          if (!taskTimes) {
            return;
          }
          const { startTime, endTime, taskTime } = taskTimes;
          const endTimeDate = new Date(endTime);
          const startTimeDate = new Date(startTime);
          const allocatedTimeDate = taskTime;

          const endTimeUnix = endTimeDate.getTime();
          const startTimeUnix = startTimeDate.getTime();
          const differenceInSeconds = (endTimeUnix - startTimeUnix) / 1000;
          console.log("differenceInSeconds", differenceInSeconds);
          console.log(allocatedTimeDate);
          if (differenceInSeconds <= allocatedTimeDate) {
            updateTaskCompleteStatus(params.row._id, "On Time");
            setStatus({
              label: "On Time",
              icon: <CheckCircleIcon />,
              color: "#34CAF9",
              backgroundColor: "#DCF6FE",
            });
          } else {
            updateTaskCompleteStatus(params.row._id, "Late");
            setStatus({
              label: "Late",
              icon: <ErrorIcon />,
              color: "#d74444",
              backgroundColor: "#fbeaea",
            });
          }
        };
        calculateStatus();
      }, [params.row.taskStatus, params.row._id]);

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingX: "20px",
            width: "100%",
          }}
        >
          <Chip
            label={status.label}
            icon={status.icon}
            sx={{
              backgroundColor: status.backgroundColor,
              color: status.color,
              fontSize: "0.7rem",
              fontWeight: "500",
              paddingX: "10px",
              "& .MuiChip-icon": {
                fontSize: "1.1rem",
                color: status.color,
              },
            }}
          />
        </Box>
      );
    },
  },
];

export default function EmployeeTaskTable() {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const theme = useTheme();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser._id;

  async function getTasks() {
    try {
      const date = new Date(); // Assuming you want tasks created on the current date
      const formattedDate = date.toISOString(); // Convert date to ISO string format
      console.log(formattedDate);
      const response = await axios.get(`/api/task/getAssignedTasksByEmployeeIdDate/${id}`, {
        params: {
          date: formattedDate,
        },
      });
      const tasks = response.data.map((task) => ({
        id: task._id, // Ensure _id is used as the unique identifier
        ...task,
      }));
      setRows(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    getTasks();
  }, [id]);

  useEffect(() => {
    if (socket) {
      console.log("socket");
      // const handleTaskAssignment = (task) => {
      //   const newTask = { ...task, id: task._id }; // Add `id` using `_id`

      //   const newRows = [...rows];
      //   const index = newRows.findIndex((row) => row.id === newTask.id);

      //   if (index === -1) {
      //     newRows.push(newTask);
      //   } else {
      //     newRows[index] = newTask;
      //   }

      //   setRows(newRows);
      // };
      const Refresh = () => {
        getTasks();
      };

      socket.on("taskAssigned", Refresh);
      socket.on("pauseReqAccepted", Refresh);
      socket.on("TaskResumed", Refresh);
      socket.on("notification", Refresh);
      socket.on("statusUpdated", Refresh);

      return () => {
        socket.off("taskAssigned", Refresh);
        socket.off("pauseReqAccepted", Refresh);
        socket.off("TaskResumed", Refresh);
        socket.off("notification", Refresh);
        socket.on("statusUpdated", Refresh);
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, rows, dispatch, currentUser]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (value === "") {
      getTasks(); // Reload all     tasks if search text is cleared
    } else {
      const filteredRows = rows.filter((row) => row.taskTicketNo.toLowerCase().includes(value.toLowerCase()));
      setRows(filteredRows);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const currentTask = rows.find((row) => row.id === id);
      const currentStatus = currentTask.taskStatus;
      const pauseRequestStatus = currentTask.pauseRequestStatus;
      if (
        currentStatus === "Paused" &&
        (status === "PauseRequest" || status === "Completed" || status === "In Progress")
      ) {
        toast.error("Task is paused!!");
        return;
      } else if (currentStatus === "Not Started" && (status === "PauseRequest" || status === "ResumeRequest")) {
        toast.error("Task is not Started Yet!");
        return;
      } else if (currentStatus === "In Progress" && (status === "In Progress" || status === "ResumeRequest")) {
        toast.error("Task is already in Progress");
        return;
      } else if (pauseRequestStatus === "pending" && status === "PauseRequest") {
        toast.error("Pause Request already pending");
      } else if (currentStatus === "In Progress" && status === "PauseRequest") {
        const Task = rows.find((row) => row.id === id);
        console.log(Task);
        const response = await axios.post("/api/task/pauseRequest", {
          taskId: Task._id,
          ticketNumber: Task.taskTicketNo,
          managerId: Task.manager_obj_id,
          employeeId: Task.employee_obj_id,
          employeeName: currentUser.employeeName,
        });
        console.log(response);
        if (response.status === 200) {
          toast.success("Task pause Request Sent successfully!");
        } else {
          toast.error("Failed to send pause task!");
        }
      } else if (currentStatus === "Paused" && status === "ResumeRequest") {
        const Task = rows.find((row) => row.id === id);
        console.log(Task);
        const response = await axios.post("/api/task/pauseResume", {
          taskId: Task._id,
          ticketNumber: Task.taskTicketNo,
          managerId: Task.manager_obj_id,
          employeeId: Task.employee_obj_id,
          employeeName: currentUser.employeeName,
        });
        console.log(response);
        if (response.status === 200) {
          toast.success("Task Resume Request Sent successfully!");
        } else {
          toast.error("Failed to send Resume task!");
        }
      }

      // Conditions for status change
      if (currentStatus === "In Progress" && status === "Not Started") {
        toast.error("Task status cannot be changed to Not Started once it is In Progress!");
        return;
      } else if (currentStatus === "Completed" || status === "Not Started") {
        toast.error("Task status cannot be changed once it is Completed!");
        return;
      } else if (currentStatus === "Not Started" && status === "Completed") {
        toast.error("Task status cannot be directly changed to Completed!");
        return;
      }

      if (
        (currentStatus === "In Progress" && status === "Completed") ||
        (currentStatus === "Not Started" && status === "In Progress")
      ) {
        console.log("we are in");
        // Update task status via API
        const response = await axios.put(`/api/task/updateTaskStatus/${id}`, {
          taskStatus: status,
          taskStartTime: status === "In Progress" ? new Date().toISOString() : null,
          taskcompleteTime: status === "Completed" ? new Date().toISOString() : null,
        });
        if (response.status === 200) {
          toast.success("successfully!");
        } else {
          toast.error("Failed!");
        }
        // Update local state (rows) after successful update
        // setRows((prevRows) =>
        //   prevRows.map((row) =>
        //     row.id === id
        //       ? {
        //           ...row,
        //           taskStatus: status,
        //           taskStartTime:
        //             status === "In Progress" ? new Date().toISOString() : null, // Update taskStartTime locally
        //         }
        //       : row
        //   )
        // );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Typography variant="h6">Task List</Typography>
        <TextField
          label="Search Ticket No"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearch}
          sx={{
            width: 300,
            color: "#3b4056",
            "& .MuiInputBase-input::placeholder": {
              color: "#3b4056", // Change placeholder color
              fontSize: "16px", // Change font size
            },
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, width: "100%", overflowX: "auto" }}>
        <div style={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns(handleStatusChange)}
            pageSize={5}
            density="comfortable"
            disableRowSelectionOnClick
            getRowId={(row) => row._id}
          />
        </div>
      </Box>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Paper>
  );
}