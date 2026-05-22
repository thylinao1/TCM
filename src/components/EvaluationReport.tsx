import { useMemo } from 'react';
import type { Session } from '../types';
import { buildLtemReport, TIER5_BOUNDARY } from '../lib/ltemAnalysis';
import { formatP } from '../lib/stats';
import {
  Sparkles, Users, CheckCircle2, AlertTriangle, TrendingUp, Target,
  BarChart3, GitBranch, Ruler, FlaskConical, FileText, ArrowRight,
} from 'lucide-react';

/**
 * The Statistical Evaluation Report.
 *
 * This is the view an L&D professional opens after a cohort has completed
 * its forms. Every number here is computed automatically by the platform
 * the moment responses arrive. The user runs no tests and sees no formulas;
 * they read a finished, client-ready result.
 */
export default function EvaluationReport({ session }: { session: Session }) {
  const r = useMemo(() => buildLtemReport(session), [session]);

  if (!r.hasData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center py-24 text-center animate-in fade-in">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <FileText size={32} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Report not ready yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto">{r.headline}</p>
      </div>
    );
  }

  const maxBin = Math.max(...r.histogram.map((b) => b.count), 1);
  const stageMax = Math.max(r.meanPre, r.meanEnd, r.retention?.meanRefresher ?? 0, 10);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">

      {/* ============ HEADLINE ============ */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl -mr-24 -mt-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-indigo-300" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-200">
              Evaluation Report &middot; Generated Automatically
            </h2>
          </div>
          <p className="text-2xl font-bold leading-snug max-w-3xl">{r.headline}</p>
          <p className="mt-4 text-sm text-indigo-200 max-w-3xl leading-relaxed">
            This page was produced by the platform with no manual statistics. The trainer
            opens the tab and the finished result is already here. The methods below follow
            the LTEM Statistical Methodology Guide (Appendix G).
          </p>
        </div>
      </div>

      {/* ============ COHORT / COMPLETENESS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users size={18} />} label="Learners enrolled" value={String(r.enrolled)} tone="slate" />
        <StatCard icon={<CheckCircle2 size={18} />} label="Completed both forms" value={String(r.matched)} tone="indigo" />
        <StatCard icon={<TrendingUp size={18} />} label="Completion rate" value={`${r.completionRate.toFixed(0)}%`} tone="emerald" />
        <StatCard icon={<BarChart3 size={18} />} label="Improved pre to post" value={`${r.pctImproved.toFixed(0)}%`} tone="violet" />
      </div>

      {/* ============ DESIGN CHOICE ============ */}
      <Section icon={<GitBranch size={18} />} title="Evaluation design" subtitle="Chosen at scoping, before any data was collected">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          The platform follows the three-question decision rule in Appendix G to pick the
          right design. For routine commercial delivery the answer is the Pre-Post design:
          the same learners are measured before and after training.
        </p>
        <div className="space-y-2">
          <DecisionStep q="Two comparable, untrained groups of 12 or more available?" a="No" note="Single training cohort; no waitlist or comparison team." />
          <DecisionStep q="Can learners be randomly assigned to train now vs. later?" a="No" note="The client needs the whole cohort trained on schedule." />
          <DecisionStep q="Is a natural comparison group available?" a="No" note="No equivalent untrained team to compare against." />
        </div>
        <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700">
            <span className="font-bold text-indigo-700">Design used: {r.designName}.</span>{' '}
            Each learner answers a scenario before training and a matched (cloned) scenario
            after. Because the same person is measured twice, stable individual differences
            cancel out and the gain score isolates the training effect.
          </p>
        </div>
      </Section>

      {/* ============ DESCRIPTIVES ============ */}
      <Section icon={<BarChart3 size={18} />} title="Decision-making score, before vs after" subtitle="Tier 5 scenario score, 0 to 10 scale">
        <div className="space-y-4">
          <ScoreBar label="What You Know (before)" value={r.meanPre} max={stageMax} color="bg-slate-400" />
          <ScoreBar label="What You Learnt (after)" value={r.meanEnd} max={stageMax} color="bg-indigo-600" />
          {r.retention && (
            <ScoreBar label="What You Did (refresher)" value={r.retention.meanRefresher} max={stageMax} color="bg-violet-500" />
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <MiniStat label="Mean before" value={r.meanPre.toFixed(2)} />
          <MiniStat label="Mean after" value={r.meanEnd.toFixed(2)} />
          <MiniStat label="Average gain" value={`+${r.meanGain.toFixed(2)}`} highlight />
          <MiniStat label="Spread of gains (SD)" value={r.sdGain.toFixed(2)} />
        </div>
      </Section>

      {/* ============ DISTRIBUTION CHECK ============ */}
      <Section icon={<BarChart3 size={18} />} title="Distribution check" subtitle="Which statistical test applies">
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          Before choosing a test, the platform inspects the shape of the gain scores. A
          roughly symmetric, mound-shaped pattern allows the paired t-test; a lopsided
          pattern calls for the Wilcoxon test instead.
        </p>
        <div className="flex items-end gap-2 h-44 mb-2">
          {r.histogram.map((b) => (
            <div key={b.label} className="flex-1 h-full flex flex-col justify-end items-center gap-1">
              <span className="text-xs font-bold text-slate-500">{b.count}</span>
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-700"
                style={{ height: `${Math.max((b.count / maxBin) * 88, b.count > 0 ? 4 : 0)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {r.histogram.map((b) => (
            <span key={b.label} className="flex-1 text-center text-[10px] text-slate-400 font-medium">
              {b.label}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-1">Gain score (points improved, post minus pre)</p>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <MiniStat label="Skewness" value={r.skew.toFixed(2)} />
          <MiniStat label="Distribution" value={r.isNormal ? 'Approx. normal' : 'Skewed'} />
          <MiniStat label="Sample size" value={String(r.matched)} />
        </div>
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <FlaskConical size={18} className="text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700">
            <span className="font-bold text-slate-900">Test selected: {r.testName}.</span> {r.testReason}
          </p>
        </div>
      </Section>

      {/* ============ TEST RESULT ============ */}
      <Section icon={<FlaskConical size={18} />} title="Statistical test result" subtitle="Is the improvement real, or could it be chance?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultBox label="Test used" value={r.testName} />
          <ResultBox
            label={r.testName === 'Paired t-test' ? 'Test statistic (t)' : 'Test statistic (z)'}
            value={(r.testName === 'Paired t-test' ? r.tTest.t : r.wilcoxon.z).toFixed(2)}
          />
          <ResultBox label="p-value" value={formatP(r.pValue)} />
        </div>
        <div className={`mt-4 rounded-xl p-5 flex items-start gap-3 ${r.significant ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
          {r.significant
            ? <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
            : <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />}
          <div>
            <p className={`font-bold ${r.significant ? 'text-emerald-800' : 'text-amber-800'}`}>
              {r.significant ? 'Statistically significant improvement' : 'Not statistically significant'}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {r.significant
                ? `A p-value of ${r.pValue < 0.001 ? 'under 0.001' : r.pValue.toFixed(3)} means an improvement this large would almost never happen by chance alone. The change is real.`
                : 'With this sample the improvement cannot be reliably distinguished from chance. Pooling more cohorts would increase the power to detect it.'}
            </p>
          </div>
        </div>
      </Section>

      {/* ============ EFFECT SIZE ============ */}
      <Section icon={<Ruler size={18} />} title="Effect size" subtitle="Not just whether it changed, but how much">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center shrink-0">
            <div className="text-6xl font-black text-indigo-600 tracking-tighter">{r.d.toFixed(2)}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cohen&rsquo;s d</div>
            <div className="mt-2 inline-block bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
              {r.dLabel} effect
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative h-9 bg-slate-100 rounded-full overflow-hidden">
              {[0.2, 0.5, 0.8].map((mark) => (
                <div key={mark} className="absolute top-0 bottom-0 w-px bg-slate-300" style={{ left: `${(mark / 1.6) * 100}%` }} />
              ))}
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((Math.abs(r.d) / 1.6) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1.5 px-1">
              <span>0</span><span>0.2 small</span><span>0.5 medium</span><span>0.8 large</span><span>1.6+</span>
            </div>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              An effect of this size means a typical learner who was around the middle of the
              group before training now answers scenarios better than most of the group did
              beforehand. It is a clearly visible shift in capability, not a marginal one.
            </p>
          </div>
        </div>
      </Section>

      {/* ============ CONFIDENCE INTERVAL ============ */}
      <Section icon={<Target size={18} />} title="95% confidence interval" subtitle="How precise is the estimate of the gain?">
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          The average gain measured here is {r.meanGain.toFixed(2)} points. The confidence
          interval gives the range the true average gain most plausibly falls within. It is
          where the platform reports honestly how much variability there is in the data.
        </p>
        <CiBar low={r.ci.low} high={r.ci.high} mean={r.meanGain} />
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          {r.ci.low > 0
            ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            : <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />}
          <p className="text-sm text-slate-700">
            We can be 95% confident the true average gain is between{' '}
            <span className="font-bold">{r.ci.low.toFixed(2)}</span> and{' '}
            <span className="font-bold">{r.ci.high.toFixed(2)}</span> points.{' '}
            {r.ci.low > 0
              ? 'Because the whole range sits above zero, the improvement is real and not sampling noise.'
              : 'Because the range includes zero, a larger sample is needed to be confident.'}
          </p>
        </div>
      </Section>

      {/* ============ MEANINGFUL CHANGE ============ */}
      <Section icon={<Target size={18} />} title="Meaningful-change test" subtitle="Beyond significance: was the change big enough to matter?">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          A change can be statistically significant yet too small to matter commercially.
          This second test asks a tougher question, agreed with the client at scoping: did
          learners gain more than {r.threshold.toFixed(1)} points? That threshold is the
          movement needed to cross from a pre-competent baseline into the Tier 5
          decision-making competence band (the boundary sits at {TIER5_BOUNDARY.toFixed(0)} out of 10).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <ResultBox label="Threshold to beat (X)" value={`${r.threshold.toFixed(1)} pts`} />
          <ResultBox label="Average gain observed" value={`${r.meanGain.toFixed(2)} pts`} />
          <ResultBox label="One-sided p-value" value={formatP(r.meaningful.pValue)} />
        </div>
        <div className={`rounded-xl p-5 flex items-start gap-3 ${r.meaningful.passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
          {r.meaningful.passed
            ? <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
            : <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />}
          <div>
            <p className={`font-bold ${r.meaningful.passed ? 'text-emerald-800' : 'text-amber-800'}`}>
              {r.meaningful.passed
                ? 'The improvement is meaningful, not just statistically detectable'
                : 'Improvement detected, but below the agreed meaningful threshold'}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {r.meaningful.passed
                ? 'The cohort gained more than the agreed threshold, so the training moved learners across a tier boundary that the client recognises as real progress.'
                : 'The cohort improved, but not yet by the margin agreed as commercially meaningful.'}
            </p>
          </div>
        </div>
      </Section>

      {/* ============ CALIBRATION ============ */}
      <Section icon={<Ruler size={18} />} title="Form calibration check" subtitle="Were the questions well pitched?">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          For the comparison to be trustworthy, the questions must not be so hard everyone
          scores zero, nor so easy everyone scores full marks. The platform checks both.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalibrationCard
            ok={r.floorOk}
            title="Floor check (before-scores)"
            detail={`Mean before-score is ${r.meanPre.toFixed(2)}. Target is roughly 2 to 3, leaving room to show improvement.`}
          />
          <CalibrationCard
            ok={r.ceilingOk}
            title="Ceiling check (after-scores)"
            detail={`Mean after-score is ${r.meanEnd.toFixed(2)} and the highest individual score is ${r.maxEnd.toFixed(0)}. Target is 5 to 8 with nobody hitting the maximum.`}
          />
        </div>
      </Section>

      {/* ============ RETENTION ============ */}
      {r.retention && (
        <Section icon={<TrendingUp size={18} />} title="Retention at the refresher" subtitle="Did the gain hold up months later?">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultBox label="Score at end of course" value={r.retention.meanEnd.toFixed(2)} />
            <ResultBox label="Score at refresher" value={r.retention.meanRefresher.toFixed(2)} />
            <ResultBox label="Retained" value={`${r.retention.retained.toFixed(0)}%`} />
          </div>
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            Measuring again after a realistic delay is the strongest part of the LTEM
            picture. A score that holds near the end-of-course level is evidence the
            learning stuck rather than fading with the forgetting curve.
          </p>
        </Section>
      )}

      {/* ============ CLIENT SUMMARY ============ */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-3xl p-8 text-white shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-200 flex items-center gap-2 mb-3">
          <FileText size={18} /> Client-ready summary
        </h3>
        <p className="text-lg leading-relaxed">{r.headline}</p>
        <p className="mt-3 text-emerald-100 text-sm leading-relaxed">
          {r.matched} learners completed both assessments ({r.completionRate.toFixed(0)}% of
          the cohort). Improvement tested with the {r.testName.toLowerCase()} ({formatP(r.pValue)}),
          effect size Cohen&rsquo;s d = {r.d.toFixed(2)} ({r.dLabel.toLowerCase()}).
          {r.meaningful.passed
            ? ' The gain also clears the meaningful-change threshold agreed with the client.'
            : ' The gain is positive but below the agreed meaningful-change threshold.'}
        </p>
        <p className="mt-4 text-xs text-emerald-200 flex items-center gap-1.5">
          <ArrowRight size={13} /> This is the one paragraph a sponsor reads. The statistics
          above are the evidence behind it, computed so the L&amp;D team never has to.
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

function StatCard({ icon, label, value, tone }: {
  icon: React.ReactNode; label: string; value: string; tone: 'slate' | 'indigo' | 'emerald' | 'violet';
}) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    violet: 'bg-violet-100 text-violet-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tones[tone]}`}>{icon}</div>
      <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
      <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
      <div className={`text-xl font-black tracking-tight ${highlight ? 'text-indigo-700' : 'text-slate-900'}`}>{value}</div>
      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{label}</div>
    </div>
  );
}

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</div>
      <div className="text-lg font-black text-slate-900">{value}</div>
    </div>
  );
}

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">{value.toFixed(2)} / 10</span>
      </div>
      <div className="h-5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

function DecisionStep({ q, a, note }: { q: string; a: string; note: string }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
      <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md shrink-0">{a}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-700">{q}</p>
        <p className="text-xs text-slate-500">{note}</p>
      </div>
    </div>
  );
}

function CalibrationCard({ ok, title, detail }: { ok: boolean; title: string; detail: string }) {
  return (
    <div className={`rounded-xl p-4 border ${ok ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        {ok
          ? <CheckCircle2 size={16} className="text-emerald-600" />
          : <AlertTriangle size={16} className="text-amber-600" />}
        <p className={`font-bold text-sm ${ok ? 'text-emerald-800' : 'text-amber-800'}`}>
          {title} {ok ? 'passed' : 'flagged'}
        </p>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{detail}</p>
    </div>
  );
}

function CiBar({ low, high, mean }: { low: number; high: number; mean: number }) {
  // Scale: clamp the axis to a sensible window around the interval.
  const axisLo = Math.min(0, Math.floor(low - 1));
  const axisHi = Math.ceil(high + 1);
  const span = axisHi - axisLo || 1;
  const pct = (v: number) => ((v - axisLo) / span) * 100;
  return (
    <div>
      <div className="relative h-16">
        {/* zero line */}
        <div className="absolute top-0 bottom-6 w-px bg-rose-300" style={{ left: `${pct(0)}%` }}>
          <span className="absolute -top-0 -translate-x-1/2 text-[10px] font-bold text-rose-400">0</span>
        </div>
        {/* interval band */}
        <div
          className="absolute top-6 h-4 bg-indigo-200 rounded-full"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
        />
        {/* mean marker */}
        <div className="absolute top-4 h-8 w-1.5 bg-indigo-700 rounded-full -translate-x-1/2" style={{ left: `${pct(mean)}%` }} />
        {/* endpoint labels */}
        <span className="absolute top-12 -translate-x-1/2 text-xs font-bold text-indigo-700" style={{ left: `${pct(low)}%` }}>{low.toFixed(2)}</span>
        <span className="absolute top-12 -translate-x-1/2 text-xs font-bold text-indigo-700" style={{ left: `${pct(high)}%` }}>{high.toFixed(2)}</span>
        <span className="absolute top-0 -translate-x-1/2 text-[10px] font-bold text-slate-500" style={{ left: `${pct(mean)}%` }}>mean {mean.toFixed(2)}</span>
      </div>
      <div className="h-px bg-slate-200" />
      <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
        <span>{axisLo} points</span>
        <span>{axisHi} points</span>
      </div>
    </div>
  );
}
