import * as fs from "fs-extra";
import * as multer from "multer";
import * as path from "path";

import { generateRandomString } from "@/utils/string";

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const tempDir = path.resolve(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "temp",
    );
    const imagesDir = path.resolve(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "images",
    );
    const filesDir = path.resolve(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "files",
    );

    await fs.ensureDir(tempDir);
    await fs.ensureDir(imagesDir);
    await fs.ensureDir(filesDir);

    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    let targetFileName =
      Date.now() +
      "_" +
      generateRandomString(7) +
      path.extname(file.originalname);

    if (req.user?.id) {
      targetFileName = req.user.id + "_" + targetFileName;
    }

    cb(null, targetFileName);
  },
});

export const imageUpload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.mimetype,
      )
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed."));
    }
  },
  limits: {
    fileSize: +process.env.MAX_IMAGE_UPLOAD_SIZE_IN_KB * 1024,
  },
}).single("image");

export const fileUpload = multer({
  storage,
  fileFilter: (_req, _file, cb) => {
    cb(null, true);
  },
  limits: {
    fileSize: +process.env.MAX_FILE_UPLOAD_SIZE_IN_KB * 1024,
  },
}).single("file");
