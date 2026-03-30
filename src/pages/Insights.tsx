import { useState } from 'react';
import { mockAiScenario } from '../data/mockData';
import { Check, X, Eye, FileOutput } from 'lucide-react';

export default function Insights() {
  const [marked, setMarked] = useState<'success' | 'red-flag' | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Qualitative Insights & Evaluation</h1>
        <p className="text-slate-500 mt-1">Grade Tier 5 trainee responses against AI-generated rubrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trainee Response Section */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">Trainee Response Review</span>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Alex Mercer</span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Scenario Context</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{mockAiScenario.scenarioText}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Prompt</h4>
                <p className="font-medium text-slate-900">{mockAiScenario.prompt}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Alex's Answer</h4>
                <blockquote className="border-l-4 border-indigo-500 pl-4 py-1">
                  <p className="text-lg text-slate-800 italic">"I would wait until there are no other team members around, taking them to a separate room to understand why they are late, rather than calling them out in front of the others."</p>
                </blockquote>
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
              <span className="text-sm text-slate-500">How would you grade this based on the rubric?</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMarked('red-flag')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    marked === 'red-flag' ? 'bg-red-600 text-white shadow-md' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                >
                  <X size={16} /> Mark Red Flag
                </button>
                <button 
                  onClick={() => setMarked('success')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    marked === 'success' ? 'bg-green-600 text-white shadow-md' : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Check size={16} /> Mark Success
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Rubric & Playbook Section */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 text-white text-sm">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
              <Eye size={18} className="text-indigo-400" /> 
              Tier 5 Evaluation Rubric
            </h3>
            <ul className="space-y-3">
              {mockAiScenario.rubric.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${r.startsWith('Success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {r.startsWith('Success') ? <Check size={12} /> : <X size={12} />}
                  </div>
                  <span className="text-slate-300 leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
               Tier 6 Manager Playbook
            </h3>
            <p className="text-xs text-slate-500 mb-4">These observations must be made by the manager exactly 30 days after the class.</p>
            
            <ul className="space-y-3 mb-6">
              {mockAiScenario.managerChecklist.map((c, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded border-2 border-slate-300 shrink-0 mt-0.5 pointer-events-none" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all flex justify-center items-center gap-2 text-sm">
               <FileOutput size={16} /> Export Manager PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
