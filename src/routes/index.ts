import * as express from "express";

import authApiRoutes from "@/routes/api/auth";
import uploadApiRoutes from "@/routes/api/upload";
import blogApiRoutes from "@/routes/api/blog";
import contactMessageApiRoutes from "@/routes/api/contact-message";

import authRoutes from "@/routes/auth";
import uploadRoutes from "@/routes/upload";
import homeRoutes from "@/routes/home";
import adminRoutes from "@/routes/admin";

const router = express.Router();

router.use("/api/auth", authApiRoutes);
router.use("/api/upload", uploadApiRoutes);
router.use("/api/blogs", blogApiRoutes);
router.use("/api/contact-messages", contactMessageApiRoutes);

router.use("/", homeRoutes);
router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);
router.use("/admin", adminRoutes);

export default router;
