import { describe, it, expect } from 'vitest';
import type OpenAI from 'openai';
import { buildUserPrompt, SYSTEM_PROMPT, scoreOpenEndedResponse } from './_scoreEngine';
import { scoreRequestSchema } from '../src/lib/scoringSchema';

const request = scoreRequestSchema.parse({
  scenario: 'A vendor is angry about a late invoice.',
  prompt: 'What do you say to de-escalate?',
  rubric: ['Success: De-escalate calmly.', 'Fail: Threaten the vendor.'],
  learnerResponse: 'I would apologise and explain the payment timeline.',
});

describe('buildUserPrompt', () => {
  it('includes the scenario, question and learner response', () => {
    const text = buildUserPrompt(request);
    expect(text).toContain('A vendor is angry about a late invoice.');
    expect(text).toContain('What do you say to de-escalate?');
    expect(text).toContain('I would apologise and explain the payment timeline.');
  });

  it('numbers every rubric line', () => {
    const text = buildUserPrompt(request);
    expect(text).toContain('1. Success: De-escalate calmly.');
    expect(text).toContain('2. Fail: Threaten the vendor.');
  });

  it('applies the default target tier', () => {
    expect(buildUserPrompt(request)).toContain('Target tier: LTEM Tier 5');
  });
});

describe('SYSTEM_PROMPT', () => {
  it('instructs the model on the 0-10 score field and JSON output', () => {
    expect(SYSTEM_PROMPT).toContain('0 to 10');
    expect(SYSTEM_PROMPT).toContain('"score"');
  });
});

/**
 * A minimal fake OpenAI client that returns scripted completion contents,
 * one per call. Lets the failure-handling path be tested without the API.
 */
function fakeClient(contents: string[]): OpenAI {
  let call = 0;
  return {
    chat: {
      completions: {
        create: async () => {
          const content = contents[Math.min(call, contents.length - 1)];
          call += 1;
          return { choices: [{ message: { content } }] };
        },
      },
    },
  } as unknown as OpenAI;
}

const validModelReply = JSON.stringify({
  score: 7,
  targetTier: 'LTEM Tier 5',
  criteria: [
    { criterion: 'Success: De-escalate calmly.', type: 'success', met: true, evidence: 'apologised first' },
  ],
  justification: 'A calm, rubric-aligned answer.',
});

describe('scoreOpenEndedResponse — failure handling', () => {
  it('returns the validated result when the model replies with valid JSON', async () => {
    const result = await scoreOpenEndedResponse(fakeClient([validModelReply]), request);
    expect(result.score).toBe(7);
  });

  it('retries once and still succeeds if the first reply is malformed', async () => {
    const result = await scoreOpenEndedResponse(fakeClient(['not json at all', validModelReply]), request);
    expect(result.score).toBe(7);
  });

  it('throws after two attempts when the model never returns valid JSON', async () => {
    await expect(
      scoreOpenEndedResponse(fakeClient(['garbage', 'still garbage']), request),
    ).rejects.toThrow(/Scoring failed after 2 attempts/);
  });

  it('throws when the JSON is well-formed but violates the score schema', async () => {
    const offSchema = JSON.stringify({ ...JSON.parse(validModelReply), score: 99 });
    await expect(
      scoreOpenEndedResponse(fakeClient([offSchema, offSchema]), request),
    ).rejects.toThrow(/Scoring failed after 2 attempts/);
  });
});
