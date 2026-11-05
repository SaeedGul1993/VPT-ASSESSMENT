import type { Request, Response } from "express";
import { FieldWorkerLabels } from "../../labels/field-worker.labels";
import { fieldWorkersService } from "./field-workers.service";
import type {
  AssignFieldWorkerAreaInput,
  CreateFieldWorkerInput,
  UpdateFieldWorkerStatusInput,
} from "./field-workers.validation";

export class FieldWorkersController {
  async create(req: Request, res: Response) {
    const worker = await fieldWorkersService.create(req.body as CreateFieldWorkerInput);

    return res.status(201).json({
      success: true,
      message: FieldWorkerLabels.CREATED,
      data: { worker },
    });
  }

  async list(_req: Request, res: Response) {
    const workers = await fieldWorkersService.list();

    return res.status(200).json({
      success: true,
      message: FieldWorkerLabels.LISTED,
      data: { workers },
    });
  }

  async getById(req: Request, res: Response) {
    const worker = await fieldWorkersService.getById(req.params.id as string);

    return res.status(200).json({
      success: true,
      message: FieldWorkerLabels.FETCHED,
      data: { worker },
    });
  }

  async updateStatus(req: Request, res: Response) {
    const worker = await fieldWorkersService.updateStatus(
      req.params.id as string,
      req.body as UpdateFieldWorkerStatusInput,
    );

    return res.status(200).json({
      success: true,
      message: FieldWorkerLabels.STATUS_UPDATED,
      data: { worker },
    });
  }

  async assignArea(req: Request, res: Response) {
    const worker = await fieldWorkersService.assignArea(
      req.params.id as string,
      req.body as AssignFieldWorkerAreaInput,
    );

    return res.status(200).json({
      success: true,
      message: FieldWorkerLabels.AREA_ASSIGNED,
      data: { worker },
    });
  }
}

export const fieldWorkersController = new FieldWorkersController();
