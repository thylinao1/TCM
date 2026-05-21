# LLM Scorer Evaluation Report

Generated: 2026-05-21T01:49:20.234Z
Model: `gpt-4o-mini`
Gold set size: 30 human-scored responses

## Agreement with human reference scores

| Metric | Value |
| --- | --- |
| Exact-match accuracy | 3.3% |
| Within ±1 accuracy | 36.7% |
| Within ±2 accuracy | 63.3% |
| Mean absolute error | 2.13 points |
| Bias (AI − human) | -2.13 points |
| Pearson correlation | 0.872 |
| Spearman correlation | 0.904 |

## After leave-one-out linear calibration

Fitted calibration: `human ≈ 0.983 × ai + 2.176`. Metrics below are leave-one-out cross-validated, so the calibration is never evaluated on the point it was fitted with.

| Metric | Value |
| --- | --- |
| Calibrated mean absolute error | 1.05 points |
| Calibrated within ±1 accuracy | 50.0% |
| Calibrated within ±2 accuracy | 90.0% |

## Per-response results

| Response | Participant | Stage | Human | AI | Δ |
| --- | --- | --- | --- | --- | --- |
| resp-pre-1:1 | Alex Stanton | pre | 7 | 4 | -3 |
| resp-pre-1:2 | Alex Stanton | pre | 6 | 3 | -3 |
| resp-end-1:1 | Alex Stanton | end | 9 | 8 | -1 |
| resp-end-1:2 | Alex Stanton | end | 7 | 2 | -5 |
| resp-ref-1:1 | Alex Stanton | refresher | 8 | 8 | +0 |
| resp-ref-1:2 | Alex Stanton | refresher | 6 | 3 | -3 |
| resp-pre-2:1 | Mia Rojas | pre | 3 | 1 | -2 |
| resp-pre-2:2 | Mia Rojas | pre | 3 | 1 | -2 |
| resp-end-2:1 | Mia Rojas | end | 3 | 1 | -2 |
| resp-end-2:2 | Mia Rojas | end | 3 | 1 | -2 |
| resp-ref-2:1 | Mia Rojas | refresher | 7 | 6 | -1 |
| resp-ref-2:2 | Mia Rojas | refresher | 5 | 2 | -3 |
| resp-pre-3:1 | David Chen | pre | 2 | 1 | -1 |
| resp-pre-3:2 | David Chen | pre | 2 | 1 | -1 |
| resp-end-3:1 | David Chen | end | 2 | 1 | -1 |
| resp-end-3:2 | David Chen | end | 2 | 1 | -1 |
| resp-ref-3:1 | David Chen | refresher | 4 | 1 | -3 |
| resp-ref-3:2 | David Chen | refresher | 4 | 1 | -3 |
| resp-pre-4:1 | Sam Wilson | pre | 7 | 3 | -4 |
| resp-pre-4:2 | Sam Wilson | pre | 6 | 4 | -2 |
| resp-end-4:1 | Sam Wilson | end | 8 | 6 | -2 |
| resp-end-4:2 | Sam Wilson | end | 9 | 5 | -4 |
| resp-ref-4:1 | Sam Wilson | refresher | 7 | 4 | -3 |
| resp-ref-4:2 | Sam Wilson | refresher | 7 | 3 | -4 |
| resp-pre-5:1 | Jordan Lee | pre | 2 | 1 | -1 |
| resp-pre-5:2 | Jordan Lee | pre | 2 | 1 | -1 |
| resp-end-5:1 | Jordan Lee | end | 3 | 1 | -2 |
| resp-end-5:2 | Jordan Lee | end | 3 | 1 | -2 |
| resp-ref-5:1 | Jordan Lee | refresher | 2 | 1 | -1 |
| resp-ref-5:2 | Jordan Lee | refresher | 2 | 1 | -1 |
