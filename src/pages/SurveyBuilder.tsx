import { useState } from 'react';
import { mockAiScenario } from '../data/mockData';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export default function SurveyBuilder() {
  const [courseContent, setCourseContent] = useState('');
  const [numQuestions, setNumQuestions] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!courseContent) return;
    setIsGenerating(true);
    setGenerated(false);
    
    // Simulate API delay
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">End of Session Builder</h1>
        <p className="text-slate-500 mt-1">Configure the final survey and generate Will Thalheimer LTEM Evaluation Scenarios.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Sparkles className="text-indigo-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">LTEM Scenario Generator (Tier 5 & 6)</h3>
              <p className="text-xs text-slate-500">Powered by AI</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Questions Needed</label>
              <input 
                type="number" 
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                min={1} max={5}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Course Content & Expectations</label>
              <textarea 
                placeholder="Paste syllabus, notes, or specific challenges the class faced..."
                value={courseContent}
                onChange={(e) => setCourseContent(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !courseContent}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {isGenerating ? 'Generating Scenarios...' : 'Generate AI Scenarios'}
            </button>
          </div>
        </div>

        {/* Right Column: Output Simulation */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed">
          {!generated && !isGenerating ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-3 py-10">
               <Sparkles size={32} className="opacity-50" />
               <p className="text-sm max-w-[200px]">Fill out the parameters to generate high-fidelity LTEM scenarios.</p>
             </div>
          ) : isGenerating ? (
             <div className="h-full flex flex-col items-center justify-center text-indigo-500 space-y-4 py-10">
               <Loader2 className="animate-spin" size={32} />
               <p className="text-sm font-medium animate-pulse">Applying Instructional Design rules...</p>
             </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm border-l-4 border-l-emerald-500">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-emerald-800 font-semibold text-sm">Added to Trainee Survey</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Question 1 (Tier 5 Scenario)</h4>
                <p className="text-sm text-slate-700 mb-3 bg-slate-50 p-3 rounded-md">{mockAiScenario.scenarioText}</p>
                <p className="text-sm font-medium text-slate-900">Prompt: {mockAiScenario.prompt}</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">For Consultant</span>
                  Tier 5 Written Marking Rubric
                </h4>
                <ul className="space-y-2">
                  {mockAiScenario.rubric.map((r, i) => (
                    <li key={i} className={`text-sm p-2 rounded ${r.startsWith('Success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">For Manager</span>
                  Tier 6 Observation Checklist
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 list-disc pl-4 marker:text-amber-500">
                  {mockAiScenario.managerChecklist.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
