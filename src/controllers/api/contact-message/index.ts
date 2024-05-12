import { NextFunction, Request, Response } from "express";

import { status } from "@/constants/http";
import * as responseHelper from "@/helpers/response";
import * as contactMessageService from "@/services/contact-message";

export const getContactMessages = async (
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

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Contact messages list get successful.",
      {
        page: req.validatedData.page,
        limit: req.validatedData.limit,
        total,
        previousPage: req.validatedData.page > 1,
        nextPage: req.validatedData.page * req.validatedData.limit < total,
        results: contactMessages,
      },
    );
  } catch (error) {
    next(error);
  }
};

export const getContactMessageById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contactMessage = await contactMessageService.getContactMessageById(
      req.params.id,
    );

    if (!contactMessage) {
      return responseHelper.respondError(
        req,
        res,
        status.HTTP_404_NOT_FOUND,
        "Contact message not found.",
      );
    }

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Contact message get successful.",
      contactMessage,
    );
  } catch (error) {
    next(error);
  }
};

export const createContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contactMessage = await contactMessageService.createContactMessage(
      req.validatedData,
    );

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Thank you for reaching out.",
      contactMessage,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contactMessage = await contactMessageService.getContactMessageById(
      req.params.id,
    );

    if (!contactMessage) {
      return responseHelper.respondError(
        req,
        res,
        status.HTTP_404_NOT_FOUND,
        "Contact message not found.",
      );
    }

    await contactMessageService.deleteContactMessage(contactMessage.id);

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Contact message deleted successfully.",
    );
  } catch (error) {
    next(error);
  }
};
