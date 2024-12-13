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

  const full_leave_type = "Full Leave";
  const half_leave_type = "Half Leave";

  //Category
  const paid_leave_category = "Paid Leave";
  const unpaid_leave_category = "Unpaid Leave";

  const totalLeaves = await leavesModel.aggregate([
    {
      $match: {
        from: new mongoose.Types.ObjectId(userId),
        $expr: {
          $and: [{ $eq: [{ $year: "$selectedDate" }, year] }, { $eq: [{ $month: "$selectedDate" }, month] }],
        },
      },
    },
  ]);

  const [fullLeaves, halfLeaves] = totalLeaves.reduce(
    (acc, value) => {
      if (value.leaveType === full_leave_type) {
        acc[0].push(value);
      }
      if (value.leaveType === half_leave_type) {
        acc[1].push(value);
      }

      return acc;
    },
    [[], []]
  );

  // console.log("Reduce Type Full leaves", fullLeaves);
  // console.log(" Reduce Type half leaves", halfLeaves);

  //looping over full leaves to increment paidLeaves or UnpaidLeaves

  for (const leave of fullLeaves) {
    if (leave.leaveCategory === paid_leave_category) {
      paidLeavesCount += 1;
      paidLeavesCountBefore += 1;
    }
    if (leave.leaveCategory === unpaid_leave_category) {
      unpaidLeavesCount += 1;
      unpaidLeavesCountBefore += 1;
    }
  }

  //looping over full leaves to increment halfLeavesPaidCount or halfLeavesUnpaidCount
  for (const leave of halfLeaves) {
    if (leave.leaveCategory === paid_leave_category) {
      halfLeavesPaidCount += 1;
    }
    if (leave.leaveCategory === unpaid_leave_category) {
      halfLeavesUnpaidCount += 1;
    }
  }

  // console.log("half leaves paid:", halfLeavesPaidCount);
  // console.log("half leaves Unpaid:", halfLeavesUnpaidCount);

  paidLeavesCount += Math.floor(halfLeavesPaidCount / 3);
  unpaidLeavesCount += Math.floor(halfLeavesUnpaidCount / 3);

  return {
    paidLeavesCountBefore,
    unpaidLeavesCountBefore,
    paidLeavesCount,
    unpaidLeavesCount,
    halfLeaves: halfLeaves.length,
    halfLeavesPaidCount,
    halfLeavesUnpaidCount,
  };
};

module.exports = paid_unpaid_leaves;
