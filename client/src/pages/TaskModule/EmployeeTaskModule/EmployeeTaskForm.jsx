import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Make sure you're using Day.js or the adapter you need
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneOutlineSharpIcon from "@mui/icons-material/DoneOutlineSharp";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../../utils/axiosInterceptor";
import dayjs from "dayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function EmployeeTaskForm() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const role = currentUser.role;
  const assignedby = currentUser._id;
  const [taskTypes, setTaskTypes] = useState([]);
  const [newTaskType, setNewTaskType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaskType, setEditingTaskType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const textFieldRef = useRef(null);

  const [formData, setFormData] = useState({
    ticketNumber: "",
    priority: "",
    taskType: "",
    employee_obj_id: "",
    slots: [
      { date_time: null, points: "" },
      { date_time: null, points: "" },
      { date_time: null, points: "" },
    ],
  });

  const handleEditClick = (type) => {
    setEditingTaskType(type.name);
    setNewTaskType(type.name);
    setSelectedId(type._id);
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
      }
    }, 0);
  };

  const mapFormDataToApiFormat = () => {
    const apiData = {
      taskTime_1: {
        date_time: formData.slots[0].date_time
          ? dayjs(formData.slots[0].date_time).unix()
          : null,
        points: Number(formData.slots[0].points),
      },
      taskTime_2: {
        date_time: formData.slots[1].date_time
          ? dayjs(formData.slots[1].date_time).unix()
          : null,
        points: Number(formData.slots[1].points),
      },
      taskTime_3: {
        date_time: formData.slots[2].date_time
          ? dayjs(formData.slots[2].date_time).unix()
          : null,
        points: Number(formData.slots[2].points),
      },
    };
    console.log("apiData", apiData);
    return apiData;
  };

  // Handle slot change (either for time or points)
  const handleSlotChange = (index, field) => (value) => {
    const updatedSlots = [...formData.slots];
    updatedSlots[index][field] = value;
    setFormData({ ...formData, slots: updatedSlots });
  };

  useEffect(() => {
    const fetchTaskTypes = async () => {
      const response = await axios.get("/api/task/get_all_task_types");
      setTaskTypes(response.data);
    };
    fetchTaskTypes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (value === "add-new") {
      setModalOpen(true); // Open modal to add new task type
    }
  };

  // Open dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTaskType = async () => {
    if (!newTaskType) return;
    try {
      const response = await axios.post("/api/task/add_new_task_types", {
        name: newTaskType,
      });
      setTaskTypes([...taskTypes, response.data]);
      setFormData({ ...formData, taskType: response.data.name });
      setNewTaskType("");
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding task type:", error);
    }
  };

  const handleEditTaskType = async () => {
    if (!editingTaskType || !selectedId) return;
    try {
      const response = await axios.put(
        `/api/task/edit_task_type/${selectedId}`,
        { name: newTaskType }
      );
      setTaskTypes(
        taskTypes.map((type) =>
          type._id === selectedId ? response.data : type
        )
      );
      setEditingTaskType(null);
      setNewTaskType(null);
      setSelectedId(null);
      setModalOpen(false);
    } catch (error) {
      console.error("Error editing task type:", error);
    }
  };

  const handleDeleteTaskType = async (id) => {
    try {
      await axios.delete(`/api/task/delete_task_type/${id}`);
      setTaskTypes(taskTypes.filter((type) => type._id !== id));
    } catch (error) {
      console.error("Error deleting task type:", error);
    }
  };
  const searchQuery = "";
  useEffect(() => {
    async function getEmployees() {
      try {
        const response = await axios.get(
          `/api/employee/get_managers_employees?search=${searchQuery}`
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    getEmployees();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const apiData = mapFormDataToApiFormat();
    const updatedFormData = {
      ...formData,
      manager_obj_id: currentUser._id,
      taskTime_1: {
        date_time: apiData.taskTime_1.date_time,
        points: apiData.taskTime_1.points,
      },
      taskTime_2: {
        date_time: apiData.taskTime_2.date_time,
        points: apiData.taskTime_2.points,
      },
      taskTime_3: {
        date_time: apiData.taskTime_3.date_time,
        points: apiData.taskTime_3.points,
      },
    };
    const { slots, ...formDataWithoutSlots } = updatedFormData;
    console.log("formDataWithoutSlots", formDataWithoutSlots);

    const role = currentUser.role;
    if (role === "admin" || role === "manager") {
      axios
        .post("/api/task/postTask", formDataWithoutSlots)
        .then((res) => {
          toast.success("Task Assigned Successfully !");
          setTimeout(() => {
            navigate("/all-tasks");
          }, 1500);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Task Assignment Failed !");
        });
    } else {
      toast.error("Not Authorized to Assign Task !");
      return;
    }
  };

  return (
    <Paper>
      <Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  color: "#3b4056",
                  fontWeight: "500",
                  fontSize: "18px",
                }}
                mb={1}
              >
                Task Assignment Form{" "}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ticketNumber"
                label="Task Ticket Number"
                variant="outlined"
                fullWidth
                value={formData.ticketNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Task Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Task Priority"
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Assign Employee</InputLabel>
                <Select
                  name="employee_obj_id"
                  value={formData.employee_obj_id}
                  onChange={handleChange}
                  label="Assign Employee"
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      {employee.employeeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Task Type</InputLabel>
                <Select
                  name="taskType"
                  value={formData.taskType}
                  onChange={handleChange}
                  label="Task Type"
                >
                  {taskTypes.map((type) => (
                    <MenuItem key={type._id} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ marginTop: "5px" }}>
                <Typography
                  onClick={() => setModalOpen(true)}
                  color="#007aa7"
                  sx={{
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    display: "flex",
                    justifyContent: "end",
                    color: "#00729B",
                  }}
                >
                  <AddIcon
                    sx={{
                      color: "#00729B",
                      fontSize: "1rem",
                    }}
                  />{" "}
                  Add new type
                </Typography>
              </Box>

              {/* Modal for managing task types */}
              <Dialog
                open={modalOpen}
                onClose={() => {
                  setModalOpen(false);
                  setEditingTaskType("");
                  setNewTaskType("");
                  setSelectedId("");
                }}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>Manage Task Types</DialogTitle>
                <DialogContent>
                  <TextField
                    label={editingTaskType ? "Edit Task Type" : "New Task Type"}
                    inputRef={textFieldRef}
                    variant="outlined"
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    fullWidth
                    sx={{ my: 1 }}
                    onFocus={() => {
                      newTaskType === "" && setNewTaskType("");
                    }}
                  />
                  <List>
                    {taskTypes.map((type) => (
                      <ListItem key={type._id}>
                        <ListItemText primary={type.name} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditClick(type)}
                          >
                            <EditIcon sx={{ color: "#024CAA" }} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteTaskType(type._id)}
                          >
                            <DeleteIcon sx={{ color: "#AF1740" }} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </DialogContent>
                <DialogActions>
                  {editingTaskType ? (
                    <Button
                      onClick={() => handleEditTaskType(selectedId)}
                      color="primary"
                      variant="outlined"
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddTaskType}
                      color="primary"
                      variant="outlined"
                    >
                      Add
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setModalOpen(false);
                      setEditingTaskType("");
                      setNewTaskType("");
                      setSelectedId("");
                    }}
                    color="error"
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={handleClickOpen}
                    >
                      Add Time with Points
                    </Button>
                  </Grid>

                  <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="sm"
                    fullWidth
                  >
                    <DialogTitle>Add Time Slots and Points</DialogTitle>
                    <DialogContent dividers>
                      <Grid container spacing={2} sx={{ my: 1 }}>
                        {formData.slots.map((slot, index) => (
                          <Grid item xs={12} key={index}>
                            <Typography variant="h6" gutterBottom>
                              Time Slot {index + 1}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                {/* Original DateTimePicker */}
                                <DateTimePicker
                                  label="Select Date & Time"
                                  value={slot.date_time}
                                  onChange={(newValue) =>
                                    handleSlotChange(
                                      index,
                                      "date_time"
                                    )(newValue)
                                  }
                                  textField={(params) => (
                                    <TextField {...params} fullWidth />
                                  )}
                                  viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                {/* Points Input (manual entry) */}
                                <FormControl fullWidth>
                                  <TextField
                                    label={`Points for Slot ${index + 1}`}
                                    type="number"
                                    value={slot.points}
                                    onChange={(e) =>
                                      handleSlotChange(
                                        index,
                                        "points"
                                      )(e.target.value)
                                    }
                                    inputProps={{ min: 0 }} // To ensure points are positive
                                    fullWidth
                                  />
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </DialogContent>
                    <DialogActions sx={{ my: 1 }}>
                      <Button onClick={handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleClose}
                        color="primary"
                        variant="contained"
                      >
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={3}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                startIcon={<DoneOutlineSharpIcon />}
              >
                Assign Task
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
    </Paper>
  );
}

export default EmployeeTaskForm;
