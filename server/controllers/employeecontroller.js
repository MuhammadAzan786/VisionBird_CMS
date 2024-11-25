const Employee = require("../models/employeemodel");
const Post = require("../models/postmodel");
const path = require("path");
const fs = require("fs");
const streamifier = require("streamifier");

const cloudinary = require("../utils/cloudinaryConfig");

const parentDir = path.dirname(__dirname);
const mainDir = path.join(parentDir, "uploads", "employees");

module.exports = {
  // ! Add Employee page
  create_employee: async (req, res) => {
    try {
      if (
        !req.files["cnicScanCopy"][0] ||
        !req.files["policeCertificateUpload"][0] ||
        !req.files["degreesScanCopy"][0] ||
        !req.files["employeeProImage"][0]
      ) {
        return res.status(400).json({ error: "Missing required files" });
      }

      const cnicScanCopyBuffer = req.files["cnicScanCopy"][0].buffer;
      const policeCertificateUploadBuffer =
        req.files["policeCertificateUpload"][0].buffer;
      const degreesScanCopyBuffer = req.files["degreesScanCopy"][0].buffer;
      const empProImgBuffer = req.files["employeeProImage"][0].buffer;

      // Cloudinary upload for each file using streams
      const uploadToCloudinary = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "employeePhotos" },
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

      const cnicScanCopyUpload = await uploadToCloudinary(cnicScanCopyBuffer);
      const policeCertificateUploadUpload = await uploadToCloudinary(
        policeCertificateUploadBuffer
      );
      const degreesScanCopyUpload = await uploadToCloudinary(
        degreesScanCopyBuffer
      );
      const employeeProImageUpload = await uploadToCloudinary(empProImgBuffer);

      const employee = new Employee({
        ...req.body,
        cnicScanCopy: cnicScanCopyUpload.secure_url,
        policeCertificateUpload: policeCertificateUploadUpload.secure_url,
        degreesScanCopy: degreesScanCopyUpload.secure_url,
        employeeProImage: employeeProImageUpload.secure_url,
      });

      await employee.save();
      res.json({ message: "Employee data saved successfully!" });
    } catch (error) {
      console.error("Error in create_employee:", error);
      res.status(400).json({ error: error.message });
    }
  },

  // ! Get All the Employee
  get_employees: async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // ! Get the Single Employee
  get_employee: async (req, res) => {
    const userId = req.params.id;
    try {
      const employee = await Employee.findById(userId);
      res.status(200).json(employee);
    } catch (error) {
      console.log(`Error in getting the Employee Record` + error);
    }
  },

  get_managers: async (req, res) => {
    try {
      const managers = await Employee.find({ role: "manager" });
      res.status(200).json(managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching managers" });
    }
  },

  get_admin: async (req, res) => {
    try {
      const admin = await Employee.findOne({ role: "admin" });
      res.status(200).json(admin);
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({ error: "An error occurred while fetching admin" });
    }
  },

  // ! Delete the Employee
  delete_employee: async (req, res) => {
    const userId = req.params.id;
    try {
      // finding the document to delete
      const document = await Employee.findOne({ _id: userId });
      if (!document) {
        res.status(400).json({ error: "Employee not found" });
        return;
      }

      //deleting the document from mongo db
      const deleteDone = await Employee.deleteOne({ _id: userId });
      if (!deleteDone) {
        return res.status(404).send({ error: "Employee not Deleted" });
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

      // Delete files from Cloudinary
      await deleteFromCloudinary(document.cnicScanCopy);
      await deleteFromCloudinary(document.employeeProImage);
      await deleteFromCloudinary(document.policeCertificateUpload);
      await deleteFromCloudinary(document.degreesScanCopy);

      res.status(200).send({ message: "Employee record Deleted !!!" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  },

  // ! Update Employee
  update_employee: async (req, res) => {
    const userId = req.params.id;
    try {
      // Retrieve the current document
      const document = await Employee.findById(userId);
      if (!document) {
        return res.status(404).json({ error: "Employee not found" });
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

      // Fields to check for updates
      const fieldsToCheck = [
        "cnicScanCopy",
        "employeeProImage",
        "policeCertificateUpload",
        "degreesScanCopy",
      ];

      let updateFields = {};

      for (const field of fieldsToCheck) {
        if (req.files[field]) {
          const newFileBuffer = req.files[field][0].buffer; // Get the new file buffer
          const oldCloudinaryUrl = document[field]; // Get the old Cloudinary URL from the document

          // Upload new file to Cloudinary using streams
          const uploadNewFile = async (buffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "employeePhotos" },
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

          // Upload the new file
          const newFileUpload = await uploadNewFile(newFileBuffer);

          // If upload is successful, delete the old file and update the field with the new URL
          if (newFileUpload) {
            await deleteFileFromCloudinary(oldCloudinaryUrl); // Delete the old Cloudinary file
            updateFields[field] = newFileUpload.secure_url; // Update the field with the new file URL
          }
        }
      }

      
      
      // Merge the updated fields with the rest of the request body
      const updateData = {
        ...req.body,
        ...updateFields,
      };

      // Update the document with only the changed fields
      const updatedEmployee = await Employee.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
        }
      );

      res.status(200).json(updatedEmployee);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  },

  // ! Delete Employee with its Post
  delete_employee_with_posts: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await Employee.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "Employee not found" });
      }
      // Delete all posts associated with the user
      await Post.deleteMany({ employee_obj_id: userId });

      res
        .status(200)
        .json({ message: "Employee and its all posts deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // ! Get only Employees no admins no managers
  get_only_employees: async (req, res) => {
    try {
      const employees = await Employee.find({ role: "employee" });
      if (!employees) {
        return res.status(404).json({ message: "No Employees found" });
      }
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // ! Get Employees and managers no admins
  get_managers_employees: async (req, res) => {
    const search = req.query.search || "";
    try {
      const employees = await Employee.find({
        role: { $in: ["employee", "manager"] },
        $or: [
          { employeeName: { $regex: search, $options: "i" } },
          { employeeID: { $regex: search, $options: "i" } },
        ],
      });

      if (!employees || employees.length === 0) {
        return res.status(404).json({ message: "No Employees found" });
      }
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  get_employee_ids: async (req, res) => {
    try {
      const employees = await Employee.find({ role: "employee" }, "_id"); // Retrieve only the IDs
      const employeeIds = employees.map((employee) => employee._id);
      return res.status(200).json(employeeIds);
    } catch (error) {
      console.error("Error fetching employee IDs:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  search_employee: async (req, res) => {
    try {
      const search = req.query.search || "";
      const employees = await Employee.find({
        $or: [
          { employeeName: { $regex: search, $options: "i" } },
          { employeeID: { $regex: search, $options: "i" } },
        ],
      });
      res.status(200).json(employees);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  },
};
