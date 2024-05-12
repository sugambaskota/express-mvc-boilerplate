import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import { status } from "@/constants/http";
import { UserRoles } from "@/constants/user-roles";
import { respondError } from "@/helpers/response";
import * as authService from "@/services/auth";

const getUserFromReq = async (req: Request) => {
  if (req.isAuthenticated() && req.user) {
    return req.user;
  }

  throw new Error("Sorry, you are not authenticated.");
};

const getUserFromApiReq = async (req: Request) => {
  const token = req.headers?.authorization?.split(" ")?.[1];

  if (!token) {
    throw new Error("No auth token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authService.getUserProfile(decoded?.sub as string);

    if (user) {
      req.user = user;
      return user;
    }

    throw new Error("Sorry, user not found.");
  } catch (error) {
    throw new Error("Sorry, invalid token.");
  }
};

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromReq(req);

    if (user) {
      return next();
    }

    return respondError(
      req,
      res,
      status.HTTP_403_FORBIDDEN,
      "Sorry, you are not authorized.",
    );
  } catch (error) {
    return respondError(req, res, status.HTTP_401_UNAUTHORIZED, error?.message);
  }
};

export const isApiAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromApiReq(req);

    if (user) {
      return next();
    }

    return respondError(
      req,
      res,
      status.HTTP_403_FORBIDDEN,
      "Sorry, you are not authorized.",
    );
  } catch (error) {
    return respondError(req, res, status.HTTP_401_UNAUTHORIZED, error?.message);
  }
};

export const isUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromReq(req);

    if (user && user?.role === UserRoles.USER) {
      req.user = user;
      return next();
    }

    return respondError(
      req,
      res,
      status.HTTP_403_FORBIDDEN,
      "Sorry, you are not authorized.",
    );
  } catch (error) {
    return respondError(req, res, status.HTTP_401_UNAUTHORIZED, error?.message);
  }
};

export const isApiUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromApiReq(req);

    if (user && user?.role === UserRoles.USER) {
      req.user = user;
      return next();
    }

    return respondError(
      req,
      res,
      status.HTTP_403_FORBIDDEN,
      "Sorry, you are not authorized.",
    );
  } catch (error) {
    return respondError(req, res, status.HTTP_401_UNAUTHORIZED, error?.message);
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromReq(req);

    if (
      user &&
      (user?.role === UserRoles.ADMIN || user?.role === UserRoles.SUPER_ADMIN)
    ) {
      req.user = user;
      return next();
    }

    return respondError(
      req,
      res,
      status.HTTP_403_FORBIDDEN,
      "Sorry, you are not authorized.",
    );
  } catch (error) {
    return respondError(req, res, status.HTTP_401_UNAUTHORIZED, error?.message);
  }
};

export const isApiAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromApiReq(req);

    if (
      user &&
      (user?.role === UserRoles.ADMIN || user?.role === UserRoles.SUPER_ADMIN)
    ) {
      req.user = user;
      return next();
    }

    return respondError(
      req,
      res,
      status.HTTP_403_FORBIDDEN,
      "Sorry, you are not authorized.",
    );
  } catch (error) {
    return respondError(req, res, status.HTTP_401_UNAUTHORIZED, error?.message);
  }
};

export const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromReq(req);

    if (user && user?.role === UserRoles.SUPER_ADMIN) {
      req.user = user;
      return next();
    }

    return respondError(
      req,
      res,
      status.HTTP_403_FORBIDDEN,
      "Sorry, you are not authorized.",
    );
  } catch (error) {
    return respondError(req, res, status.HTTP_401_UNAUTHORIZED, error?.message);
  }
};

export const isApiSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromApiReq(req);

    if (user && user?.role === UserRoles.SUPER_ADMIN) {
      req.user = user;
      return next();
    }

    return respondError(
      req,
      res,
      status.HTTP_403_FORBIDDEN,
      "Sorry, you are not authorized.",
    );
  } catch (error) {
    return respondError(req, res, status.HTTP_401_UNAUTHORIZED, error?.message);
  }
};
