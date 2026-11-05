import type { Request, Response } from "express";
import { MemberLabels } from "../../labels/member.labels";
import { membersService } from "./members.service";
import type { CreateMemberInput, UpdateMemberInput } from "./members.validation";

export class MembersController {
  async create(req: Request, res: Response) {
    const member = await membersService.create(
      req.user!,
      req.params.householdId as string,
      req.body as CreateMemberInput,
    );

    return res.status(201).json({
      success: true,
      message: MemberLabels.CREATED,
      data: { member },
    });
  }

  async listByHousehold(req: Request, res: Response) {
    const members = await membersService.listByHousehold(
      req.user!,
      req.params.householdId as string,
    );

    return res.status(200).json({
      success: true,
      message: MemberLabels.LISTED,
      data: { members },
    });
  }

  async getById(req: Request, res: Response) {
    const member = await membersService.getById(req.user!, req.params.id as string);

    return res.status(200).json({
      success: true,
      message: MemberLabels.FETCHED,
      data: { member },
    });
  }

  async update(req: Request, res: Response) {
    const member = await membersService.update(
      req.user!,
      req.params.id as string,
      req.body as UpdateMemberInput,
    );

    return res.status(200).json({
      success: true,
      message: MemberLabels.UPDATED,
      data: { member },
    });
  }

  async softDelete(req: Request, res: Response) {
    const member = await membersService.softDelete(req.user!, req.params.id as string);

    return res.status(200).json({
      success: true,
      message: MemberLabels.DELETED,
      data: { member },
    });
  }
}

export const membersController = new MembersController();
