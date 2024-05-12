import { NextFunction, Request, Response } from "express";
import * as fs from "fs-extra";
import * as path from "path";
import * as sharp from "sharp";

import { status } from "@/constants/http";
import { respondError, respondSuccess } from "@/helpers/response";
import { fileUpload, imageUpload } from "@/helpers/upload";
import { handleError } from "@/utils/error";
import { validateUpload } from "@/validation/validator";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  imageUpload(req, res, async (err: any) => {
    if (err) {
      return respondError(
        req,
        res,
        status.HTTP_400_BAD_REQUEST,
        err.code === "LIMIT_UNEXPECTED_FILE"
          ? "Unexpected field."
          : err.code === "LIMIT_FILE_SIZE"
            ? `Image size is large. Maximum allowed size is ${process.env.MAX_IMAGE_UPLOAD_SIZE_IN_KB}KB.`
            : err.message,
      );
    }

    const validationError = validateUpload(req);

    if (validationError) {
      return respondError(
        req,
        res,
        status.HTTP_400_BAD_REQUEST,
        validationError,
      );
    }

    try {
      const { filename } = req.file;
      const foldername = req?.body?.folder?.toLowerCase();

      const targetFolderPath = path.resolve(
        req.file.destination,
        "..",
        "images",
        foldername,
      );

      await fs.ensureDir(targetFolderPath);
      const imageMetadata = await sharp(req.file.path).metadata();

      if (imageMetadata.width > 1200) {
        await sharp(req.file.path)
          .resize({
            fit: sharp.fit.contain,
            width: 1200,
          })
          .toFile(path.resolve(targetFolderPath, filename));

        // delete original file
        try {
          await fs.remove(req.file.path);
        } catch (err) {
          handleError(err);
        }
      } else {
        await fs.move(req.file.path, path.resolve(targetFolderPath, filename));
      }

      return respondSuccess(
        res,
        status.HTTP_200_OK,
        "Image successfully uploaded.",
        {
          path: `/uploads/images/${foldername}/` + filename,
        },
      );
    } catch (error) {
      next(error);
    }
  });
};

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  fileUpload(req, res, async (err: any) => {
    if (err) {
      return respondError(
        req,
        res,
        status.HTTP_400_BAD_REQUEST,
        err.code === "LIMIT_UNEXPECTED_FILE"
          ? "Unexpected field."
          : err.code === "LIMIT_FILE_SIZE"
            ? `File size is large. Maximum allowed size is ${process.env.MAX_FILE_UPLOAD_SIZE_IN_KB}KB.`
            : err.message,
      );
    }

    const validationError = validateUpload(req);

    if (validationError) {
      return respondError(
        req,
        res,
        status.HTTP_400_BAD_REQUEST,
        validationError,
      );
    }

    try {
      const { filename } = req.file;
      const foldername = req?.body?.folder?.toLowerCase();

      const targetFolderPath = path.resolve(
        req.file.destination,
        "..",
        "files",
        foldername,
      );

      await fs.ensureDir(targetFolderPath);
      await fs.move(req.file.path, path.resolve(targetFolderPath, filename));

      return respondSuccess(
        res,
        status.HTTP_200_OK,
        "File successfully uploaded.",
        {
          path: `/uploads/files/${foldername}/` + filename,
        },
      );
    } catch (error) {
      next(error);
    }
  });
};
