const express = require("express");
const router = express.Router();
const taxfilecontroller = require("../controllers/taxFilescontroller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const taxFileModel = require("../models/taxFilesmodel");
const parentDir = path.dirname(__dirname);
const uploadDir = path.join(parentDir, "uploads", "TaxFiles");
const { generateUniqueIdentifier } = require("../Middlewares/uniqueidentifier");
const categorycheck = require("../Middlewares/categorycheck");

const authorizeRoles= require('../Middlewares/authorization') 

const auth = require('../Middlewares/auth');

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const filename =
//       Date.now() + "-" + req.uniqueIdentifier + "-" + file.originalname;
//     cb(null, filename);
//   },
// });

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// const uploadFiles = multer({ storage: storage }).array("files", 15);

router.post(
  "/add_file/:id",auth,
  categorycheck,
  (req, res, next) => {
    const uniqueIdentifier = generateUniqueIdentifier(); // Generate unique identifier from middleware
    req.uniqueIdentifier = uniqueIdentifier; // Attach unique identifier to request object
    console.log("Unique Identifier attached to request:", req.uniqueIdentifier);
    next();
  },
  upload.array("files", 15),
  taxfilecontroller.create_File
);

router.delete("/delete_file/:id",auth,authorizeRoles('admin','manager'), taxfilecontroller.delete_File);

router.post("/filter_files/:id",auth,authorizeRoles('admin','manager'), taxfilecontroller.filter_Files);
router.get("/get_all_files/:id",auth, authorizeRoles('admin','manager'),taxfilecontroller.get_all_Files);
router.get("/get_file/:id",auth,authorizeRoles('admin','manager'), taxfilecontroller.get_File);
router.get("/download_File/:id", auth,authorizeRoles('admin','manager'),taxfilecontroller.download_File);
router.get(
  "/download_Filtered_Files/:id/:startDate/:endDate",auth,authorizeRoles('admin','manager'),
  taxfilecontroller.download_Filtered_Files
);

router.delete("/delete_temp_folder",auth,authorizeRoles('admin','manager'), taxfilecontroller.delete_Temporary_Folder);
module.exports = router;
