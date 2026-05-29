import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initialSessions } from '../data/mockData';
import type { Question, QuestionType } from '../types';
import { ArrowLeft, Play, QrCode, Plus, Trash2, Edit2, Copy, CheckCircle2, X, Save, BarChart2, FlaskConical } from 'lucide-react';
import InsightsTab from '../components/InsightsTab';
import EvaluationReport from '../components/EvaluationReport';

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState(() => initialSessions.find(s => s.id === id) || null);
  const [activeTab, setActiveTab] = useState<'pre' | 'end' | 'refresher' | 'insights' | 'report'>('pre');
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Question Editor Modal State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Session Not Found</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-700 mt-2 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentSurvey =
    activeTab === 'insights' || activeTab === 'report' ? null : session.surveys[activeTab];

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSurveyLink = () => {
    if (session.id === 'b6e83') {
      if (activeTab === 'pre') return 'https://docs.google.com/forms/d/e/1FAIpQLSdDI75-MhlAM9jwZ7-oO87XhBoZB5eZZJ8TG0P6jZvAyWNX9g/viewform';
      if (activeTab === 'end') return 'https://docs.google.com/forms/d/e/1FAIpQLSe7qsj1IodX2dTctaRVznOJ_c5jGOx3ioQ7dO1fG5pj8g5lmg/viewform';
      if (activeTab === 'refresher') return 'https://docs.google.com/forms/d/e/1FAIpQLSf8YkYU6WdRu0XmW3qi1NnV1JoY6Ij3lJRu6MTrQS7W6d6xZQ/viewform';
    }
    return `${window.location.origin}/survey/${session.id}/${activeTab}`;
  };

  const getQRCodeImage = () => {
    if (session.id === 'b6e83') {
      if (activeTab === 'pre') return '/qr_pre.png';
      if (activeTab === 'end') return '/qr_end.png';
      if (activeTab === 'refresher') return '/qr_refresher.png';
    }
    return null;
  };

  const handleDeleteQuestion = (qId: string) => {
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        surveys: {
          ...prev.surveys,
          [activeTab as 'pre'|'end'|'refresher']: {
            ...prev.surveys[activeTab as 'pre'|'end'|'refresher'],
            questions: prev.surveys[activeTab as 'pre'|'end'|'refresher'].questions.filter(q => q.id !== qId)
          }
        }
      };
    });
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.text) return;

    setSession(prev => {
      if (!prev) return prev;
      
      const currentQuestions = prev.surveys[activeTab as 'pre'|'end'|'refresher'].questions;
      const isExisting = currentQuestions.find(q => q.id === editingQuestion.id);
      
      const updatedQuestions = isExisting
        ? currentQuestions.map(q => q.id === editingQuestion.id ? editingQuestion : q)
        : [...currentQuestions, editingQuestion];

      return {
        ...prev,
        surveys: {
          ...prev.surveys,
          [activeTab as 'pre'|'end'|'refresher']: {
            ...prev.surveys[activeTab as 'pre'|'end'|'refresher'],
            questions: updatedQuestions
          }
        }
      };
    });
    
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  const openNewQuestionModal = () => {
    setEditingQuestion({
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      text: '',
      options: []
    });
    setShowQuestionModal(true);
  };

  const openEditQuestionModal = (q: Question) => {
    setEditingQuestion({ ...q });
    setShowQuestionModal(true);
  };

  const handleOptionsChange = (val: string) => {
    if (!editingQuestion) return;
    setEditingQuestion({
      ...editingQuestion,
      options: val.split('\n').map(o => o.trim()).filter(o => o)
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <Link to="/" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium mb-4 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Sessions
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{session.courseName}</h1>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">{session.companyTaught || 'Public'}</span>
            </div>
            <p className="text-slate-500 mt-2">Manage the 3 form stages for this training cohort.</p>
          </div>
          
          <div className="flex gap-3">
             <button onClick={() => setActiveTab('insights')} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 flex items-center gap-2">
                <BarChart2 size={18} className="text-indigo-600" /> View Responses
             </button>
             <button onClick={() => setShowQRModal(true)} className="bg-indigo-600 border border-indigo-700 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <Play size={18} /> Launch Quiz
             </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex flex-wrap gap-2">
        {(['pre', 'end', 'refresher', 'insights', 'report'] as const).map(tab => {
          const isAttentionTab = tab === 'insights' || tab === 'report'
          const showAttentionHighlight = isAttentionTab && activeTab !== tab
          return (
            <div key={tab} className="relative flex-1 md:flex-none">
              {showAttentionHighlight && (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-3 rounded-full bg-amber-300/60 blur-xl animate-pulse"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-0.5 rounded-2xl ring-2 ring-amber-400 animate-pulse"
                  />
                </>
              )}
              <button
                onClick={() => setActiveTab(tab)}
                className={`relative w-full px-5 py-3 rounded-xl font-semibold text-sm transition-all text-center outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 flex items-center justify-center gap-2 ${
                  activeTab === tab
                    ? (tab === 'insights' || tab === 'report' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-white shadow-md')
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {tab === 'pre' && 'What You Know'}
                {tab === 'end' && 'What You Learnt'}
                {tab === 'refresher' && 'What You Did'}
                {tab === 'insights' && <><BarChart2 size={16} /> Evaluation Insights</>}
                {tab === 'report' && <><FlaskConical size={16} /> Evaluation Report</>}
              </button>
            </div>
          )
        })}
      </div>

      {/* Survey Editor View */}
      {activeTab === 'insights' ? (
        <InsightsTab session={session} />
      ) : activeTab === 'report' ? (
        <EvaluationReport session={session} />
      ) : currentSurvey ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500" key={activeTab}>
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{currentSurvey.title}</h2>
              <p className="text-slate-500 text-sm mt-1">{currentSurvey.questions.length} Questions Configured</p>
            </div>
            <button onClick={openNewQuestionModal} className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-colors focus:ring-2 focus:ring-indigo-300 outline-none">
              <Plus size={18} /> Add Question
            </button>
          </div>

          <div className="p-6">
            {currentSurvey.questions.length === 0 ? (
               <div className="text-center py-12 text-slate-400">
                  <p>No questions added yet. Click "Add Question" to start building.</p>
               </div>
            ) : (
              <ul className="space-y-4">
                {currentSurvey.questions.map((q, idx) => (
                  <li key={q.id} className="group border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 transition-all bg-white hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Q{idx + 1}</span>
                          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{q.type}</span>
                        </div>
                        <p className="font-semibold text-slate-900 leading-relaxed text-base">{q.text.replace(/^[A-Z]\d+\.\s*/, '').replace(/^Optional:\s*/, '')}</p>
                        
                        {q.options && q.options.length > 0 && (
                          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((opt, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                 <div className={`mt-0.5 w-4 h-4 shrink-0 border border-slate-300 bg-white ${q.type === 'choice' ? 'rounded-full' : 'rounded'}`} />
                                 <span>{opt.replace(/^\[\d+\]\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openEditQuestionModal(q)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-indigo-300">
                           <Edit2 size={18} />
                         </button>
                         <button onClick={() => handleDeleteQuestion(q.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-red-300">
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}

      {/* QUESTION EDITOR MODAL */}
      {showQuestionModal && editingQuestion && currentSurvey && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
           <form onSubmit={handleSaveQuestion} className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                   {currentSurvey.questions.find(q => q.id === editingQuestion.id) ? 'Edit Question' : 'Add Question'} 
                 </h3>
                 <button type="button" onClick={() => setShowQuestionModal(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Question Type</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {(['text', 'choice', 'checkbox', 'scale'] as QuestionType[]).map(type => (
                         <div 
                           key={type}
                           onClick={() => setEditingQuestion({...editingQuestion, type})}
                           className={`cursor-pointer border px-3 py-2.5 rounded-xl text-center text-sm font-medium capitalize transition-all ${
                             editingQuestion.type === type 
                               ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(79,70,229,1)]' 
                               : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                           }`}
                         >
                            {type}
                         </div>
                      ))}
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Question Text <span className="text-red-500">*</span></label>
                   <textarea 
                     autoFocus
                     required
                     placeholder="e.g. What motivated you to attend this course?" 
                     className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24 text-base"
                     value={editingQuestion.text}
                     onChange={(e) => setEditingQuestion({...editingQuestion, text: e.target.value})}
                   />
                 </div>
                 
                 {(editingQuestion.type === 'choice' || editingQuestion.type === 'checkbox') && (
                   <div className="animate-in fade-in slide-in-from-top-2">
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Options (One per line)</label>
                     <textarea 
                       placeholder="Option 1&#10;Option 2&#10;Option 3" 
                       className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y h-32 leading-relaxed font-mono text-sm"
                       value={editingQuestion.options?.join('\n') || ''}
                       onChange={(e) => handleOptionsChange(e.target.value)}
                     />
                   </div>
                 )}
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowQuestionModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors shadow-sm bg-white border border-slate-200">Cancel</button>
                 <button 
                   type="submit"
                   disabled={!editingQuestion.text}
                   className="px-6 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm flex items-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 outline-none"
                 >
                   <Save size={18} /> Save Question
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">
              <div className="p-6 border-b border-indigo-100 bg-indigo-50 flex justify-between items-center">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <QrCode size={20} className="text-indigo-600" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 flex-1 ml-3">Distribute Form</h3>
                 <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-8 flex flex-col items-center justify-center space-y-6">
                 <div className={`w-56 h-56 bg-slate-50 border-2 ${getQRCodeImage() ? 'border-indigo-600 bg-white' : 'border-dashed border-slate-200'} rounded-3xl flex items-center justify-center hover:border-indigo-300 transition-colors group relative overflow-hidden shadow-inner`}>
                    {getQRCodeImage() ? (
                      <img src={getQRCodeImage()!} alt="Form QR Code" className="w-full h-full object-contain p-2 animate-in zoom-in duration-500" />
                    ) : (
                      <QrCode size={140} className="text-slate-300 group-hover:scale-110 transition-transform duration-500 ease-out" />
                    )}
                 </div>
                 <div className="text-center">
                   <p className="font-bold text-slate-900 text-lg">{activeTab.toUpperCase()} Form Live</p>
                   <p className="text-sm text-slate-500 mt-1 max-w-[250px] mx-auto">Trainees can scan this code to begin the form.</p>
                 </div>

                 <div className="w-full flex items-center gap-2 mt-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                   <div className="flex-1 bg-transparent text-[13px] font-medium text-slate-600 px-3 outline-none overflow-hidden text-ellipsis whitespace-nowrap pl-2 select-all">
                     {getSurveyLink()}
                   </div>
                   <button onClick={() => handleCopyLink(getSurveyLink())} className="shrink-0 bg-white shadow-sm border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 px-3.5 py-2.5 rounded-lg font-semibold text-[13px] transition-all flex items-center gap-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                     {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />} 
                     {copied ? 'Copied!' : 'Copy'}
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
