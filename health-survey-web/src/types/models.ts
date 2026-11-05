import type { UserRole } from "../constants/Common.constants";

export type Area = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  areaId: string | null;
  area?: Pick<Area, "id" | "name" | "code"> | null;
};

export type FieldWorker = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  areaId: string | null;
  area?: Pick<Area, "id" | "name" | "code"> | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Household = {
  id: string;
  code: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  areaId: string;
  fieldWorkerId: string;
  version?: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  area?: Pick<Area, "id" | "name" | "code"> | null;
  fieldWorker?: Pick<FieldWorker, "id" | "name" | "email"> | null;
  _count?: {
    members?: number;
  };
};

export type HouseholdMember = {
  id: string;
  householdId: string;
  name: string;
  age: number;
  gender: string;
  relationship: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type HealthAssessment = {
  id: string;
  memberId: string;
  temperature?: number | null;
  hasFever?: boolean;
  hasCough?: boolean;
  hasBreathingDifficulty?: boolean;
  systolicBp?: number | null;
  diastolicBp?: number | null;
  notes?: string | null;
  flaggedForReview?: boolean;
  isUrgent?: boolean;
  assessedAt?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type DashboardStats = {
  totalHouseholds: number;
  totalFieldWorkers: number;
  activeFieldWorkers: number;
  totalMembers: number;
  totalAssessments: number;
  urgentAssessments: number;
  unreadActivities: number;
  generatedAt: string;
  cache?: {
    hit: boolean;
    ttlSeconds: number;
  };
};

export type ActivityLog = {
  id: string;
  type: string;
  message: string;
  assessmentId?: string | null;
  readAt?: string | null;
  createdAt: string;
  assessment?: {
    id: string;
    temperature?: number | null;
    isUrgent?: boolean;
    member?: {
      id: string;
      name: string;
      household?: {
        id: string;
        code: string;
        area?: { id: string; name: string; code: string } | null;
      } | null;
    } | null;
  } | null;
};
