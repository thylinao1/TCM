# Blue Morning — LTEM Training Evaluation Platform

A web platform that operationalises the **Learning-Transfer Evaluation Model
(LTEM)** for The TCM Group. Trainers run a three-stage evaluation journey for
each training cohort, and open-ended scenario answers are scored 0–10 by an LLM
against tier-mapped rubrics.

Live demo: https://tcm-alpha.vercel.app

## What it does

Each training cohort moves through three survey stages:

| Stage | Survey | LTEM focus |
| --- | --- | --- |
| Pre-course | What You Know | baseline capability |
| End of session | What You Learnt | comprehension & decision-making |
| 30-day refresher | What You Did | on-the-job transfer |

The trainer dashboard manages sessions and surveys, and the **Evaluation
Insights** view turns raw responses into cohort and per-trainee analytics.

## AI scenario scoring

Open-ended scenario answers are graded 0–10 against a rubric by a real LLM call:

```
Score with AI  (src/lib/aiScoring.ts)
  -> POST /api/score          api/score.ts         validates the request (zod)
  -> scoreOpenEndedResponse() api/_scoreEngine.ts  rubric-grounded prompt -> OpenAI (JSON mode)
  -> aiScoreSchema.parse()    src/lib/scoringSchema.ts  validates model output (zod)
  -> { score, criteria, justification }
```

- The model is prompted with the scenario's Success/Fail rubric criteria and
  asked to return JSON.
- The response is validated against a zod schema; invalid output is retried
  once, then rejected — the UI never displays unvalidated model output.
- `OPENAI_SCORING_MODEL` overrides the model (default `gpt-4o-mini`).

## Evaluation harness

`npm run eval` measures how closely the AI scorer agrees with human reference
scores. It runs the production scoring engine over a gold set of human-scored
responses and reports exact-match accuracy, within-±1 accuracy, mean absolute
error, bias, and Pearson/Spearman correlation. The report is written to
`eval/results.md`.

## Tech stack

React 19 + TypeScript + Vite, Tailwind CSS, React Router. Survey data model in
Supabase (Postgres). Scoring runs as a Vercel serverless function (`api/`)
calling the OpenAI API. Unit tests with Vitest; CI on GitHub Actions.

## Getting started

```bash
npm install
cp .env.example .env     # then set OPENAI_API_KEY
npm run dev              # frontend only
vercel dev               # frontend + /api serverless function
```

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
  score.ts          POST /api/score endpoint
  _scoreEngine.ts   shared prompt + OpenAI call + validation
eval/             LLM-as-judge evaluation harness
  run-eval.ts       scores the gold set, writes results.md
  metrics.ts        agreement metrics (MAE, accuracy, correlation)
src/
  components/       dashboard UI
  lib/              scoringSchema.ts (zod), aiScoring.ts (client)
  data/             survey templates + mock data
supabase/         Postgres schema
```
