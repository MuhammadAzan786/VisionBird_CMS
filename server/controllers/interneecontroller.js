const Internee = require("../models/interneemodel");
const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinaryConfig");

module.exports = {
  Add_internee: async (req, res) => {
    console.log("req ae hai", req.body);

    try {
      const internee = new Internee({
        ...req.body,
      });
      await internee.save().then(() => {
        return res.json({ message: "Internee Data Saved" });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  Get_All_internees: async (req, res) => {
    try {
      const search = req.query.search || "";
      const internees = await Internee.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { internId: { $regex: search, $options: "i" } },
        ],
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
      const internee = await Internee.findByIdAndUpdate(
        id,
        { interneeStatus },
        { new: true }
      );

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
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { internId: { $regex: search, $options: "i" } },
        ],
      });

      if (internees.length === 0) {
        return res
          .status(200)
          .json({ message: "No active internees found", internees: [] });
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
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { internId: { $regex: search, $options: "i" } },
        ],
      });

      if (internees.length === 0) {
        return res
          .status(200)
          .json({ message: "No inactive internees found", internees: [] });
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
  Update_internee: async (req, res) => {
    const userId = req.params.id;
    try {
      // Retrieve the current document
      const document = await Internee.findById(userId);
      if (!document) {
        return res.status(404).json({ error: "Internee not found" });
      }

      // Function to delete a file from Cloudinary if it exists
      const deleteFileFromCloudinary = async (url) => {
        if (url) {
          const segments = url.split("/");
          // Extract the public ID which includes folder and file name but excludes extension
          const publicId =
            segments.slice(7, segments.length - 1).join("/") +
            "/" +
            segments.pop().split(".")[0];

          console.log("Deleting", publicId);
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted Cloudinary file: ${publicId}`);
          } catch (err) {
            console.log(`Failed to delete Cloudinary file: ${publicId}`, err);
          }
        }
      };

      // Fields that contain Cloudinary URLs and may need updating
      const fieldsToCheck = [
        "experienceLetter",
        "appointmentFile",
        "cnicFile",
        "interneeProImage",
      ];

      // Initialize an object to hold the fields to update
      let updateFields = {};

      for (const field of fieldsToCheck) {
        if (req.files[field]) {
          const newFile = req.files[field][0].buffer; // Get the new file path
          const oldCloudinaryUrl = document[field]; // Get the old Cloudinary URL from the document

          // Upload new file to Cloudinary
          const uploadNewFile = async (buffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "internePhotos" },
                (error, result) => {
                  if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                  }
                  resolve(result);
                }
              );
              streamifier.createReadStream(buffer).pipe(stream);
            });
          };
          // const newFileUpload = await cloudinary.uploader.upload(newFile, {
          //   folder: "internePhotos",
          // });

          const newFileUpload = await uploadNewFile(newFile);

          // If upload is successful, delete the old file and update the field with the new URL
          if (newFileUpload) {
            await deleteFileFromCloudinary(oldCloudinaryUrl); // Delete the old Cloudinary file
            updateFields[field] = newFileUpload.secure_url; // Update the field with the new file URL
          }
        }
      }

      // Merge the updateFields object with the rest of the request body
      const updateData = {
        ...req.body,
        ...updateFields,
      };

      // Update the document with only the changed fields
      const updatedInternee = await Internee.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true, // Return the updated document
        }
      );

      res.status(200).json(updatedInternee);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  },
  Delete_internee: async (req, res) => {
    const userId = req.params.id;
    try {
      // Find the document
      const document = await Internee.findOne({ _id: userId });
      if (!document) {
        return res.status(400).json({ error: "Internee not found" });
      }

      // Collect public IDs
      const publicIds = [];

      if (document.interneeProImage?.public_id) {
        publicIds.push(document.interneeProImage.public_id);
      }

      if (Array.isArray(document.cnicFile)) {
        document.cnicFile.forEach((element) => {
          if (element?.public_id) publicIds.push(element.public_id);
        });
      }

      if (Array.isArray(document.experienceLetter)) {
        document.experienceLetter.forEach((element) => {
          if (element?.public_id) publicIds.push(element.public_id);
        });
      }

      if (Array.isArray(document.appointmentFile)) {
        document.appointmentFile.forEach((element) => {
          if (element?.public_id) publicIds.push(element.public_id);
        });
      }

      // Filter for images and raw files
      const images = publicIds.filter(
        (file) => typeof file === "string" && !file.includes(".")
      );
      const rawFiles = publicIds.filter(
        (file) => typeof file === "string" && file.includes(".")
      );

      // Delete resources from Cloudinary
      if (images.length > 0) {
        await cloudinary.api.delete_resources(images, {
          resource_type: "image",
        });
        console.log("Images Deleted");
      }

      if (rawFiles.length > 0) {
        await cloudinary.api.delete_resources(rawFiles, {
          resource_type: "raw",
        });
        console.log("Raw Files Deleted");
      }

      // Handle empty folder deletion
      const id = document.interneeProImage?.public_id;

      if (id) {
        const folderName = id.split("/").slice(0, -1).join("/");
        const filesInFolder = await cloudinary.api.resources({
          type: "upload",
          prefix: folderName + "/",
          max_results: 1,
        });

        if (filesInFolder.resources.length > 0) {
          const remainingPublicIds = filesInFolder.resources.map(
            (file) => file.public_id
          );

          // Delete all remaining resources
          await cloudinary.api.delete_resources(remainingPublicIds, {
            resource_type: "raw",
          });
          console.log("Remaining files deleted:", remainingPublicIds);
        } else {
          console.log("Folder is not empty, cannot delete.");
        }
        const filesAfterDeletion = await cloudinary.api.resources({
          type: "upload",
          prefix: folderName + "/",
        });

        if (filesAfterDeletion.resources.length === 0) {
          await cloudinary.api.delete_folder(folderName);
          console.log("Folder successfully deleted:", folderName);
        } else {
          console.log(
            "Folder still not empty; remaining files:",
            filesAfterDeletion.resources
          );
        }
      } else {
        console.log("Public ID is missing; skipping folder deletion.");
      }
      // Delete the document from MongoDB
      const deleteDone = await Internee.deleteOne({ _id: userId });
      if (!deleteDone) {
        return res.status(400).json({ error: "Internee not deleted" });
      }
      res.status(200).json({ message: "Internee Deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
};
