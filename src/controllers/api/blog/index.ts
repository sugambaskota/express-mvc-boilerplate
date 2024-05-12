import { NextFunction, Request, Response } from "express";
import slugify from "slugify";

import { status } from "@/constants/http";
import * as responseHelper from "@/helpers/response";
import * as blogService from "@/services/blog";
import { generateRandomString } from "@/utils/string";

export const getBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const blogs = await blogService.getBlogs(
      (req.validatedData.page - 1) * req.validatedData.limit,
      req.validatedData.limit,
      req.validatedData.search,
    );
    const total = await blogService.countBlogs(req.validatedData.search);

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Blog list get successful.",
      {
        page: req.validatedData.page,
        limit: req.validatedData.limit,
        total,
        previousPage: req.validatedData.page > 1,
        nextPage: req.validatedData.page * req.validatedData.limit < total,
        results: blogs,
      },
    );
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);

    if (!blog) {
      return responseHelper.respondError(
        req,
        res,
        status.HTTP_404_NOT_FOUND,
        "Blog not found.",
      );
    }

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Blog get successful.",
      blog,
    );
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let slug = slugify(req.validatedData.title.toLowerCase(), "-");
    const exitingBlog = await blogService.getBlogBySlug(slug);

    if (exitingBlog) {
      slug += "-" + generateRandomString(5);
    }

    const blog = await blogService.createBlog(
      {
        ...req.validatedData,
        slug,
      },
      req.user,
    );

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Blog created successfully.",
      blog,
    );
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingBlog = await blogService.getBlogById(req.params.id);

    if (!existingBlog) {
      return responseHelper.respondError(
        req,
        res,
        status.HTTP_404_NOT_FOUND,
        "Blog not found.",
      );
    }

    const blog = await blogService.updateBlog(req.validatedData, existingBlog);

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Blog updated successfully.",
      blog,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingBlog = await blogService.getBlogById(req.params.id);

    if (!existingBlog) {
      return responseHelper.respondError(
        req,
        res,
        status.HTTP_404_NOT_FOUND,
        "Blog not found.",
      );
    }

    await blogService.deleteBlog(existingBlog.id);

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Blog deleted successfully.",
    );
  } catch (error) {
    next(error);
  }
};
