/**
 * Snapshot of the most recent AI scorer benchmark.
 *
 * Produced by the evaluation harness (`npm run eval`), which scores a gold
 * set of human-rated responses with the production scoring engine and
 * compares the AI scores against the human reference scores. The figures
 * below are transcribed from `eval/results.md`; re-run the harness and
 * update this file whenever the gold set or model changes.
 */

export interface ValidationRow {
  participant: string;
  stage: 'pre' | 'end' | 'refresher';
  human: number;
  aiRaw: number;
}

export interface ScorerValidation {
  model: string;
  generated: string;
  goldSetSize: number;
  raw: {
    exactMatch: number;
    within1: number;
    within2: number;
    mae: number;
    bias: number;
    pearson: number;
    spearman: number;
  };
  calibrated: {
    mae: number;
    within1: number;
    within2: number;
  };
  rows: ValidationRow[];
}

export const scorerValidation: ScorerValidation = {
  model: 'gpt-4o-mini',
  generated: '21 May 2026',
  goldSetSize: 30,
  raw: {
    exactMatch: 0.033,
    within1: 0.367,
    within2: 0.633,
    mae: 2.13,
    bias: -2.13,
    pearson: 0.872,
    spearman: 0.904,
  },
  calibrated: {
    mae: 1.05,
    within1: 0.5,
    within2: 0.9,
  },
  rows: [
    { participant: 'Alex Stanton', stage: 'pre', human: 7, aiRaw: 4 },
    { participant: 'Alex Stanton', stage: 'pre', human: 6, aiRaw: 3 },
    { participant: 'Alex Stanton', stage: 'end', human: 9, aiRaw: 8 },
    { participant: 'Alex Stanton', stage: 'end', human: 7, aiRaw: 2 },
    { participant: 'Alex Stanton', stage: 'refresher', human: 8, aiRaw: 8 },
    { participant: 'Alex Stanton', stage: 'refresher', human: 6, aiRaw: 3 },
    { participant: 'Mia Rojas', stage: 'pre', human: 3, aiRaw: 1 },
    { participant: 'Mia Rojas', stage: 'pre', human: 3, aiRaw: 1 },
    { participant: 'Mia Rojas', stage: 'end', human: 3, aiRaw: 1 },
    { participant: 'Mia Rojas', stage: 'end', human: 3, aiRaw: 1 },
    { participant: 'Mia Rojas', stage: 'refresher', human: 7, aiRaw: 6 },
    { participant: 'Mia Rojas', stage: 'refresher', human: 5, aiRaw: 2 },
    { participant: 'David Chen', stage: 'pre', human: 2, aiRaw: 1 },
    { participant: 'David Chen', stage: 'pre', human: 2, aiRaw: 1 },
    { participant: 'David Chen', stage: 'end', human: 2, aiRaw: 1 },
    { participant: 'David Chen', stage: 'end', human: 2, aiRaw: 1 },
    { participant: 'David Chen', stage: 'refresher', human: 4, aiRaw: 1 },
    { participant: 'David Chen', stage: 'refresher', human: 4, aiRaw: 1 },
    { participant: 'Sam Wilson', stage: 'pre', human: 7, aiRaw: 3 },
    { participant: 'Sam Wilson', stage: 'pre', human: 6, aiRaw: 4 },
    { participant: 'Sam Wilson', stage: 'end', human: 8, aiRaw: 6 },
    { participant: 'Sam Wilson', stage: 'end', human: 9, aiRaw: 5 },
    { participant: 'Sam Wilson', stage: 'refresher', human: 7, aiRaw: 4 },
    { participant: 'Sam Wilson', stage: 'refresher', human: 7, aiRaw: 3 },
    { participant: 'Jordan Lee', stage: 'pre', human: 2, aiRaw: 1 },
    { participant: 'Jordan Lee', stage: 'pre', human: 2, aiRaw: 1 },
    { participant: 'Jordan Lee', stage: 'end', human: 3, aiRaw: 1 },
    { participant: 'Jordan Lee', stage: 'end', human: 3, aiRaw: 1 },
    { participant: 'Jordan Lee', stage: 'refresher', human: 2, aiRaw: 1 },
    { participant: 'Jordan Lee', stage: 'refresher', human: 2, aiRaw: 1 },
  ],
};
