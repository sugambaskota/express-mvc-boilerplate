import { Router } from "express";
import * as passport from "passport";

import * as authController from "@/controllers/auth";
import { csrf } from "@/middlewares/csrf";
import { isGuest } from "@/middlewares/guest";
import * as authSchema from "@/validation/schemas/auth";
import * as validator from "@/validation/validator";

const router = Router();

router
  .route("/register")
  .get(isGuest, authController.renderRegister)
  .post(
    csrf.doubleCsrfProtection,
    validator.validateRequestBody(
      authSchema.RegisterUserSchema,
      "auth/register",
    ),
    authController.register,
  );

router
  .route("/login")
  .get(isGuest, authController.renderLogin)
  .post(
    csrf.doubleCsrfProtection,
    validator.validateRequestBody(authSchema.LoginUserSchema, "auth/login"),
    authController.preLogin,
    passport.authenticate("local", {
      failureRedirect: "/auth/login",
      failureMessage: true,
    }),
    authController.postLogin,
  );

router
  .route("/forgot-password")
  .get(isGuest, authController.renderForgotPassword)
  .post(
    csrf.doubleCsrfProtection,
    validator.validateRequestBody(
      authSchema.ForgotPasswordSchema,
      "auth/forgot-password",
    ),
    authController.forgotPassword,
  );

router
  .route("/reset-password")
  .get(isGuest, authController.renderResetPassword)
  .post(
    csrf.doubleCsrfProtection,
    validator.validateRequestBody(
      authSchema.ResetPasswordSchema,
      "auth/reset-password",
    ),
    authController.resetPassword,
  );

router.route("/logout").post(csrf.doubleCsrfProtection, authController.logout);

export default router;
