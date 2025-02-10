require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dbconnection = require("./config/db_connection");
const { setupIoInstance } = require("./controllers/leavesController");
const { setupTaskIoInstance } = require("./controllers/task.controller");
const { setupEOPIoInstance } = require("./controllers/emp_of_week.controller");
const cookieParser = require("cookie-parser");

// Routes
const employeeRoute = require("./routes/employee_routes");
const authRoutes = require("./routes/authroutes");
const interneeRoutes = require("./routes/internee_routes");
const attendenceRoutes = require("./routes/attendence_routes");
const salaryRoutes = require("./routes/salary_routes");
const advanceRoutes = require("./routes/advance_routes");
const interviewRoute = require("./routes/interview.route");
const postRoute = require("./routes/postroutes");
const taskRoute = require("./routes/task.route");
const taxCategoryRoutes = require("./routes/taxCategory_routes");
const taxFileRoutes = require("./routes/taxFile_routes");
const leaveRoutes = require("./routes/leave_routes");
const notificationRoutes = require("./routes/notification_routes");
const employeeOfWeekRoutes = require("./routes/Employee_of_week_routes");
const employeeDocumentRoutes = require("./routes/employeeDocumentRoutes");
const teamRoutes = require("./routes/team_routes");

const auth = require("./Middlewares/auth");

// Models
const Employee = require("./models/employeemodel");
const Notification = require("./models/notificationModel");
const EmployeeOfWeekModel = require("./models/emp_of_week.model");

// Middlewares
const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_DOMAIN_NAME
      : process.env.FRONTEND_LOCAL_ADDRESS,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

app.use(express.text());

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"));
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// routes

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api/interview", interviewRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/auth", authRoutes);
app.use("/api/internee", auth, interneeRoutes);
app.use("/api/attendence", auth, attendenceRoutes);
app.use("/api/pay", auth, salaryRoutes);
app.use("/api/advance_payments", auth, advanceRoutes);
app.use("/api/posts", postRoute);
app.use("/api/task", taskRoute);
app.use("/api/tax_Category", taxCategoryRoutes);
app.use("/api/tax_File", taxFileRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/empOfWeek", employeeOfWeekRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/employee-documents", employeeDocumentRoutes);

// Socket.io
const server = http.createServer(app);
const origin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_DOMAIN_NAME
    : process.env.FRONTEND_LOCAL_ADDRESS;
console.log("CORS Origin :", origin);
const io = new Server(server, {
  cors: {
    origin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});
console.log("Backend url :", process.env.NODE_ENV);
setupIoInstance(io);
setupTaskIoInstance(io);
setupEOPIoInstance(io);

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.use(async (socket, next) => {
  try {
    const id = socket.handshake.query.id;
    const user = await Employee.findById(id);

    if (!user) {
      return next(new Error("Socket connection error: User not found"));
    }
    socket.user = user;
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Socket connection error"));
  }
});

io.on("connection", async (socket) => {
  // console.log(`${socket.user.role}, ${socket.user.employeeName} connected & socket ID: ${socket.id}`);
  const userId = socket.user.id;
  addUser(userId, socket.id);
  // console.log(users);

  socket.join(userId.toString());

  const notifications = await Notification.find({ for: userId });
  notifications.forEach((notification) => {
    socket.emit("notification", notification);
  });

  const fetchEvaluationData = async () => {
    try {
      const evaluationData = await EmployeeOfWeekModel.find();
      // console.log(evaluationData);
      socket.emit("evaluationData", evaluationData);
    } catch (error) {
      console.error("Error fetching evaluation data:", error);
    }
  };
  // Fetch data initially when the client connects
  fetchEvaluationData();

  // Update data periodically every 5 seconds
  const intervalId = setInterval(fetchEvaluationData, 5000);

  socket.on("disconnect", async () => {
    // console.log(`User disconnected: ${socket.user.employeeName} Socket ID ${socket.id}`);
    removeUser(socket.id);
    clearInterval(intervalId);
  });
});

dbconnection(); //database connection
const port = process.env.PORT;
server.listen(port, () => console.log(`Server running on port ${port}`));
