import { z } from "zod";

export const createFieldWorkerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(6).max(100),
  areaId: z.uuid().optional().nullable(),
});

export const updateFieldWorkerStatusSchema = z.object({
  isActive: z.boolean(),
});

export const assignFieldWorkerAreaSchema = z.object({
  areaId: z.uuid().nullable(),
});

export const fieldWorkerIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateFieldWorkerInput = z.infer<typeof createFieldWorkerSchema>;
export type UpdateFieldWorkerStatusInput = z.infer<typeof updateFieldWorkerStatusSchema>;
export type AssignFieldWorkerAreaInput = z.infer<typeof assignFieldWorkerAreaSchema>;
