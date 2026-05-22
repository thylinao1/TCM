// Statistical engine for the LTEM Evaluation Report.
//
// This module implements the methods described in Appendix G of the LTEM
// Playbook: paired t-test, Wilcoxon signed-rank test, Cohen's d, 95%
// confidence intervals, and the tier-based meaningful-change test.
//
// It has no external dependencies. Everything an L&D professional would
// otherwise have to compute by hand is done here automatically.

// ---------------------------------------------------------------------------
// Descriptive statistics
// ---------------------------------------------------------------------------

export const mean = (xs: number[]): number =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;

/** Sample variance (n - 1 denominator). */
export const variance = (xs: number[]): number => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
};

export const sd = (xs: number[]): number => Math.sqrt(variance(xs));

export const median = (xs: number[]): number => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
};

/** Sample skewness. Values near 0 indicate a roughly symmetric distribution. */
export const skewness = (xs: number[]): number => {
  const n = xs.length;
  if (n < 3) return 0;
  const m = mean(xs);
  const s = sd(xs);
  if (s === 0) return 0;
  const sum = xs.reduce((a, b) => a + ((b - m) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * sum;
};

// ---------------------------------------------------------------------------
// Special functions: log-gamma, incomplete beta, normal & Student-t CDFs
// ---------------------------------------------------------------------------

const logGamma = (x: number): number => {
  const c = [
    76.1800917294715, -86.5053203294168, 24.0140982408309,
    -1.23173957245016, 0.00120865097, -0.000005395239,
  ];
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return -tmp + Math.log((Math.sqrt(2 * Math.PI) * ser) / x);
};

/** Continued-fraction expansion used by the incomplete beta function. */
const betacf = (a: number, b: number, x: number): number => {
  const FPMIN = 1e-30;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 200; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-7) break;
  }
  return h;
};

/** Regularised incomplete beta function I_x(a, b). */
const incompleteBeta = (a: number, b: number, x: number): number => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) +
      a * Math.log(x) + b * Math.log(1 - x),
  );
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betacf(a, b, x)) / a;
  }
  return 1 - (bt * betacf(b, a, 1 - x)) / b;
};

/** Cumulative distribution function of the standard normal. */
export const normalCDF = (z: number): number => {
  // Abramowitz & Stegun 7.1.26 approximation of erf.
  const t = 1 / (1 + (0.3275911 * Math.abs(z)) / Math.SQRT2);
  const erf =
    1 -
    t *
      (0.254829592 +
        t *
          (-0.284496736 +
            t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) *
      Math.exp(-(z * z) / 2);
  return z >= 0 ? 0.5 + 0.5 * erf : 0.5 - 0.5 * erf;
};

/** CDF of the Student-t distribution with `df` degrees of freedom. */
export const studentTCDF = (t: number, df: number): number => {
  const x = df / (df + t * t);
  const ib = incompleteBeta(df / 2, 0.5, x);
  return t >= 0 ? 1 - 0.5 * ib : 0.5 * ib;
};

/** Critical t value such that P(T <= t) = p, found by bisection. */
export const studentTInv = (p: number, df: number): number => {
  let lo = -100;
  let hi = 100;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (studentTCDF(mid, df) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

// ---------------------------------------------------------------------------
// Hypothesis tests
// ---------------------------------------------------------------------------

export interface PairedTTestResult {
  test: 'Paired t-test';
  n: number;
  meanDiff: number;
  sdDiff: number;
  se: number;
  t: number;
  df: number;
  pValue: number;
}

/** Two-sided paired t-test on the difference scores `diffs`. */
export const pairedTTest = (diffs: number[]): PairedTTestResult => {
  const n = diffs.length;
  const m = mean(diffs);
  const s = sd(diffs);
  const se = s / Math.sqrt(n);
  const t = se === 0 ? 0 : m / se;
  const df = n - 1;
  const pValue = 2 * (1 - studentTCDF(Math.abs(t), df));
  return { test: 'Paired t-test', n, meanDiff: m, sdDiff: s, se, t, df, pValue };
};

export interface WilcoxonResult {
  test: 'Wilcoxon signed-rank test';
  n: number;
  wPlus: number;
  z: number;
  pValue: number;
}

/** Wilcoxon signed-rank test with the normal approximation (suitable n >= 10). */
export const wilcoxonSignedRank = (diffs: number[]): WilcoxonResult => {
  const nonzero = diffs.filter((d) => d !== 0);
  const n = nonzero.length;
  const absSorted = nonzero
    .map((d) => ({ abs: Math.abs(d), sign: Math.sign(d) }))
    .sort((a, b) => a.abs - b.abs);
  // Assign ranks, averaging ties.
  const ranks: number[] = new Array(n).fill(0);
  let i = 0;
  while (i < n) {
    let j = i;
    while (j < n - 1 && absSorted[j + 1].abs === absSorted[i].abs) j++;
    const avgRank = (i + 1 + (j + 1)) / 2;
    for (let k = i; k <= j; k++) ranks[k] = avgRank;
    i = j + 1;
  }
  let wPlus = 0;
  for (let k = 0; k < n; k++) if (absSorted[k].sign > 0) wPlus += ranks[k];
  const meanW = (n * (n + 1)) / 4;
  const sdW = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
  const z = sdW === 0 ? 0 : (wPlus - meanW) / sdW;
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));
  return { test: 'Wilcoxon signed-rank test', n, wPlus, z, pValue };
};

/**
 * One-sided meaningful-change test (Appendix G, section 4.2).
 * H0: mean difference <= threshold.  H1: mean difference > threshold.
 */
export const meaningfulChangeTest = (
  diffs: number[],
  threshold: number,
): { t: number; df: number; pValue: number; passed: boolean } => {
  const n = diffs.length;
  const m = mean(diffs);
  const s = sd(diffs);
  const se = s / Math.sqrt(n);
  const t = se === 0 ? 0 : (m - threshold) / se;
  const df = n - 1;
  const pValue = 1 - studentTCDF(t, df);
  return { t, df, pValue, passed: pValue < 0.05 };
};

// ---------------------------------------------------------------------------
// Effect size & confidence interval
// ---------------------------------------------------------------------------

/** Cohen's d for paired data: mean gain divided by the SD of the gains. */
export const cohensD = (diffs: number[]): number => {
  const s = sd(diffs);
  return s === 0 ? 0 : mean(diffs) / s;
};

export const effectSizeLabel = (d: number): string => {
  const a = Math.abs(d);
  if (a < 0.2) return 'Negligible';
  if (a < 0.5) return 'Small';
  if (a < 0.8) return 'Medium';
  if (a < 1.1) return 'Large';
  return 'Very large';
};

/** 95% confidence interval for the mean difference. */
export const confidenceInterval95 = (
  diffs: number[],
): { low: number; high: number } => {
  const n = diffs.length;
  const m = mean(diffs);
  const se = sd(diffs) / Math.sqrt(n);
  const tCrit = studentTInv(0.975, n - 1);
  return { low: m - tCrit * se, high: m + tCrit * se };
};

// ---------------------------------------------------------------------------
// Normality test (Shapiro-Wilk)
// ---------------------------------------------------------------------------

/** Inverse of the standard normal CDF (Acklam's algorithm). */
export const qnorm = (p: number): number => {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416];
  const pLow = 0.02425;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= 1 - pLow) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
};

export interface ShapiroWilkResult {
  W: number;
  pValue: number;
  isNormal: boolean;
}

/**
 * Shapiro-Wilk test for normality (Royston 1992/1995, AS R94).
 * The null hypothesis is that the sample came from a normal distribution;
 * a p-value above 0.05 means normality is plausible.
 */
export const shapiroWilk = (xRaw: number[]): ShapiroWilkResult => {
  const n = xRaw.length;
  if (n < 3) return { W: 1, pValue: 1, isNormal: true };
  const x = [...xRaw].sort((a, b) => a - b);

  const poly = (cc: number[], v: number): number => {
    let res = cc[0];
    let vp = v;
    for (let j = 1; j < cc.length; j++) { res += cc[j] * vp; vp *= v; }
    return res;
  };

  const c1 = [0, 0.221157, -0.147981, -2.07119, 4.434685, -2.706056];
  const c2 = [0, 0.042981, -0.293762, -1.752461, 5.682633, -3.582633];
  const c3 = [0.544, -0.39978, 0.025054, -0.0006714];
  const c4 = [1.3822, -0.77857, 0.062767, -0.0020322];
  const c5 = [-1.5861, -0.31082, -0.083751, 0.0038915];
  const c6 = [-0.4803, -0.082676, 0.0030302];
  const g = [-2.273, 0.459];

  const an = n;
  const nn2 = Math.floor(n / 2);
  const a: number[] = new Array(nn2 + 1).fill(0); // 1-indexed weights

  if (n === 3) {
    a[1] = Math.sqrt(0.5);
  } else {
    const an25 = an + 0.25;
    let summ2 = 0;
    for (let i = 1; i <= nn2; i++) {
      a[i] = qnorm((i - 0.375) / an25);
      summ2 += a[i] * a[i];
    }
    summ2 *= 2;
    const ssumm2 = Math.sqrt(summ2);
    const rsn = 1 / Math.sqrt(an);
    const a1 = poly(c1, rsn) - a[1] / ssumm2;

    let i1: number;
    let fac: number;
    if (n > 5) {
      i1 = 3;
      const a2 = -a[2] / ssumm2 + poly(c2, rsn);
      fac = Math.sqrt((summ2 - 2 * a[1] * a[1] - 2 * a[2] * a[2]) /
        (1 - 2 * a1 * a1 - 2 * a2 * a2));
      a[1] = a1;
      a[2] = a2;
    } else {
      i1 = 2;
      fac = Math.sqrt((summ2 - 2 * a[1] * a[1]) / (1 - 2 * a1 * a1));
      a[1] = a1;
    }
    for (let i = i1; i <= nn2; i++) a[i] = -a[i] / fac;
  }

  const range = x[n - 1] - x[0];
  if (range < 1e-19) return { W: 1, pValue: 1, isNormal: true };

  // Antisymmetric weight for sorted position i (j is its mirror index).
  const weight = (i: number, j: number): number => {
    if (i === j) return 0;
    const k = Math.min(i, j) + 1;
    return i > j ? a[k] : -a[k];
  };

  let sa = 0;
  let sx = 0;
  for (let i = 0, j = n - 1; i < n; i++, j--) {
    sa += weight(i, j);
    sx += x[i] / range;
  }
  sa /= n;
  sx /= n;
  let ssa = 0;
  let ssx = 0;
  let sax = 0;
  for (let i = 0, j = n - 1; i < n; i++, j--) {
    const asa = weight(i, j) - sa;
    const xsx = x[i] / range - sx;
    ssa += asa * asa;
    ssx += xsx * xsx;
    sax += asa * xsx;
  }
  const ssassx = Math.sqrt(ssa * ssx);
  const w1 = ((ssassx - sax) * (ssassx + sax)) / (ssa * ssx);
  const W = 1 - w1;

  let pValue: number;
  if (n === 3) {
    const pi6 = 1.90985931710274;
    const stqr = 1.0471975511966;
    pValue = Math.max(0, Math.min(1, pi6 * (Math.asin(Math.sqrt(W)) - stqr)));
  } else {
    let y = Math.log(w1);
    let m: number;
    let s: number;
    if (n <= 11) {
      const gamma = poly(g, an);
      if (gamma - y <= 0) return { W, pValue: 1e-19, isNormal: false };
      y = -Math.log(gamma - y);
      m = poly(c3, an);
      s = Math.exp(poly(c4, an));
    } else {
      const xx = Math.log(an);
      m = poly(c5, xx);
      s = Math.exp(poly(c6, xx));
    }
    pValue = 1 - normalCDF((y - m) / s);
  }
  return { W, pValue, isNormal: pValue > 0.05 };
};

// ---------------------------------------------------------------------------
// Histogram helper
// ---------------------------------------------------------------------------

export interface HistogramBin {
  label: string;
  count: number;
}

/** Bin values into `targetBins` equal-width buckets for a gain-score histogram. */
export const histogram = (xs: number[], targetBins = 8): HistogramBin[] => {
  if (xs.length === 0) return [];
  const min = Math.min(...xs);
  const max = Math.max(...xs);
  if (max - min < 1e-9) {
    return [{ label: min.toFixed(1), count: xs.length }];
  }
  const width = (max - min) / targetBins;
  const bins: HistogramBin[] = [];
  for (let i = 0; i < targetBins; i++) {
    const lo = min + i * width;
    const hi = lo + width;
    const last = i === targetBins - 1;
    const count = xs.filter((x) => x >= lo && (last ? x <= hi + 1e-9 : x < hi)).length;
    bins.push({ label: lo.toFixed(1), count });
  }
  return bins;
};

export const formatP = (p: number): string => {
  if (p < 0.001) return 'p < 0.001';
  return `p = ${p.toFixed(3)}`;
};
