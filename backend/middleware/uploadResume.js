const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("========== MULTER FILE ==========");

  console.log("Original name:", file.originalname);

  console.log("Mimetype:", file.mimetype);

  console.log("Field name:", file.fieldname);

  const extension = path.extname(file.originalname || "").toLowerCase();

  console.log("Extension:", extension);

  const allowedExtensions = [".pdf", ".doc", ".docx"];

  if (allowedExtensions.includes(extension)) {
    console.log("File accepted by extension:", extension);

    return cb(null, true);
  }

  return cb(new Error("Only PDF, DOC, and DOCX files are allowed."), false);
};

const uploadResume = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = uploadResume;
