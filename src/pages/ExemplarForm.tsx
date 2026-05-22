import { Link } from 'react-router-dom';
import {
  preSessionTemplate, endSessionTemplate, refresherTemplate, mockAiScenariosLibrary,
} from '../data/mockData';
import type { Question, SurveyTemplate } from '../types';
import {
  ArrowLeft, MessageSquareText, ListChecks, Star, Briefcase, Check, X, Sparkles, Clock,
} from 'lucide-react';

/**
 * A read-only, annotated walk-through of the three TCM evaluation forms.
 *
 * Every question is tagged with the LTEM tier it is there to measure, and the
 * open-ended scenario questions show the rubric the AI scores them against.
 * This is the page to share with someone who wants to see, concretely, what
 * the forms look like.
 */

type TierKey = 'decision' | 'knowledge' | 'survey' | 'operational';

const TIERS: Record<TierKey, { label: string; chip: string; icon: typeof Star }> = {
  decision: { label: 'Tier 5 to 6 - Decision-Making & Task Competence', chip: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: MessageSquareText },
  knowledge: { label: 'Tier 4 - Knowledge', chip: 'bg-amber-100 text-amber-700 border-amber-200', icon: ListChecks },
  survey: { label: 'Tier 3 - Learner Survey', chip: 'bg-sky-100 text-sky-700 border-sky-200', icon: Star },
  operational: { label: 'Operational - not an LTEM tier', chip: 'bg-slate-100 text-slate-500 border-slate-200', icon: Briefcase },
};

/** Classify a question into the LTEM tier it measures. */
const tierOf = (q: Question): TierKey => {
  if (q.id === '1' || q.id === '2') return 'decision'; // open-ended scenarios
  if (['2a', '2b', '2c', '2d'].includes(q.id)) return 'knowledge'; // knowledge MCQs
  if (['9', '10', '11', '12'].includes(q.id)) return 'operational'; // consent / services
  if (q.type === 'scale') return 'survey';
  return 'survey'; // reflective and confidence questions
};

/** Map a form's two scenario questions to their AI rubric entries. */
const rubricFor = (stage: 'pre' | 'end' | 'refresher', qId: string) => {
  const prefix = stage === 'refresher' ? 'ref' : stage;
  const idx = qId === '1' ? '1' : '2';
  return mockAiScenariosLibrary.find((s) => s.id === `ai-${prefix}-${idx}`) || null;
};

const cleanText = (t: string) => t.replace(/^[A-Z]?\d+[a-z]?\.\s*/, '').replace(/^Optional:\s*/, '');

export default function ExemplarForm() {
  const forms: { stage: 'pre' | 'end' | 'refresher'; template: SurveyTemplate; when: string; blurb: string }[] = [
    {
      stage: 'pre',
      template: preSessionTemplate,
      when: 'Before the course',
      blurb: 'Establishes the baseline. What can the learner already do before any training?',
    },
    {
      stage: 'end',
      template: endSessionTemplate,
      when: 'End of the session',
      blurb: 'Captures immediate capability. Completed in the room, so completion is near 100%.',
    },
    {
      stage: 'refresher',
      template: refresherTemplate,
      when: '3 to 6 months later',
      blurb: 'Measures what actually stuck and transferred into the workplace after a realistic delay.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">

      <div>
        <Link to="/" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium mb-4 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Sessions
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Exemplar Evaluation Form</h1>
        <p className="text-slate-500 mt-2 max-w-2xl">
          A complete, annotated example of the three forms a learner completes across a TCM
          programme. Each question is tagged with the LTEM tier it measures.
        </p>
      </div>

      {/* How the journey works */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-3">One journey, three forms, the same shape</h2>
          <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl">
            Every learner answers the same kind of form three times: before training, at the
            end of the session, and again months later. Each form pairs a realistic
            scenario question with a few short knowledge questions and some reflective
            questions. The scenario at the start and the scenario at the end are cloned: same
            underlying skill, different characters and context, so a learner cannot simply
            recall their earlier answer.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {forms.map((f, i) => (
              <div key={f.stage} className="flex items-center gap-3">
                <div className="bg-white/10 rounded-xl px-4 py-2.5">
                  <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Clock size={11} /> {f.when}
                  </div>
                  <div className="font-bold text-sm mt-0.5">{f.template.title}</div>
                </div>
                {i < forms.length - 1 && <span className="text-indigo-400 font-bold">&rarr;</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier legend */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">What the tags mean</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.keys(TIERS) as TierKey[]).map((k) => {
            const T = TIERS[k];
            const Icon = T.icon;
            return (
              <div key={k} className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md border ${T.chip}`}>
                  <Icon size={12} /> {T.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Each form */}
      {forms.map((f) => (
        <div key={f.stage} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {f.when}
              </span>
              <h2 className="text-xl font-bold text-slate-900">{f.template.title}</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1.5">{f.blurb}</p>
          </div>

          <ol className="divide-y divide-slate-100">
            {f.template.questions.map((q, idx) => {
              const tk = tierOf(q);
              const T = TIERS[tk];
              const Icon = T.icon;
              const isScenario = tk === 'decision';
              const rubric = isScenario ? rubricFor(f.stage, q.id) : null;
              return (
                <li key={q.id} className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex gap-3 flex-1 min-w-[260px]">
                      <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded h-fit">
                        Q{idx + 1}
                      </span>
                      <p className="font-semibold text-slate-800 leading-relaxed text-sm">
                        {cleanText(q.text)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${T.chip}`}>
                      <Icon size={12} /> {T.label}
                    </span>
                  </div>

                  {/* Answer-format preview */}
                  {q.type === 'choice' && q.options && (
                    <div className="mt-3 ml-9 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => (
                        <div key={opt} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white shrink-0" />
                          {opt.replace(/^\[\d+\]\s*/, '')}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === 'checkbox' && q.options && (
                    <div className="mt-3 ml-9 flex flex-wrap gap-2">
                      {q.options.map((opt) => (
                        <span key={opt} className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  {q.type === 'scale' && (
                    <div className="mt-3 ml-9 flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                          <Star size={15} />
                        </span>
                      ))}
                    </div>
                  )}
                  {q.type === 'text' && !isScenario && (
                    <div className="mt-3 ml-9 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center px-3 text-sm text-slate-300">
                      Free-text answer
                    </div>
                  )}

                  {/* Scenario rubric */}
                  {isScenario && rubric && (
                    <div className="mt-4 ml-9 bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={15} className="text-emerald-600" />
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          How the AI scores this answer, 0 to 10
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        The learner writes a free-text response. The AI grades it against a
                        fixed rubric agreed for this scenario. It is the demonstrated quality
                        of the decision that scores, never how confident the learner sounds.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {rubric.rubric.map((line, i) => {
                          const success = line.startsWith('Success');
                          return (
                            <div key={i} className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 border ${success ? 'bg-white border-emerald-200' : 'bg-white border-rose-200'}`}>
                              {success
                                ? <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                                : <X size={15} className="text-rose-500 shrink-0 mt-0.5" />}
                              <span className="text-slate-700">{line.replace(/^(Success|Fail):\s*/, '')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      ))}

      {/* Closing note */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-2">Why the forms are built this way</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          The scenario questions are deliberately calibrated so an untrained learner scores
          low, around 2 or 3 out of 10. That is not a flaw, it leaves room to show real
          movement. Because the measure is the quality of the decision and not a self-rating,
          an overconfident learner who answers poorly still scores low. And because the
          before and after scenarios are cloned rather than identical, the comparison stays
          honest. The knowledge and reflective questions sit alongside the scenarios so each
          form still gives the trainer a rounded picture of the learner.
        </p>
      </div>
    </div>
  );
}
