const Post = require("../models/postmodel");
const path = require("path");
const fs = require("fs");

module.exports = {
  create_project: async (req, res) => {
    try {
      // const projectImagesFilename = req.files["project_images"].filename;
      const project = new Post({
        ...req.body,
        // project_images: projectImagesFilename
      });
      await project.save().then(() => {
        res.json({ message: "project created !!!" });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  get_projects: async (req, res) => {
    try {
      const projects = await Post.find({ employee_obj_id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  get_project: async (req, res) => {
    const projectId = req.params.id;
    try {
      const project = await Post.findById(projectId);
      res.status(200).json(project);
    } catch (error) {
      res.status(500).send("Error fetching post !!!");
    }
  },
  delete_project: async (req, res) => {
    const projectId = req.params.id;
    try {
      // finding the document to delete
      const project = await Post.findById(projectId);

      //deleting the document from mongo db
      const deleteDone = await Employee.deleteOne({ _id: userId });
      if (!deleteDone) {
        return res.status(404).send({ error: "Employee not Deleted" });
      }
      files_to_delete = [path.join(mainDir, project.project_images)];

      const deleteFile = (filePath) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(`Failed to delete file: ${filePath}`, err);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      };
      files_to_delete.forEach(deleteFile);
      res.status(200).json({ message: "project Deleted !!!" });
    } catch (error) {
      res.status(500).send("Error deleting post !!!");
    }
  },
};
