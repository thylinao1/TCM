import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initialSessions, mockAiScenariosLibrary } from '../data/mockData';
import { Check, X, FileOutput, ArrowLeft, FileText, UserCircle } from 'lucide-react';

export default function Insights() {
  const { id } = useParams<{ id: string }>();
  // If no ID is provided, we can either default to the first session or show a placeholder.
  const session = initialSessions.find(s => s.id === id) || initialSessions[0];
  const [selectedResponseIdx, setSelectedResponseIdx] = useState(0);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <h2 className="text-xl font-bold text-slate-900 mb-4">No Sessions Available</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-700 mt-2 flex items-center gap-2">
          <ArrowLeft size={16} /> Go to Dashboard
        </Link>
      </div>
    );
  }

  const responses = session.responses || [];
  const selectedResponse = responses[selectedResponseIdx];

  // Helper to find the matching question text from the session template
  const getQuestion = (stage: 'pre'|'end'|'refresher', qId: string) => {
    return session.surveys[stage]?.questions.find(q => q.id === qId);
  };

  // Extract scenario text to see if we can match an AI rubric
  const findRubricForQuestion = (qText: string) => {
    if (!qText.includes('[AI Scenario')) return null;
    return mockAiScenariosLibrary.find(ai => qText.includes(ai.prompt)) || mockAiScenariosLibrary[0];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <Link to="/" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium mb-4 transition-colors w-fit">
            <ArrowLeft size={16} /> Back to Sessions
          </Link>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold tracking-tight text-slate-900">Evaluation Insights</h1>
             <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">{session.courseName}</span>
          </div>
          <p className="text-slate-500 mt-1">Review qualitative LTEM responses and manager checklists.</p>
        </div>
        <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2">
          <FileOutput size={18} /> Export Report
        </button>
      </div>

      {responses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Responses Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Once trainees complete the QR code surveys for {session.courseName}, their answers will appear here in real-time.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar: List of Responses */}
          <div className="lg:w-1/3 space-y-4">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700 flex justify-between items-center">
                   <span>Trainee Submissions</span>
                   <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{responses.length}</span>
                </div>
                <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                   {responses.map((resp, idx) => (
                     <li 
                       key={resp.id} 
                       onClick={() => setSelectedResponseIdx(idx)}
                       className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-3 ${selectedResponseIdx === idx ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'}`}
                     >
                       <UserCircle size={36} className="text-slate-300" />
                       <div>
                         <p className="font-semibold text-slate-900 text-sm">Participant {idx + 1}</p>
                         <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{resp.stage} Survey • {new Date(resp.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                       </div>
                     </li>
                   ))}
                </ul>
             </div>
          </div>

          {/* Main Area: Response Details */}
          <div className="lg:w-2/3 space-y-6">
             {selectedResponse && (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                     <h2 className="text-xl font-bold text-slate-900 capitalize">{selectedResponse.stage} Survey Response</h2>
                     <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">Completed</span>
                  </div>
                  
                  <div className="p-6 space-y-8">
                     {Object.entries(selectedResponse.answers).map(([qId, answer], index) => {
                        const question = getQuestion(selectedResponse.stage, qId);
                        if (!question) return null;
                        
                        const aiRubric = findRubricForQuestion(question.text);
                        const isAiQuestion = !!aiRubric;

                        return (
                          <div key={qId} className={`relative p-5 rounded-2xl border ${isAiQuestion ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-100 bg-slate-50'}`}>
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
                                   {/* Rubric display */}
                                   <div className="space-y-2">
                                     {aiRubric.rubric.map((r, i) => (
                                        <div key={i} className="flex gap-2 text-sm text-slate-600">
                                          {r.startsWith('Success') ? <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" /> : <X size={16} className="text-red-500 shrink-0 mt-0.5" />}
                                          <span>{r}</span>
                                        </div>
                                     ))}
                                   </div>
                                   {/* Manager Checklist Action items */}
                                   <div className="bg-white border border-slate-200 rounded-xl p-3">
                                      <h5 className="text-xs font-semibold text-slate-700 mb-2">Manager Observation Checklist (Tier 6)</h5>
                                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
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
             )}
          </div>
        </div>
      )}
    </div>
  );
}
