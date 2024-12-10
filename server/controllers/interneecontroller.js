const Internee = require("../models/interneemodel");
const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinaryConfig");

module.exports = {
  Add_internee: async (req, res) => {
    try {
      console.log("Add_Internee Request Recieved");
      const { updateData, deletedFiles } = req.body;
      console.log("Deleted Files List: ", deletedFiles);

      // for deleting files on cloudinary
      if (deletedFiles.length > 0) {
        const images = deletedFiles.filter((file) => !file.includes("."));
        const rawFiles = deletedFiles.filter((file) => file.includes("."));

        if (images.length > 0) {
          await cloudinary.api.delete_resources(images, { resource_type: "image" });
          console.log("Emp Add, Images Deleted");
        }

        if (rawFiles.length > 0) {
          await cloudinary.api.delete_resources(rawFiles, { resource_type: "raw" });
          console.log("Emp Add, Raw Files Deleted");
        }
      }

      const internee = new Internee(updateData);
      await internee.save();

      res.json({ message: "Internee Data Saved" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  Update_internee: async (req, res) => {
    try {
      const userId = req.params.id;
      const { updateData, deletedFiles } = req.body;
      console.log("Deleted Files List: ", deletedFiles);

      const document = await Internee.findById(userId);

      if (!document) {
        return res.status(404).json({ error: "Internee not found" });
      }

      // for deleting files on cloudinary
      if (deletedFiles.length > 0) {
        const images = deletedFiles.filter((file) => !file.includes("."));
        const rawFiles = deletedFiles.filter((file) => file.includes("."));

        if (images.length > 0) {
          await cloudinary.api.delete_resources(images, { resource_type: "image" });
          console.log("Emp Add, Images Deleted");
        }

        if (rawFiles.length > 0) {
          await cloudinary.api.delete_resources(rawFiles, { resource_type: "raw" });
          console.log("Emp Add, Raw Files Deleted");
        }
      }

      const updatedInternee = await Internee.findByIdAndUpdate(userId, updateData, {
        new: true, // Return the updated document
      });

      res.status(200).json(updatedInternee);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  },

  Get_All_internees: async (req, res) => {
    try {
      const search = req.query.search || "";
      const internees = await Internee.find({
        $or: [{ firstName: { $regex: search, $options: "i" } }, { internId: { $regex: search, $options: "i" } }],
      });
      res.status(200).json(internees);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //! Update internee status
  update_internee_status: async (req, res) => {
    const { id } = req.params;

    const { interneeStatus } = req.body;

    try {
      const internee = await Internee.findByIdAndUpdate(id, { interneeStatus }, { new: true });

      if (!internee) {
        return res.status(404).json({ message: "Internee not found" });
      }

      res.status(200).json({
        message: "Internee status updated successfully",
        internee,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //! Fetch active internee
  active_internees: async (req, res) => {
    const search = req.query.search || "";
    try {
      const internees = await Internee.find({
        interneeStatus: "active",
        $or: [{ firstName: { $regex: search, $options: "i" } }, { internId: { $regex: search, $options: "i" } }],
      });

      if (internees.length === 0) {
        return res.status(200).json({ message: "No active internees found", internees: [] });
      }

      res.status(200).json(internees);
    } catch (error) {
      console.error("Error fetching active internees:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //! Fetch inactive employees
  inactive_internees: async (req, res) => {
    const search = req.query.search || "";
    try {
      const internees = await Internee.find({
        interneeStatus: "inactive",
        $or: [{ firstName: { $regex: search, $options: "i" } }, { internId: { $regex: search, $options: "i" } }],
      });

      if (internees.length === 0) {
        return res.status(200).json({ message: "No inactive internees found", internees: [] });
      }

      res.status(200).json(internees);
    } catch (error) {
      console.error("Error fetching inactive internees:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  Get_internee: async (req, res) => {
    try {
      const intern_id = req.params.id;
      const internee = await Internee.findById(intern_id);
      res.status(200).json(internee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  Delete_internee: async (req, res) => {
    try {
      const userId = req.params.id;

      const deletedInternee = await Internee.findByIdAndDelete(userId);

      if (!deletedInternee) {
        return res.status(404).json({ message: "Internee not Deleted" });
      }

      const { interneeProImage } = deletedInternee;

      const folderName = interneeProImage.public_id.split("/").slice(0, -1).join("/");
      console.log("folderName", folderName);

      await cloudinary.api.delete_resources_by_prefix(folderName, { resource_type: "image" });
      await cloudinary.api.delete_resources_by_prefix(folderName, { resource_type: "raw" });
      await cloudinary.api.delete_folder(folderName);

      console.log("Internee deleted Successfully");

      res.status(200).json({ message: "Internee deleted Successfully" });
    } catch (error) {
      console.log("DELETE_INTERNEE_ERROR", error);
      res.status(501).json({ message: "Internee deletetion Unsuccessfull" });
    }
  },
};
