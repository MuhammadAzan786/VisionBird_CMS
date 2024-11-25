const EmpOfWeek = require("../models/emp_of_week.model");
const date_fns = require("date-fns");
const EmpOfWeekWinners = require('../models/EmpOfWeekWinners'); // Adjust the path as needed
const eowNotification=require('../models/eowNotificationModel')
const Employee =require('../models/employeemodel')
let ioInstance;

const setupEOPIoInstance = (io) => {
  ioInstance = io;
};

// ! POST: Create new employee of the week evaluations
const postEvaluations = async (req, res) => {
  try {
    const evaluations = req.body.reportData;
    console.log(evaluations);
    const evaluationDate = new Date(evaluations[0].evaluation_date);
    console.log("evaluationDate (Date object)", evaluationDate);

    // Reset time to 00:00:00.000
    evaluationDate.setUTCHours(0, 0, 0, 0);
    const evaluationDateTimeZero = evaluationDate.toISOString();
    //console.log("evaluationDateTimeZero", evaluationDateTimeZero);

    const weekNo = getWeekNumber(new Date(evaluationDate)); // Function to calculate the week number

    // Prepare the data for insertion
    const evaluationsToInsert = evaluations.map((evalData) => {
      const totalPoints =
        (evalData.behavior_points || 0) +
        (evalData.work_attitude_points || 0) +
        (evalData.quality_of_work_points || 0) +
        (evalData.work_creativity || 0) -
        (evalData.mistakes_points || 0);

      return {
        employee: {
          id: evalData.employee_id,
          name: evalData.employee_name,
        },
        evaluation_date: evaluationDateTimeZero,
        behavior_points: evalData.behavior_points,
        work_attitude_points: evalData.work_attitude_points,
        quality_of_work_points: evalData.quality_of_work_points,
        work_creativity: evalData.work_creativity,
        mistakes_points: evalData.mistakes_points,
        leave: evalData.leave,
        week_no: weekNo,
        total_points: totalPoints,
      };
    });

    // Use insertMany to insert multiple records at once
    const result = await EmpOfWeek.insertMany(evaluationsToInsert);

    // Check if the day is Friday (5 represents Friday in JavaScript Date API)
    
    console.log(evaluationDate.getUTCDay() )
    if (evaluationDate.getUTCDay() === 5) {
      console.log("yes today is friday")
      // Call the controller to calculate the Employee of the Week
      const employeeOfTheWeek = await calculateEmployeeOfTheWeek(weekNo);

      // If an employee of the week is found, save it to the database or handle as needed
      if (employeeOfTheWeek) {
        await EmpOfWeekWinners.create({
          week_no: weekNo,
          employee_id: employeeOfTheWeek.id,
          employee_name: employeeOfTheWeek.name,
          total_points: employeeOfTheWeek.totalPoints,
        });

        // const notificationData = await TaskNotification.create({
        //   employee_id: employeeId,
        //   manager_id: managerId,
        //   Task_id: taskId,
        //   message: `${managerName} has accepted the Pause request of Task ${ticketNumber}`,
        // });
        const notificationData = await eowNotification.create({
          name: employeeOfTheWeek.name,
          //employee: employeeOfTheWeek.name,
          points: employeeOfTheWeek.totalPoints,
          employee_id:employeeOfTheWeek.id,
          message: `Congratulations to ${employeeOfTheWeek.name} for being the Employee of the Week!`,
          NotificationName:"eowNotification"
        });

        console.log("notification ka data ",notificationData)
        // notification
        
        ioInstance.emit("notification", notificationData); 
        ioInstance.emit("celebration", notificationData); // Broadcast to all connected clients

     
        // ioInstance.emit('celebration', {
        //     message: `Congratulations to ${employeeOfTheWeek.name} for being the Employee of the Week!`,
        //     employee: employeeOfTheWeek.name,
        //     points: employeeOfTheWeek.totalPoints,
        //   });
        // ioInstance.emit('celebration', {
        //   message: `Congratulations to ${employeeOfTheWeek.name} for being the Employee of the Week!`,
        //   employee: employeeOfTheWeek.name,
        //   points: employeeOfTheWeek.totalPoints,
        // });
        // Send a celebration message to all employees
        console.log("Celebration: Employee of the Week is", employeeOfTheWeek.name);
      }
    }
   
    return res.status(201).json({
      message: "Evaluations submitted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error submitting evaluations:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// This function determines the Employee of the Week based on highest points
const calculateEmployeeOfTheWeek = async (weekNo) => {
  try {
    // Retrieve all evaluations for the specified week
    const evaluations = await EmpOfWeek.find({ week_no: weekNo });
    console.log("Evaluations for the week:", evaluations);

    if (evaluations.length === 0) {
      console.log(`No evaluations found for week number: ${weekNo}`);
      return null;
    }

    // Group evaluations by employee ID and calculate total points
    const employeeTotals = evaluations.reduce((acc, evalData) => {
      const employeeId = evalData.employee.id;
      const employeeName = evalData.employee.name;
      const points = evalData.total_points;

      // If employee ID is already in acc, add points to total
      if (acc[employeeId]) {
        acc[employeeId].totalPoints += points;
      } else {
        // Otherwise, initialize this employee's entry
        acc[employeeId] = { name: employeeName, totalPoints: points };
      }

      return acc;
    }, {});

    // Determine the employee with the highest total points
    let topEmployee = null;
    for (const [id, data] of Object.entries(employeeTotals)) {
      console.log(`Employee ID: ${id}, Name: ${data.name}, Total Points: ${data.totalPoints}`);
      if (!topEmployee || data.totalPoints > topEmployee.totalPoints) {
        topEmployee = { id, name: data.name, totalPoints: data.totalPoints };
      }
    }

    return topEmployee;
  } catch (error) {
    console.error("Error calculating Employee of the Week:", error);
    return null;
  }
};





// * Function to get the week number
const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};
// ! GET: Check if the report for this date exists or not
const checkReportExists = async (req, res) => {
  try {
    const { evaluation_date } = req.params;
    console.log(evaluation_date);
    const weekNo = getWeekNumber(new Date(evaluation_date));
    const todayDate = date_fns.format(new Date(evaluation_date), "yyyy-MM-dd");
    // Check if the date is a weekday (Monday to Friday)
    if (date_fns.isWeekend(todayDate)) {
      return res.status(200).json({
        message: "Reports can only be submitted for weekdays.",
        exists: false,
        evaluation_permission: false,
      });
    }
    // Check if reports for the given date already exist
    const existingReports = await EmpOfWeek.find({
      evaluation_date: evaluation_date,
      week_no: weekNo,
    });
    console.log("existingReports", existingReports);
    if (existingReports.length > 0) {
      console.log("existing length", existingReports.length);
      return res.status(200).json({
        message: "Reports for this date already exist.",
        exists: true,
        evaluation_permission: false,
      });
    }
    return res.status(200).json({
      message: "No reports found for this date.",
      exists: false,
      evaluation_permission: true,
    });
  } catch (error) {
    console.error("Error checking report existence:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ! GET: Retrieve all evaluations for a specific week
const getEvaluationsByWeek = async (req, res) => {
  try {
    const { week_no } = req.params;
    // Find all evaluations for the specified week number
    const evaluations = await EmpOfWeek.find({ week_no });
    if (evaluations.length === 0) {
      return res
        .status(404)
        .json({ message: `No evaluations found for week number ${week_no}.` });
    }
    return res.status(200).json({ evaluations });
  } catch (error) {
    console.error("Error in GET /evaluations/week/:week_no:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// ! GET: Retrieve all evaluations for a specific employee
const getEvaluationsByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    // Find all evaluations for the specified employee
    const evaluations = await EmpOfWeek.find({ "employee.id": employee_id });
    if (evaluations.length === 0) {
      return res.status(404).json({
        message: `No evaluations found for employee with ID ${employee_id}.`,
      });
    }
    return res.status(200).json({ evaluations });
  } catch (error) {
    console.error("Error in GET /evaluations/employee/:employee_id:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// ! GET: Retrieve all evaluations for a specific employee for specific week
const getEvaluationsByEmployeeForWeek = async (req, res) => {
  try {
    const { employee_id, week_no } = req.query;
    console.log("employee_id", employee_id, "week_no", week_no);
    // Find all evaluations where the employee.id matches and the week_no matches
    const evaluations = await EmpOfWeek.find({
      "employee.id": employee_id,
      week_no: week_no,
    });
    // if (evaluations.length === 0) {
    //   return res.status(404).json({
    //     message: `No evaluations found for employee with ID ${employee_id} in week number ${week_no}.`,
    //   });
    // }
    console.log("returning ......", employee_id, evaluations);
    return res.status(200).json({ evaluations });
  } catch (error) {
    console.error(
      "Error in GET /evaluations/employee/:employee_id/week/:week_no:",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// ! PUT: Update an existing evaluation for a specific week and employee
const updateEvaluation = async (req, res) => {
  try {
    const { week_no, employee_id } = req.params;
    const {
      behavior_points,
      work_attitude_points,
      quality_of_work_points,
      work_creativity,
      mistakes_points,
      leave,
    } = req.body;
    // Find the evaluation for the specified week and employee
    const evaluation = await EmpOfWeek.findOne({ id: employee_id, week_no });
    if (!evaluation) {
      return res.status(404).json({
        message: `No evaluation found for employee ID ${employee_id} in week number ${week_no}.`,
      });
    }
    // Update the evaluation fields
    evaluation.behavior_points = behavior_points ?? evaluation.behavior_points;
    evaluation.work_attitude_points =
      work_attitude_points ?? evaluation.work_attitude_points;
    evaluation.quality_of_work_points =
      quality_of_work_points ?? evaluation.quality_of_work_points;
    evaluation.work_creativity = work_creativity ?? evaluation.work_creativity;
    evaluation.mistakes_points = mistakes_points ?? evaluation.mistakes_points;
    evaluation.leave = leave ?? evaluation.leave;
    evaluation.total_points =
      evaluation.behavior_points +
      evaluation.work_attitude_points +
      evaluation.quality_of_work_points +
      evaluation.work_creativity -
      evaluation.mistakes_points;
    // Save the updated evaluation
    const updatedEvaluation = await evaluation.save();
    return res.status(200).json({
      message: "Evaluation updated successfully",
      evaluation: updatedEvaluation,
    });
  } catch (error) {
    console.error("Error in PUT /evaluation/:week_no/:employee_id:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// ! GET: Retrieve all dates for which the data has been added
const getReportDates = async (req, res) => {
  try {
    const reports = await EmpOfWeek.aggregate([
      {
        $group: {
          _id: "$evaluation_date",
          reports: { $push: "$$ROOT" },
        },
      },
    ]);
    console.log("Reports:", reports);
    const dates = reports.map((report) => report._id);
    console.log("Dates:", dates);
    return res.status(200).json({ dates });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// ! GET: Retrive all evaluations history
// const getAllEvaluations = async (req, res) => {
//   try {
//     // Fetch all evaluations without populating the employee info
//     const data = await EmpOfWeek.find();

//     // For each evaluation, fetch the employee details and only include the necessary fields
//     const evaluationsWithEmployeeDetails = await Promise.all(data.map(async (evaluation) => {
//       // Fetch employee by ID
//       const employee = await Employee.findById(evaluation.employee.id, 'employeeName email employeeProImage'); // Select necessary fields

//       return {
//         ...evaluation.toObject(),  // Convert Mongoose document to plain object
//         employee: employee
//           ? {
//               name: employee.employeeName,
//               email: employee.email,
//               employeeProImage: employee.employeeProImage,
//             }
//           : {
//               name: "Unknown", // Default values if employee not found
//               email: "N/A",
//               employeeProImage: null,
//             },
//       };
//     }));

//     // Return evaluations with populated employee details
//     return res.status(200).json({ data: evaluationsWithEmployeeDetails });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
const getAllEvaluations = async (req, res) => {
  try {
    // Extract weekNo from the query parameters
    const { weekNo } = req.query;

    let weekQuery = {};
    if (weekNo) {
      // If a week number is provided, fetch data for that specific week
      weekQuery = { week_no: weekNo };
    } else {
      // If no week number is provided, fetch data for the most recent week
      const mostRecentWeek = await EmpOfWeek.findOne().sort({ week_no: -1 }); // Sort by week_no in descending order
      if (mostRecentWeek) {
        weekQuery = { week_no: mostRecentWeek.week_no }; // Use the most recent week's number
      } else {
        return res.status(400).json({ message: 'No evaluations found' });
      }
    }

    let allEmployeeTotals = []; // To store totals for all weeks

    // Retrieve all evaluations for the specified or most recent week
    const evaluations = await EmpOfWeek.find(weekQuery);

    // Group evaluations by employee ID and calculate total points
    const employeeTotals = await evaluations.reduce(async (accPromise, evalData) => {
      const acc = await accPromise; // Wait for the accumulator to resolve
      const employeeId = evalData.employee.id; // Employee ID
      const points = evalData.total_points; // Points awarded

      // Fetch employee details (name, email, profile image, designation)
      const employee = await Employee.findById(employeeId, 'employeeName email employeeProImage employeeDesignation');

      if (employee) {
        const { employeeName, email, employeeProImage, employeeDesignation } = employee;

        // If employee ID already exists in the accumulator, add the points
        if (acc[employeeId]) {
          acc[employeeId].totalPoints += points;
        } else {
          // Otherwise, initialize this employee's entry
          acc[employeeId] = {
            name: employeeName,
            email: email,
            employeeProImage: employeeProImage,
            employeeDesignation: employeeDesignation, // Include designation here
            totalPoints: points
          };
        }
      }

      return acc;
    }, Promise.resolve({})); // Initialize accumulator as a resolved promise

    // Add the employee totals for this week to the overall result
    allEmployeeTotals.push({ weekNo: weekQuery.week_no || mostRecentWeek.week_no, employeeTotals });

    // Return all employee totals for each week
    return res.status(200).json({ data: allEmployeeTotals });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};




module.exports = {
  postEvaluations,
  getEvaluationsByWeek,
  getEvaluationsByEmployee,
  updateEvaluation,
  getEvaluationsByEmployeeForWeek,
  checkReportExists,
  getReportDates,
  setupEOPIoInstance,
  getAllEvaluations
};
