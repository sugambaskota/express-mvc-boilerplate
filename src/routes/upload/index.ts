import { Router } from "express";

import * as uploadApiController from "@/controllers/api/upload";
import { isAuth } from "@/middlewares/auth";

const router = Router();

router.route("/image").post(isAuth, uploadApiController.uploadImage);

router.route("/file").post(isAuth, uploadApiController.uploadFile);

export default router;
