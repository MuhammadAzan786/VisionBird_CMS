const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    employee_obj_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    loan_amount: {
      type: Number,
      required: true,
    },
    loan_left: {
      type: Number,
      required: true,
    },
    loan_deducted: {
      type: Number,
    },
    loan_payback_type: {
      type: String,
      enum: ["full", "installments"],
      required: true,
    },

    installment_duration_months: {
      type: Number,
      // required: function () {
      //   return this.loan_payback_type === "installments";
      // },

      required: true,
    },
    loan_reason: {
      type: String,
      required: true,
    },

    approval_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    activity_status: {
      type: String,
      enum: ["active", "completed"],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

loanSchema.pre("validate", function (next) {
  if (this.isNew && this.loan_left === undefined) {
    this.loan_left = this.loan_amount;
  }
  next();
});

loanSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.installment_duration_months <= 0) {
    update.$set.activity_status = "completed";
  }
  next();
});

loanSchema.index(
  { employee_obj_id: 1, approval_status: 1, activity_status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      $or: [{ approval_status: "pending" }, { activity_status: "active" }],
    },
    // partialFilterExpression: {
    //   loan_status: {
    //     $or: [{ approval_status: "pending" }, { activity_status: "active" }],
    //   },
    // },
  }
);

const LoanModel = mongoose.model("loan", loanSchema);
module.exports = LoanModel;
