import type { Request, Response } from "express";
import { SyncLabels } from "../../labels/sync.labels";
import { syncService } from "./sync.service";
import type { SyncPullQuery, SyncPushInput } from "./sync.validation";

export class SyncController {
  async push(req: Request, res: Response) {
    const data = await syncService.push(req.user!, req.body as SyncPushInput);

    return res.status(200).json({
      success: true,
      message: SyncLabels.PUSH_SUCCESS,
      data,
    });
  }

  async pull(req: Request, res: Response) {
    const data = await syncService.pull(
      req.user!,
      req.query as unknown as SyncPullQuery,
    );

    return res.status(200).json({
      success: true,
      message: SyncLabels.PULL_SUCCESS,
      data,
    });
  }
}

export const syncController = new SyncController();
