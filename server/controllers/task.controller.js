const notificationModel = require("../models/notificationModel");
const Task = require("../models/task.model");
const Employee = require("../models/employeemodel");
const TaskNotification = require("../models/taskNotificationModel");
const TaskType = require("../models/taskTypemodel");

let ioInstance;

const setupTaskIoInstance = (io) => {
  ioInstance = io;
};

// ! Get Tasks
const getTask = async (req, res) => {
  try {
    const taskData = await Task.find();
    res.status(200).json(taskData);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// ! Get Tasks By date
const getTasksByDate = async (req, res) => {
  try {
    const { date } = req.body;
    const parsedDate = new Date(date);

    const taskData = await Task.find({
      createdAt: {
        $gte: parsedDate, // Start of the day
        $lt: new Date(parsedDate.getTime() + 86400000), // End of the day
      },
    });
    res.status(200).json(taskData);
  } catch (error) {
    console.error("Error fetching tasks by date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//! Get Tasks By EmployeeId According to date
const getTasksByEmployeeIdDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const parsedDate = new Date(date);
    const dateObject = new Date(parsedDate);
    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getUTCDate()).padStart(2, "0");
    const dateOnly = `${year}-${month}-${day}`;
    const data = await Task.find({
      employee_obj_id: id,
      createdAt: {
        $gte: dateOnly, // Start of the day
        $lt: new Date(parsedDate.getTime() + 86400000), // End of the day
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching tasks by employee and date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//! Get Tasks By EmployeeId According to date
const getAssignedTasksByEmployeeIdDate = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the current date
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setUTCHours(23, 59, 59, 999));

    const data = await Task.find({
      employee_obj_id: id,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching tasks by employee and date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//! Get In Progress Tasks By EmployeeId According to date
const getInProgressTasksByEmployeeIdDate = async (req, res) => {
  try {
    const { id } = req.params;
    // Get the current date
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setUTCHours(23, 59, 59, 999));

    const data = await Task.find({
      employee_obj_id: id,
      taskStatus: "In Progress",
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!data) {
      return res.status(404).json({ message: "No In Progress Tasks Found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching tasks by employee and date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//! Get In Progress Tasks By EmployeeId According to date
const getCompletedTasksByEmployeeIdDate = async (req, res) => {
  try {
    const { id } = req.params;
    // Get the current date
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setUTCHours(23, 59, 59, 999));

    const data = await Task.find({
      employee_obj_id: id,
      taskcompleteStatus: "completed",
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!data) {
      return res.status(404).json({ message: "No In Progress Tasks Found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching tasks by employee and date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//! Get In Late Tasks By EmployeeId According to date
const getLateTasksByEmployeeIdDate = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the current date
    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    // Set the "shift end time" to 18:00 PM today
    const shiftEndTime = new Date(currentDate);
    shiftEndTime.setHours(18, 0, 0, 0);  // 18:00 PM

    // Find tasks that are late (task DateTime should be in the past and after shift end time)
    const data = await Task.find({
      employee_obj_id: id,
      taskcompleteStatus: { $ne: "completed" }, // Only non-completed tasks
      taskStatus: { $ne: "Not Started" }, // Optional: exclude tasks that are "Not Started"
      DateTime: { $lte: currentTime }, // Task should have a past date
      createdAt: {
        $gte: currentDate.setUTCHours(0, 0, 0, 0), // Ensure tasks are from today
        $lt: currentDate.setUTCHours(23, 59, 59, 999),
      },
    });

    // Filter out late tasks
    const lateTasks = data.filter(task => {
      // Check if task DateTime exceeds shift end time (18:00 PM)
      return task.DateTime <= shiftEndTime.getTime();
    });

    if (lateTasks.length === 0) {
      return res.status(404).json({ message: "No Late Tasks Found" });
    }

    res.status(200).json(lateTasks);
  } catch (error) {
    console.error("Error fetching tasks by employee and date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// ! Get Tasks by Id
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = await Task.findById(id);
    if (!taskData) {
      res.status(404).json({ message: "No such Task Exist" });
    }
    res.status(200).json(taskData);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// ! Post or Add Task
const postTask = async (req, res) => {
  try {
    console.log("inside postTask");
    console.log(req.body)

    const emp_id = req.body.employee_obj_id;
    const manager_id = req.body.manager_obj_id;
   // const manager_name = req.body.manager_name;
    const ticketNumber = req.body.ticketNumber;
    const priority = req.body.priority;
    const tasktype = req.body.taskType;

    const manager = await Employee.findById(manager_id);
    const manager_name = manager ? manager.employeeName : null;

    // Extracting taskTime objects from request body
    const taskTime_1 = req.body.taskTime_1;
    const taskTime_2 = req.body.taskTime_2;
    const taskTime_3 = req.body.taskTime_3;

    console.log(req.body.taskTime_1,req.body.taskTime_2,req.body.taskTime_3)

    // Create a new Task document with the received data
    const taskData = await Task.create({
      employee_obj_id: emp_id,
      manager_obj_id: manager_id,
      taskTicketNo: ticketNumber,
      taskPriority: priority,
      taskTime_1: {
        //date_time: new Date(taskTime_1.date_time * 1000), // Convert from seconds to milliseconds
        date_time:taskTime_1.date_time ,
        points: taskTime_1.points,
      },
      taskTime_2: {
        //date_time: new Date(taskTime_2.date_time * 1000), // Convert from seconds to milliseconds
        date_time:taskTime_2.date_time ,
        points: taskTime_2.points,
      },
      taskTime_3: {
        //date_time: new Date(taskTime_3.date_time * 1000), // Convert from seconds to milliseconds
        date_time:taskTime_3.date_time ,
        points: taskTime_3.points,
      },
      taskType: tasktype,
    });

    console.log("task data at controller", taskData);

    const notificationData = await TaskNotification.create({
      employee_id: emp_id,
      manager_id: manager_id,
      Task_id: taskData._id,
      message: `New Task From ${manager_name}`,
    });

    ioInstance.to(emp_id.toString()).emit("notification", notificationData);
    ioInstance.to(emp_id.toString()).emit("taskAssigned", taskData);
    ioInstance.to(manager_id.toString()).emit("statusUpdated", taskData);

    res.status(200).json({ taskData, message: "Task Assigned" });
  } catch (error) {
    console.error("Error in postTask:", error);
    res.status(500).json({ message: error.message });
  }
};

// !Task pause request Api
const pauseRequest = async (req, res) => {
  try {
    const taskId = req.body.taskId;
    const ticketNumber = req.body.ticketNumber;
    const managerId = req.body.managerId;
    const employeeId = req.body.employeeId;
    const employeeName = req.body.employeeName;

    const taskData = await Task.findById(taskId);
    const mannager_id = taskData.manager_obj_id;

    if (!taskData) {
      return res.status(404).json({ message: "No such Task Exist" });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        pauseRequestStatus: "pending",
      },
      { new: true }
    );

    const notificationData = await TaskNotification.create({
      employee_id: employeeId,
      manager_id: managerId,
      Task_id: taskId,
      message: `${employeeName} has requested to Pause the Task ${ticketNumber}`,
    });

    ioInstance.to(managerId.toString()).emit("notification", notificationData);

    ioInstance.to(mannager_id.toString()).emit("pauseReq", updatedTask);

    res.status(200).json({ success: true, updatedTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// Pause Request Accepted API
const pauseRequestAccepted = async (req, res) => {
  try {
    const taskId = req.body.taskId;
    const ticketNumber = req.body.ticketNumber;
    const managerId = req.body.managerId;
    const employeeId = req.body.employeeId;
    const employeeName = req.body.employeeName;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "No such Task Exist" });
    }
    if (task.taskStatus !== "In Progress") {
      return res.status(400).json({ message: "Task is not in progress." });
    }

    const currentTime = new Date().getTime();

    // Calculate elapsed time since the task started
    const elapsedTimeInSeconds = Math.floor(
      (currentTime - task.taskStartTime) / 1000
    );

    // Update the pauseStartTime
    task.pauseStartTime = currentTime;

    // Update the task status to "Paused"
    task.taskStatus = "Paused";

    // Update the pauseRequestStatus to "approved"
    task.pauseRequestStatus = "approved";

    // Calculate the new remaining task time
    task.taskTime = Math.max(0, task.taskTime - elapsedTimeInSeconds); // Subtract the elapsed time from the original task time

    await task.save();

    // Emit task status update
    let managerName = await Employee.findById(managerId);
    managerName = managerName.employeeName;

    const notificationData = await TaskNotification.create({
      employee_id: employeeId,
      manager_id: managerId,
      Task_id: taskId,
      message: `${managerName} has accepted the Pause request of Task ${ticketNumber}`,
    });

    ioInstance.to(employeeId.toString()).emit("notification", notificationData);
    ioInstance.to(employeeId.toString()).emit("pauseReqAccepted", task);

    ioInstance.to(managerId.toString()).emit("statusUpdated", task);
    ioInstance.to(employeeId.toString()).emit("statusUpdated", task);

    res
      .status(200)
      .json({ success: true, message: "Task Paused Successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Pause Resume API
const pauseResume = async (req, res) => {
  try {
    console.log("inside controller");
    const taskId = req.body.taskId;
    const managerId = req.body.managerId;
    const employeeId = req.body.employeeId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "No such Task Exist" });
    }
    if (task.taskStatus !== "Paused") {
      return res.status(400).json({ message: "Task is not paused currently." });
    }

    // Check if pauseStartTime exists
    if (!task.pauseStartTime) {
      return res.status(400).json({ message: "Task is not paused currently." });
    }

    // Calculate the current pause duration in seconds
    const currentPauseDurationInSeconds =
      (new Date().getTime() - task.pauseStartTime) / 1000;

    // Update total paused duration
    task.totalpausedDuration =
      (task.totalpausedDuration || 0) + currentPauseDurationInSeconds;

    // Reset pauseStartTime and set task status to In Progress
    task.pauseStartTime = null;
    task.taskStatus = "In Progress";

    // When resuming, set taskStartTime to the current time
    task.taskStartTime = new Date().getTime();

    task.pauseRequestStatus = "not_requested";

    await task.save();

    ioInstance.to(employeeId.toString()).emit("TaskResumed", task);
    ioInstance.to(managerId.toString()).emit("TaskResumed", task);

    ioInstance.to(managerId.toString()).emit("statusUpdated", task);
    ioInstance.to(employeeId.toString()).emit("statusUpdated", task);

    res.status(200).json({
      success: true,
      message: "Task Resumed Successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// !Update Task for starting task and completing task
const taskStatusUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = await Task.findById(id);

    const mannager_id = taskData.manager_obj_id;

    const employee_id = taskData.employee_obj_id;

    if (!taskData) {
      return res.status(404).json({ message: "No such Task Exist" });
    }
    if (req.body.taskStatus === "In Progress") {
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        {
          taskStatus: req.body.taskStatus,
          taskStartTime: req.body.taskStartTime,
        },
        { new: true }
      );

      ioInstance.to(mannager_id.toString()).emit("statusUpdated", updatedTask);
      ioInstance.to(employee_id.toString()).emit("statusUpdated", updatedTask);

      res.status(200).json(updatedTask);
    } else if (req.body.taskStatus === "Completed") {
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        {
          taskStatus: req.body.taskStatus,
          taskcompleteTime: req.body.taskcompleteTime,
        },
        { new: true }
      );

      ioInstance.to(employee_id.toString()).emit("statusUpdated", updatedTask);
      ioInstance.to(mannager_id.toString()).emit("statusUpdated", updatedTask);
      res.status(200).json(updatedTask);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// !Update Task when the task was paused
const pauseTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    task.taskStatus = "Paused";
    task.pauseTime = new Date();
  } catch (error) {}
};

// !Update Task for complete status to check it was on time or late
const taskCompleteStatusUpdate = async (req, res) => {
  try {

    console.log("inside update")
    const { id } = req.params;
    console.log(id)
    //const { taskCompleteStatus } = req.body; // Destructure taskCompleteStatus directly
    // console.log(id);
    // console.log(taskCompleteStatus);

    const task= await Task.findById(id)
    console.log(task)
    // const completionTime=task.updatedAt
    const today = new Date();
    const formattedDateTimePST = today.toLocaleString("en-US", { timeZone: "Asia/Karachi" });
    // Create a Date object from the formatted date string
    const pstDate = new Date(formattedDateTimePST);
    // Convert to Unix timestamp in seconds
    const unixTimestamp = Math.floor(pstDate.getTime() / 1000);

    //console.log(unixTimestamp,task.taskTime_2.date_time)
    let points=0;
    if(unixTimestamp>task.taskTime_2.date_time)
      points=task.taskTime_3.points
    else if(unixTimestamp>task.taskTime_1.date_time)
      points=task.taskTime_2.points
    else if(unixTimestamp<task.taskTime_1.date_time)
      points=task.taskTime_1.points

    
   // console.log(points)

    // Check if task was completed on time
    

    // Use findByIdAndUpdate correctly
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskcompleteStatus: "completed",
        pointsGained:points
       },
      { new: true } // To return the updated document
    );

    if (updatedTask) {
      const ticketNo=task.taskTicketNo
      const emp_id=task.employee_obj_id
      const emp=await Employee.findById(emp_id)
      const emp_name=emp.employeeName
       const manager_id=task.manager_obj_id

    const notificationData = await TaskNotification.create({
      employee_id: emp_id,
       manager_id: manager_id,
      Task_id: id,
      message: `${emp_name} has completed the Task ${ticketNo}`,
    });

    ioInstance.to(manager_id.toString()).emit("notification", notificationData);
    //ioInstance.to(emp_id.toString()).emit("statusUpdated");
    ioInstance.to(manager_id.toString()).emit("statusUpdated");
      return res.status(200).json({ updatedTask });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

// !Get Task through Employee ID
const getTaskByEmpId = async (req, res) => {
  try {
    console.log("inside controller")
    
    console.log(req.params.id )
    const taskData = await Task.find({ employee_obj_id: req.params.id }).populate({
      path: 'manager_obj_id', // Field to populate
      model: 'Employee', // Specify the Employee model
      select: 'employeeName email employeeProImage' // Only retrieve specific fields
    });
    



    if (!taskData) {
      res.status(404).json({ message: "No data of this Employee ID" });
    }
    res.status(200).json(taskData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Get Task through Internee ID
const getTaskByIntId = async (req, res) => {
  try {
    const taskData = await Task.find({ internee_obj_id: req.params.id });
    if (!taskData) {
      res.status(404).json({ message: "No data of this Internee ID" });
    }
    res.status(200).json(taskData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ! Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = await Task.findByIdAndDelete(id);
    if (!taskData) {
      return res.status(404).json({ message: "No task found for deletion" });
    }
    return res.status(200).json({ message: "Task deleted successfully!!!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ! Get all task types
const get_all_task_types = async (req, res) => {
  try {
    const taskTypes = await TaskType.find();
    res.json(taskTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ! Add a new task type
const add_new_task_types = async (req, res) => {
  const { name } = req.body;

  const newTaskType = new TaskType({ name });
  try {
    const savedTaskType = await newTaskType.save();
    res.status(201).json(savedTaskType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ! Edit task type
const edit_task_type = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedTaskType = await TaskType.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );
    if (!updatedTaskType) {
      return res.status(404).json({ message: "Task type not found" });
    }
    res.status(200).json(updatedTaskType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ! delete task type
const delete_task_type = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTaskType = await TaskType.findByIdAndDelete(id);
    if (!deletedTaskType) {
      return res.status(404).json({ message: "Task type not found" });
    }
    res.status(200).json({ message: "Task type deleted successfully!!!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPendingTasksByEmpId = async (req, res) => {
  try {
    const { id } = req.params;

    const tasks = await Task.find({
      employee_obj_id: id,
      taskcompleteStatus: "Task UnComplete"
    });

    if (!tasks.length) {
      return res.status(404).json({ message: 'No incomplete tasks found for this employee.' });
    }

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}

module.exports = {
  getTask,
  getTaskById,
  postTask,
  deleteTask,
  getTaskByEmpId,
  getTaskByIntId,
  getTasksByDate,
  getAssignedTasksByEmployeeIdDate,
  getCompletedTasksByEmployeeIdDate,
  getLateTasksByEmployeeIdDate,
  setupTaskIoInstance,
  edit_task_type,
  delete_task_type,
  get_all_task_types,
  add_new_task_types,
  taskCompleteStatusUpdate,
  getPendingTasksByEmpId
};
