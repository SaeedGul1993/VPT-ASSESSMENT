import { z } from "zod";

const syncActionEnum = z.enum(["CREATE", "UPDATE", "DELETE"]);
const syncEntityEnum = z.enum(["HOUSEHOLD", "MEMBER", "ASSESSMENT"]);

export const syncOpSchema = z.object({
  opId: z.uuid(),
  entityType: syncEntityEnum,
  entityId: z.uuid(),
  action: syncActionEnum,
  clientVersion: z.number().int().min(0).nullable().optional(),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
});

export const syncPushSchema = z.object({
  ops: z.array(syncOpSchema).min(1).max(100),
});

export const syncPullQuerySchema = z.object({
  since: z.iso.datetime().optional(),
});

export type SyncOpInput = z.infer<typeof syncOpSchema>;
export type SyncPushInput = z.infer<typeof syncPushSchema>;
export type SyncPullQuery = z.infer<typeof syncPullQuerySchema>;
