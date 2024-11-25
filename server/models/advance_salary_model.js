const mongoose = require("mongoose");

const advanceSalarySchema = new mongoose.Schema(
  {
    employee_obj_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    advance_salary_months: {
      type: Number,
      required: true,
    },
    advance_salary_left: {
      type: Number,
      required: true,
    },
    advance_salary_deducted: {
      type: Number,
    },
    advance_salary_reason: {
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

advanceSalarySchema.pre("validate", function (next) {
  if (this.isNew && this.advance_salary_left === undefined) {
    this.advance_salary_left = this.advance_salary_months;
  }

  next();
});

advanceSalarySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.advance_salary_left <= 0) {
    update.$set.activity_status = "completed";
  }
  next();
});

advanceSalarySchema.index(
  { employee_obj_id: 1, approval_status: 1, activity_status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      advance_salary_status: {
        $or: [{ approval_status: "pending" }, { activity_status: "active" }],
      },
    },
  }
);

const AdvanceSalary = mongoose.model("AdvanceSalary", advanceSalarySchema);
module.exports = AdvanceSalary;
