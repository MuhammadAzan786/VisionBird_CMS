const mongoose = require("mongoose");
const { Schema } = mongoose;

const interneeSchema = new Schema({
  firstName: { type: String, required: true, match: /^[a-zA-Z\s]+$/ },
  fatherName: { type: String, required: true, match: /^[a-zA-Z\s]+$/ },
  cnic: { type: String, required: true, match: /^\d{5}-\d{7}-\d$/ },
  dob: {
    type: Date,
    required: true,
  },
  mailingAddress: { type: String, required: true },
  mobile: { type: String, required: true, match: /^03\d{2}-\d{7}$/ },
  email: {
    type: String,
    required: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  },
  gender: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  otherMobile: { type: String, required: true, match: /^03\d{2}-\d{7}$/ },
  whosMobile: { type: String, required: true, match: /^[a-zA-Z\s]+$/ },
  qualification: { type: String, required: true },
  rules: { type: String, required: true },
  slack: { type: String, required: true },
  internshipFrom: { type: Date, required: true },
  internshipTo: { type: Date, required: true },
  internId: { type: String, required: true },
  designation: { type: String, required: true },
  offered_By: { type: String, required: true },
  appointmentFile: { type: String },
  cnicFile: { type: String },
  experienceLetter: { type: String },
  interneeProImage: { type: String },
  givenOn: { type: Date, required: true },
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
});

const Internee = mongoose.model("Internee", interneeSchema);
module.exports = Internee;
