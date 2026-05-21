# Blue Morning Survey MVP

This is a frontend-only MVP prototyping the Blue Morning Consultancy Survey platform.

## Development Rules

1. **Focus on the Root Cause**: IF YOU MEET AN ERROR TRY IDENTIFY THE ERROR AND FOCUS ON THE ROOT OF THE ISSUE.

## AI Scenario Scoring

Open-ended LTEM scenario answers are scored 0-10 against their rubric by a real
LLM call.

- `api/score.ts` — a Vercel serverless function. It builds a rubric-grounded
  prompt, calls the OpenAI API in JSON mode, and validates the model's output
  against a zod schema (`src/lib/scoringSchema.ts`) before returning it. Invalid
  output is retried once, then rejected.
- `src/lib/aiScoring.ts` — the client helper used by the Evaluation Insights
  tab's **Score with AI** button.

### Setup

1. `cp .env.example .env` and set `OPENAI_API_KEY`.
2. Add the same key as an Environment Variable in the Vercel project.
3. Run locally with `vercel dev` (serves the Vite app and the `/api` function
   together). `npm run dev` runs the frontend only.
