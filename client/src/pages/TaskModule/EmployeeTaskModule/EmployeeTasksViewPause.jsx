import * as React from "react";

import { Avatar, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import {
  Box,
  Divider,
  Grid,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import axios from "../../../utils/axiosInterceptor";
import { initializeSocket } from "../../../redux/socketSlice";
import { useParams } from "react-router-dom";
import EmployeeNameCell from "../../../components/Grid Cells/EmployeeProfileCell";

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Formatting to ensure two digits for hours, minutes, and seconds
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};
function formatDateTime(unixTime) {
  return new Date(unixTime * 1000).toLocaleString(); // Convert UNIX timestamp to readable date
}
const columns = () => [
  // Ticket No
  {
    field: "taskTicketNo",
    headerName: "# Ticket",
    flex: 1,
    headerAlign: "center",
    editable: false,
    renderCell: (params) => (
      <Typography variant="inherit" className="flex align-center text-center w-full" display="block">
        #{params.row.taskTicketNo}
      </Typography>
    ),
  },
  {
    field: "AssignedBy",
    headerName: "Assigned By",
    editable: false,
    flex: 2,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <EmployeeNameCell
        src={row.manager_obj_id.employeeProImage.secure_url}
        name={row.manager_obj_id.employeeName}
        userId={row.manager_obj_id.email}
      />
    ),
  },

  // Task Priority
  {
    field: "taskPriority",
    headerName: "Task Priority",
    headerAlign: "center",
    flex: 1,
    width: 150,

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
            label={params.row.taskPriority}
            size="small"
            variant="filled"
            sx={{
              width: "50%",
              backgroundColor: params.row.taskPriority == "Urgent" ? "#ffe3e2" : "#e8fadd",
              color: params.row.taskPriority == "Urgent" ? "#ff5d59" : "#66CA24",
            }}
          />
        </Box>
      );
    },
  },

  // Time
  {
    field: "TimeSlots",
    headerName: "Time",
    width: 250,
    headerAlign: "center",
    renderCell: (params) => {
      const taskTimes = params.row;

      // Prepare a list of task times to display
      const taskTimeList = [
        taskTimes.taskTime_1 || null,
        taskTimes.taskTime_2 || null,
        taskTimes.taskTime_3 || null,
      ];

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {taskTimeList.map((taskTime, index) => {
            if (!taskTime) {
              return (
                <Typography variant="body2" sx={{ fontWeight: "300" }} key={index}>
                  No task time available
                </Typography>
              );
            }
            const formattedDateTime = formatDateTime(taskTime.date_time);
            return (
              <Typography variant="body2" sx={{ fontWeight: "300" }} key={index}>
                {formattedDateTime} (Points: {taskTime.points})
              </Typography>
            );
          })}

        </Box>
      );


    },
  },
  
  {
    field: "Action",
    headerName: "Status",
    flex: 1,
    editable: false,
    headerAlign: "center",
    align: "center",

    renderCell: (params) => {
      return (
        <>
          <Typography
            variant="caption"
            display="block"
            sx={{
              minWidth: "auto", // Remove extra width
              padding: 0, // Remove padding for an icon-only butto
              fontWeight: "500",
              color: "#767989",
            }}
          >
            {params.row.taskcompleteStatus == "Task UnComplete" ? "Not Completed" : "Completed"}
          </Typography>

          {/*         
          <Tooltip title="Done" arrow>
            <Button
              disabled={params.row.taskcompleteStatus !== "Task UnComplete"}
              sx={{
                minWidth: "auto", // Remove extra width
                padding: 0, // Remove padding for an icon-only button
               // backgroundColor: "transparent", // Remove background color
                color: "inherit", // Inherit text color
                
                backgroundColor:'#f5f5f7ff !important',
                boxShadow: "none", // Remove box shadow if any
                transition: "transform 0.3s ease", // Smooth transition for background and transform
                "&:hover": {
                  
                  backgroundColor:'#f5f5f7ff !important',
                  transform: "rotate(15deg)", // Rotate icon on hover
                },
              }}
              
            >
              <DoneOutlineIcon
                sx={{
                  backgroundColor:'#f5f5f7ff !important',
                  "&:hover": {
                    
                  backgroundColor:'#f5f5f7ff !important',
                    transform: "rotate(15deg)", // Rotate icon on hover
                  },
                  color:
                    params.row.taskcompleteStatus === "Task UnComplete"
                      ? "gray"
                      : "green", // Change color based on task completion status
                }}
              />
            </Button>
          </Tooltip> */}
        </>
      );
    },
  },
];

export default function EmployeeTasksViewPause() {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [employee, setEmployee] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState({});
  const [task, setTask] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { empid } = useParams();
  const socket = useSelector((state) => state.socket.socket);

  const currentUser = employee;
  const id = currentUser?._id;

  const getTasks = async (id) => {
    try {
      const response = await axios.get(`/api/task/getTaskByEmpId/${id}`);
      console.log("response", response);
      // const tasks = response.data.map((task) => ({
      //   id: task._id, // Ensure _id is used as the unique identifier
      //   ...task,
      // }));

      setRows(response.data); // Set the rows with the fetched tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      const handleTaskStatusChange = (task) => {
        getTasks(empid); // Reload tasks when status is updated
      };

      socket.on("pauseReq", handleTaskStatusChange);
      socket.on("statusUpdated", handleTaskStatusChange);

      return () => {
        socket.off("pauseReq", handleTaskStatusChange);
        socket.off("statusUpdated", handleTaskStatusChange);
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, rows, dispatch, currentUser]);

  useEffect(() => {
    // getEmployee(empid);
    getTasks(empid);
  }, [empid]);

  const handleSearch = (event) => {
    const value = event.target.value.trim(); // Trim whitespace
    console.log("Type of value:", typeof value, "Value:", value);
    setSearchText(value);

    if (value === "") {
      getTasks(empid); // Reload all tasks if search text is cleared
    } else {
      const filteredRows = rows.filter((row) => {
        const taskTicketNo = row.taskTicketNo ? row.taskTicketNo.toString().trim() : ""; // Trim whitespace
        console.log("Task Ticket No:", taskTicketNo, "Type:", typeof taskTicketNo);
        console.log("Comparison Result:", taskTicketNo.includes(value));

        return taskTicketNo.includes(value); // Filter rows by ticket number
      });

      console.log("Filtered Rows:", filteredRows);
      setRows(filteredRows); // Set filtered rows
    }
  };

  const handleRowClick = (params, event) => {
    setPopoverContent(params.row);
    console.log("params", params.row);
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setPopoverContent(null);
  };

  function formatDateTime(unixTime) {
    return new Date(unixTime * 1000).toLocaleString(); // Convert UNIX timestamp to readable date
  }

  return (
    <Box sx={{ px: 0, py: 6 }}>
      <Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Typography variant="h6">Employee Tasks</Typography>
          <TextField
            label="Search Ticket No"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={handleSearch}
            sx={{ width: 300 }}
          />
        </Box>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          rows={rows}
          columns={columns()}
          pageSize={10}
          rowHeight={100}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          getRowId={(row) => row._id}
        />
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Typography>
            {popoverContent && (
              <Box
                p={2}
                maxWidth={400}
                sx={{
                  // backgroundColor: "#fff",
                  borderRadius: 1,
                  // boxShadow: 1,
                  display: "flex",
                  flexDirection: "column",

                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                {/* Header */}
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Task Details
                </Typography>
                <Divider sx={{ my: 1 }} />

                {/* General Info Section */}
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong style={{ color: "#000000" }}>Task No:</strong> {popoverContent.taskTicketNo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong style={{ color: "#000000" }}>Priority:</strong>{" "}
                      <Typography
                        component="span"
                        sx={{
                          color: popoverContent.taskPriority === "Urgent" ? "error.main" : "text.primary",
                          fontWeight: popoverContent.taskPriority === "Urgent" ? "bold" : "normal",
                        }}
                      >
                        {popoverContent.taskPriority}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong style={{ color: "#000000" }}>Type:</strong> {popoverContent.taskType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong style={{ color: "#000000" }}>Date/Time:</strong> {popoverContent.DateTime}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1 }} />

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">
                          <strong>Task Time</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Date/Time</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Points</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[1, 2, 3].map((num) => {
                        const taskTime = popoverContent[`taskTime_${num}`];
                        return taskTime ? (
                          <TableRow key={num}>
                            <TableCell align="center">{`Time ${num}`}</TableCell>
                            <TableCell align="center">{formatDateTime(taskTime.date_time)}</TableCell>
                            <TableCell align="center">{taskTime.points}</TableCell>
                          </TableRow>
                        ) : null;
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Typography>
        </Popover>
      </Paper>
    </Box>
  );
}
