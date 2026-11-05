import { z } from "zod";

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const relationshipEnum = z.enum([
  "HEAD",
  "SPOUSE",
  "CHILD",
  "PARENT",
  "SIBLING",
  "OTHER",
]);

export const createMemberSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(2).max(100),
  age: z.number().int().min(0).max(120),
  gender: genderEnum,
  relationship: relationshipEnum,
});

export const updateMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  age: z.number().int().min(0).max(120).optional(),
  gender: genderEnum.optional(),
  relationship: relationshipEnum.optional(),
});

export const householdIdParamsSchema = z.object({
  householdId: z.uuid(),
});

export const memberIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
