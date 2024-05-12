import * as authService from "@/services/auth";
import { NextFunction, Request, Response } from "express";

import { User } from "@/entities/user";

export const renderProfile = async (_req: Request, res: Response) => {
  res.render("admin/profile", {
    layout: "admin",
  });
};

export const patchProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.patchUser(req.validatedData, req.user);

    req.flash("successFlash", "Profile updated successfully.");
    res.redirect("/admin");
  } catch (error) {
    next(error);
  }
};

export const renderUpdatePassword = async (_req: Request, res: Response) => {
  res.render("admin/update-password", {
    layout: "admin",
  });
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.getUserByEmailWithHashedPassword(
      req.user.email,
    );

    const passwordMatched = await User.comparePasswords(
      req.validatedData.currentPassword,
      user.password,
    );

    if (!passwordMatched) {
      return res.render("admin/update-password", {
        layout: "admin",
        oldValues: req.validatedData,
        errorFlash: "Sorry, current password is invalid.",
      });
    }

    await authService.updatePassword(req.validatedData, req.user);

    req.flash("successFlash", "Password updated successfully.");
    res.redirect("/admin");
  } catch (error) {
    next(error);
  }
};
