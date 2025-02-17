const mongoose = require("mongoose");

const employeeDocumentSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    documentName: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const EmployeeDocument = mongoose.model(
  "EmployeeDocument",
  employeeDocumentSchema
);

module.exports = EmployeeDocument;
