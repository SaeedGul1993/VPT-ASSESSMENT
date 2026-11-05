import type { Request, Response } from "express";
import { HouseholdLabels } from "../../labels/household.labels";
import { householdsService } from "./households.service";
import type {
  CreateHouseholdInput,
  ListHouseholdsQuery,
  UpdateHouseholdInput,
} from "./households.validation";

export class HouseholdsController {
  async create(req: Request, res: Response) {
    const household = await householdsService.create(
      req.user!,
      req.body as CreateHouseholdInput,
    );

    return res.status(201).json({
      success: true,
      message: HouseholdLabels.CREATED,
      data: { household },
    });
  }

  async list(req: Request, res: Response) {
    const result = await householdsService.list(
      req.user!,
      req.query as unknown as ListHouseholdsQuery,
    );

    return res.status(200).json({
      success: true,
      message: HouseholdLabels.LISTED,
      data: {
        households: result.households,
        cache: result.cache, // hit/miss proof for Redis caching
      },
    });
  }

  async getById(req: Request, res: Response) {
    const household = await householdsService.getById(
      req.user!,
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      message: HouseholdLabels.FETCHED,
      data: { household },
    });
  }

  async update(req: Request, res: Response) {
    const household = await householdsService.update(
      req.user!,
      req.params.id as string,
      req.body as UpdateHouseholdInput,
    );

    return res.status(200).json({
      success: true,
      message: HouseholdLabels.UPDATED,
      data: { household },
    });
  }

  async softDelete(req: Request, res: Response) {
    const household = await householdsService.softDelete(
      req.user!,
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      message: HouseholdLabels.DELETED,
      data: { household },
    });
  }
}

export const householdsController = new HouseholdsController();
