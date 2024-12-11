import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosInterceptor";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import bg from "/vbt-logo.png";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { palette } from "../../theme/colors";
import { initializeSocket } from "../../redux/socketSlice";

export default function ViewLeave() {
  const { id } = useParams();
  const [leave, setLeave] = useState({});
  const [leaveFrom, setLeaveFrom] = useState({});
  const [getLeave, setGetLeave] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  // notification;
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendLeaveStatus = (status) => {
    axios
      .put(`/api/leave/change-status/${id}`, {
        status,
        statusChangedBy: currentUser.employeeName,
        statusChangedById: currentUser._id,
        for: leaveFrom._id,
      })
      .then((res) => {
        setGetLeave(!getLeave);
        console.log(res);
        toast.success("Leave status changed successfully");
        if (currentUser.role == "admin") {
          navigate("/Manager-leaves");
        } else {
          navigate("/employee-leaves");
        }
      })
      .catch((error) => {
        toast.error("Error in changing leave status!!!");
        console.log(error);
      });
  };
  const getLeaves = async () => {
    axios
      .get(`/api/leave/get-leave/${id}`)
      .then((response) => {
        setLeaveFrom(response.data.from);
        setLeave(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leave history:", error);
      });
  };
  useEffect(() => {
    getLeaves();
  }, [id, getLeave]);
  useEffect(() => {
    if (socket) {
      socket.on("notification", () => {
        getLeaves();
      });
      return () => {
        socket.off("notification", () => {
          // console.log(`Employee of the Week: ${data.employee} with ${data.points} points!`);
        });
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, dispatch, currentUser]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const times = new Date(0, 0, 0, hours, minutes);
    const formattedTime = times.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formattedTime;
  };
  {
    {
      return (
        <>
          <Toaster />
          <Box sx={{ width: "100%", padding: 3, paddingX: 6 }}>
            <Box component={Paper} elevation={3} p={10}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                pt={5}
                pb={3}
              >
                <Box pb={1}>
                  <img src={bg} alt="" width={380} />
                </Box>
                <Typography variant="body2" textAlign={"center"}>
                  B-343, Pagganwala Street, Near Cheema Masjid, Shadman Colony,
                  Gujrat, Pakistan.
                </Typography>
                <Typography variant="body2" textAlign={"center"}>
                  Mobile: 0322-5930603, 0346-5930603, Landline: 053-3709168,
                  053-3728469
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">
                    URL:
                    <Link
                      href="https://www.example.com"
                      target="_blank"
                      rel="noopener"
                      sx={{ marginLeft: 1 }}
                    >
                      https://www.visionbird.com
                    </Link>
                  </Typography>
                  <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                    Email:
                    <Link
                      href="https://www.example.com"
                      target="_blank"
                      rel="noopener"
                      sx={{ marginLeft: 1 }}
                    >
                      info@visionbird.com
                    </Link>
                  </Typography>
                </Box>
              </Box>
              <Box
                fullWidth
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                bgcolor={palette.primary.main}
                mb={6}
                p={2}
              >
                <Typography fontSize={25} fontWeight={500} color={"white"}>
                  {leave.leaveType} Applicant Form
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    value={leaveFrom.employeeName}
                    label="Employee's Name"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    value={leaveFrom.employeeID}
                    label="Employee's ID"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    value={leaveFrom.employeeDesignation}
                    label="Designation"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={leave.reason}
                    label="Reason / Purpose of Leave"
                    rows={4}
                    multiline
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid spacing={2} container xs={12} item>
                  <Grid item xs={leave.leaveType == "Long Leaves" ? 6 : 3}>
                    <TextField
                      value={leave.leaveType}
                      label="Leave type"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  {leave.leaveType !== "Long Leaves" ? (
                    <Grid xs={5} item fullWidth>
                      <TextField
                        value={dayjs(leave.selectedDate).format(
                          "dddd, MMMM D, YYYY"
                        )}
                        label="Leave Date"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  ) : null}

                  {leave.leaveType == "Half Leave" ? (
                    <>
                      <Grid xs={2} item>
                        <TextField
                          value={formatTime(leave.fromTime)}
                          label="From"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid xs={2} item>
                        <TextField
                          value={formatTime(leave.toTime)}
                          label="To"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </>
                  ) : null}
                  {leave.leaveType == "Short Leave" ? (
                    <>
                      <Grid xs={2} item>
                        <TextField
                          value={formatTime(leave.fromTime)}
                          label="From"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid xs={2} item>
                        <TextField
                          value={formatTime(leave.toTime)}
                          label="To"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </>
                  ) : null}

                  <Grid xs={leave.leaveType == "Long Leaves" ? 6 : 4} item>
                    <TextField
                      value={leave.leaveCategory}
                      label="Leave Category"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  {leave.leaveType == "Long Leaves" ? (
                    <>
                      <Grid xs={6} item>
                        <TextField
                          value={dayjs(leave.leavesStart).format(
                            "dddd, MMMM D, YYYY"
                          )}
                          label="Leaves Start"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid xs={6} item>
                        <TextField
                          value={dayjs(leave.leavesEnd).format(
                            "dddd, MMMM D, YYYY"
                          )}
                          label="Leaves End"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </>
                  ) : null}
                  <Grid
                    xs={
                      leave.leaveType == "Half Leave" ||
                      leave.leaveType == "Short Leave"
                        ? 8
                        : 12
                    }
                    item
                  >
                    <TextField
                      value={leave.status}
                      label="Leave status"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                {currentUser.role == "employee" ? (
                  "" //If role is not employee
                ) : currentUser.role == "manager" ? ( //If role is manager
                  currentUser._id == leaveFrom._id ? (
                    "" //If leave is from same person who is login
                  ) : leave.status == "Pending" ? (
                    <Grid item>
                      <Grid container spacing={2} mt={10} mb={10}>
                        <Grid item>
                          <Button
                            variant="contained"
                            onClick={() => {
                              sendLeaveStatus("Accepted");
                            }}
                          >
                            Accept
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                              sendLeaveStatus("Rejected");
                            }}
                          >
                            Reject
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )
                ) : //If role is not manager
                currentUser._id == leave.for ? ( //If leave is for person who is login
                  leave.status == "Pending" ? (
                    <Grid item>
                      <Grid container spacing={2} mt={10} mb={10}>
                        <Grid item>
                          <Button
                            variant="contained"
                            onClick={() => {
                              sendLeaveStatus("Accepted");
                            }}
                          >
                            Accept
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                              sendLeaveStatus("Rejected");
                            }}
                          >
                            Reject
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </Grid>
            </Box>
          </Box>
        </>
      );
    }
  }
}
