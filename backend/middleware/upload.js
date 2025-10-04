const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const fs = require("fs");
    const uploadDir = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, basename + "-" + uniqueSuffix + extension);
  },
});

// File filter for data files
const fileFilter = (req, file, cb) => {
  // Accept CSV, JSON, TXT files
  const allowedTypes = [
    "text/csv",
    "application/json",
    "text/plain",
    "application/vnd.ms-excel", // .csv with different mime type
    "text/x-csv",
  ];

  const allowedExtensions = [".csv", ".json", ".txt"];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Tipo de archivo no permitido. Solo se aceptan: ${allowedExtensions.join(
          ", "
        )}`
      ),
      false
    );
  }
};

// Upload middleware for single file
const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single("file");

// Upload middleware for multiple files
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5, // Max 5 files
  },
}).array("files", 5);

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "Archivo demasiado grande. Máximo 10MB permitido.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "Demasiados archivos. Máximo 5 archivos permitidos.",
      });
    }
    return res.status(400).json({
      success: false,
      error: `Error de subida: ${error.message}`,
    });
  }

  if (error.message.includes("Tipo de archivo no permitido")) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
};
