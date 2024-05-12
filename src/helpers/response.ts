import { Request, Response } from "express";

export const respondSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: Record<any, any> | Array<Record<any, any>>,
) =>
  res
    .status(statusCode)
    .json({
      message,
      data,
    })
    .end();

export const respondError = (
  req: Request,
  res: Response,
  statusCode: number,
  message: string,
  fieldErrors?: Record<string, any>,
) => {
  if (req.headers["content-type"] === "application/json") {
    return res
      .status(statusCode)
      .json({
        message,
        fieldErrors,
      })
      .end();
  }

  return res.status(statusCode).render("pages/error", {
    statusCode,
    message,
  });
};
