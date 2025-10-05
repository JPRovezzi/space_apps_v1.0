const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
} = require("../middleware/upload");

// Upload single data file
router.post(
  "/data",
  uploadSingle,
  handleUploadError,
  fileController.uploadDataFile
);

// Upload multiple files
router.post(
  "/files",
  uploadMultiple,
  handleUploadError,
  fileController.uploadMultipleFiles
);

// Get list of uploaded files
router.get("/files", fileController.getUploadedFiles);

// Delete uploaded file
router.delete("/files/:filename", fileController.deleteFile);

// Info endpoint
router.get("/", (req, res) => {
  res.json({
    message: "File Upload API",
    endpoints: {
      "upload-data":
        "POST /api/v1/upload/data - Upload single data file (CSV, JSON, TXT)",
      "upload-files": "POST /api/v1/upload/files - Upload multiple files",
      "list-files": "GET /api/v1/upload/files - Get list of uploaded files",
      "delete-file":
        "DELETE /api/v1/upload/files/:filename - Delete uploaded file",
    },
    supportedFormats: ["CSV", "JSON", "TXT"],
    maxFileSize: "10MB",
    maxFiles: 5,
  });
});

module.exports = router;
