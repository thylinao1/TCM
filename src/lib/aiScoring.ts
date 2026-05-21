import { aiScoreSchema, type AiScoreResult } from './scoringSchema';
import type { FeedbackScenario } from '../types';

/**
 * Client helper that sends a learner's open-ended answer to the `/api/score`
 * serverless endpoint, which runs a real LLM scoring pass.
 *
 * The response is validated against `aiScoreSchema` a second time on the
 * client so the UI never trusts an unexpected payload shape.
 */
export async function scoreResponseWithAI(params: {
  scenario: FeedbackScenario;
  learnerResponse: string;
  targetTier?: string;
}): Promise<AiScoreResult> {
  const response = await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scenario: params.scenario.scenarioText,
      prompt: params.scenario.prompt,
      rubric: params.scenario.rubric,
      managerChecklist: params.scenario.managerChecklist,
      learnerResponse: params.learnerResponse,
      targetTier: params.targetTier ?? 'LTEM Tier 5',
    }),
  });

  if (!response.ok) {
    const detail = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(detail.error ?? `Scoring failed (HTTP ${response.status}).`);
  }

  return aiScoreSchema.parse(await response.json());
}
