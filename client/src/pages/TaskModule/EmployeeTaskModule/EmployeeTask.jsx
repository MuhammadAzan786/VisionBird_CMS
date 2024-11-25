import { useEffect, useState } from "react";
import { Paper, Avatar, Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../../../utils/axiosInterceptor";
import { useSelector } from "react-redux";
import { initializeSocket } from "../../../redux/socketSlice";
import { useDispatch } from "react-redux";
const EmployeeTask = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();

  const fetchEmployees = async () => {
    try {
      const searchTerm = "";
      const response = await axios.get(
        `/api/employee/get_managers_employees?search=${searchTerm}`
      );
      console.log(response);
      const fetchedEmployees = await Promise.all(
        response.data.map(async (employee) => {
          // Fetch tasks for each employee
          const assignTasks = await fetchTasks(
            employee._id,
            "getAssignedTasksByEmployeeIdDate"
          );
          const completeTasks = await fetchTasks(
            employee._id,
            "getCompletedTasksByEmployeeIdDate"
          );

          return {
            ...employee,
            assignTasks,
            completeTasks,
          };
        })
      );
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchTasks = async (employeeId, taskType) => {
    try {
      const { data } = await axios.get(`/api/task/${taskType}/${employeeId}`);
      return data.length;
    } catch (error) {
      console.error(`Error fetching ${taskType} tasks:`, error);
      return 0;
    }
  };

  // const CardClicked=(id)=>{
  //   if(currentUser.role=='mannager' & currentUser._id==id)
  //    navigate(`/employeetaskboard/${id}`)
  //   else
  //   navigate(`/employeetaskviewPause/${id}`)
          

  // }

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (socket) {
      const handlefetchTasks = () => {
        fetchEmployees();
      };

      socket.on("notification", handlefetchTasks);
      socket.on("statusUpdated", handlefetchTasks);
      socket.on("taskAssigned", handlefetchTasks);

      return () => {
        socket.off("notification", handlefetchTasks);
        socket.off("statusUpdated", handlefetchTasks);
        socket.on("taskAssigned", handlefetchTasks);
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket, dispatch]);

  return (
    <Paper>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Grid container spacing={3} justifyContent={"center"}>
          {employees.map((employee) => (
            <Grid
              item
              xl={4}
              lg={5}
              md={6}
              sm={8}
              xs={12}
              key={employee._id}
              component={motion.div}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Box
                sx={{
                  boxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
                  WebkitBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
                  MozBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
                  backgroundColor: "#FFFFFF",
                  py: 3,
                  px: 3,
                  borderRadius: "10px",
                  cursor: "pointer",
                  maxWidth: "100%",

                  transition: "0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "0.3s ease-in-out",
                  },
                }}
              //  onClick={CardClicked(employee._id)}
                onClick={() =>{
                  console.log("usercurrent",currentUser)
                  console.log(currentUser.role,currentUser._id,employee._id)
                  if(currentUser.role=='manager' & currentUser._id==employee._id)
                    navigate(`/employeetaskboard/${employee._id}`)
                    else
                    navigate(`/employeetaskviewPause/${employee._id}`)
                }
                
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: 3,
                    width: "100%",
                  }}
                >
                  <Avatar
                    alt={employee.employeeName}
                    src={employee.employeeProImage}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        lineHeight: "22px",
                        fontWeight: "500",
                        color: "rgba(46, 38, 61, 0.9)",
                        fontSize: "15px",
                      }}
                    >
                      {employee.employeeName}
                    </Typography>
                    <Typography
                      sx={{
                        lineHeight: "20px",
                        fontWeight: "400",
                        color: "rgba(46, 38, 61, 0.7)",
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        maxWidth: "100%",
                      }}
                    >
                      {employee.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  <Grid container spacing={1} justifyContent={"center"}>
                    <Grid item xs={4} textAlign={"center"}>
                      <Box
                        sx={{
                          backgroundColor: "#EFE6FF",
                          py: 1,
                          borderRadius: "5px",
                        }}
                      >
                        <Typography
                          sx={{
                            lineHeight: "22px",
                            fontWeight: "600",
                            //color: "rgba(46, 38, 61, 0.9)",
                            // color:'#666cff',
                            color: "#6A5ACD",
                            fontSize: "13px",
                          }}
                        >
                          Assigned
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1.4rem",
                            fontWeight: "800",
                            // color: "#999999",
                            color: "#6A5ACD",
                          }}
                        >
                          {employee.assignTasks}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4} textAlign={"center"}>
                      <Box
                        sx={{
                          backgroundColor: "#E6FAF1",
                          py: 1,
                          borderRadius: "5px",
                        }}
                      >
                        <Typography
                          sx={{
                            lineHeight: "22px",
                            fontWeight: "600",

                            color: "#2E8B57",
                            fontSize: "13px",
                          }}
                        >
                          Completed
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1.4rem",
                            fontWeight: "800",

                            color: "#2E8B57",
                          }}
                        >
                          {employee.completeTasks}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Paper>
  );
};

export default EmployeeTask;
