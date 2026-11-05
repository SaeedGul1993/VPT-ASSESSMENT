import bcrypt from "bcrypt";
import { FieldWorkerLabels } from "../../labels/field-worker.labels";
import { AppError } from "../../utils/AppError";
import { invalidateDashboardCache } from "../../utils/cache";
import { fieldWorkersRepository } from "./field-workers.repository";
import type {
  AssignFieldWorkerAreaInput,
  CreateFieldWorkerInput,
  UpdateFieldWorkerStatusInput,
} from "./field-workers.validation";

export class FieldWorkersService {
  private toPublic(worker: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    areaId: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    area?: { id: string; name: string; code: string } | null;
    password?: string;
  }) {
    return {
      id: worker.id,
      name: worker.name,
      email: worker.email,
      role: worker.role,
      isActive: worker.isActive,
      areaId: worker.areaId,
      area: worker.area ?? null,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt,
    };
  }

  async create(input: CreateFieldWorkerInput) {
    const email = input.email.toLowerCase();
    const existing = await fieldWorkersRepository.findByEmail(email);
    if (existing) {
      throw new AppError(FieldWorkerLabels.EMAIL_EXISTS, 409, "EMAIL_EXISTS");
    }

    if (input.areaId) {
      const area = await fieldWorkersRepository.findAreaById(input.areaId);
      if (!area) {
        throw new AppError(FieldWorkerLabels.AREA_NOT_FOUND, 404, "AREA_NOT_FOUND");
      }
    }

    const password = await bcrypt.hash(input.password, 10);
    const worker = await fieldWorkersRepository.createFieldWorker({
      name: input.name,
      email,
      password,
      areaId: input.areaId ?? null,
    });

    const full = await fieldWorkersRepository.findFieldWorkerById(worker.id);
    await invalidateDashboardCache();
    return this.toPublic(full ?? worker);
  }

  async list() {
    const workers = await fieldWorkersRepository.listFieldWorkers();
    return workers.map((worker) => this.toPublic(worker));
  }

  async getById(id: string) {
    const worker = await fieldWorkersRepository.findFieldWorkerById(id);
    if (!worker) {
      throw new AppError(FieldWorkerLabels.NOT_FOUND, 404, "NOT_FOUND");
    }
    return this.toPublic(worker);
  }

  async updateStatus(id: string, input: UpdateFieldWorkerStatusInput) {
    const worker = await fieldWorkersRepository.findFieldWorkerById(id);
    if (!worker) {
      throw new AppError(FieldWorkerLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    const updated = await fieldWorkersRepository.updateStatus(id, input.isActive);
    await invalidateDashboardCache();
    return this.toPublic(updated);
  }

  async assignArea(id: string, input: AssignFieldWorkerAreaInput) {
    const worker = await fieldWorkersRepository.findFieldWorkerById(id);
    if (!worker) {
      throw new AppError(FieldWorkerLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    if (input.areaId) {
      const area = await fieldWorkersRepository.findAreaById(input.areaId);
      if (!area) {
        throw new AppError(FieldWorkerLabels.AREA_NOT_FOUND, 404, "AREA_NOT_FOUND");
      }
    }

    const updated = await fieldWorkersRepository.assignArea(id, input.areaId);
    await invalidateDashboardCache();
    return this.toPublic(updated);
  }
}

export const fieldWorkersService = new FieldWorkersService();
