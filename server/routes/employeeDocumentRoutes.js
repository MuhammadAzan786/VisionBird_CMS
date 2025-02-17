const express = require("express");
const router = express.Router();
const {
  upload,
  uploadDocument,
  deleteDocument,
  updateDocument,
  getDocument,
  getDocumentsByEmployee,
} = require("../controllers/employeeDocumentController");

// Upload document
router.post("/uploadDocument", upload.single("file"), uploadDocument);

// Delete document
router.delete("/deleteDocument/:id", deleteDocument);

// Update document
router.put("/updateDocument/:id", upload.single("document"), updateDocument);

// Get document details
router.get("/getDocuments/:id", getDocument);

// Get all documents for a specific employee
router.get("/employee/:employeeId", getDocumentsByEmployee);

module.exports = router;
