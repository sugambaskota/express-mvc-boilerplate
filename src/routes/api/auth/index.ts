import { Router } from "express";

import * as authApiController from "@/controllers/api/auth";
import { isApiAuth } from "@/middlewares/auth";
import * as authSchema from "@/validation/schemas/auth";
import * as validator from "@/validation/validator";

const router = Router();

router
  .route("/register")
  .post(
    validator.validateRequestBody(authSchema.RegisterUserSchema),
    authApiController.register,
  );

router
  .route("/login")
  .post(
    validator.validateRequestBody(authSchema.LoginUserSchema),
    authApiController.login,
  );

router
  .route("/profile")
  .get(isApiAuth, authApiController.getCurrentUserProfile)
  .patch(
    isApiAuth,
    validator.validateRequestBody(authSchema.PatchUserSchema),
    authApiController.patchUser,
  );

router.route("/verify-email").get(authApiController.verifyEmail);

router
  .route("/get-new-token")
  .post(
    validator.validateRequestBody(authSchema.GetNewTokenSchema),
    authApiController.getNewToken,
  );

export default router;
