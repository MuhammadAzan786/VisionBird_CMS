const mongoose = require("mongoose");
const taxFilesSchema = new mongoose.Schema(
  {
    file_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax_Category",
    },
    file: {
      type: [],
      // required: true,
    },
    file_date: {
      type: Date,
      // required: true,
    },
    uniqueIdentity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tax_Files = mongoose.model("Tax_Files", taxFilesSchema);

module.exports = Tax_Files;
