import { AreaLabels } from "../../labels/area.labels";
import { AppError } from "../../utils/AppError";
import { areasRepository } from "./areas.repository";
import type { CreateAreaInput, UpdateAreaInput } from "./areas.validation";

export class AreasService {
  async create(input: CreateAreaInput) {
    const name = input.name.trim();
    const code = input.code.trim().toUpperCase();

    const existingName = await areasRepository.findByName(name);
    if (existingName) {
      throw new AppError(AreaLabels.NAME_EXISTS, 409, "NAME_EXISTS");
    }

    const existingCode = await areasRepository.findByCode(code);
    if (existingCode) {
      throw new AppError(AreaLabels.CODE_EXISTS, 409, "CODE_EXISTS");
    }

    const area = await areasRepository.create({
      name,
      code,
      description: input.description ?? null,
    });

    return areasRepository.findById(area.id);
  }

  async list() {
    return areasRepository.list();
  }

  async getById(id: string) {
    const area = await areasRepository.findById(id);
    if (!area) {
      throw new AppError(AreaLabels.NOT_FOUND, 404, "NOT_FOUND");
    }
    return area;
  }

  async update(id: string, input: UpdateAreaInput) {
    const area = await areasRepository.findById(id);
    if (!area) {
      throw new AppError(AreaLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    if (input.name) {
      const name = input.name.trim();
      const existingName = await areasRepository.findByName(name);
      if (existingName && existingName.id !== id) {
        throw new AppError(AreaLabels.NAME_EXISTS, 409, "NAME_EXISTS");
      }
    }

    if (input.code) {
      const code = input.code.trim().toUpperCase();
      const existingCode = await areasRepository.findByCode(code);
      if (existingCode && existingCode.id !== id) {
        throw new AppError(AreaLabels.CODE_EXISTS, 409, "CODE_EXISTS");
      }
    }

    return areasRepository.update(id, {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.code ? { code: input.code.trim().toUpperCase() } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    });
  }
}

export const areasService = new AreasService();
