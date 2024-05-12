import { NextFunction, Request, Response } from "express";

export const isGuest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated() || req.user) {
    return res.redirect("/");
  }

  next();
};
