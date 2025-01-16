const EmployeeDocument = require("../models/employeeDocument.Model");
const cloudinary = require("../utils/cloudinaryConfig");
const multer = require("multer");

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc Upload a document
// @route POST /api/employee-documents/upload
// @access Public
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const employeeId = req.body.employeeId;
    const documentName = req.body.documentName;

    // Upload file to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: "Employee_Documents" },
        async (error, uploadedFile) => {
          if (error) return res.status(500).json({ error: "Upload failed" });

          // Save document details in MongoDB
          const newDocument = new EmployeeDocument({
            employee_id: employeeId,
            documentName: documentName,
            documentUrl: uploadedFile.secure_url,
            fileSize: file.size, // Store file size in bytes
          });

          await newDocument.save();
          res.status(201).json(newDocument);
        }
      )
      .end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Delete a document
// @route DELETE /api/employee-documents/:id
// @access Public
const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await EmployeeDocument.findById(documentId);
    if (!document) return res.status(404).json({ error: "Document not found" });

    // Extract Cloudinary public ID
    const publicId = document.documentUrl.split("/").pop().split(".")[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`employee_documents/${publicId}`);

    // Delete from MongoDB
    await EmployeeDocument.findByIdAndDelete(documentId);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update a document (re-upload to Cloudinary and update DB)
// @route PUT /api/employee-documents/:id
// @access Public
const updateDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const existingDocument = await EmployeeDocument.findById(documentId);
    if (!existingDocument)
      return res.status(404).json({ error: "Document not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Delete old document from Cloudinary
    const publicId = existingDocument.documentUrl
      .split("/")
      .pop()
      .split(".")[0];
    await cloudinary.uploader.destroy(`employee_documents/${publicId}`);

    // Upload new document to Cloudinary
    const file = req.file;
    const result = await cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: "employee_documents" },
        async (error, uploadedFile) => {
          if (error) return res.status(500).json({ error: "Upload failed" });

          // Update MongoDB document
          existingDocument.documentName = file.originalname;
          existingDocument.documentUrl = uploadedFile.secure_url;
          existingDocument.fileSize = file.size;

          await existingDocument.save();
          res.status(200).json(existingDocument);
        }
      )
      .end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get a document
// @route GET /api/employee-documents/:id
// @access Public
const getDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await EmployeeDocument.findById(documentId);
    if (!document) return res.status(404).json({ error: "Document not found" });

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get all documents for a specific employee
// @route GET /api/employee-documents/employee/:employeeId
// @access Public
const getDocumentsByEmployee = async (req, res) => {
  try {
    console.log("calllleddddd");
    const employeeId = req.params.employeeId;
    const documents = await EmployeeDocument.find({ employee_id: employeeId });

    if (!documents || documents.length === 0) {
      return res
        .status(404)
        .json({ error: "No documents found for this employee" });
    }

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upload,
  uploadDocument,
  deleteDocument,
  updateDocument,
  getDocument,
  getDocumentsByEmployee,
};
