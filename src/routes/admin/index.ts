import { Router } from "express";

import * as adminContactMessageController from "@/controllers/admin/contact-message";
import * as adminDashboardController from "@/controllers/admin/dashboard";
import * as adminProfileController from "@/controllers/admin/profile";
import { isAdmin } from "@/middlewares/auth";
import { csrf } from "@/middlewares/csrf";
import * as authSchema from "@/validation/schemas/auth";
import * as validator from "@/validation/validator";

const router = Router();

router.route("").get(isAdmin, adminDashboardController.renderDashboard);

router
  .route("/profile")
  .get(isAdmin, adminProfileController.renderProfile)
  .post(
    csrf.doubleCsrfProtection,
    isAdmin,
    validator.validateRequestBody(authSchema.PatchUserSchema, "admin/profile"),
    adminProfileController.patchProfile,
  );
router
  .route("/update-password")
  .get(isAdmin, adminProfileController.renderUpdatePassword)
  .post(
    csrf.doubleCsrfProtection,
    isAdmin,
    validator.validateRequestBody(
      authSchema.UpdatePasswordSchema,
      "admin/update-password",
      {
        layout: "admin",
      },
    ),
    adminProfileController.updatePassword,
  );

router
  .route("/contact-messages")
  .get(
    isAdmin,
    validator.validateRequestPagination,
    adminContactMessageController.renderContactMessages,
  );

export default router;
