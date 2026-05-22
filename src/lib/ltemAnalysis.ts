// LTEM evaluation analysis.
//
// Takes the raw survey responses for a session and produces a complete,
// client-ready statistical evaluation following Appendix G of the LTEM
// Playbook. The L&D professional never runs any of this by hand; the
// Evaluation Report view simply renders whatever this function returns.

import type { Session, SurveyResponse } from '../types';
import {
  mean,
  sd,
  median,
  skewness,
  pairedTTest,
  wilcoxonSignedRank,
  meaningfulChangeTest,
  cohensD,
  effectSizeLabel,
  confidenceInterval95,
  histogram,
  shapiroWilk,
  type PairedTTestResult,
  type WilcoxonResult,
  type HistogramBin,
} from './stats';

// The two open-ended scenario questions carry the Tier 5 decision-making
// score (graded 0-10 by the AI scorer and stored as an [AI_SCORE: n] tag).
const SCENARIO_QIDS = ['1', '2'];

// Meaningful-change threshold, agreed at the scoping consultation BEFORE any
// data is collected: pre-scores were expected near 3/10, the target is the
// Tier 5 decision-making boundary at 5/10, so X = 5 - 3 = 2 points.
export const MEANINGFUL_CHANGE_THRESHOLD = 2.0;
export const TIER5_BOUNDARY = 5.0;

/** Mean of the 0-10 AI scores on the scenario questions of one response. */
const scenarioScore = (resp: SurveyResponse): number | null => {
  const scores: number[] = [];
  for (const qid of SCENARIO_QIDS) {
    const ans = resp.answers[qid];
    if (typeof ans === 'string') {
      const m = ans.match(/\[AI_SCORE:\s*(\d+(?:\.\d+)?)\]/);
      if (m) scores.push(parseFloat(m[1]));
    }
  }
  return scores.length > 0 ? mean(scores) : null;
};

export interface LearnerRecord {
  name: string;
  email: string;
  pre: number | null;
  end: number | null;
  refresher: number | null;
  gain: number | null;
}

export interface LtemReport {
  hasData: boolean;
  // Cohort / completeness
  enrolled: number;
  matched: number;
  completionRate: number;
  learners: LearnerRecord[];
  // Descriptives
  meanPre: number;
  meanEnd: number;
  medianPre: number;
  medianEnd: number;
  meanGain: number;
  sdGain: number;
  maxEnd: number;
  pctImproved: number;
  diffs: number[];
  // Distribution check
  skew: number;
  isNormal: boolean;
  shapiroW: number;
  shapiroP: number;
  histogram: HistogramBin[];
  // Test selection + result
  designName: string;
  testName: string;
  testReason: string;
  tTest: PairedTTestResult;
  wilcoxon: WilcoxonResult;
  pValue: number;
  significant: boolean;
  // Effect size + CI
  d: number;
  dLabel: string;
  ci: { low: number; high: number };
  // Meaningful-change test
  threshold: number;
  meaningful: { t: number; df: number; pValue: number; passed: boolean };
  // Calibration
  floorOk: boolean;
  ceilingOk: boolean;
  // Retention (end -> refresher)
  retention: { matched: number; meanEnd: number; meanRefresher: number; retained: number } | null;
  // Plain-language summary
  headline: string;
}

export const buildLtemReport = (session: Session): LtemReport => {
  const byStage = (stage: 'pre' | 'end' | 'refresher') =>
    session.responses.filter((r) => r.stage === stage);

  const pre = byStage('pre');
  const end = byStage('end');
  const refresher = byStage('refresher');

  // Build one record per learner, keyed on email (falling back to name).
  const key = (r: SurveyResponse) => (r.participantEmail || r.participantName || '').toLowerCase();
  const names = new Map<string, { name: string; email: string }>();
  for (const r of session.responses) {
    const k = key(r);
    if (k && !names.has(k)) {
      names.set(k, { name: r.participantName || 'Learner', email: r.participantEmail || '' });
    }
  }

  const learners: LearnerRecord[] = [];
  for (const [k, info] of names) {
    const p = pre.find((r) => key(r) === k);
    const e = end.find((r) => key(r) === k);
    const f = refresher.find((r) => key(r) === k);
    const preScore = p ? scenarioScore(p) : null;
    const endScore = e ? scenarioScore(e) : null;
    const refScore = f ? scenarioScore(f) : null;
    learners.push({
      name: info.name,
      email: info.email,
      pre: preScore,
      end: endScore,
      refresher: refScore,
      gain: preScore !== null && endScore !== null ? endScore - preScore : null,
    });
  }

  const matchedLearners = learners.filter((l) => l.pre !== null && l.end !== null);
  const enrolled = Math.max(names.size, pre.length, end.length);
  const matched = matchedLearners.length;

  const empty: LtemReport = {
    hasData: false,
    enrolled,
    matched,
    completionRate: 0,
    learners,
    meanPre: 0,
    meanEnd: 0,
    medianPre: 0,
    medianEnd: 0,
    meanGain: 0,
    sdGain: 0,
    maxEnd: 0,
    pctImproved: 0,
    diffs: [],
    skew: 0,
    isNormal: true,
    shapiroW: 1,
    shapiroP: 1,
    histogram: [],
    designName: 'Pre-Post (single group)',
    testName: '-',
    testReason: '',
    tTest: { test: 'Paired t-test', n: 0, meanDiff: 0, sdDiff: 0, se: 0, t: 0, df: 0, pValue: 1 },
    wilcoxon: { test: 'Wilcoxon signed-rank test', n: 0, wPlus: 0, z: 0, pValue: 1 },
    pValue: 1,
    significant: false,
    d: 0,
    dLabel: 'Negligible',
    ci: { low: 0, high: 0 },
    threshold: MEANINGFUL_CHANGE_THRESHOLD,
    meaningful: { t: 0, df: 0, pValue: 1, passed: false },
    floorOk: false,
    ceilingOk: false,
    retention: null,
    headline: 'Not enough matched pre and post responses to run an analysis yet.',
  };

  if (matched < 3) return empty;

  const preScores = matchedLearners.map((l) => l.pre as number);
  const endScores = matchedLearners.map((l) => l.end as number);
  const diffs = matchedLearners.map((l) => l.gain as number);

  const meanPre = mean(preScores);
  const meanEnd = mean(endScores);
  const meanGain = mean(diffs);
  const sdGain = sd(diffs);
  const pctImproved = (diffs.filter((d) => d > 0).length / diffs.length) * 100;
  const skew = skewness(diffs);
  // Formal normality test (Shapiro-Wilk) on the gain scores.
  const shapiro = shapiroWilk(diffs);
  const isNormal = matched >= 25 && shapiro.isNormal;

  const tTest = pairedTTest(diffs);
  const wilcoxon = wilcoxonSignedRank(diffs);

  // Test selection follows the Appendix G decision rule.
  let testName: string;
  let testReason: string;
  let pValue: number;
  const swText =
    `the Shapiro-Wilk normality test gives W = ${shapiro.W.toFixed(3)}, ` +
    `p = ${shapiro.pValue < 0.001 ? 'below 0.001' : shapiro.pValue.toFixed(3)}`;
  if (matched >= 25 && isNormal) {
    testName = 'Paired t-test';
    testReason =
      `The sample is 25 or larger and ${swText}, which is above 0.05, so ` +
      'normality is plausible and the paired t-test applies.';
    pValue = tTest.pValue;
  } else {
    testName = 'Wilcoxon signed-rank test';
    testReason =
      matched < 25
        ? 'The sample is smaller than 25, so the non-parametric Wilcoxon ' +
          'signed-rank test is the safer choice.'
        : `${swText.charAt(0).toUpperCase()}${swText.slice(1)}, which is at or ` +
          'below 0.05, so normality is doubtful and the non-parametric ' +
          'Wilcoxon signed-rank test is the safer choice.';
    pValue = wilcoxon.pValue;
  }

  const d = cohensD(diffs);
  const ci = confidenceInterval95(diffs);
  const meaningful = meaningfulChangeTest(diffs, MEANINGFUL_CHANGE_THRESHOLD);

  const maxEnd = Math.max(...endScores);
  const floorOk = meanPre >= 1.5 && meanPre <= 4;
  const ceilingOk = meanEnd <= 8 && maxEnd < 10;

  // Retention: learners with both an end and a refresher score.
  const retLearners = learners.filter((l) => l.end !== null && l.refresher !== null);
  const retention =
    retLearners.length >= 3
      ? {
          matched: retLearners.length,
          meanEnd: mean(retLearners.map((l) => l.end as number)),
          meanRefresher: mean(retLearners.map((l) => l.refresher as number)),
          retained:
            (mean(retLearners.map((l) => l.refresher as number)) /
              mean(retLearners.map((l) => l.end as number))) *
            100,
        }
      : null;

  const significant = pValue < 0.05;
  const headline = significant
    ? `The training produced a ${effectSizeLabel(d).toLowerCase()} and statistically reliable ` +
      `improvement in learners' decision-making (average gain of ${meanGain.toFixed(1)} points ` +
      `on a 0 to 10 scale). We can be 95% confident the true average gain lies between ` +
      `${ci.low.toFixed(1)} and ${ci.high.toFixed(1)} points.`
    : `Learners improved on average by ${meanGain.toFixed(1)} points, but with this sample ` +
      `the change cannot yet be distinguished from chance. A larger cohort is needed.`;

  return {
    hasData: true,
    enrolled,
    matched,
    completionRate: enrolled > 0 ? (matched / enrolled) * 100 : 0,
    learners,
    meanPre,
    meanEnd,
    medianPre: median(preScores),
    medianEnd: median(endScores),
    meanGain,
    sdGain,
    maxEnd,
    pctImproved,
    diffs,
    skew,
    isNormal,
    shapiroW: shapiro.W,
    shapiroP: shapiro.pValue,
    histogram: histogram(diffs),
    designName: 'Pre-Post (single group)',
    testName,
    testReason,
    tTest,
    wilcoxon,
    pValue,
    significant,
    d,
    dLabel: effectSizeLabel(d),
    ci,
    threshold: MEANINGFUL_CHANGE_THRESHOLD,
    meaningful,
    floorOk,
    ceilingOk,
    retention,
    headline,
  };
};
