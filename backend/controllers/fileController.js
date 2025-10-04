const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const fileController = {};

// Upload single data file
fileController.uploadDataFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se encontró ningún archivo",
      });
    }

    const file = req.file;
    const filePath = file.path;
    const fileExtension = path.extname(file.originalname).toLowerCase();

    let data = [];
    let metadata = {
      filename: file.originalname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      type: fileExtension,
    };

    // Process different file types
    try {
      if (fileExtension === ".csv") {
        // Read and parse CSV
        const fileContent = fs.readFileSync(filePath, "utf8");
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });

        data = records.map((record, index) => ({
          id: index + 1,
          ...record,
        }));

        metadata.columns = records.length > 0 ? Object.keys(records[0]) : [];
        metadata.rowCount = records.length;
      } else if (fileExtension === ".json") {
        // Read and parse JSON
        const fileContent = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(fileContent);

        // Handle different JSON structures
        if (Array.isArray(jsonData)) {
          data = jsonData.map((item, index) => ({
            id: index + 1,
            ...item,
          }));
        } else if (jsonData.data && Array.isArray(jsonData.data)) {
          data = jsonData.data;
        } else {
          data = [jsonData];
        }

        metadata.rowCount = data.length;
      } else if (fileExtension === ".txt") {
        // Read plain text file
        const fileContent = fs.readFileSync(filePath, "utf8");
        const lines = fileContent.split("\n").filter((line) => line.trim());

        // Try to parse as CSV-like data
        if (lines.length > 1) {
          const headers = lines[0].split(",").map((h) => h.trim());
          data = lines.slice(1).map((line, index) => {
            const values = line.split(",").map((v) => v.trim());
            const obj = { id: index + 1 };
            headers.forEach((header, i) => {
              obj[header] = values[i] || "";
            });
            return obj;
          });
          metadata.columns = headers;
        } else {
          // Plain text, create single entry
          data = [{ id: 1, content: fileContent }];
        }

        metadata.rowCount = data.length;
      }
    } catch (parseError) {
      // Clean up file on parse error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        success: false,
        error: `Error procesando archivo: ${parseError.message}`,
      });
    }

    res.json({
      success: true,
      message: "Archivo procesado exitosamente",
      data: {
        metadata,
        preview: data.slice(0, 10), // First 10 rows as preview
        totalRows: data.length,
        filePath: filePath.replace(/\\/g, "/"), // Normalize path separators
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Error procesando archivo de subida",
    });
  }
};

// Upload multiple files
fileController.uploadMultipleFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No se encontraron archivos",
      });
    }

    const results = req.files.map((file) => ({
      filename: file.originalname,
      size: file.size,
      path: file.path.replace(/\\/g, "/"),
      uploadedAt: new Date().toISOString(),
    }));

    res.json({
      success: true,
      message: `${req.files.length} archivos subidos exitosamente`,
      data: results,
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    res.status(500).json({
      success: false,
      error: "Error procesando archivos de subida",
    });
  }
};

// Get list of uploaded files
fileController.getUploadedFiles = (req, res) => {
  try {
    const uploadDir = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadDir)) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const files = fs.readdirSync(uploadDir).map((filename) => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);

      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        path: filePath.replace(/\\/g, "/"),
      };
    });

    res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({
      success: false,
      error: "Error obteniendo lista de archivos",
    });
  }
};

// Delete uploaded file
fileController.deleteFile = (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: "Nombre de archivo requerido",
      });
    }

    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "Archivo no encontrado",
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "Archivo eliminado exitosamente",
    });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({
      success: false,
      error: "Error eliminando archivo",
    });
  }
};

module.exports = fileController;
