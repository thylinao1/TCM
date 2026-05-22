import { z } from 'zod';

/**
 * Shared scoring schemas for the LTEM AI evaluation assistant.
 *
 * These zod schemas are the single source of truth for the shape of data
 * exchanged with the LLM. The serverless endpoint (`api/score.ts`) validates
 * every model response against `aiScoreSchema` before returning it, so
 * malformed or hallucinated output is rejected rather than shown to a trainer.
 */

/** One rubric criterion judged by the model. */
export const criterionResultSchema = z.object({
  criterion: z.string(),
  type: z.enum(['success', 'fail']),
  met: z.boolean(),
  evidence: z.string(),
});

/**
 * The exact JSON the LLM must return for a scored response.
 * `score` is constrained to an integer 0-10 to match the LTEM 0-10 rubric.
 */
export const aiScoreSchema = z.object({
  score: z.number().int().min(0).max(10),
  targetTier: z.string(),
  criteria: z.array(criterionResultSchema),
  justification: z.string().min(1),
  // Present on responses from /api/score: the raw model score before the
  // benchmarked linear calibration is applied. The model itself never
  // returns this field, so it is optional.
  rawScore: z.number().int().min(0).max(10).optional(),
});

export type CriterionResult = z.infer<typeof criterionResultSchema>;
export type AiScoreResult = z.infer<typeof aiScoreSchema>;

/** Shape of the request body the `/api/score` endpoint accepts. */
export const scoreRequestSchema = z.object({
  scenario: z.string().min(1),
  prompt: z.string().min(1),
  rubric: z.array(z.string()).min(1),
  managerChecklist: z.array(z.string()).default([]),
  learnerResponse: z.string().min(1),
  targetTier: z.string().default('LTEM Tier 5'),
});

export type ScoreRequest = z.infer<typeof scoreRequestSchema>;
