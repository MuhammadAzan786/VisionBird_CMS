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
      const { updateData, deletedFiles } = req.body;

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
      const employee = new Employee(updateData);
      await employee.save();
      console.log("Employee Created Successfully");
      res.json({ message: "Employee data saved successfully!" });
    } catch (error) {
      console.error("Error in create_employee:", error);
      res.status(400).json({ error: error.message });
    }
  },
  // ===============================================================

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
      res.status(500).json({ error: "An error occurred while fetching managers" });
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
          const publicId = segments.slice(7, segments.length - 1).join("/") + "/" + segments.pop().split(".")[0];

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
      const { updateData, deletedFiles } = req.body;
      console.log("Emp Update, Delete File List: ", deletedFiles);

      const document = await Employee.findById(userId);
      if (!document) {
        return res.status(404).json({ error: "Employee not found" });
      }

      //for deleting files on cloudinary
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

      // Update the document with only the changed fields
      const updatedEmployee = await Employee.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

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

      res.status(200).json({ message: "Employee and its all posts deleted successfully" });
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
        $or: [{ employeeName: { $regex: search, $options: "i" } }, { employeeID: { $regex: search, $options: "i" } }],
      });

      if (employees.length === 0) {
        return res.status(200).json({ message: "No employees found", employees: [] });
      }

      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message || "An error occurred" });
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
        $or: [{ employeeName: { $regex: search, $options: "i" } }, { employeeID: { $regex: search, $options: "i" } }],
      });
      res.status(200).json(employees);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  },

  delete_employee_documents: async (req, res) => {
    try {
      const { public_id } = req.query;

      console.log("deleting document", public_id);
      const result = await cloudinary.uploader.destroy(public_id);
      if (result.result === "ok") {
        return res.status(200).json({ message: "Document deleted successfully" });
      } else {
        return res.status(400).json({ message: "Failed to delete document" });
      }
    } catch (error) {
      console.log("Error deleting document from Cloudinary:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  grabge_collector: async (req, res) => {
    // data shape : Employee/Tayyab_/o18zzgxtbdaxxy49rq3d
    console.log("Garbage Collector", req.body);

    try {
      const parsedData = JSON.parse(req.body);
      if (parsedData.length === 0) {
        console.log("nothing to delete");
        return;
      }

      const images = parsedData.filter((file) => !file.includes("."));
      const rawFiles = parsedData.filter((file) => file.includes("."));

      if (images.length > 0) {
        await cloudinary.api.delete_resources(images, { resource_type: "image" });
        console.log("Emp Add, Images Deleted");
      }

      if (rawFiles.length > 0) {
        await cloudinary.api.delete_resources(rawFiles, { resource_type: "raw" });
        console.log("Emp Add, Raw Files Deleted");
      }

      // await cloudinary.api.delete_resources(parsedData, { type: "upload" });
      // console.log("Deleted files:");

      const folderName = parsedData[0].split("/").slice(0, -1).join("/");
      console.log("folder", folderName);

      const filesInFolder = await cloudinary.api.resources({
        type: "upload",
        prefix: folderName + "/",
        max_results: 1,
      });

      console.log("Files length:", filesInFolder.resources.length);

      if (filesInFolder.resources.length === 0) {
        // Delete the folder if it's empty
        await cloudinary.api.delete_folder(folderName);
        console.log("Deleted folder:");
      } else {
        console.log("Folder is not empty, cannot delete.");
      }
    } catch (error) {
      console.log("Error during deletion:", error);
    }
  },

  //! Update employee status
  update_employee_status: async (req, res) => {
    const { id } = req.params;
    console.log("iddd", id);
    const { employeeStatus } = req.body;

    try {
      const employee = await Employee.findByIdAndUpdate(
        id,
        { employeeStatus },
        { new: true } // Return the updated document
      );
      console.log(employee);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({
        message: "Employee status updated successfully",
        employee,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //! Fetch active employees
  active_employees: async (req, res) => {
    const search = req.query.search || "";
    try {
      const employees = await Employee.find({
        employeeStatus: "active",
        role: { $in: ["employee", "manager"] },
        $or: [{ employeeName: { $regex: search, $options: "i" } }, { employeeID: { $regex: search, $options: "i" } }],
      });

      if (employees.length === 0) {
        return res.status(200).json({ message: "No active employees found", employees: [] });
      }

      res.status(200).json(employees);
    } catch (error) {
      console.error("Error fetching active employees:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //! Fetch inactive employees
  inactive_employees: async (req, res) => {
    const search = req.query.search || "";
    try {
      const employees = await Employee.find({
        employeeStatus: "inactive",
        role: { $in: ["employee", "manager"] },
        $or: [{ employeeName: { $regex: search, $options: "i" } }, { employeeID: { $regex: search, $options: "i" } }],
      });

      if (employees.length === 0) {
        return res.status(200).json({ message: "No inactive employees found", employees: [] });
      }

      res.status(200).json(employees);
    } catch (error) {
      console.error("Error fetching inactive employees:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //! check username availability
  check_username: async (req, res) => {
    const { username } = req.query; // Extract username from query params

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    try {
      const userExists = await Employee.findOne({ employeeUsername: username });
      res.json({ exists: !!userExists }); // Respond with true if user exists, otherwise false
    } catch (error) {
      console.error("Error checking username:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },
};
