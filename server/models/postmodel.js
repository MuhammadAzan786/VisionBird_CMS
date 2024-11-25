const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    employee_obj_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      // required: true,
    },
    project_id: {
      type: String,
      required: true,
    },
    project_title: {
      type: String,
      required: true,
    },
    project_description: {
      type: String,
    },
    project_url: {
      type: String,
    },
    project_images: [{
      type: String
      // required:true
    }],
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
