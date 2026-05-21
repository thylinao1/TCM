import { describe, it, expect } from 'vitest';
import {
  meanAbsoluteError,
  exactMatchAccuracy,
  withinToleranceAccuracy,
  bias,
  pearson,
  spearman,
} from './metrics';

describe('meanAbsoluteError', () => {
  it('is 0 for identical series', () => {
    expect(meanAbsoluteError([1, 2, 3], [1, 2, 3])).toBe(0);
  });
  it('averages the absolute differences', () => {
    expect(meanAbsoluteError([2, 2], [0, 4])).toBe(2);
  });
  it('returns 0 for empty input', () => {
    expect(meanAbsoluteError([], [])).toBe(0);
  });
});

describe('exactMatchAccuracy', () => {
  it('counts only exact matches', () => {
    expect(exactMatchAccuracy([1, 2, 3], [1, 9, 3])).toBeCloseTo(2 / 3);
  });
});

describe('withinToleranceAccuracy', () => {
  it('counts predictions within the tolerance band', () => {
    expect(withinToleranceAccuracy([1, 2, 3], [2, 4, 3], 1)).toBeCloseTo(2 / 3);
  });
});

describe('bias', () => {
  it('is positive when predictions run high', () => {
    expect(bias([5, 7], [3, 5])).toBe(2);
  });
  it('is negative when predictions run low', () => {
    expect(bias([1, 1], [3, 3])).toBe(-2);
  });
});

describe('pearson', () => {
  it('is 1 for a perfect positive linear relationship', () => {
    expect(pearson([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
  });
  it('is -1 for a perfect negative relationship', () => {
    expect(pearson([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1);
  });
});

describe('spearman', () => {
  it('is 1 for any monotonic increasing relationship', () => {
    expect(spearman([1, 2, 3, 4], [1, 4, 9, 16])).toBeCloseTo(1);
  });
  it('handles tied values', () => {
    expect(spearman([1, 1, 2], [5, 5, 9])).toBeCloseTo(1);
  });
});
