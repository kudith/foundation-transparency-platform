import multer from "multer";

// Multer configuration untuk handle file upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

/**
 * Convert buffer to base64 data URI for Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File mimetype
 * @returns {string} Base64 data URI
 */
export const bufferToDataURI = (buffer, mimetype) => {
  const base64 = buffer.toString("base64");
  return `data:${mimetype};base64,${base64}`;
};



