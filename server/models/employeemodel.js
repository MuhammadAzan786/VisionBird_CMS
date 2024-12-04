const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeeFatherName: {
    type: String,
    required: true,
  },
  employeeCNIC: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  mailingAddress: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  guardiansMobileNumber: {
    type: String,
    required: true,
  },
  whosMobile: {
    type: String,
    required: true,
  },
  superAdmin: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  disability: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  disabilityType: {
    type: String,
    required: function () {
      return this.disability === "yes";
    },
  },
  qualification: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
  dateConfirmed: {
    type: Date,
  },
  probationPeriod: {
    type: String,
    required: true,
  },
  probationMonth: {
    type: Number,
  },
  policyBookSigned: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  appointmentLetterGiven: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  rulesAndRegulationsSigned: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  annualLeavesSigned: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },

  attendanceBiometric: {
    type: String,
    enum: ["yes", "no"],
  },
  localServerAccountCreated: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    required: true,
  },
  addedInSlack: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  addedInWhatsApp: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  employeeCardGiven: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  bankAccount: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  bankAccountNumber: {
    type: String,
    required: function () {
      return this.bankAccount === "yes";
    },
  },

  employeeID: {
    type: String,
    required: true,
  },
  employeeDesignation: {
    type: String,
    required: true,
  },
  BasicPayInProbationPeriod: {
    type: Number,
    required: function () {
      return this.probationPeriod === "yes";
    },
  },
  BasicPayAfterProbationPeriod: {
    type: Number,
  },
  AllowancesInProbationPeriod: {
    type: Number,
    required: function () {
      return this.probationPeriod === "yes";
    },
  },
  AllowancesAfterProbationPeriod: {
    type: Number,
  },
  employeeUsername: {
    type: String,
    required: true,
  },
  employeePassword: {
    type: String,
    required: true,
  },
  employeeStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },

  // Document Objects
  employeeProImage: {
    type: Object, // Changed from String to Object
    required: false,
    default: {},
    public_id: { type: String },
    secure_url: { type: String },
    original_file_name: { type: String },
    resource_type: { type: String },
  },
  cnicScanCopy: {
    type: [Object], // Changed from [String] to [Object]
    required: false,
    default: [],
    public_id: { type: String },
    secure_url: { type: String },
    original_file_name: { type: String },
    resource_type: { type: String },
  },
  policeCertificateUpload: {
    type: [Object], // Changed from [String] to [Object]
    required: false,
    default: [],
    public_id: { type: String },
    secure_url: { type: String },
    original_file_name: { type: String },
    resource_type: { type: String },
  },
  degreesScanCopy: {
    type: [Object], // Changed from [String] to [Object]
    required: false,
    default: [],
    public_id: { type: String },
    secure_url: { type: String },
    original_file_name: { type: String },
    resource_type: { type: String },
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
