import { z } from "zod";

export const createHouseholdSchema = z.object({
  id: z.uuid().optional(), // mobile offline can send its own UUID
  code: z.string().min(2).max(50),
  address: z.string().min(3).max(500),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  // Must match the field worker's assigned area (validated in service)
  areaId: z.uuid().optional(),
  // Required for SUPER_ADMIN create; ignored for FIELD_WORKER
  fieldWorkerId: z.uuid().optional(),
});

export const updateHouseholdSchema = z.object({
  code: z.string().min(2).max(50).optional(),
  address: z.string().min(3).max(500).optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
});

export const householdIdParamsSchema = z.object({
  id: z.uuid(),
});

export const listHouseholdsQuerySchema = z.object({
  search: z.string().optional(),
  areaId: z.uuid().optional(),
  includeDeleted: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export type CreateHouseholdInput = z.infer<typeof createHouseholdSchema>;
export type UpdateHouseholdInput = z.infer<typeof updateHouseholdSchema>;
export type ListHouseholdsQuery = z.infer<typeof listHouseholdsQuerySchema>;
