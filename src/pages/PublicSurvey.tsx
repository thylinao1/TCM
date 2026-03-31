import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { initialSessions } from '../data/mockData';
import { CheckCircle2, Star, Send } from 'lucide-react';
import type { SurveyResponse } from '../types';

export default function PublicSurvey() {
  const { id, stage } = useParams<{ id: string; stage: 'pre' | 'end' | 'refresher' }>();
  const session = initialSessions.find(s => s.id === id);
  const survey = session?.surveys[stage!];

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!session || !survey) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-slate-800">Survey Not Found</h1>
        <p className="text-slate-500 mt-2">Please check the link and try again.</p>
      </div>
    );
  }

  const handleTextChange = (qId: string, val: string) => setAnswers(prev => ({ ...prev, [qId]: val }));
  const handleChoiceChange = (qId: string, val: string) => setAnswers(prev => ({ ...prev, [qId]: val }));
  
  const handleCheckboxChange = (qId: string, val: string, checked: boolean) => {
    setAnswers(prev => {
      const current = (prev[qId] as string[]) || [];
      if (checked) {
        return { ...prev, [qId]: [...current, val] };
      } else {
        return { ...prev, [qId]: current.filter(item => item !== val) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const response: SurveyResponse = {
      id: Math.random().toString(36).substr(2, 9),
      stage: stage!,
      submittedAt: new Date().toISOString(),
      participantName,
      participantEmail,
      answers
    };
    session.responses.push(response);
    session.surveysCompleted[stage!] = true;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
           <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Thank You!</h2>
        <p className="text-slate-600">Your response has been recorded successfully.</p>
        <p className="mt-8 text-sm text-slate-400">Powered by Blue Morning Consultancy</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 md:py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight">{survey.title}</h1>
            <p className="text-slate-300 mt-2 font-medium">{session.courseName}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Verification Block */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
             <h3 className="font-semibold text-slate-900 text-lg mb-4 flex gap-3">
               Participant Details
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="Jane Doe"
                    value={participantName}
                    onChange={e => setParticipantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    required
                    placeholder="jane@company.com"
                    value={participantEmail}
                    onChange={e => setParticipantEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 transition-all"
                  />
                </div>
             </div>
          </div>

          {survey.questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
               <h3 className="font-semibold text-slate-900 text-lg mb-4 flex gap-3">
                 <span className="text-indigo-600">{idx + 1}.</span> {q.text.replace(/^[A-Z]\d+\.\s*/, '').replace(/^Optional:\s*/, '')}
                 {q.required && <span className="text-red-500">*</span>}
               </h3>

               {/* Text Input */}
               {q.type === 'text' && (
                 <textarea 
                   required={q.required}
                   placeholder="Type your answer here..."
                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-y min-h-[120px] text-slate-700 transition-all"
                   value={(answers[q.id] as string) || ''}
                   onChange={e => handleTextChange(q.id, e.target.value)}
                 />
               )}

               {/* Single Choice (Radio) */}
               {q.type === 'choice' && q.options && (
                 <div className="space-y-3">
                   {q.options.map(opt => (
                     <label key={opt} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${answers[q.id] === opt ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                       <input 
                         type="radio" 
                         name={q.id}
                         value={opt}
                         required={q.required}
                         checked={answers[q.id] === opt}
                         onChange={e => handleChoiceChange(q.id, e.target.value)}
                         className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                       />
                       <span className="text-slate-700 font-medium">{opt.replace(/^\[\d+\]\s*/, '')}</span>
                     </label>
                   ))}
                 </div>
               )}

               {/* Multiple Choice (Checkbox) */}
               {q.type === 'checkbox' && q.options && (
                 <div className="space-y-3">
                   {q.options.map(opt => {
                     const isChecked = ((answers[q.id] as string[]) || []).includes(opt);
                     return (
                       <label key={opt} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${isChecked ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                         <input 
                           type="checkbox"
                           checked={isChecked}
                           onChange={e => handleCheckboxChange(q.id, opt, e.target.checked)}
                           className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                         />
                         <span className="text-slate-700 font-medium">{opt.replace(/^\[\d+\]\s*/, '')}</span>
                       </label>
                     );
                   })}
                 </div>
               )}

               {/* Scale (1-5 Rating) */}
               {q.type === 'scale' && (
                 <div className="flex flex-wrap gap-2">
                   {[1, 2, 3, 4, 5].map(rating => (
                     <button
                       key={rating}
                       type="button"
                       onClick={() => handleChoiceChange(q.id, rating.toString())}
                       className={`flex-1 min-w-[60px] flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all ${
                         answers[q.id] === rating.toString()
                           ? 'border-amber-400 bg-amber-50 text-amber-700'
                           : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                       }`}
                     >
                       <Star size={24} className={answers[q.id] === rating.toString() || Number(answers[q.id]) >= rating ? 'fill-amber-400 text-amber-400' : ''} />
                       <span className="font-bold text-lg">{rating}</span>
                     </button>
                   ))}
                 </div>
               )}
            </div>
          ))}

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">Please review your answers before submitting.</p>
            <button 
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              Submit Response <Send size={20} />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
