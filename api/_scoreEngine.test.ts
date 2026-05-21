import { describe, it, expect } from 'vitest';
import { buildUserPrompt, SYSTEM_PROMPT } from './_scoreEngine';
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
