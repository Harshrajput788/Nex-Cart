import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 6, 
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "")
      .toLowerCase();

    cb(null, `${Date.now()}-${safeName}`);
  },
});

export const uploadSingle = multer({ storage });