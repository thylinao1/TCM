import { describe, it, expect } from 'vitest';
import { aiScoreSchema, scoreRequestSchema } from './scoringSchema';

const validResult = {
  score: 7,
  targetTier: 'LTEM Tier 5',
  criteria: [
    { criterion: 'Success: de-escalates calmly', type: 'success', met: true, evidence: 'apologised first' },
  ],
  justification: 'A solid, rubric-aligned answer.',
};

describe('aiScoreSchema', () => {
  it('accepts a well-formed result', () => {
    expect(aiScoreSchema.safeParse(validResult).success).toBe(true);
  });
  it('rejects a score above 10', () => {
    expect(aiScoreSchema.safeParse({ ...validResult, score: 11 }).success).toBe(false);
  });
  it('rejects a non-integer score', () => {
    expect(aiScoreSchema.safeParse({ ...validResult, score: 7.5 }).success).toBe(false);
  });
  it('rejects an unknown criterion type', () => {
    expect(
      aiScoreSchema.safeParse({
        ...validResult,
        criteria: [{ ...validResult.criteria[0], type: 'maybe' }],
      }).success,
    ).toBe(false);
  });
  it('rejects an empty justification', () => {
    expect(aiScoreSchema.safeParse({ ...validResult, justification: '' }).success).toBe(false);
  });
});

describe('scoreRequestSchema', () => {
  it('applies defaults for managerChecklist and targetTier', () => {
    const parsed = scoreRequestSchema.parse({
      scenario: 'A workplace scenario.',
      prompt: 'What do you do?',
      rubric: ['Success: handles it well'],
      learnerResponse: 'I would address it directly.',
    });
    expect(parsed.managerChecklist).toEqual([]);
    expect(parsed.targetTier).toBe('LTEM Tier 5');
  });
  it('rejects an empty rubric', () => {
    expect(
      scoreRequestSchema.safeParse({
        scenario: 'A workplace scenario.',
        prompt: 'What do you do?',
        rubric: [],
        learnerResponse: 'I would address it directly.',
      }).success,
    ).toBe(false);
  });
});
