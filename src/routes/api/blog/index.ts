import { Router } from "express";

import * as blogApiController from "@/controllers/api/blog";
import { isApiSuperAdmin } from "@/middlewares/auth";
import * as blogSchema from "@/validation/schemas/blog";
import * as validator from "@/validation/validator";

const router = Router();

router
  .route("/")
  .get(validator.validateRequestPagination, blogApiController.getBlogs);

router.route("/:slug").get(blogApiController.getBlogBySlug);

router
  .route("/")
  .post(
    isApiSuperAdmin,
    validator.validateRequestBody(blogSchema.CreateBlogSchema),
    blogApiController.createBlog,
  );

router
  .route("/:id")
  .put(
    isApiSuperAdmin,
    validator.validateRequestBody(blogSchema.UpdateBlogSchema),
    blogApiController.updateBlog,
  );

router
  .route("/:id")
  .patch(
    isApiSuperAdmin,
    validator.validateRequestBody(blogSchema.PatchBlogSchema),
    blogApiController.updateBlog,
  );

router.route("/:id").delete(isApiSuperAdmin, blogApiController.deleteBlog);

export default router;
