import type { Request, Response } from "express";
import { ActivityLabels } from "../../labels/activity.labels";
import { activitiesService } from "./activities.service";

export class ActivitiesController {
  async list(req: Request, res: Response) {
    const unreadOnly = req.query.unreadOnly === "true";
    const activities = await activitiesService.list(unreadOnly);

    return res.status(200).json({
      success: true,
      message: ActivityLabels.LISTED,
      data: { activities },
    });
  }

  async markRead(req: Request, res: Response) {
    const activity = await activitiesService.markRead(req.params.id as string);

    return res.status(200).json({
      success: true,
      message: ActivityLabels.MARKED_READ,
      data: { activity },
    });
  }
}

export const activitiesController = new ActivitiesController();
