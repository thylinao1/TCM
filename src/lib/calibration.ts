/**
 * Linear calibration applied to the raw LLM score.
 *
 * The evaluation harness (`npm run eval`) found that the raw model scores
 * correlate strongly with human reference scores but sit about two points
 * low. These coefficients (`human ~= slope * ai + intercept`) come from the
 * latest leave-one-out cross-validated fit recorded in `eval/results.md`.
 * Re-run the harness and update them whenever the gold set grows.
 *
 * This is the single source of truth for the calibration: it is imported by
 * the `/api/score` endpoint (applied to every live score) and by the AI
 * Scorer Validation page (to show the corrected agreement).
 */

export const CALIBRATION_SLOPE = 0.983;
export const CALIBRATION_INTERCEPT = 2.176;

/** Maps a raw 0-10 model score onto the human reference scale. */
export const calibrate = (rawScore: number): number =>
  Math.max(
    0,
    Math.min(10, Math.round(CALIBRATION_SLOPE * rawScore + CALIBRATION_INTERCEPT)),
  );
