import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { scoreRequestSchema } from '../src/lib/scoringSchema';
import { calibrate } from '../src/lib/calibration';
import { scoreOpenEndedResponse } from './_scoreEngine';

/**
 * POST /api/score
 *
 * Runs a real LLM scoring pass for a single open-ended LTEM scenario answer.
 * The request body is validated with zod; the model is prompted with the
 * scenario rubric, asked to return JSON, and its output is validated against
 * `aiScoreSchema` before it is returned (see `_scoreEngine.ts`).
 *
 * The raw model score is then passed through the benchmarked linear
 * calibration (see `src/lib/calibration.ts`) so the returned score sits on
 * the human reference scale.
 *
 * Required environment variable: OPENAI_API_KEY
 * Optional: OPENAI_SCORING_MODEL (defaults to gpt-4o-mini)
 */

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
