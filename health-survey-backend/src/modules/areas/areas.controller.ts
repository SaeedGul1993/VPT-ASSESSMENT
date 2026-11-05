import type { Request, Response } from "express";
import { AreaLabels } from "../../labels/area.labels";
import { areasService } from "./areas.service";
import type { CreateAreaInput, UpdateAreaInput } from "./areas.validation";

export class AreasController {
  async create(req: Request, res: Response) {
    const area = await areasService.create(req.body as CreateAreaInput);

    return res.status(201).json({
      success: true,
      message: AreaLabels.CREATED,
      data: { area },
    });
  }

  async list(_req: Request, res: Response) {
    const areas = await areasService.list();

    return res.status(200).json({
      success: true,
      message: AreaLabels.LISTED,
      data: { areas },
    });
  }

  async getById(req: Request, res: Response) {
    const area = await areasService.getById(req.params.id as string);

    return res.status(200).json({
      success: true,
      message: AreaLabels.FETCHED,
      data: { area },
    });
  }

  async update(req: Request, res: Response) {
    const area = await areasService.update(
      req.params.id as string,
      req.body as UpdateAreaInput,
    );

    return res.status(200).json({
      success: true,
      message: AreaLabels.UPDATED,
      data: { area },
    });
  }
}

export const areasController = new AreasController();
