# Blue Morning - LTEM Training Evaluation Platform

[![CI](https://github.com/thylinao1/TCM/actions/workflows/ci.yml/badge.svg)](https://github.com/thylinao1/TCM/actions/workflows/ci.yml)

A web platform that operationalises the **Learning-Transfer Evaluation Model
(LTEM)** for a training organisation. Trainers run a three-stage evaluation
journey for each cohort; open-ended scenario answers are scored 0 to 10 by an
LLM against tier-mapped rubrics; and the platform turns the results into a
client-ready statistical report, with no statistics for the trainer to run.

**Live demo:** https://tcm-gray.vercel.app

The demo opens on a worked example cohort ("Practical Mediation Skills (Q3)",
60 learners) so every view is populated with realistic data.

## Why it exists

Training providers can usually show only satisfaction scores, which do not
prove that learning happened or transferred to the job. LTEM replaces the
single "Level 2" of older models with distinct tiers for knowledge,
decision-making, task competence and workplace transfer. This platform makes
those tiers measurable in practice and packages the evidence so it survives a
sceptical client conversation.

## The evaluation journey

Each cohort moves through three forms. Every form pairs open-ended scenario
questions with short knowledge questions and reflective questions.

| Stage | Form | LTEM focus |
| --- | --- | --- |
| Before the course | What You Know | baseline capability |
| End of session | What You Learnt | knowledge and decision-making |
| 3 to 6 month refresher | What You Did | transfer to the workplace |

The **Exemplar Form** page renders all three forms read-only, with every
question tagged with the LTEM tier it measures.

## Statistical Evaluation Report

The headline feature. The trainer opens one tab and reads a finished,
client-ready result; the platform does the statistics. It follows the LTEM
Statistical Methodology Guide and implements, with no external libraries
(see `src/lib/stats.ts`):

- **Design selection** following the pre-post / control-group decision rule.
- **A normality check** - a full Shapiro-Wilk test (Royston's algorithm),
  verified against SciPy.
- **Hypothesis test** - paired t-test when the sample is large and normal,
  otherwise the Wilcoxon signed-rank test, chosen automatically.
- **Effect size** - Cohen's d with benchmark interpretation.
- **95% confidence interval** for the mean gain.
- **Tier-based meaningful-change test** - a one-sided test of whether the gain
  clears a pre-agreed threshold, not just zero.
- **Floor and ceiling calibration checks** on the question difficulty.

The Student-t and normal distributions, the incomplete beta function and the
inverse-normal function are all implemented from scratch in `src/lib/stats.ts`;
`src/lib/ltemAnalysis.ts` assembles them into the report.

## AI scenario scoring

Open-ended scenario answers are graded 0 to 10 against a rubric by a real LLM
call, then passed through a benchmarked calibration:

```
Score with AI  (src/lib/aiScoring.ts)
  -> POST /api/score          api/score.ts          validates the request (zod)
  -> scoreOpenEndedResponse() api/_scoreEngine.ts   rubric-grounded prompt -> OpenAI (JSON mode)
  -> aiScoreSchema.parse()    src/lib/scoringSchema.ts   validates model output (zod)
  -> calibrate()              src/lib/calibration.ts     corrects the systematic offset
  -> { score, rawScore, criteria, justification }
```

- The model is prompted with the scenario's Success/Fail rubric criteria and
  asked to return JSON.
- Output is validated against a zod schema; invalid output is retried once,
  then rejected, so the UI never displays unvalidated model output.
- The raw score is corrected by the linear calibration in
  `src/lib/calibration.ts` - one shared module used by both the live endpoint
  and the validation page.
- `OPENAI_SCORING_MODEL` overrides the model (default `gpt-4o-mini`).

## AI Scorer Validation

The **AI Scorer Validation** page shows the scorer is not trusted blindly. It
surfaces the benchmark from the evaluation harness: agreement metrics, the
before/after of calibration, a human-vs-AI scatter plot, and the full
per-response table.

## Evaluation harness

`npm run eval` measures how closely the AI scorer agrees with human reference
scores. It runs the production scoring engine over a gold set of human-scored
responses and reports exact-match accuracy, within-1 and within-2 accuracy,
mean absolute error, bias, and Pearson/Spearman correlation. Because the model
ranks answers well but scores with a systematic offset, the harness fits a
leave-one-out cross-validated linear calibration and reports the corrected
agreement. The report is written to `eval/results.md`.

## Tech stack

React 19 + TypeScript + Vite, Tailwind CSS, React Router. Scoring runs as a
Vercel serverless function (`api/`) calling the OpenAI API. Statistics are
pure TypeScript with no dependencies. Unit tests with Vitest; CI on GitHub
Actions (build, server typecheck, tests).

## Getting started

```bash
npm install
cp .env.example .env     # then set OPENAI_API_KEY
npm run dev              # frontend only
vercel dev               # frontend + /api serverless function
```

The frontend runs without a key; only the live "Score with AI" button needs
`OPENAI_API_KEY`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server (frontend only) |
| `npm run build` | Type-check and build the frontend |
| `npm run typecheck:server` | Type-check the `api/` and `eval/` code |
| `npm test` | Run the Vitest unit tests |
| `npm run eval` | Run the LLM-as-judge evaluation harness |
| `npm run lint` | ESLint |

## Project layout

```
api/              Vercel serverless functions
  score.ts          POST /api/score endpoint (scores + calibrates)
  _scoreEngine.ts   shared prompt + OpenAI call + validation
eval/             LLM-as-judge evaluation harness
  run-eval.ts       scores the gold set, writes results.md
  metrics.ts        agreement metrics (MAE, accuracy, correlation)
src/
  pages/            Dashboard, SessionDetail, ExemplarForm, ScorerValidation
  components/       EvaluationReport, InsightsTab, Layout
  lib/              stats.ts (statistics), ltemAnalysis.ts (report),
                    calibration.ts, scoringSchema.ts (zod), aiScoring.ts
  data/             survey templates, demo cohort, scorer validation data
supabase/         Postgres schema
```

## Note

This is a prototype built to demonstrate how LTEM can be operationalised. The
demo cohort is synthetic and no real learner data is included in the repository.
