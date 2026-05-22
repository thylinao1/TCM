import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { scoreRequestSchema } from '../src/lib/scoringSchema';
import { scoreOpenEndedResponse } from './_scoreEngine';

/**
 * POST /api/score
 *
 * Runs a real LLM scoring pass for a single open-ended LTEM scenario answer.
 * The request body is validated with zod; the model is prompted with the
 * scenario rubric, asked to return JSON, and its output is validated against
 * `aiScoreSchema` before it is returned (see `_scoreEngine.ts`).
 *
 * Required environment variable: OPENAI_API_KEY
 * Optional: OPENAI_SCORING_MODEL (defaults to gpt-4o-mini)
 */

/**
 * Linear calibration applied to the raw model score.
 *
 * The evaluation harness (`npm run eval`) found the raw model scores
 * correlate strongly with human reference scores but sit about two points
 * low. These coefficients (`human ~= slope * ai + intercept`) come from the
 * latest leave-one-out cross-validated fit in `eval/results.md`; re-run the
 * harness and update them whenever the gold set grows.
 */
const CALIBRATION_SLOPE = 0.983;
const CALIBRATION_INTERCEPT = 2.176;

const calibrate = (rawScore: number): number =>
  Math.max(0, Math.min(10, Math.round(CALIBRATION_SLOPE * rawScore + CALIBRATION_INTERCEPT)));
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: 'AI scoring is not configured: the OPENAI_API_KEY environment variable is missing.' });
  }

  const parsed = scoreRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body.', issues: parsed.error.issues });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await scoreOpenEndedResponse(client, parsed.data);
    // Apply the benchmarked calibration so the returned score matches the
    // human reference scale. `rawScore` keeps the uncalibrated model score
    // for transparency.
    return res.status(200).json({
      ...result,
      rawScore: result.score,
      score: calibrate(result.score),
    });
  } catch (err) {
    return res.status(502).json({ error: err instanceof Error ? err.message : 'Scoring failed.' });
  }
}
