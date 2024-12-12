//TODO:LATER NEED TO ADD ANOTHER CHECK FOR APPLICATION APPROVED IN REDUCE METHOD

//We have two leave types (full & half)
//First Separate full and half Leave type using reduce.
//Then loop over full leaves to incremenet paidLeavesCount or unpaidLeavesCount
//Then loop over half leaves to incremenet halfLeavesPaidCount or halfLeavesUnpaidCount

const paid_unpaid_leaves = (leaves) => {
  let paidLeavesCount = 0;
  let unpaidLeavesCount = 0;
  let halfLeavesPaidCount = 0;
  let halfLeavesUnpaidCount = 0;

  const [fullLeaves, halfLeaves] = leaves.reduce(
    (acc, value) => {
      if (value.leaveType === "Full Leave") {
        acc[0].push(value);
      }
      if (value.leaveType === "Half Leave") {
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
    if (leave.leaveCategory === "Paid Leave") {
      paidLeavesCount += 1;
    }
    if (leave.leaveCategory === "Unpaid Leave") {
      unpaidLeavesCount += 1;
    }
  }

  //looping over full leaves to increment halfLeavesPaidCount or halfLeavesUnpaidCount
  for (const leave of halfLeaves) {
    if (leave.leaveCategory === "Paid Leave") {
      halfLeavesPaidCount += 1;
    }
    if (leave.leaveCategory === "Unpaid Leave") {
      halfLeavesUnpaidCount += 1;
    }
  }

  // console.log("half leaves paid:", halfLeavesPaidCount);
  // console.log("half leaves Unpaid:", halfLeavesUnpaidCount);

  paidLeavesCount += Math.floor(halfLeavesPaidCount / 3);
  unpaidLeavesCount += Math.floor(halfLeavesUnpaidCount / 3);

  return { paidLeavesCount, unpaidLeavesCount, halfLeavesPaidCount, halfLeavesUnpaidCount };
};

const paid_unpaid_leaves1 = (leaves) => {
  let paidLeavesCount = 0;
  let unpaidLeavesCount = 0;
  let halfLeavesPaidCount = 0;
  let halfLeavesUnpaidCount = 0;

  const [fullLeaves, halfLeaves] = leaves.reduce(
    (acc, value) => {
      if (value.type === "full") {
        acc[0].push(value);
      } else {
        acc[1].push(value);
      }

      return acc;
    },
    [[], []]
  );

  //looping over full leaves to increment paidLeaves or UnpaidLeaves
  for (const leave of fullLeaves) {
    if (leave.category === "paid") {
      paidLeavesCount += 1;
    } else {
      unpaidLeavesCount += 1;
    }
  }

  //looping over full leaves to increment halfLeavesPaidCount or halfLeavesUnpaidCount
  for (const leave of halfLeaves) {
    if (leave.category === "paid") {
      halfLeavesPaidCount += 1;
    } else {
      halfLeavesUnpaidCount += 1;
    }
  }

  console.log("half leaves paid:", halfLeavesPaidCount);
  console.log("half leaves Unpaid:", halfLeavesUnpaidCount);

  paidLeavesCount += Math.floor(halfLeavesPaidCount / 3);
  unpaidLeavesCount += Math.floor(halfLeavesUnpaidCount / 3);

  return { paidLeavesCount, unpaidLeavesCount, halfLeavesPaidCount, halfLeavesUnpaidCount };
};

module.exports = paid_unpaid_leaves;
