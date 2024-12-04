const Internee = require("../models/interneemodel");
const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinaryConfig");

module.exports = {
  Add_internee: async (req, res) => {
    try {
      const appointmentFile = req.files["appointmentFile"][0].buffer;
      const cnicFile = req.files["cnicFile"][0].buffer;
      const experienceLetter = req.files["experienceLetter"][0].buffer;
      const interneeProImage = req.files["interneeProImage"][0].buffer;

      // Cloudinary upload for each file using streams
      const uploadToCloudinary = (buffer) => {
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

      const appointmentFileUpload = await uploadToCloudinary(appointmentFile);
      const cnicFileUpload = await uploadToCloudinary(cnicFile);
      const experienceLetterUpload = await uploadToCloudinary(experienceLetter);
      const interneeProImageUpload = await uploadToCloudinary(interneeProImage);

      const internee = new Internee({
        ...req.body,

        appointmentFile: appointmentFileUpload.secure_url,
        cnicFile: cnicFileUpload.secure_url,
        experienceLetter: experienceLetterUpload.secure_url,
        interneeProImage: interneeProImageUpload.secure_url,
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
      //finding the document to delete
      const document = await Internee.findOne({ _id: userId });
      if (!document) {
        res.status(400).json({ error: "Internee not found" });
      }

      //deleting the document from mongo db
      const deleteDone = await Internee.deleteOne({ _id: userId });
      if (!deleteDone) {
        return res.status(400).json({ error: "Internee not deleted" });
      }

      const deleteFromCloudinary = async (url) => {
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

      await deleteFromCloudinary(document.appointmentFile),
        await deleteFromCloudinary(document.cnicFile),
        await deleteFromCloudinary(document.experienceLetter),
        await deleteFromCloudinary(document.interneeProImage),
        res.status(200).json({ message: "Internee Deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  },
};
