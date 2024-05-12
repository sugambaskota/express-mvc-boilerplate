import { Request, Response } from "express";

export const renderHome = async (_req: Request, res: Response) => {
  res.render("home/main");
};
