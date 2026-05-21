import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import OpenAI from 'openai';
import { scoreOpenEndedResponse, DEFAULT_MODEL } from '../api/_scoreEngine';
import { scoreRequestSchema } from '../src/lib/scoringSchema';
import { mockPopulatedResponses, mockAiScenariosLibrary } from '../src/data/mockData';
import type { FeedbackScenario } from '../src/types';
import {
  meanAbsoluteError,
  exactMatchAccuracy,
  withinToleranceAccuracy,
  bias,
  pearson,
  spearman,
  linearFit,
} from './metrics';

/**
 * LLM-as-judge evaluation harness.
 *
 * Runs the production scoring engine over a gold set of human-scored
 * responses and reports how closely the AI scores agree with the human
 * reference scores. Writes a markdown report to `eval/results.md`.
 *
 * Run with: npm run eval   (requires OPENAI_API_KEY)
 *
 * Gold set: the open-ended answers in `src/data/mockData.ts` carry a human
 * reference score in an `[AI_SCORE: n]` tag. Those reference scores were
 * calibrated by the TCM evaluation team and are treated here as ground truth.
 */

interface GoldItem {
  id: string;
  participant: string;
  stage: string;
  scenario: FeedbackScenario;
  learnerResponse: string;
  humanScore: number;
}

const HUMAN_SCORE_TAG = /\[AI_SCORE:\s*(\d+)\]/;
const OPEN_ENDED_QUESTION_IDS = ['1', '2'];

function buildGoldSet(): GoldItem[] {
  const items: GoldItem[] = [];
  for (const response of mockPopulatedResponses) {
    const stagePrefix = response.stage === 'refresher' ? 'ref' : response.stage;
    for (const qId of OPEN_ENDED_QUESTION_IDS) {
      const raw = response.answers[qId];
      if (typeof raw !== 'string') continue;

      const match = raw.match(HUMAN_SCORE_TAG);
      if (!match) continue;

      const scenario = mockAiScenariosLibrary.find((s) => s.id === `ai-${stagePrefix}-${qId}`);
      if (!scenario) continue;

      items.push({
        id: `${response.id}:${qId}`,
        participant: response.participantName ?? 'Unknown',
        stage: response.stage,
        scenario,
        learnerResponse: raw.replace(/\[AI_SCORE:\s*\d+\]/g, '').trim(),
        humanScore: Number.parseInt(match[1], 10),
      });
    }
  }
  return items;
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

interface Calibration {
  slope: number;
  intercept: number;
  mae: number;
  within1: number;
  within2: number;
}

function buildReport(
  model: string,
  rows: Array<GoldItem & { aiScore: number }>,
  metrics: Record<string, number>,
  calibration: Calibration,
): string {
  const lines: string[] = [];
  lines.push('# LLM Scorer Evaluation Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Model: \`${model}\``);
  lines.push(`Gold set size: ${rows.length} human-scored responses`);
  lines.push('');
  lines.push('## Agreement with human reference scores');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('| --- | --- |');
  lines.push(`| Exact-match accuracy | ${pct(metrics.exact)} |`);
  lines.push(`| Within ±1 accuracy | ${pct(metrics.within1)} |`);
  lines.push(`| Within ±2 accuracy | ${pct(metrics.within2)} |`);
  lines.push(`| Mean absolute error | ${metrics.mae.toFixed(2)} points |`);
  lines.push(`| Bias (AI − human) | ${metrics.bias >= 0 ? '+' : ''}${metrics.bias.toFixed(2)} points |`);
  lines.push(`| Pearson correlation | ${metrics.pearson.toFixed(3)} |`);
  lines.push(`| Spearman correlation | ${metrics.spearman.toFixed(3)} |`);
  lines.push('');
  lines.push('## After leave-one-out linear calibration');
  lines.push('');
  lines.push(
    `Fitted calibration: \`human ≈ ${calibration.slope.toFixed(3)} × ai + ${calibration.intercept.toFixed(3)}\`. ` +
      'Metrics below are leave-one-out cross-validated, so the calibration is never evaluated on the point it was fitted with.',
  );
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('| --- | --- |');
  lines.push(`| Calibrated mean absolute error | ${calibration.mae.toFixed(2)} points |`);
  lines.push(`| Calibrated within ±1 accuracy | ${pct(calibration.within1)} |`);
  lines.push(`| Calibrated within ±2 accuracy | ${pct(calibration.within2)} |`);
  lines.push('');
  lines.push('## Per-response results');
  lines.push('');
  lines.push('| Response | Participant | Stage | Human | AI | Δ |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const row of rows) {
    const delta = row.aiScore - row.humanScore;
    lines.push(
      `| ${row.id} | ${row.participant} | ${row.stage} | ${row.humanScore} | ${row.aiScore} | ${delta >= 0 ? '+' : ''}${delta} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

async function main(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set. Add it to a .env file or your environment, then re-run.');
    process.exit(1);
  }

  const goldSet = buildGoldSet();
  if (goldSet.length === 0) {
    console.error('Gold set is empty — no human-scored responses found in the mock data.');
    process.exit(1);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log(`Scoring ${goldSet.length} responses with ${DEFAULT_MODEL}...\n`);

  const rows: Array<GoldItem & { aiScore: number }> = [];
  for (const item of goldSet) {
    const request = scoreRequestSchema.parse({
      scenario: item.scenario.scenarioText,
      prompt: item.scenario.prompt,
      rubric: item.scenario.rubric,
      managerChecklist: item.scenario.managerChecklist,
      learnerResponse: item.learnerResponse,
    });
    const result = await scoreOpenEndedResponse(client, request);
    rows.push({ ...item, aiScore: result.score });
    console.log(`  ${item.id.padEnd(16)} human=${item.humanScore}  ai=${result.score}`);
  }

  const aiScores = rows.map((r) => r.aiScore);
  const humanScores = rows.map((r) => r.humanScore);
  const metrics = {
    exact: exactMatchAccuracy(aiScores, humanScores),
    within1: withinToleranceAccuracy(aiScores, humanScores, 1),
    within2: withinToleranceAccuracy(aiScores, humanScores, 2),
    mae: meanAbsoluteError(aiScores, humanScores),
    bias: bias(aiScores, humanScores),
    pearson: pearson(aiScores, humanScores),
    spearman: spearman(aiScores, humanScores),
  };

  // Leave-one-out cross-validated linear calibration. The raw AI scores
  // correlate strongly with the human scores but carry a systematic offset;
  // fitting `human ~= slope * ai + intercept` corrects it. Leave-one-out CV
  // ensures the calibration is never evaluated on the point it was fit with.
  const calibrationFit = linearFit(aiScores, humanScores);
  const calibratedScores: number[] = [];
  for (let i = 0; i < aiScores.length; i++) {
    const trainAi = aiScores.filter((_, j) => j !== i);
    const trainHuman = humanScores.filter((_, j) => j !== i);
    const fit = linearFit(trainAi, trainHuman);
    calibratedScores.push(fit.slope * aiScores[i] + fit.intercept);
  }
  const calibration: Calibration = {
    slope: calibrationFit.slope,
    intercept: calibrationFit.intercept,
    mae: meanAbsoluteError(calibratedScores, humanScores),
    within1: withinToleranceAccuracy(calibratedScores, humanScores, 1),
    within2: withinToleranceAccuracy(calibratedScores, humanScores, 2),
  };

  console.log('\n=== Agreement with human reference scores ===');
  console.log(`  Exact-match accuracy : ${pct(metrics.exact)}`);
  console.log(`  Within ±1 accuracy   : ${pct(metrics.within1)}`);
  console.log(`  Within ±2 accuracy   : ${pct(metrics.within2)}`);
  console.log(`  Mean absolute error  : ${metrics.mae.toFixed(2)} points`);
  console.log(`  Bias (AI − human)    : ${metrics.bias >= 0 ? '+' : ''}${metrics.bias.toFixed(2)} points`);
  console.log(`  Pearson correlation  : ${metrics.pearson.toFixed(3)}`);
  console.log(`  Spearman correlation : ${metrics.spearman.toFixed(3)}`);

  console.log('\n=== After leave-one-out linear calibration ===');
  console.log(
    `  Calibration          : human ~= ${calibration.slope.toFixed(3)} x ai + ${calibration.intercept.toFixed(3)}`,
  );
  console.log(`  Calibrated MAE       : ${calibration.mae.toFixed(2)} points`);
  console.log(`  Calibrated within +/-1: ${pct(calibration.within1)}`);
  console.log(`  Calibrated within +/-2: ${pct(calibration.within2)}`);

  writeFileSync('eval/results.md', buildReport(DEFAULT_MODEL, rows, metrics, calibration));
  console.log('\nReport written to eval/results.md');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
