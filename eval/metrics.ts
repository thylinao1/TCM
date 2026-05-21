/**
 * Agreement metrics for evaluating the AI scorer against human reference
 * scores. All functions take two equal-length arrays: predicted (AI) scores
 * and actual (human) scores.
 */

/** Mean absolute error: average of |predicted - actual|. */
export function meanAbsoluteError(predicted: number[], actual: number[]): number {
  if (predicted.length === 0) return 0;
  const total = predicted.reduce((sum, p, i) => sum + Math.abs(p - actual[i]), 0);
  return total / predicted.length;
}

/** Fraction of predictions that exactly equal the human score. */
export function exactMatchAccuracy(predicted: number[], actual: number[]): number {
  if (predicted.length === 0) return 0;
  const hits = predicted.filter((p, i) => p === actual[i]).length;
  return hits / predicted.length;
}

/** Fraction of predictions within `tolerance` points of the human score. */
export function withinToleranceAccuracy(
  predicted: number[],
  actual: number[],
  tolerance: number,
): number {
  if (predicted.length === 0) return 0;
  const hits = predicted.filter((p, i) => Math.abs(p - actual[i]) <= tolerance).length;
  return hits / predicted.length;
}

/** Signed mean error (predicted - actual): positive = the AI scores high. */
export function bias(predicted: number[], actual: number[]): number {
  if (predicted.length === 0) return 0;
  return predicted.reduce((sum, p, i) => sum + (p - actual[i]), 0) / predicted.length;
}

/** Pearson correlation coefficient between two series. */
export function pearson(a: number[], b: number[]): number {
  const n = a.length;
  if (n === 0) return 0;
  const meanA = a.reduce((s, x) => s + x, 0) / n;
  const meanB = b.reduce((s, x) => s + x, 0) / n;
  let covariance = 0;
  let varianceA = 0;
  let varianceB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    covariance += da * db;
    varianceA += da * da;
    varianceB += db * db;
  }
  const denominator = Math.sqrt(varianceA * varianceB);
  return denominator === 0 ? 0 : covariance / denominator;
}

/** Average (tie-corrected, 1-based) ranks of the values in an array. */
function ranks(values: number[]): number[] {
  const ordered = values.map((value, index) => ({ value, index })).sort((x, y) => x.value - y.value);
  const result = new Array<number>(values.length);
  let i = 0;
  while (i < ordered.length) {
    let j = i;
    while (j + 1 < ordered.length && ordered[j + 1].value === ordered[i].value) j++;
    const averageRank = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) result[ordered[k].index] = averageRank;
    i = j + 1;
  }
  return result;
}

/** Spearman rank correlation: Pearson correlation applied to the ranks. */
export function spearman(a: number[], b: number[]): number {
  return pearson(ranks(a), ranks(b));
}

/**
 * Ordinary-least-squares fit of `y ≈ slope * x + intercept`.
 * Used to calibrate the AI scores against the human reference scores.
 */
export function linearFit(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const meanY = y.reduce((s, v) => s + v, 0) / n;
  let covariance = 0;
  let varianceX = 0;
  for (let i = 0; i < n; i++) {
    covariance += (x[i] - meanX) * (y[i] - meanY);
    varianceX += (x[i] - meanX) ** 2;
  }
  const slope = varianceX === 0 ? 0 : covariance / varianceX;
  return { slope, intercept: meanY - slope * meanX };
}
