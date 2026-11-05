import type { Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

export class DashboardController {
  async stats(_req: Request, res: Response) {
    const stats = await dashboardService.getStats();

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: { stats },
    });
  }
}

export const dashboardController = new DashboardController();
