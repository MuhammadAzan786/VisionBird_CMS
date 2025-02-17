import { useEffect, useState } from "react";
import { TextField, Box, Grid, Paper, Typography, Button, FormControl, InputLabel, MenuItem } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import bg from "/vbt-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import axios from "../../utils/axiosInterceptor";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Select from "@mui/material/Select";
import { palette } from "../../theme/colors";
import { Navigate } from "react-router-dom";
import { renderTimeViewClock } from "@mui/x-date-pickers";
function LeaveForm() {
  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [leaveCategory, setLeaveCategory] = useState("");
  const [leavesStart, setLeavesStart] = useState(dayjs());
  const [leavesEnd, setLeavesEnd] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [admin, setAdmin] = useState({});
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  let id = currentUser._id;
  let role = currentUser.role;
  let name = currentUser.employeeName;
  let employeeID = currentUser.employeeID;
  let employeeDesignation = currentUser.employeeDesignation;

  const sendLeaveApplication = () => {
    if (
      !reason ||
      !leaveType ||
      !leaveCategory ||
      (leaveType === "Short Leave" && (!fromTime || !toTime)) ||
      (leaveType === "Half Leave" && (!fromTime || !toTime)) ||
      (leaveType !== "Long Leaves" && !selectedDate) ||
      (leaveType === "Long Leaves" && (!leavesStart || !leavesEnd))
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (role === "employee" && !selectedManager) {
      toast.error("Please select manager to request leave.");
      return;
    }
    if (role === "manager" && Object.keys(admin).length === 0) {
      toast.error("Please select admin to request leave.");
      return;
    }

    // If all fields are filled, then submit the form.
    let leave_information = {};

    if (leaveType == "Short Leave") {
      //Get From and To time
      leave_information = {
        from: id,
        role,
        name,
        for: role == "manager" ? admin._id : selectedManager,
        leaveType,
        leaveCategory,
        reason,
        selectedDate,
        fromTime,
        toTime,
      };
    } else if (leaveType == "Half Leave") {
      //Get From and To time
      leave_information = {
        from: id,
        role,
        name,
        for: role == "manager" ? admin._id : selectedManager,
        leaveType,
        leaveCategory,
        reason,
        selectedDate,
        fromTime,
        toTime,
      };
    } else if (leaveType == "Full Leave") {
      leave_information = {
        from: id,
        role,
        name,
        for: role == "manager" ? admin._id : selectedManager,
        leaveType,
        leaveCategory,
        reason,
        selectedDate,
      };
    } else {
      //Long Leave
      leave_information = {
        from: id,
        role,
        name,
        for: role == "manager" ? admin._id : selectedManager,
        leaveType,
        leaveCategory,
        reason,
        leavesStart,
        leavesEnd,
      };
    }
    axios
      .post("/api/leave/create-leave", leave_information)
      .then((res) => {
        console.log(res);
        toast.success("Leave Request Submitted Successfully");
        navigate("/my-leaves");
      })
      .catch((error) => {
        toast.error("Error in Submitting Leave Request!!");
        console.log(error);
      });
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get("/api/employee/get-managers");
      if (!response) {
        throw new Error("Failed to fetch managers");
      }
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const fetchAdmin = async () => {
    try {
      const response = await axios.get("/api/employee/get-admin");
      if (!response) {
        throw new Error("Failed to fetch admin");
      }
      setAdmin(response.data);
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  useEffect(() => {
    if (role == "manager") {
      fetchAdmin();
    } else {
      fetchManagers();
    }
  }, [role]);

  return (
    <>
      <Box sx={{ width: "100%", padding: 3, paddingX: 6 }}>
        <Box component={Paper} p={10}>
          <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} pt={5} pb={3}>
            <Box pb={1}>
              <img src={bg} alt="" width={380} />
            </Box>
            <Typography variant="body2" textAlign={"center"}>
              B-343, Pagganwala Street, Near Cheema Masjid, Shadman Colony, Gujrat, Pakistan.
            </Typography>
            <Typography variant="body2" textAlign={"center"}>
              Mobile: 0322-5930603, 0346-5930603, Landline: 053-3709168, 053-3728469
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2">
                URL:
                <Link href="https://www.example.com" target="_blank" rel="noopener" sx={{ marginLeft: 1 }}>
                  https://www.visionbird.com
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                Email:
                <Link href="https://www.example.com" target="_blank" rel="noopener" sx={{ marginLeft: 1 }}>
                  info@visionbird.com
                </Link>
              </Typography>
            </Box>
          </Box>

          <Typography
            fontSize={25}
            fontWeight={500}
            mb={6}
            p={2}
            color={"white"}
            textAlign="center"
            bgcolor={palette.primary.main}
          >
            Leave Applicant Form
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled
                value={name}
                label="Employee's Name"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                disabled
                value={employeeID}
                label="Employee's ID"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={7}>
              <TextField
                disabled
                value={employeeDesignation}
                label="Designation"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {role == "manager" ? null : (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label" sx={{ color: "grey" }}>
                    Select Manager
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select Manager"
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                  >
                    {managers.map((manager) => (
                      <MenuItem key={manager._id} value={manager._id}>
                        {manager.employeeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" sx={{ color: "grey" }}>
                  Select Leave Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Leave Type"
                  value={leaveType}
                  onChange={(event) => {
                    setLeaveType(event.target.value);
                    setFromTime(null);
                    setToTime(null);
                  }}
                >
                  <MenuItem value="Short Leave">Short Leave (less then 2 hours)</MenuItem>

                  <MenuItem value="Half Leave">Half Leave (2 to 4 hours)</MenuItem>
                  <MenuItem value="Full Leave">Full Leave(1 day or More than 4 hours) </MenuItem>
                  <MenuItem value="Long Leaves">Long Leaves (More than 1 day)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" sx={{ color: "grey" }}>
                  Select Leave Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Leave Category"
                  value={leaveCategory}
                  onChange={(event) => {
                    setLeaveCategory(event.target.value);
                  }}
                >
                  <MenuItem value="Paid Leave">Paid Leave</MenuItem>
                  <MenuItem value="Unpaid Leave">Unpaid Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid spacing={2} container xs={12} item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {leaveType == "Short Leave" ? (
                  <>
                    <Grid xs={6} item fullWidth>
                      <DatePicker
                        sx={{ width: "100%" }}
                        label="Select Short Leave Date"
                        format="dddd, DD MMMM, YYYY"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        // renderInput={(params) => <TextField {...params} />}
                        minDate={dayjs(new Date())}
                      />
                    </Grid>
                    <Grid xs={3} item>
                      <FormControl fullWidth>
                        <TimePicker
                          // desktopModeMediaQuery="Desktop"
                          viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                          }}
                          label="From"
                          value={fromTime ? dayjs(`2000-01-01T${fromTime}`) : null}
                          onChange={(newValue) => {
                            const time = newValue ? newValue.format("HH:mm") : null;

                            setFromTime(time);
                            const toTime = newValue.add(2, "hour").format("HH:mm");
                            setToTime(toTime);

                            if (time && toTime) {
                              console.log("timeeeeeee totime", time, toTime);

                              const from = dayjs(`2000-01-01T${time}`);
                              const to = dayjs(`2000-01-01T${toTime}`);
                              const diffInMinutes = to.diff(from, "minute") || from.diff(to, "minute");
                              if (diffInMinutes > 240) {
                                console.log("120000000");
                                setLeaveType("Full Leave");
                                toast("Leave more than 4hrs will be considered Full leave.", {
                                  icon: "ℹ️",
                                });
                                // toast.error(
                                //   "Short leave more than 4hrs will be considered Full leave."
                                // );
                              } else if (diffInMinutes > 120) {
                                setLeaveType("Half Leave");
                                toast("Leave more than 2hrs will be considered Half leave.", {
                                  icon: "ℹ️",
                                });
                                // toast.error(
                                //   "Short leave more than 4hrs will be considered Half leave."
                                // );
                              }

                              // if (diffInMinutes > 120) {
                              //   setLeaveType("Half Leave");
                              //   toast.error(
                              //     "Short leave more than 2hrs will be considered Full leave."
                              //   );
                              // }
                            }
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={3} item>
                      <FormControl fullWidth>
                        <TimePicker
                          // desktopModeMediaQuery="Desktop"
                          viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                          }}
                          label="To"
                          value={toTime ? dayjs(`2000-01-01T${toTime}`) : null}
                          onChange={(newValue) => {
                            const time = newValue ? newValue.format("HH:mm") : null;
                            setToTime(time);

                            if (time && fromTime) {
                              const from = dayjs(`2000-01-01T${fromTime}`);
                              const to = dayjs(`2000-01-01T${time}`);
                              const diffInMinutes = to.diff(from, "minute") || from.diff(to, "minute");
                              if (diffInMinutes > 240) {
                                console.log("120000000");
                                setLeaveType("Full Leave");
                                toast("Leave more than 4hrs will be considered Full leave.", {
                                  icon: "ℹ️",
                                });
                                // toast.error(
                                //   "Short leave more than 4hrs will be considered Full leave."
                                // );
                              } else if (diffInMinutes > 120) {
                                setLeaveType("Half Leave");
                                toast("Leave more than 2hrs will be considered Half leave.", {
                                  icon: "ℹ️",
                                });
                                // toast.error(
                                //   "Short leave more than 2hrs will be considered Half leave."
                                // );
                              }
                              // if (diffInMinutes > 240) {
                              //   setLeaveType("Full Leave");
                              //   toast.error(
                              //     "Half Leave more than 4hrs will be considered Full Leave."
                              //   );
                              // }
                            }
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : null}
                {leaveType == "Half Leave" ? (
                  <>
                    <Grid xs={6} item fullWidth>
                      <DatePicker
                        sx={{ width: "100%" }}
                        label="Select Half Leave Date"
                        format="dddd, DD MMMM, YYYY"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        // renderInput={(params) => <TextField {...params} />}
                        minDate={dayjs(new Date())}
                      />
                    </Grid>
                    <Grid xs={3} item>
                      <FormControl fullWidth>
                        <TimePicker
                          // desktopModeMediaQuery="Desktop"
                          viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                          }}
                          label="From"
                          value={fromTime ? dayjs(`2000-01-01T${fromTime}`) : null}
                          onChange={(newValue) => {
                            const time = newValue ? newValue.format("HH:mm") : null;
                            setFromTime(time);
                            const toTime = newValue.add(4, "hour").format("HH:mm");
                            setToTime(toTime);

                            if (time && toTime) {
                              const from = dayjs(`2000-01-01T${time}`);
                              const to = dayjs(`2000-01-01T${toTime}`);
                              const diffInMinutes = to.diff(from, "minute") || from.diff(to, "minute");
                              if (diffInMinutes > 240) {
                                setLeaveType("Full Leave");
                                toast("Leave more than 4hrs will be considered Full leave.", {
                                  icon: "ℹ️",
                                });
                                // toast.error(
                                //   "Half leave more than 4hrs will be considered Full leave."
                                // );
                              } else if (diffInMinutes <= 120) {
                                setLeaveType("Short Leave");
                                toast("Leave less than 2hrs will be considered Short Leave.", {
                                  icon: "ℹ️",
                                });
                                // toast.error(
                                //   "Half Leave less than 2hrs will be considered Short Leave."
                                // );
                              }
                            }
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={3} item>
                      <FormControl fullWidth>
                        <TimePicker
                          // desktopModeMediaQuery="Desktop"
                          viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                          }}
                          label="To"
                          value={toTime ? dayjs(`2000-01-01T${toTime}`) : null}
                          onChange={(newValue) => {
                            const time = newValue ? newValue.format("HH:mm") : null;
                            setToTime(time);

                            if (time && fromTime) {
                              const from = dayjs(`2000-01-01T${fromTime}`);
                              const to = dayjs(`2000-01-01T${time}`);
                              const diffInMinutes = to.diff(from, "minute") || from.diff(to, "minute");
                              if (diffInMinutes > 240) {
                                setLeaveType("Full Leave");
                                toast("Leave more than 4hrs will be considered Full Leave.", {
                                  icon: "ℹ️",
                                });
                                // toast.error(
                                //   "Half Leave more than 4hrs will be considered Full Leave."
                                // );
                              } else if (diffInMinutes <= 120) {
                                setLeaveType("Short Leave");
                                toast("Leave less than 2hrs will be considered Short Leave.", {
                                  icon: "ℹ️",
                                });
                                // toast.error(
                                //   "Half Leave less than 2hrs will be considered Short Leave."
                                // );
                              }
                            }
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : null}
                {leaveType == "Full Leave" ? (
                  <>
                    <Grid xs={12} item fullWidth>
                      <DatePicker
                        sx={{ width: "100%" }}
                        label="Select Full Leave Date"
                        format="dddd, DD MMMM, YYYY"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        minDate={dayjs(new Date())}
                      />
                    </Grid>
                  </>
                ) : null}
                {leaveType == "Long Leaves" ? (
                  <>
                    <Grid xs={6} item fullWidth>
                      <DatePicker
                        sx={{ width: "100%" }}
                        label="Leaves Start"
                        format="dddd, DD MMMM, YYYY"
                        value={leavesStart}
                        onChange={(newValue) => {
                          setLeavesStart(newValue);
                        }}
                        minDate={dayjs(new Date())}
                      />
                    </Grid>

                    <Grid xs={6} item fullWidth>
                      <DatePicker
                        sx={{ width: "100%" }}
                        label="Leaves End"
                        format="dddd, DD MMMM, YYYY"
                        value={leavesEnd}
                        onChange={(newValue) => setLeavesEnd(newValue)}
                        minDate={dayjs(new Date())}
                      />
                    </Grid>
                  </>
                ) : null}
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                }}
                label="Reason / Purpose of Leave"
                rows={4}
                multiline
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box display={"flex"} justifyContent={"right"} alignItems={"center"} mt={5}>
            <Button onClick={sendLeaveApplication} variant="contained">
              Send Application
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default LeaveForm;
