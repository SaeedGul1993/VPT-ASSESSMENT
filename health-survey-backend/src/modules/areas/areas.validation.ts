import { z } from "zod";

export const createAreaSchema = z.object({
  name: z.string().min(2).max(100),
  code: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[A-Z0-9-]+$/, "Code must be uppercase letters, numbers, or hyphens"),
  description: z.string().max(500).optional().nullable(),
});

export const updateAreaSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  code: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[A-Z0-9-]+$/, "Code must be uppercase letters, numbers, or hyphens")
    .optional(),
  description: z.string().max(500).optional().nullable(),
});

export const areaIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateAreaInput = z.infer<typeof createAreaSchema>;
export type UpdateAreaInput = z.infer<typeof updateAreaSchema>;
