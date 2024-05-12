import { Router } from "express";

import * as uploadApiController from "@/controllers/api/upload";
import { isApiAuth } from "@/middlewares/auth";

const router = Router();

router.route("/image").post(isApiAuth, uploadApiController.uploadImage);

router.route("/file").post(isApiAuth, uploadApiController.uploadFile);

export default router;
