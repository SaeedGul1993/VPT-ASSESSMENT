import type { SyncAction, SyncEntity, SyncResult } from "../../generated/prisma";

export type SyncWorker = {
  id: string;
  areaId: string;
};

export type OpResult = {
  opId: string;
  entityType: SyncEntity;
  entityId: string;
  action: SyncAction;
  result: SyncResult;
  entity?: unknown;
  message?: string;
};
