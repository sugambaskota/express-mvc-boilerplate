import { Router } from "express";

import * as homeController from "@/controllers/home";

const router = Router();

router.route("/").get(homeController.renderHome);

export default router;
