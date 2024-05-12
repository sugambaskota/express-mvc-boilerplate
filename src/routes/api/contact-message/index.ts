import { Router } from "express";

import * as contactMessageApiController from "@/controllers/api/contact-message";
import { isApiSuperAdmin } from "@/middlewares/auth";
import * as contactMesssageSchema from "@/validation/schemas/contact-message";
import * as validator from "@/validation/validator";

const router = Router();

router
  .route("/")
  .get(
    isApiSuperAdmin,
    validator.validateRequestPagination,
    contactMessageApiController.getContactMessages,
  );

router
  .route("/:id")
  .get(isApiSuperAdmin, contactMessageApiController.getContactMessageById);

router
  .route("/")
  .post(
    validator.validateRequestBody(
      contactMesssageSchema.CreateContactMessageSchema,
    ),
    contactMessageApiController.createContactMessage,
  );

router
  .route("/:id")
  .delete(isApiSuperAdmin, contactMessageApiController.deleteContactMessage);

export default router;
