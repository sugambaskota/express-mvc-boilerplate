import * as contactMessageService from "@/services/contact-message";
import { NextFunction, Request, Response } from "express";

export const renderContactMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contactMessages = await contactMessageService.getContactMessages(
      (req.validatedData.page - 1) * req.validatedData.limit,
      req.validatedData.limit,
      req.validatedData.search,
    );
    const total = await contactMessageService.countContactMessages(
      req.validatedData.search,
    );

    res.render("admin/contact-messages", {
      layout: "admin",
      page: req.validatedData.page,
      limit: req.validatedData.limit,
      total,
      search: req.validatedData.search,
      previousPage: req.validatedData.page > 1,
      nextPage: req.validatedData.page * req.validatedData.limit < total,
      results: contactMessages,
    });
  } catch (error) {
    next(error);
  }
};
