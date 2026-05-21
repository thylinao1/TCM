import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { aiScoreSchema, scoreRequestSchema, type ScoreRequest } from '../src/lib/scoringSchema';

/**
 * POST /api/score
 *
 * Runs a real LLM scoring pass for a single open-ended LTEM scenario answer.
 * The model is prompted with the scenario rubric, asked to return JSON, and
 * its output is validated against `aiScoreSchema` (zod) before it is returned.
 * If the model returns JSON that fails validation, the request is retried once.
 *
 * Required environment variable: OPENAI_API_KEY
 * Optional: OPENAI_SCORING_MODEL (defaults to gpt-4o-mini)
 */

const MODEL = process.env.OPENAI_SCORING_MODEL ?? 'gpt-4o-mini';

const SYSTEM_PROMPT = `You are a strict evaluation assistant for The TCM Group's Learning-Transfer Evaluation Model (LTEM).
You score a learner's written answer to a workplace scenario on an INTEGER scale from 0 to 10, judged ONLY against the rubric supplied for that scenario.

The rubric contains two kinds of criteria:
- "Success:" criteria describe evidence a strong answer should contain.
- "Fail:" criteria describe red-flag answers that should pull the score down.

Scoring guidance:
- 0-3: meets few or no success criteria, or clearly matches one or more fail criteria.
- 4-6: partially meets the success criteria; noticeable gaps or weak reasoning.
- 7-10: clearly meets most or all success criteria with sound reasoning and no fail criteria.

Judge the substance of the answer, not its length or polish. Do not reward generic statements that fail to engage with the scenario.

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

function buildUserPrompt(req: ScoreRequest): string {
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
  const scoreRequest = parsed.data;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Up to two attempts: if the model returns JSON that fails schema
  // validation, ask once more before giving up.
  let lastError = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(scoreRequest) },
        ],
      });

      const raw = completion.choices[0]?.message?.content ?? '';
      const validated = aiScoreSchema.safeParse(JSON.parse(raw));

      if (validated.success) {
        return res.status(200).json(validated.data);
      }
      lastError = `Model output failed schema validation: ${validated.error.issues
        .map((issue) => `${issue.path.join('.')} ${issue.message}`)
        .join('; ')}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown error while calling the model.';
    }
  }

  return res.status(502).json({ error: `Scoring failed after 2 attempts. ${lastError}` });
}
