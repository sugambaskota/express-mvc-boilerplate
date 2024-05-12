import { NextFunction, Request, Response } from "express";

import { status } from "@/constants/http";
import { User } from "@/entities/user";
import * as responseHelper from "@/helpers/response";
import * as authService from "@/services/auth";
import {
  handleForgotPasswordEvent,
  handleUserRegisteredEvent,
} from "@/services/mailer/events/user";

export const renderRegister = (_req: Request, res: Response) => {
  res.render("auth/register");
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingUser = await authService.getUserByEmail(
      req.validatedData.email,
    );

    if (existingUser) {
      return res.render("auth/register", {
        oldValues: req.validatedData,
        errorFlash: "Sorry, email with this user already exists.",
      });
    }

    const user = await authService.registerUser(req.validatedData);
    await handleUserRegisteredEvent(user);

    req.flash("successFlash", "Registration successful.");
    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};

export const renderLogin = (_req: Request, res: Response) => {
  res.render("auth/login");
};

export const preLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.getUserByEmailWithHashedPassword(
      req.validatedData.email,
    );

    if (!user) {
      return res.render("auth/login", {
        oldValues: req.validatedData,
        errorFlash: "Sorry, invalid credentials.",
      });
    }

    const passwordMatched = await User.comparePasswords(
      req.validatedData.password,
      user.password,
    );

    if (!passwordMatched) {
      return res.render("auth/login", {
        oldValues: req.validatedData,
        errorFlash: "Sorry, invalid credentials.",
      });
    }

    if (!user.verified) {
      return res.render("auth/login", {
        oldValues: req.validatedData,
        errorFlash:
          "Sorry, your account is not verified. Please check your email to verify your account.",
      });
    }

    req.validatedData = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const postLogin = async (req: Request, res: Response) => {
  req.flash("successFlash", "You are logged in.");
  res.redirect("/");
};

export const renderForgotPassword = (_req: Request, res: Response) => {
  res.render("auth/forgot-password");
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.getUserByEmail(req.validatedData.email);

    if (!user) {
      return res.render("auth/forgot-password", {
        oldValues: req.validatedData,
        errorFlash: "Sorry, something went wrong.",
      });
    }

    const userWithPasswordResetToken =
      await authService.generatePasswordResetToken(user);

    await handleForgotPasswordEvent(userWithPasswordResetToken);

    req.flash(
      "successFlash",
      "Email sent. Please check your email for password reset instructions.",
    );
    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};

export const renderResetPassword = (_req: Request, res: Response) => {
  res.render("auth/reset-password");
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return responseHelper.respondError(
        req,
        res,
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "Sorry, required information missing.",
      );
    }

    const user = await authService.getUserByEmailWithPasswordResetToken(
      email as string,
    );

    if (!user) {
      return responseHelper.respondError(
        req,
        res,
        status.HTTP_404_NOT_FOUND,
        "Sorry, invalid link.",
      );
    }

    if (token !== user.passwordResetToken) {
      return responseHelper.respondError(
        req,
        res,
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "Sorry, invalid link.",
      );
    }

    await authService.resetPassword(req.validatedData, user);

    req.flash(
      "successFlash",
      "Password reset successful. Please login with your new password.",
    );
    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.flash("successFlash", "You are logged out.");
    res.redirect("/");
  });
};
