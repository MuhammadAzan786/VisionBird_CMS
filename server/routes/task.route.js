const express = require("express");
const router = express.Router();
const {
  getTask,
  getTaskById,
  postTask,
  deleteTask,
  getTaskByEmpId,
  getTaskByIntId,
  taskStatusUpdate,
  task_Completed,
  taskCompleteStatusUpdate,
  getTasksByDate,
  getAssignedTasksByEmployeeIdDate,
  getCompletedTasksByEmployeeIdDate,
  completedTaskHistory,
  getLateTasksByEmployeeIdDate,
  pauseRequest,
  pauseRequestAccepted,
  add_new_task_types,
  getPendingTasksByEmpId,
  get_all_task_types,
  delete_task_type,
  edit_task_type,
  pauseResume,
} = require("../controllers/task.controller");
const auth = require("../Middlewares/auth");
const authorizeRoles = require("../Middlewares/authorization");
//* Get Task Controller
router.get("/getTask", auth, authorizeRoles("admin", "manager"), getTask);
// * Get Tasks By date
router.get(
  "/getTasksByDate",
  auth,
  authorizeRoles("admin", "manager"),
  getTasksByDate
);
// * Get Task By Id
router.get(
  "/getTaskById/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  getTaskById
);
// * Get Task from Employee Id
router.get(
  "/getTaskByEmpId/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  getTaskByEmpId
);


// * Get Task from Employee Id where task is not completed
router.get(
  "/getPendingTasksByEmpId/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  getPendingTasksByEmpId
);


// * Get Task from Employee Id and date
router.get(
  "/getAssignedTasksByEmployeeIdDate/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  getAssignedTasksByEmployeeIdDate
);

// * Get Completed Tasks from Employee Id and date
router.get(
  "/getCompletedTasksByEmployeeIdDate/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  getCompletedTasksByEmployeeIdDate
);
//Get Task History
router.get(
  "/completedTaskHistory/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  completedTaskHistory
);
// * Get Completed Tasks from Employee Id and date
router.get(
  "/getLateTasksByEmployeeIdDate/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  getLateTasksByEmployeeIdDate
);
// * Get Task from Internee Id
router.get(
  "/getTaskByIntId/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  getTaskByIntId
);
// * Post Task
router.post("/postTask", auth, authorizeRoles("admin", "manager"), postTask);

// * Delete Task
router.delete(
  "/deleteTask/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  deleteTask
);

// * Get all task types
router.get(
  "/get_all_task_types",
  auth,
  authorizeRoles("admin", "manager"),
  get_all_task_types
);
// * Add a new task type
router.post(
  "/add_new_task_types",
  auth,
  authorizeRoles("admin", "manager"),
  add_new_task_types
);

// * edit task type
router.put(
  "/edit_task_type/:id",
  auth,
  authorizeRoles("admin", "manager"),
  edit_task_type
);
// * delete task type
router.delete(
  "/delete_task_type/:id",
  auth,
  authorizeRoles("admin", "manager"),
  delete_task_type
);


router.put(
  '/taskCompleteStatusUpdate/:id',
  auth,
  authorizeRoles( "employee","manager"),
  taskCompleteStatusUpdate,

)
module.exports = router;
