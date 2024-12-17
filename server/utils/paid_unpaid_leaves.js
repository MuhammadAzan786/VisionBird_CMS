//TODO:LATER NEED TO ADD ANOTHER CHECK FOR APPLICATION APPROVED IN REDUCE METHOD

const { default: mongoose } = require("mongoose");
const leavesModel = require("../models/leavesModel");

//We have two leave types (full & half)
//First Separate full and half Leave type using reduce.
//Then loop over full leaves to incremenet paidLeavesCount or unpaidLeavesCount
//Then loop over half leaves to incremenet halfLeavesPaidCount or halfLeavesUnpaidCount

const paid_unpaid_leaves = async (userId, month, year) => {
  let paidLeavesCountBefore = 0;
  let unpaidLeavesCountBefore = 0;
  let paidLeavesCount = 0;
  let unpaidLeavesCount = 0;
  let halfLeavesPaidCount = 0;
  let halfLeavesUnpaidCount = 0;

  // Types

  const fullLeaveType = "Full Leave";
  const halfLeaveType = "Half Leave";
  const longLeavesType = "Long Leaves";

  //Category
  const unpaidLeaveCategory = "Unpaid Leave";
  const paidLeaveCategory = "Paid Leave";

  const totalLeaves = await leavesModel.aggregate([
    {
      $match: {
        from: new mongoose.Types.ObjectId(userId),
        $expr: {
          $or: [
            {
              $and: [{ $eq: [{ $year: "$selectedDate" }, year] }, { $eq: [{ $month: "$selectedDate" }, month] }],
            },
            {
              $and: [{ $eq: [{ $year: "$leavesStart" }, year] }, { $eq: [{ $month: "$leavesStart" }, month] }],
            },
          ],
        },
      },
    },
  ]);

  console.log("TOTAL LEAVES", totalLeaves);

  const [fullLeaves, halfLeaves, longLeaves] = totalLeaves.reduce(
    (acc, value) => {
      if (value.leaveType === fullLeaveType) {
        acc[0].push(value);
      }
      if (value.leaveType === halfLeaveType) {
        acc[1].push(value);
      }
      if (value.leaveType === "Long Leaves") {
        acc[2].push(value);
      }

      return acc;
    },
    [[], [], []]
  );

  console.log("Long Leaves", longLeaves);

  // console.log("Reduce Type Full leaves", fullLeaves);
  // console.log(" Reduce Type half leaves", halfLeaves);

  //looping over full leaves to increment paidLeaves or UnpaidLeaves

  for (const leave of fullLeaves) {
    if (leave.leaveCategory === paidLeaveCategory) {
      paidLeavesCount += 1;
      paidLeavesCountBefore += 1;
    }
    if (leave.leaveCategory === unpaidLeaveCategory) {
      unpaidLeavesCount += 1;
      unpaidLeavesCountBefore += 1;
    }
  }

  //looping over full leaves to increment halfLeavesPaidCount or halfLeavesUnpaidCount
  for (const leave of halfLeaves) {
    if (leave.leaveCategory === paidLeaveCategory) {
      halfLeavesPaidCount += 1;
    }
    if (leave.leaveCategory === unpaidLeaveCategory) {
      halfLeavesUnpaidCount += 1;
    }
  }

  // console.log("half leaves paid:", halfLeavesPaidCount);
  // console.log("half leaves Unpaid:", halfLeavesUnpaidCount);

  paidLeavesCount += Math.floor(halfLeavesPaidCount / 3);
  unpaidLeavesCount += Math.floor(halfLeavesUnpaidCount / 3);

  const leaveValues = {
    halfLeaves: halfLeaves.length,
    casualLeaves: 55,
    sickLeaves: 55,
    unpaidLeavesCount,
    paidLeavesCount,
    otherLeaves: 55,
  };

  //for frontend data transforming
  const leaveDetails = mapLeavesToLabels(leaveValues);

  return {
    unpaidLeavesCount,
    leaveDetails,
  };
};

const mapLeavesToLabels = (leaveDetails) => {
  const labels = [
    "Short /Half Leave:",
    "Casual Leave:",
    "Sick Leave:",
    "Without Pay Leave:",
    "Cash Leave:",
    "Other Leaves",
  ];

  const keys = Object.keys(leaveDetails);

  if (labels.length === keys.length) {
    const mapped = labels.map((item, index) => {
      const key = keys[index];
      return {
        key,
        label: item,
        value: leaveDetails[key],
      };
    });

    return mapped;
  }
  console.error("Function: mapLeavesToLabels, Labels and leave details keys length mismatch.");
  return [];
};

const longLeaveCalculation = () => {};

module.exports = paid_unpaid_leaves;
