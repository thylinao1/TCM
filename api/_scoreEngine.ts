import type OpenAI from 'openai';
import { aiScoreSchema, type AiScoreResult, type ScoreRequest } from '../src/lib/scoringSchema';

/**
 * Shared LLM scoring engine.
 *
 * Used by both the `/api/score` serverless endpoint and the offline
 * evaluation harness (`eval/run-eval.ts`), so the harness measures the
 * exact code path that runs in production.
 *
 * Files in `api/` prefixed with `_` are treated as modules, not routes.
 */

export const DEFAULT_MODEL = process.env.OPENAI_SCORING_MODEL ?? 'gpt-4o-mini';

export const SYSTEM_PROMPT = `You are a strict evaluation assistant for The TCM Group's Learning-Transfer Evaluation Model (LTEM).
You score a learner's written answer to a workplace scenario on an INTEGER scale from 0 to 10, judged ONLY against the rubric supplied for that scenario.

The rubric contains two kinds of criteria:
- "Success:" criteria describe evidence a strong answer should contain.
- "Fail:" criteria describe red-flag answers that should pull the score down.

Scoring guidance (use the full 0 to 10 range; do not cluster scores at the low end):
- 1-2: poor — meets no success criteria, or clearly matches a fail criterion.
- 3-5: partial — meets some success criteria but has clear gaps or weak/vague reasoning.
- 6-7: solid — meets most success criteria; a sound, safe answer with no fail criteria.
- 8-9: excellent — meets essentially all success criteria, explicitly and well-reasoned.
- 0 and 10 are reserved for extreme cases and should be rare.

Calibration: a reasonable answer that does the right thing belongs at 6-7, not 3-4. Only drop to 1-2 for genuinely poor answers. Judge the substance of the answer, not its length or polish, and do not reward generic statements that fail to engage with the scenario.

Return ONLY a JSON object with exactly this shape:
{
  "score": <integer 0-10>,
  "targetTier": "<the target LTEM tier you were given>",
  "criteria": [
    { "criterion": "<the rubric line, verbatim>", "type": "success" or "fail", "met": <boolean>, "evidence": "<short quote/paraphrase from the answer, or why the criterion was not met>" }
  ],
  "justification": "<2-3 sentence explanation of the score>"
}
Include exactly one entry in "criteria" for every rubric line provided.`;

/** Builds the rubric-grounded user prompt for a single scoring request. */
export function buildUserPrompt(req: ScoreRequest): string {
  const rubricLines = req.rubric.map((line, i) => `${i + 1}. ${line}`).join('\n');
  return [
    `Target tier: ${req.targetTier}`,
    '',
    'Scenario presented to the learner:',
    req.scenario,
    '',
    'Question the learner answered:',
    req.prompt,
    '',
    'Rubric criteria:',
    rubricLines,
    '',
    "Learner's answer:",
    `"""${req.learnerResponse}"""`,
  ].join('\n');
}

/**
 * Scores one open-ended response with the LLM.
 *
 * Makes up to two attempts: if the model returns JSON that fails zod
 * validation, it asks once more before throwing.
 */
export async function scoreOpenEndedResponse(
  client: OpenAI,
  request: ScoreRequest,
  model: string = DEFAULT_MODEL,
): Promise<AiScoreResult> {
  let lastError = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(request) },
        ],
      });

      const raw = completion.choices[0]?.message?.content ?? '';
      const validated = aiScoreSchema.safeParse(JSON.parse(raw));

      if (validated.success) {
        return validated.data;
      }
      lastError = `model output failed schema validation: ${validated.error.issues
        .map((issue) => `${issue.path.join('.')} ${issue.message}`)
        .join('; ')}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'unknown error while calling the model.';
    }
  }

  throw new Error(`Scoring failed after 2 attempts: ${lastError}`);
}
