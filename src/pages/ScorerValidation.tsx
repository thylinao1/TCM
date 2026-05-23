import { Link } from 'react-router-dom';
import { scorerValidation } from '../data/scorerValidation';
import { calibrate, CALIBRATION_SLOPE, CALIBRATION_INTERCEPT } from '../lib/calibration';
import {
  ArrowLeft, Sparkles, Target, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight,
} from 'lucide-react';

/**
 * AI Scorer Validation.
 *
 * Surfaces the benchmark from the evaluation harness: how closely the AI
 * scorer agrees with human reference scores, before and after calibration.
 * Read-only and linkable, so it can be shared as evidence that the scorer
 * is checked against people, not trusted blindly.
 */

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export default function ScorerValidation() {
  const v = scorerValidation;
  const rows = v.rows.map((r) => {
    const aiCal = calibrate(r.aiRaw);
    return { ...r, aiCal, deltaRaw: r.aiRaw - r.human, deltaCal: aiCal - r.human };
  });

  // Scatter geometry: 0-10 on both axes inside a square plot.
  const P = 300; // plot size in svg units
  const M = 44; // margin for axis labels
  const toX = (val: number) => M + (val / 10) * P;
  const toY = (val: number) => M + P - (val / 10) * P;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">

      <div>
        <Link to="/" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium mb-4 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Sessions
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Scorer Validation</h1>
        <p className="text-slate-500 mt-2 max-w-2xl">
          Evidence that the AI scorer agrees with human markers. The scorer is benchmarked
          against a gold set of human-scored responses, and the agreement is measured.
        </p>
      </div>

      {/* Intro */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl -mr-24 -mt-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-indigo-300" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-200">How the scorer is checked</h2>
          </div>
          <p className="text-lg leading-relaxed max-w-3xl">
            Two people will not score an open answer identically, so the AI is held to the
            same standard as a human marker. It scored {v.goldSetSize} responses that had
            already been scored by the TCM evaluation team, and its scores were compared
            against those human reference scores.
          </p>
          <p className="mt-3 text-sm text-indigo-200">
            Model: <span className="font-mono">{v.model}</span> &middot; Gold set:{' '}
            {v.goldSetSize} human-scored responses &middot; Last run: {v.generated}
          </p>
        </div>
      </div>

      {/* Raw agreement */}
      <Section icon={<Target size={18} />} title="Raw agreement with human scores" subtitle="The AI scorer before any correction">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="Within 1 point" value={pct(v.raw.within1)} />
          <Metric label="Within 2 points" value={pct(v.raw.within2)} />
          <Metric label="Mean error" value={`${v.raw.mae.toFixed(2)} pts`} />
          <Metric label="Correlation (Pearson)" value={v.raw.pearson.toFixed(2)} />
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700">
            The pattern is clear and useful: a correlation of {v.raw.pearson.toFixed(2)} means
            the AI ranks strong and weak answers almost exactly as a human would. But it is
            consistently harsh, scoring on average{' '}
            <span className="font-bold">{Math.abs(v.raw.bias).toFixed(1)} points low</span>{' '}
            (bias {v.raw.bias.toFixed(2)}). A consistent offset like that is easy to correct.
          </p>
        </div>
      </Section>

      {/* Calibration */}
      <Section icon={<TrendingUp size={18} />} title="After calibration" subtitle="Correcting the systematic offset">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Because the gap is a steady offset, a simple linear correction fixes it:{' '}
          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[13px]">
            human &asymp; {CALIBRATION_SLOPE} &times; ai + {CALIBRATION_INTERCEPT}
          </span>
          . It is fitted with leave-one-out cross-validation, so the correction is never
          tested on the same response it was learned from. Every live AI score on the
          platform passes through this step automatically.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CompareCard label="Mean error" before={`${v.raw.mae.toFixed(2)} pts`} after={`${v.calibrated.mae.toFixed(2)} pts`} />
          <CompareCard label="Within 1 point" before={pct(v.raw.within1)} after={pct(v.calibrated.within1)} />
          <CompareCard label="Within 2 points" before={pct(v.raw.within2)} after={pct(v.calibrated.within2)} />
        </div>
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700">
            After calibration the AI lands within two points of the human score{' '}
            <span className="font-bold">{pct(v.calibrated.within2)}</span> of the time, with an
            average error of about <span className="font-bold">one point</span> on the 0 to 10
            scale, which is within the range two human markers would differ from each other.
          </p>
        </div>
      </Section>

      {/* Scatter */}
      <Section icon={<Target size={18} />} title="Human score vs AI score" subtitle="Each dot is one response; the diagonal is perfect agreement">
        <div className="flex justify-center">
          <svg viewBox={`0 0 ${P + M + 20} ${P + M + 30}`} className="w-full max-w-md">
            {/* gridlines */}
            {[0, 2, 4, 6, 8, 10].map((g) => (
              <g key={g}>
                <line x1={toX(g)} y1={toY(0)} x2={toX(g)} y2={toY(10)} stroke="#E2E8F0" strokeWidth="1" />
                <line x1={toX(0)} y1={toY(g)} x2={toX(10)} y2={toY(g)} stroke="#E2E8F0" strokeWidth="1" />
                <text x={toX(g)} y={toY(0) + 16} textAnchor="middle" fontSize="9" fill="#94A3B8">{g}</text>
                <text x={toX(0) - 8} y={toY(g) + 3} textAnchor="end" fontSize="9" fill="#94A3B8">{g}</text>
              </g>
            ))}
            {/* perfect-agreement diagonal */}
            <line x1={toX(0)} y1={toY(0)} x2={toX(10)} y2={toY(10)} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3" />
            {/* raw points */}
            {rows.map((r, i) => {
              const jx = ((i % 5) - 2) * 0.12;
              const jy = ((i % 3) - 1) * 0.12;
              return (
                <circle key={`raw-${i}`} cx={toX(r.human + jx)} cy={toY(r.aiRaw + jy)} r="4"
                  fill="#6366F1" fillOpacity="0.35" />
              );
            })}
            {/* calibrated points */}
            {rows.map((r, i) => {
              const jx = ((i % 5) - 2) * 0.12;
              const jy = ((i % 3) - 1) * 0.12;
              return (
                <circle key={`cal-${i}`} cx={toX(r.human + jx)} cy={toY(r.aiCal + jy)} r="4"
                  fill="#10B981" fillOpacity="0.7" />
              );
            })}
            {/* axis titles */}
            <text x={toX(5)} y={P + M + 26} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">
              Human reference score
            </text>
            <text x={14} y={toY(5)} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold"
              transform={`rotate(-90 14 ${toY(5)})`}>
              AI score
            </text>
          </svg>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <span className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="w-3 h-3 rounded-full" style={{ background: '#6366F1', opacity: 0.5 }} /> Raw AI score
          </span>
          <span className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} /> Calibrated AI score
          </span>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
          The green dots sit much closer to the diagonal: calibration pulls the AI scores onto
          the human scale.
        </p>
      </Section>

      {/* Per-response table */}
      <Section icon={<Target size={18} />} title="Every benchmarked response" subtitle={`All ${v.goldSetSize} gold-set responses`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="text-left py-2.5 px-3">Learner</th>
                <th className="text-left py-2.5 px-3">Stage</th>
                <th className="text-center py-2.5 px-3">Human</th>
                <th className="text-center py-2.5 px-3">AI raw</th>
                <th className="text-center py-2.5 px-3">AI calibrated</th>
                <th className="text-center py-2.5 px-3">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium text-slate-700">{r.participant}</td>
                  <td className="py-2 px-3 text-slate-500 capitalize">{r.stage}</td>
                  <td className="py-2 px-3 text-center font-semibold text-slate-900">{r.human}</td>
                  <td className="py-2 px-3 text-center text-slate-400">{r.aiRaw}</td>
                  <td className="py-2 px-3 text-center font-semibold text-indigo-600">{r.aiCal}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`font-bold ${Math.abs(r.deltaCal) <= 1 ? 'text-emerald-600' : Math.abs(r.deltaCal) <= 2 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {r.deltaCal > 0 ? '+' : ''}{r.deltaCal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
          <ArrowRight size={13} /> Difference is the calibrated AI score minus the human score.
          Green is within 1 point, amber within 2, red beyond.
        </p>
      </Section>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="font-bold text-slate-900 mb-2">Why this matters</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          The AI never scores in the dark. It is measured against human markers, the gap is
          quantified, and a published correction closes it. This page is regenerated whenever
          the benchmark is re-run, so the agreement figures stay honest as the gold set grows.
          It is the difference between asking a client to trust a black box and showing them
          exactly how far the scorer can be trusted.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Presentational helpers
// ---------------------------------------------------------------------------

function Section({ icon, title, subtitle, children }: {
  icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{label}</div>
    </div>
  );
}

function CompareCard({ label, before, after }: { label: string; before: string; after: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-slate-400 line-through text-sm">{before}</span>
        <ArrowRight size={14} className="text-slate-400" />
        <span className="text-emerald-600 font-black text-lg">{after}</span>
      </div>
    </div>
  );
}
