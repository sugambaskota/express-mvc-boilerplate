import { Request, Response } from "express";

export const renderDashboard = async (_req: Request, res: Response) => {
  res.render("admin/dashboard", {
    layout: "admin",
  });
};
