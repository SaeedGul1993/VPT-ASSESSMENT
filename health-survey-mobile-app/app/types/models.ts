import type { UserRole } from '../constants/Common.constants';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  areaId: string | null;
  area?: AreaSummary | null;
};

export type AreaSummary = {
  id: string;
  name: string;
  code: string;
};

export type Household = {
  id: string;
  code: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  areaId: string;
  createdById: string;
  version?: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  area?: AreaSummary | null;
  createdBy?: { id: string; name: string; email: string } | null;
};

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type Relationship =
  | 'HEAD'
  | 'SPOUSE'
  | 'CHILD'
  | 'PARENT'
  | 'SIBLING'
  | 'OTHER';

export type HouseholdMember = {
  id: string;
  householdId: string;
  name: string;
  age: number;
  gender: Gender;
  relationship: Relationship;
  version?: number;
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
  version?: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateHouseholdBody = {
  code: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type CreateMemberBody = {
  name: string;
  age: number;
  gender: Gender;
  relationship: Relationship;
};

export type CreateAssessmentBody = {
  temperature?: number | null;
  hasFever?: boolean;
  hasCough?: boolean;
  hasBreathingDifficulty?: boolean;
  systolicBp?: number | null;
  diastolicBp?: number | null;
  notes?: string | null;
  flaggedForReview?: boolean;
};
