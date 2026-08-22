/**
 * Resume Upload Middleware for CareerOS
 * 
 * Uses Multer memoryStorage with strict MIME type & extension validation and 5MB size limit.
 */
const multer = require("multer");
const path = require("path");

const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(mimeType)) {
        const error = new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
        error.statusCode = 400;
        return cb(error, false);
    }

    cb(null, true);
};

const uploadResume = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter,
}).single("resume");

/**
 * Express wrapper for handling multer errors cleanly (Required file)
 */
const handleResumeUpload = (req, res, next) => {
    uploadResume(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File size exceeds the 5MB limit.",
                });
            }
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`,
            });
        } else if (err) {
            return res.status(err.statusCode || 400).json({
                success: false,
                message: err.message || "File upload failed.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No resume file uploaded. Please attach a file under the 'resume' field.",
            });
        }

        next();
    });
};

/**
 * Express wrapper for optional resume upload (Accepts multipart file or passes through for JSON)
 */
const handleOptionalResumeUpload = (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
        uploadResume(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message: "File size exceeds the 5MB limit.",
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`,
                });
            } else if (err) {
                return res.status(err.statusCode || 400).json({
                    success: false,
                    message: err.message || "File upload failed.",
                });
            }
            next();
        });
    } else {
        next();
    }
};

module.exports = {
    handleResumeUpload,
    handleOptionalResumeUpload,
};
