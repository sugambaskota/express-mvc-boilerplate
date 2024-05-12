import { NextFunction, Request, Response } from "express";
import { Schema } from "zod";

import { status } from "@/constants/http";
import { respondError } from "@/helpers/response";

export const parseValidationErrors = (error: any) => {
  if (Array.isArray(error?.issues)) {
    const messagesArray = error.issues.map((err: any) => err.message);
    return messagesArray?.join("\n");
  }

  return "Validation error";
};

export const validateRequestBody =
  (
    schema: Schema,
    viewsPath?: string,
    viewsPathOptions?: Record<string, string>,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;

      next();
    } catch (error) {
      const fieldErrors = error?.flatten()?.fieldErrors;

      if (viewsPath) {
        return res.render(
          viewsPath,
          viewsPathOptions
            ? {
                ...viewsPathOptions,
                oldValues: req.body,
                fieldErrors,
              }
            : {
                oldValues: req.body,
                fieldErrors,
              },
        );
      }

      return respondError(
        req,
        res,
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        parseValidationErrors(error),
        fieldErrors,
      );
    }
  };

export const validateRequestPagination = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = {
    issues: [],
  };

  const page = req.query.page;
  const limit = req.query.limit;
  const search = req.query.search;

  if (page && isNaN(+page)) {
    error.issues.push({
      message: "Page must be a valid number.",
    });
  }

  if (limit && isNaN(+limit)) {
    error.issues.push({
      message: "Limit must be a valid number.",
    });
  }

  if (limit && !isNaN(+limit) && +limit > 100) {
    error.issues.push({
      message: "Limit must not exceed 100.",
    });
  }

  if (error.issues.length > 0) {
    return respondError(
      req,
      res,
      status.HTTP_422_UNPROCESSABLE_ENTITY,
      parseValidationErrors(error),
    );
  }

  req.validatedData = {
    page: req.query.page ? parseInt(page as string) : 1,
    limit: req.query.limit ? parseInt(limit as string) : 10,
    search: req.query.search ? (search as string).trim() : undefined,
  };

  next();
};

export const validateUpload = (req: Request) => {
  let error = {
    issues: [],
  };

  if (!req?.file) {
    error.issues.push({
      message: "File is required.",
    });
  }

  if (!req?.body?.folder) {
    error.issues.push({
      message: "Folder name is required.",
    });
  }

  if (req?.body?.folder && req.body.folder.includes(" ")) {
    error.issues.push({
      message: "Folder name must not contain space.",
    });
  }

  if (error.issues.length > 0) {
    return parseValidationErrors(error);
  }

  return;
};
