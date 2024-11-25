const mongoose = require("mongoose");
const taxCategorySchema = new mongoose.Schema(
  {
    categoryTitle: {
      type: String,
      required: true,
    },
    categoryCode: {
      type: String,
      required: true,
    },
    categoryDescription: {
      type: String,
    },
    categoryImage: {
      publicId: {
        type: String,
        // required: true,
      },
      src: {
        type: String,
        // required: true,
      },
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Tax_Category", taxCategorySchema);

module.exports = Category;
