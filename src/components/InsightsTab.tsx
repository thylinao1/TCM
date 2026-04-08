import { useState, useEffect } from 'react';
import { mockAiScenariosLibrary } from '../data/mockData';
import { Check, X, FileOutput, FileText, UserCircle, Sparkles, BarChart2, MessageSquare, Star, ThumbsUp, Target, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import type { Session, SurveyResponse } from '../types';

const MCQ_CORRECT_ANSWERS: Record<string, string> = {
  '2a': 'Facilitate, Appreciate, Innovate, Resolve',
  '2b': 'Validating emotions without validating behavior',
  '2c': 'To respect physiological boundaries and allow emotions to settle',
  '2d': 'Stating observable behaviors without labels or judgments'
};

export default function InsightsTab({ session }: { session: Session }) {
  const [activeView, setActiveView] = useState<'overview' | 'responses' | 'progress'>('overview');
  const [stageFilter, setStageFilter] = useState<'pre' | 'end' | 'refresher'>('end');
  const [selectedResponseIdx, setSelectedResponseIdx] = useState(0);

  const [allResponses, setAllResponses] = useState(session.responses || []);

  useEffect(() => {
    setAllResponses(session.responses || []);
  }, [session.responses]);

  const filteredResponses = allResponses.filter(r => r.stage === stageFilter);
  const selectedResponse = filteredResponses[selectedResponseIdx] || filteredResponses[0];

  const findRubricForQuestion = (stage: string, qId: string) => {
    const stagePrefix = stage === 'refresher' ? 'ref' : stage;
    return mockAiScenariosLibrary.find(ai => ai.id === `ai-${stagePrefix}-${qId}` || qId.startsWith(ai.id));
  };

  // --- AGGREGATION LOGIC ---
  const endResponses = allResponses.filter(r => r.stage === 'end');
  
  // 1-5 Star Ratings
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalStars = 0;
  let validStarRatings = 0;
  
  endResponses.forEach(r => {
    const ratingStr = r.answers['13']; 
    if (ratingStr) {
      const num = parseInt(ratingStr as string);
      if (num >= 1 && num <= 5) {
        starCounts[num as 1|2|3|4|5]++;
        totalStars += num;
        validStarRatings++;
      }
    }
  });
  
  const averageRating = validStarRatings > 0 ? (totalStars / validStarRatings).toFixed(1) : '0.0';

  // Recommendations (Yes/Maybe/No)
  const recCounts = { 'Yes': 0, 'Maybe': 0, 'No': 0 };
  let validRecs = 0;
  
  endResponses.forEach(r => {
    const recStr = r.answers['9']; 
    if (recStr && (recStr === 'Yes' || recStr === 'Maybe' || recStr === 'No')) {
      recCounts[recStr]++;
      validRecs++;
    }
  });

  // --- LTEM 5 ASSESSMENT SCORING LOGIC ---
  const getScore = (answer: string | string[]): number | null => {
    if (typeof answer !== 'string') return null;
    const match = answer.match(/\[AI_SCORE:\s*(\d+)\]/);
    return match ? parseInt(match[1], 10) : null;
  };

  const getParticipantScore = (resp: SurveyResponse) => {
    let earned = 0;
    let possible = 0;
    const survey = session.surveys[resp.stage];
    
    Object.entries(resp.answers).forEach(([qId, val]) => {
      const q = survey?.questions.find(x => x.id === qId);
      if (!q) return;

      if (q.type === 'choice' && MCQ_CORRECT_ANSWERS[qId]) {
        possible += 5;
        if (val === MCQ_CORRECT_ANSWERS[qId]) {
          earned += 5;
        }
      } else {
        const isEvaluation = typeof val === 'string' && val.includes('[AI_SCORE:');
        if (isEvaluation) {
          const s = getScore(val as string);
          if (s !== null) {
            earned += s;
            possible += 10; 
          }
        }
      }
    });
    return { earned, possible };
  };

  // Calculate cohort average based on the currently filtered stage
  let totalEarned = 0;
  let totalPossible = 0;
  let validParticipants = 0;

  filteredResponses.forEach(r => {
    const { earned, possible } = getParticipantScore(r);
    if (possible > 0) {
      totalEarned += earned;
      totalPossible += possible;
      validParticipants++;
    }
  });

  const cohortScorePct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  // --- PROGRESS TRACKER LOGIC ---
  // Get unique trainee names across all responses
  const traineeNames = Array.from(new Set(allResponses.map(r => r.participantName).filter(Boolean))) as string[];

  interface TraineeProgress {
    name: string;
    email: string;
    pre: { score: number | null; pct: number | null };
    end: { score: number | null; pct: number | null };
    refresher: { score: number | null; pct: number | null };
    trend: 'improving' | 'stable' | 'declining' | 'incomplete';
    narrative: string;
  }

  const traineeProgressData: TraineeProgress[] = traineeNames.map(name => {
    const getStageScore = (stage: 'pre' | 'end' | 'refresher') => {
      const resp = allResponses.find(r => r.participantName === name && r.stage === stage);
      if (!resp) return { score: null, pct: null };
      const { earned, possible } = getParticipantScore(resp);
      if (possible === 0) return { score: null, pct: null };
      return { score: earned, pct: Math.round((earned / possible) * 100) };
    };

    const pre = getStageScore('pre');
    const end = getStageScore('end');
    const refresher = getStageScore('refresher');

    const email = allResponses.find(r => r.participantName === name)?.participantEmail || '';

    // Determine trend based on available data
    const scores = [pre.pct, end.pct, refresher.pct].filter(s => s !== null) as number[];
    let trend: TraineeProgress['trend'] = 'incomplete';
    if (scores.length >= 2) {
      const first = scores[0];
      const last = scores[scores.length - 1];
      const diff = last - first;
      if (diff >= 10) trend = 'improving';
      else if (diff <= -10) trend = 'declining';
      else trend = 'stable';
    }

    // Generate narrative
    const narrativeParts: string[] = [];
    if (pre.pct !== null && end.pct !== null) {
      const change = end.pct - pre.pct;
      if (change > 20) narrativeParts.push(`Showed strong gains between What You Know (${pre.pct}%) and What You Learnt (${end.pct}%), a +${change}pp improvement.`);
      else if (change > 0) narrativeParts.push(`Improved from What You Know (${pre.pct}%) to What You Learnt (${end.pct}%).`);
      else if (change === 0) narrativeParts.push(`Assessment score held steady from What You Know to What You Learnt at ${pre.pct}%.`);
      else narrativeParts.push(`Score dipped from What You Know (${pre.pct}%) to What You Learnt (${end.pct}%). May need additional coaching.`);
    }
    if (refresher.pct !== null) {
      if (end.pct !== null) {
        const change = refresher.pct - end.pct;
        if (change >= 0) narrativeParts.push(`What You Did shows sustained retention at ${refresher.pct}%.`);
        else narrativeParts.push(`What You Did shows a drop to ${refresher.pct}% — application in practice may need reinforcement.`);
      } else {
        narrativeParts.push(`What You Did score: ${refresher.pct}%.`);
      }
    }
    if (narrativeParts.length === 0) narrativeParts.push('Awaiting data from additional form stages.');

    return { name, email, pre, end, refresher, trend, narrative: narrativeParts.join(' ') };
  });

  const ScorePill = ({ pct }: { pct: number | null }) => {
    if (pct === null) return <span className="text-slate-300 text-sm font-medium italic">—</span>;
    const color = pct >= 75 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : pct >= 50 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-rose-100 text-rose-800 border-rose-200';
    return (
      <span className={`inline-flex items-center justify-center min-w-[52px] px-3 py-1 rounded-full text-sm font-bold border ${color}`}>
        {pct}%
      </span>
    );
  };

  const TrendBadge = ({ trend }: { trend: TraineeProgress['trend'] }) => {
    if (trend === 'improving') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
        <TrendingUp size={12} /> Improving
      </span>
    );
    if (trend === 'declining') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
        <TrendingDown size={12} /> Declining
      </span>
    );
    if (trend === 'stable') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
        <Minus size={12} /> Stable
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-500 text-xs font-bold border border-indigo-100">
        <ArrowRight size={12} /> In Progress
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-bold tracking-tight text-slate-900">Evaluation Insights</h2>
             <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">{allResponses.length} Submissions</span>
          </div>
          <p className="text-slate-500 mt-1">Review qualitative LTEM responses and AI-powered performance data.</p>
        </div>
        
        <div className="bg-slate-100 p-1 rounded-xl flex items-center flex-wrap gap-1">
           <button 
             onClick={() => setActiveView('overview')}
             className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${activeView === 'overview' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
           >
             <BarChart2 size={16} /> Cohort Overview
           </button>
           <button 
             onClick={() => setActiveView('progress')}
             className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${activeView === 'progress' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
           >
             <TrendingUp size={16} /> Progress Tracker
           </button>
           <button 
             onClick={() => setActiveView('responses')}
             className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${activeView === 'responses' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
           >
             <MessageSquare size={16} /> Raw Responses
           </button>
        </div>
      </div>

      {allResponses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Responses Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Once trainees complete the QR code forms for this session, their answers will appear here in real-time.</p>
        </div>
      ) : activeView === 'overview' ? (
        // ================= OVERVIEW TAB =================
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          
          {/* AI SUMMARY BLOCK */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <div className="relative z-10">
               <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                 <Sparkles className="text-indigo-300" size={24} /> 
                 LTEM Tier 5 &amp; 6 Executive Summary
               </h2>
               <div className="text-indigo-100 text-lg leading-relaxed space-y-4">
                 <p>
                   Overall, the cohort demonstrated a <strong className="text-white">high level of theoretical proficiency</strong> in conflict de-escalation, specifically citing the "structured empathy framework" and "resolution triangle" as key takeaways. Analyzing the real-world simulated scenarios, <strong className="text-emerald-300">80% of trainees</strong> correctly identified private 1-on-1 interventions as the correct primary action.
                 </p>
                 <p>
                   <strong className="text-amber-300">Areas for Improvement:</strong> The What You Did data indicates that while intent remains high, practical application drops when participants are faced with rapid, high-pressure demands (e.g. from vendors or senior stakeholders). We recommend focusing the next coaching block on high-pressure tactical roleplays.
                 </p>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* QUANTITATIVE WIDGET 1: STAR RATING */}
             <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                   <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-1">
                     <Star size={20} className="text-amber-400 fill-amber-400" /> Overall Satisfaction
                   </h3>
                   <p className="text-sm text-slate-500 mb-6">Based on End of Session responses</p>
                </div>
                
                <div className="flex items-end gap-8 mb-6">
                   <div className="text-6xl font-black text-slate-900 tracking-tighter">
                     {averageRating}
                   </div>
                   <div className="space-y-2 flex-1">
                     {[5, 4, 3, 2, 1].map(num => {
                       const count = starCounts[num as 1|2|3|4|5];
                       const pct = validStarRatings > 0 ? (count / validStarRatings) * 100 : 0;
                       return (
                         <div key={num} className="flex items-center gap-3 text-sm">
                           <span className="w-4 font-medium text-slate-500">{num}</span>
                           <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full transition-all duration-1000 ${num >= 4 ? 'bg-emerald-400' : num === 3 ? 'bg-amber-400' : 'bg-red-400'}`}
                               style={{ width: `${pct}%` }}
                             />
                           </div>
                           <span className="w-6 text-right font-semibold text-slate-700">{count}</span>
                         </div>
                       )
                     })}
                   </div>
                </div>
             </div>

             {/* QUANTITATIVE WIDGET 2: NPS / RECOMMEND */}
             <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                   <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-1">
                     <ThumbsUp size={20} className="text-indigo-500" /> Recommend to Colleague
                   </h3>
                   <p className="text-sm text-slate-500 mb-6">Likelihood to refer the course</p>
                </div>
                
                <div className="flex-1 flex flex-col justify-center space-y-5">
                   {['Yes', 'Maybe', 'No'].map(label => {
                     const count = recCounts[label as 'Yes'|'Maybe'|'No'];
                     const pct = validRecs > 0 ? (count / validRecs) * 100 : 0;
                     let color = 'bg-slate-300';
                     if (label === 'Yes') color = 'bg-indigo-500';
                     if (label === 'Maybe') color = 'bg-amber-400';
                     if (label === 'No') color = 'bg-rose-500';

                     return (
                       <div key={label}>
                         <div className="flex justify-between items-end mb-2">
                           <span className="font-semibold text-slate-700">{label}</span>
                           <span className="text-sm font-bold text-slate-900">{Math.round(pct)}% <span className="text-slate-400 font-normal ml-1">({count})</span></span>
                         </div>
                         <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
                         </div>
                       </div>
                     )
                   })}
                </div>
             </div>

             {/* QUANTITATIVE WIDGET 3: LTEM AVERAGE SCORE */}
             <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                   <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-1">
                     <Target size={20} className="text-emerald-500" /> Assessment Score
                   </h3>
                   <p className="text-sm text-slate-500 mb-6">Average decision-making score</p>
                </div>
                
                <div className="flex flex-col items-center justify-center flex-1 space-y-2 mb-4">
                   <div className="text-6xl font-black text-emerald-500 tracking-tighter">
                     {cohortScorePct}%
                   </div>
                   <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                     {totalEarned} / {totalPossible} Total Points
                   </div>
                </div>
             </div>
          </div>
        </div>

      ) : activeView === 'progress' ? (
        // ================= PROGRESS TRACKER TAB =================
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          
          {/* Header card */}
          <div className="bg-gradient-to-r from-violet-900 via-indigo-800 to-indigo-700 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -ml-10 -mb-10"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                <TrendingUp size={22} className="text-violet-300" /> Trainee Progress Tracker
              </h3>
              <p className="text-indigo-200 leading-relaxed text-sm max-w-2xl">
                Compare each trainee's decision-making assessment score across all three form stages — What You Know, What You Learnt, and What You Did — to identify who is embedding learning and who needs additional support.
              </p>
              <div className="mt-4 flex gap-4 flex-wrap text-xs">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> ≥75% Strong
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 50–74% Developing
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> &lt;50% Needs Support
                </span>
              </div>
            </div>
          </div>

          {/* Column headers */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Trainee</span>
            <span className="text-center">What You Know</span>
            <span className="text-center">What You Learnt</span>
            <span className="text-center">What You Did</span>
            <span className="text-center">Overall Trend</span>
          </div>

          {/* Trainee rows */}
          <div className="space-y-4">
            {traineeProgressData.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-5 items-center">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <UserCircle size={24} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{t.email}</p>
                    </div>
                  </div>

                  {/* Pre */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:hidden">What You Know</span>
                    <ScorePill pct={t.pre.pct} />
                    {t.pre.score !== null && <span className="text-[10px] text-slate-400">{t.pre.score}/{t.pre.score !== null ? (t.pre.pct !== null ? Math.round(t.pre.score / (t.pre.pct / 100)) : '?') : '?'} pts</span>}
                  </div>

                  {/* End */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:hidden">What You Learnt</span>
                    <ScorePill pct={t.end.pct} />
                    {t.end.score !== null && <span className="text-[10px] text-slate-400">{t.end.score} pts</span>}
                  </div>

                  {/* Refresher */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:hidden">What You Did</span>
                    <ScorePill pct={t.refresher.pct} />
                    {t.refresher.score !== null && <span className="text-[10px] text-slate-400">{t.refresher.score} pts</span>}
                  </div>

                  {/* Trend */}
                  <div className="flex justify-center">
                    <TrendBadge trend={t.trend} />
                  </div>
                </div>

                {/* Narrative */}
                <div className="px-5 pb-4 border-t border-slate-50">
                  <p className="text-xs text-slate-500 leading-relaxed pt-3">
                    <span className="font-bold text-slate-600">AI Insight: </span>{t.narrative}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      ) : (
        // ================= RAW RESPONSES TAB =================
        <div className="flex flex-col lg:flex-row gap-6 animate-in slide-in-from-bottom-4">
          
          {/* Sidebar: List of Responses Filtered by Stage */}
          <div className="lg:w-1/3 space-y-4">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Filter by Form Phase</h4>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => { setStageFilter('pre'); setSelectedResponseIdx(0); }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${stageFilter === 'pre' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      What You Know ({allResponses.filter(r => r.stage === 'pre').length})
                    </button>
                    <button 
                      onClick={() => { setStageFilter('end'); setSelectedResponseIdx(0); }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${stageFilter === 'end' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      What You Learnt ({allResponses.filter(r => r.stage === 'end').length})
                    </button>
                    <button 
                      onClick={() => { setStageFilter('refresher'); setSelectedResponseIdx(0); }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${stageFilter === 'refresher' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      What You Did ({allResponses.filter(r => r.stage === 'refresher').length})
                    </button>
                  </div>
                </div>

                <ul className="divide-y divide-slate-100 flex-1 overflow-y-auto">
                   {filteredResponses.length === 0 ? (
                     <div className="p-8 text-center text-slate-500 text-sm">No submissions for this stage yet.</div>
                   ) : filteredResponses.map((resp, idx) => (
                     <li 
                       key={resp.id} 
                       onClick={() => setSelectedResponseIdx(idx)}
                       className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between ${selectedResponseIdx === idx ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'}`}
                     >
                       <div className="flex items-center gap-3">
                         <UserCircle size={36} className="text-slate-300" />
                         <div>
                           <p className="font-semibold text-slate-900 text-sm">{resp.participantName || `Participant ${idx + 1}`}</p>
                           <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                             {resp.participantEmail || `${new Date(resp.submittedAt).toLocaleDateString()} • ${new Date(resp.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                           </p>
                         </div>
                       </div>

                       {/* INDIVIDUAL SCORE */}
                       {(() => {
                         const score = getParticipantScore(resp);
                         if (score.possible > 0) {
                           return (
                             <div className="text-right">
                               <div className="text-xl font-black text-emerald-500">{score.earned}/{score.possible}</div>
                               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</div>
                             </div>
                           );
                         }
                         return null;
                       })()}
                     </li>
                   ))}
                </ul>
             </div>
          </div>

          {/* Main Area: Response Details */}
          <div className="lg:w-2/3">
             {selectedResponse ? (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[700px]">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                     <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       {{ pre: 'What You Know', end: 'What You Learnt', refresher: 'What You Did' }[selectedResponse.stage as 'pre'|'end'|'refresher']}
                     </h2>
                     <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                       <FileOutput size={14} /> Export CSV
                     </button>
                  </div>
                  
                  <div className="p-6 space-y-8 h-[600px] overflow-y-auto">
                     {session.surveys[selectedResponse.stage]?.questions.map((question, index) => {
                        const qId = question.id;
                        const answer = selectedResponse.answers[qId];
                        if (answer === undefined) return null;
                        
                        const aiRubric = findRubricForQuestion(selectedResponse.stage, qId);
                        const isAiQuestion = !!aiRubric; 

                        return (
                          <div key={qId} className={`relative p-5 rounded-2xl border ${isAiQuestion ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
                             <p className="font-semibold text-slate-800 text-sm leading-relaxed mb-3">
                               <span className="text-indigo-500 mr-2">{index + 1}.</span> {question.text}
                             </p>
                             
                             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-700 text-sm whitespace-pre-wrap flex justify-between items-start gap-4">
                               <div className="flex-1">
                                 {Array.isArray(answer) ? answer.join(', ') : answer.replace(/\[AI_SCORE:\s*\d+\]/g, '')}
                               </div>
                               {question.type === 'choice' && MCQ_CORRECT_ANSWERS[qId] && (
                                 <div className={`shrink-0 font-bold px-3 py-1.5 rounded-lg border shadow-sm text-xs flex flex-col items-center ${answer === MCQ_CORRECT_ANSWERS[qId] ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                   <span className="opacity-75 text-[9px] uppercase tracking-wider mb-0.5">Score</span>
                                   <div className="text-base">{answer === MCQ_CORRECT_ANSWERS[qId] ? '5' : '0'}<span className="text-[10px] opacity-75 font-medium"> / 5</span></div>
                                 </div>
                               )}
                               {typeof answer === 'string' && answer.includes('[AI_SCORE:') && (
                                 <div className="shrink-0 bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm text-xs flex flex-col items-center">
                                   <span className="opacity-75 text-[9px] uppercase tracking-wider mb-0.5">AI Grade</span>
                                   <div className="flex items-center">
                                      <input 
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={getScore(answer) !== null ? getScore(answer) as number : 0}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value, 10);
                                          if (!isNaN(val) && val >= 0 && val <= 10) {
                                            const updatedResponses = allResponses.map(r => {
                                              if (r.id === selectedResponse.id) {
                                                return {
                                                  ...r,
                                                  answers: {
                                                    ...r.answers,
                                                    [qId]: (r.answers[qId] as string).replace(/\[AI_SCORE:\s*\d+\]/, `[AI_SCORE: ${val}]`)
                                                  }
                                                };
                                              }
                                              return r;
                                            });
                                            setAllResponses(updatedResponses);
                                          }
                                        }}
                                        className="w-8 text-center text-base bg-transparent border-b border-indigo-300 focus:outline-none focus:border-indigo-600 font-bold m-0 p-0 mr-1"
                                      />
                                      <span className="text-[10px] opacity-75 font-medium">/ 10</span>
                                   </div>
                                 </div>
                               )}
                             </div>

                             {isAiQuestion && (
                               <div className="mt-4 pt-4 border-t border-indigo-100">
                                 <div className="flex items-center justify-between mb-3">
                                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Evaluation Rubric (Trainer Adjustable)</h4>
                                   <button className="text-[10px] text-indigo-600 font-bold hover:bg-indigo-100 uppercase tracking-wider bg-indigo-50 px-2.5 py-1.5 rounded transition-colors">Save Adjustments</button>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="space-y-3">
                                     {aiRubric.rubric.map((r, i) => {
                                        const isSuccess = r.startsWith('Success');
                                        return (
                                          <div key={i} className="flex gap-2 text-sm text-slate-600 font-medium items-start">
                                            {isSuccess ? <Check size={16} className="text-emerald-500 shrink-0 mt-2" /> : <X size={16} className="text-red-500 shrink-0 mt-2" />}
                                            <div className="flex-1">
                                              <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>{isSuccess ? 'Success Metric' : 'Failure Metric'}</span>
                                              <textarea defaultValue={r.replace(/^(Success|Fail):\s*/, '')} className="w-full text-sm border-slate-200 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-100 resize-none h-16" />
                                            </div>
                                          </div>
                                        )
                                     })}
                                   </div>
                                   <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Manager Observation Checklist (Tier 6)</h5>
                                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1 font-medium">
                                        {aiRubric.managerChecklist.map((item, i) => (
                                          <li key={i}>{item}</li>
                                        ))}
                                      </ul>
                                   </div>
                                 </div>
                               </div>
                             )}
                          </div>
                        );
                     })}
                  </div>
               </div>
             ) : (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-[700px] flex items-center justify-center text-slate-400">
                 Select a response to view details.
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
