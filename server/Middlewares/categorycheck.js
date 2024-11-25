const taxCategoryModel = require("../models/taxCategorymodel");
const mongoose = require("mongoose");
const categorycheck = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  try {
    const category = await taxCategoryModel.findOne({ _id: id });
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json({ error1: error.message });
  }
};

module.exports = categorycheck;
