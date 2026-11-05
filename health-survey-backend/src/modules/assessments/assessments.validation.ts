import { z } from "zod";

export const createAssessmentSchema = z.object({
  id: z.uuid().optional(),
  temperature: z.number().min(30).max(45).optional().nullable(),
  hasFever: z.boolean().optional().default(false),
  hasCough: z.boolean().optional().default(false),
  hasBreathingDifficulty: z.boolean().optional().default(false),
  systolicBp: z.number().int().min(50).max(300).optional().nullable(),
  diastolicBp: z.number().int().min(30).max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  flaggedForReview: z.boolean().optional().default(false),
  assessedAt: z.iso.datetime().optional(),
});

export const updateAssessmentSchema = z.object({
  temperature: z.number().min(30).max(45).optional().nullable(),
  hasFever: z.boolean().optional(),
  hasCough: z.boolean().optional(),
  hasBreathingDifficulty: z.boolean().optional(),
  systolicBp: z.number().int().min(50).max(300).optional().nullable(),
  diastolicBp: z.number().int().min(30).max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  flaggedForReview: z.boolean().optional(),
  assessedAt: z.iso.datetime().optional(),
});

export const memberIdParamsSchema = z.object({
  memberId: z.uuid(),
});

export const assessmentIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
