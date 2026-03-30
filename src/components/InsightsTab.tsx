import { useState } from 'react';
import { mockAiScenariosLibrary } from '../data/mockData';
import { Check, X, FileOutput, FileText, UserCircle, Sparkles, BarChart2, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import type { Session } from '../types';

export default function InsightsTab({ session }: { session: Session }) {
  const [activeView, setActiveView] = useState<'overview' | 'responses'>('overview');
  const [stageFilter, setStageFilter] = useState<'pre' | 'end' | 'refresher'>('end');
  const [selectedResponseIdx, setSelectedResponseIdx] = useState(0);

  const allResponses = session.responses || [];
  const filteredResponses = allResponses.filter(r => r.stage === stageFilter);
  const selectedResponse = filteredResponses[selectedResponseIdx] || filteredResponses[0];

  const getQuestion = (stage: 'pre'|'end'|'refresher', qId: string) => {
    return session.surveys[stage]?.questions.find(q => q.id === qId);
  };

  const findRubricForQuestion = (qText: string) => {
    if (!qText.includes('[AI Scenario')) return null;
    return mockAiScenariosLibrary.find(ai => qText.includes(ai.prompt)) || mockAiScenariosLibrary[0];
  };

  // --- AGGREGATION LOGIC ---
  const endResponses = allResponses.filter(r => r.stage === 'end');
  
  // 1-5 Star Ratings
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalStars = 0;
  let validStarRatings = 0;
  
  endResponses.forEach(r => {
    const ratingStr = r.answers['11']; 
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
    const recStr = r.answers['7']; 
    if (recStr && (recStr === 'Yes' || recStr === 'Maybe' || recStr === 'No')) {
      recCounts[recStr]++;
      validRecs++;
    }
  });

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
        
        <div className="bg-slate-100 p-1 rounded-xl flex items-center">
           <button 
             onClick={() => setActiveView('overview')}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeView === 'overview' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
           >
             <BarChart2 size={16} /> Cohort Overview
           </button>
           <button 
             onClick={() => setActiveView('responses')}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeView === 'responses' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
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
            <p className="text-slate-500 max-w-sm mx-auto">Once trainees complete the QR code surveys for this session, their answers will appear here in real-time.</p>
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
                 LTEM Tier 5 & 6 Executive Summary
               </h2>
               <div className="text-indigo-100 text-lg leading-relaxed space-y-4">
                 <p>
                   Overall, the cohort demonstrated a <strong className="text-white">high level of theoretical proficiency</strong> in conflict de-escalation, specifically citing the "structured empathy framework" and "resolution triangle" as key takeaways. Analyzing the real-world simulated scenarios, <strong className="text-emerald-300">80% of trainees</strong> correctly identified private 1-on-1 interventions as the correct primary action.
                 </p>
                 <p>
                   <strong className="text-amber-300">Areas for Improvement:</strong> The 30-day Refresher data indicates that while intent remains high, practical application drops when participants are faced with rapid, high-pressure demands (e.g. from vendors or senior stakeholders). We recommend focusing the next coaching block on high-pressure tactical roleplays.
                 </p>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>
      ) : (
        // ================= RAW RESPONSES TAB =================
        <div className="flex flex-col lg:flex-row gap-6 animate-in slide-in-from-bottom-4">
          
          {/* Sidebar: List of Responses Filtered by Stage */}
          <div className="lg:w-1/3 space-y-4">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Filter by Survey Phase</h4>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => { setStageFilter('pre'); setSelectedResponseIdx(0); }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${stageFilter === 'pre' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      Pre-Session Forms ({allResponses.filter(r => r.stage === 'pre').length})
                    </button>
                    <button 
                      onClick={() => { setStageFilter('end'); setSelectedResponseIdx(0); }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${stageFilter === 'end' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      Learner Reflection Forms ({allResponses.filter(r => r.stage === 'end').length})
                    </button>
                    <button 
                      onClick={() => { setStageFilter('refresher'); setSelectedResponseIdx(0); }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${stageFilter === 'refresher' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      30-Day Refresher Forms ({allResponses.filter(r => r.stage === 'refresher').length})
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
                           <p className="font-semibold text-slate-900 text-sm">Participant {idx + 1}</p>
                           <p className="text-xs text-slate-500 mt-0.5">{new Date(resp.submittedAt).toLocaleDateString()} • {new Date(resp.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                         </div>
                       </div>
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
                     <h2 className="text-lg font-bold text-slate-900 capitalize flex items-center gap-2">
                       {selectedResponse.stage} Survey Response
                     </h2>
                     <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                       <FileOutput size={14} /> Export CSV
                     </button>
                  </div>
                  
                  <div className="p-6 space-y-8 h-[600px] overflow-y-auto">
                     {Object.entries(selectedResponse.answers).map(([qId, answer], index) => {
                        const question = getQuestion(selectedResponse.stage, qId);
                        if (!question) return null;
                        
                        const aiRubric = findRubricForQuestion(question.text);
                        const isAiQuestion = !!aiRubric && stageFilter === 'end'; 

                        return (
                          <div key={qId} className={`relative p-5 rounded-2xl border ${isAiQuestion ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
                             {isAiQuestion && (
                               <div className="absolute -top-3 left-4 bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm border border-indigo-200">
                                 AI Scenario Eval
                               </div>
                             )}
                             <p className="font-semibold text-slate-800 text-sm leading-relaxed mb-3">
                               <span className="text-indigo-500 mr-2">{index + 1}.</span> {question.text}
                             </p>
                             
                             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-700 text-sm whitespace-pre-wrap">
                               {Array.isArray(answer) ? answer.join(', ') : answer}
                             </div>

                             {isAiQuestion && (
                               <div className="mt-4 pt-4 border-t border-indigo-100">
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">AI Evaluation Rubric</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                   <div className="space-y-2">
                                     {aiRubric.rubric.map((r, i) => (
                                        <div key={i} className="flex gap-2 text-sm text-slate-600 font-medium">
                                          {r.startsWith('Success') ? <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" /> : <X size={16} className="text-red-500 shrink-0 mt-0.5" />}
                                          <span>{r}</span>
                                        </div>
                                     ))}
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
