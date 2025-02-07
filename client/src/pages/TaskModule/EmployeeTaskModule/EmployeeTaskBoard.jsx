import * as React from "react";

import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { DataGrid, renderActionsCell } from "@mui/x-data-grid";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import { DataGridPro } from "@mui/x-data-grid-pro";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import Tooltip from "@mui/material/Tooltip";
import axios from "../../../utils/axiosInterceptor";
import { initializeSocket } from "../../../redux/socketSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { CustomChip } from "../../../components/Styled/CustomChip";
import EmployeeNameCell from "../../../components/Grid Cells/EmployeeProfileCell";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-columnHeaders ": {
            backgroundColor: "#00afef", // Header background color
            color: "white", // Header text color
          },
          "& .MuiButtonBase-root": {
            tabindex: "1",
          },
          "&.MuiSvgIcon-root": {
            color: "white !important",
            visibility: "visible !important",
            tabindex: "1",
          },
          "&.MuiDataGrid-menuIcon": {
            color: "white !important",
            visibility: "visible !important",
            tabindex: "1",
          },

          // Optional: Style for the cell to maintain consistency
          cell: {
            color: "black", // Set your desired cell text color
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          //fontWeight: 'bold',
          color: "white !important",
          backgroundColor: "#00afef",
          //backgroundColor: '#72e128',
          // padding: '8px 16px',
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#00afef",
          },
          "&:disabled": {
            backgroundColor: "#66c8e4",
            color: "white !important",
          },
          //fontFamily:"inter",
          // Responsive font sizes using breakpoints
          fontSize: "13px", // default size
          "@media (max-width:600px)": {
            fontSize: "0.5rem", // smaller screens
          },
          "@media (min-width:600px) and (max-width:960px)": {
            fontSize: "0.6rem", // medium screens
          },
          "@media (min-width:960px)": {
            fontSize: "1rem", // larger screens
          },
        },
      },
    },
  },
});

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Formatting to ensure two digits for hours, minutes, and seconds
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const commonCenteringProps = {
  headerAlign: "center", // Center the header
  renderCell: (params) => (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%">
      {params.value}
    </Box>
  ),
};
function formatDateTime(unixTime) {
  return new Date(unixTime * 1000).toLocaleString(); // Convert UNIX timestamp to readable date
}
const columns = [
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
  {
    field: "TaskPriority",
    headerName: "Task Priority",
    flex: 1,
    editable: true,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <CustomChip label={row.taskPriority} status={row.taskPriority} />,
  },
  {
    field: "TimeSlots",
    headerName: "Time",
    width: 250,
    headerAlign: "center",
    renderCell: (params) => {
      // Directly access taskTime_1 from params.row
      const taskTime = params.row.taskTime_1;
  
      if (!taskTime) {
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
            <Typography variant="body2" sx={{ fontWeight: "300" }}>
              No task time available
            </Typography>
          </Box>
        );
      }
  
      // Format the date_time using the formatDateTime function
      const formattedDateTime = formatDateTime(taskTime.date_time);
  
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
          <Typography variant="body2" sx={{ fontWeight: "400" }}>
            {formattedDateTime}
          </Typography>
        </Box>
      );
    },
  },
  
  
  {
    field: "Action",
    headerName: "Action",
    flex: 1,
    editable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const updataStatus = async () => {
        event.stopPropagation();
        try {
          console.log(`Updating status for task with ID: ${params.row._id}`);

          const response = await axios.put(`/api/task/taskCompleteStatusUpdate/${params.row._id}`, {});
          console.log(response);
          if (response.status == 200) {
            console.log("200");
            toast.success("Task Completed Successfully !");
            fetchData();
          }

          console.log(response);
        } catch (error) {
          console.log(error);
        }
      };
      return (
        <>
          <Tooltip title="Complete" arrow>
            <Button
              onClick={updataStatus}
              disabled={params.row.taskcompleteStatus !== "Task UnComplete"}
              sx={{
                minWidth: "auto", // Remove extra width
                padding: 0, // Remove padding for an icon-only button
                // backgroundColor: "transparent", // Remove background color
                color: "inherit", // Inherit text color

                backgroundColor: "transparent !important",
                boxShadow: "none", // Remove box shadow if any
                transition: "transform 0.3s ease", // Smooth transition for background and transform
                "&:hover": {
                  backgroundColor: "transparent !important",
                  transform: "rotate(15deg)", // Rotate icon on hover
                },
              }}
            >
              <DoneOutlineIcon
                sx={{
                  backgroundColor: "transparent !important",
                  "&:hover": {
                    backgroundColor: "transparent !important",
                    transform: "rotate(15deg)", // Rotate icon on hover
                  },
                  color: params.row.taskcompleteStatus === "Task UnComplete" ? "gray" : "green", // Change color based on task completion status
                }}
              />
            </Button>
          </Tooltip>
        </>
      );
    },
  },
];

const handleButtonClick = (row) => {
  console.log("Button clicked for row:", row);
};

export default function EmployeeTaskBoard() {
  const [task, setTask] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState({});

  const [searchText, setSearchText] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  console.log(currentUser);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/task/getTaskByEmpId/${currentUser._id}`);

      setTask(response.data);
      console.log("tasks");
      console.log(response.data);
    } catch (error) {
      console.log(error);
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



  useEffect(() => {
    fetchData(); // Call fetchData function when component mounts
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.trim(); // Trim whitespace
    console.log("Type of value:", typeof value, "Value:", value);
    setSearchText(value);

    if (value === "") {
      fetchData(); // Reload all tasks if search text is cleared
    } else {
      const filteredRows = task.filter((row) => {
        const taskTicketNo = row.taskTicketNo ? row.taskTicketNo.toString().trim() : ""; // Trim whitespace
        console.log("Task Ticket No:", taskTicketNo, "Type:", typeof taskTicketNo);
        console.log("Comparison Result:", taskTicketNo.includes(value));

        return taskTicketNo.includes(value); // Filter rows by ticket number
      });

      console.log("Filtered Rows:", filteredRows);
      setTask(filteredRows); // Set filtered rows
    }
  };

  useEffect(() => {
    if (socket) {
      const handleTaskStatusChange = (task) => {
        fetchData();
      };

      socket.on("statusUpdated", handleTaskStatusChange);
      socket.on("taskAssigned", handleTaskStatusChange);

      return () => {
        socket.off("taskAssigned", handleTaskStatusChange);
        socket.off("statusUpdated", handleTaskStatusChange);
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, dispatch, currentUser]);

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
        <Typography variant="h6">Tasks</Typography>
        {/* <Typography variant="h6">Task List</Typography> */}
        <TextField
          label="Search Ticket No"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearch}
          sx={{ width: 300 }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, width: "100%", overflowX: "auto" }}>
        <div style={{ width: "100%" }}>
          <DataGrid
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            rows={task}
            columns={columns}
            pageSize={10}
            density="comfortable"
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
        </div>
      </Box>
    </Paper>
  );
}
