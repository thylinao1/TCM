import { useState } from 'react';
import { initialSessions } from '../data/mockData';
import type { Session } from '../types';
import { ChevronDown, ChevronUp, Calendar, Users, GraduationCap, Edit3, X, FileUp, Sparkles, FolderOpen, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [sortKey, setSortKey] = useState<keyof Session>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // New Session form
  const [newCourseName, setNewCourseName] = useState('');
  const [newCompany, setNewCompany] = useState('');

  const handleSort = (key: keyof Session) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleNoteChange = (id: string, note: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, trainerNotes: note } : s));
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Session }) => {
    if (sortKey !== columnKey) return <ChevronDown size={14} className="opacity-0 group-hover:opacity-30 ml-1" />;
    return sortOrder === 'asc' ? <ChevronUp size={14} className="text-blue-500 ml-1" /> : <ChevronDown size={14} className="text-blue-500 ml-1" />;
  };

  const handleCreateSession = () => {
    if (!newCourseName) return;
    
    // In MVP, we just proceed to the AI Modal rather than saving to state immediately
    // so the "AI Generation" flow feels like part of the setup.
    setShowCreateModal(false);
    setShowAIModal(true);
  };

  const finalizeSessionCreation = () => {
    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 5),
      courseName: newCourseName,
      date: new Date().toISOString().split('T')[0],
      companyTaught: newCompany,
      trainerNotes: '',
      surveysCompleted: { pre: false, end: false, refresher: false },
      surveys: {
        pre: JSON.parse(JSON.stringify(initialSessions[0].surveys.pre)),
        end: JSON.parse(JSON.stringify(initialSessions[0].surveys.end)),
        refresher: JSON.parse(JSON.stringify(initialSessions[0].surveys.refresher))
      }
    };
    setSessions([newSession, ...sessions]);
    setNewCourseName('');
    setNewCompany('');
    setShowAIModal(false);
    navigate(`/session/${newSession.id}`);
  };

  const handleUploadSimulation = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      finalizeSessionCreation();
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Active Sessions</h1>
          <p className="text-slate-500 mt-1">Manage your training cohorts and survey statuses.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all hover:shadow-md transform hover:-translate-y-0.5"
        >
          + New Session
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm font-medium">
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort('courseName')}>
                  <div className="flex items-center">Course Name <SortIcon columnKey="courseName" /></div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort('date')}>
                  <div className="flex items-center">Date <SortIcon columnKey="date" /></div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort('companyTaught')}>
                  <div className="flex items-center">Company <SortIcon columnKey="companyTaught" /></div>
                </th>
                <th className="p-4">Surveys Status</th>
                <th className="p-4">Trainer Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSessions.map((session) => (
                <tr key={session.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4 align-top">
                    <Link to={`/session/${session.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                       <GraduationCap size={16} className="text-indigo-500" />
                       {session.courseName}
                    </Link>
                  </td>
                  <td className="p-4 align-top text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {session.date}
                    </div>
                  </td>
                  <td className="p-4 align-top text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      {session.companyTaught || 'Public Sector'}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex gap-2">
                      <Link to={`/session/${session.id}`} className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors hover:shadow-sm ${session.surveysCompleted.pre ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Pre</Link>
                      <Link to={`/session/${session.id}`} className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors hover:shadow-sm ${session.surveysCompleted.end ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>End</Link>
                      <Link to={`/session/${session.id}`} className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors hover:shadow-sm ${session.surveysCompleted.refresher ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Refresher</Link>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="relative">
                      <Edit3 size={14} className="absolute right-3 top-3 text-slate-300 pointer-events-none group-hover:text-blue-400 transition-colors" />
                      <textarea 
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        rows={2}
                        placeholder="Add private notes..."
                        value={session.trainerNotes}
                        onChange={(e) => handleNoteChange(session.id, e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xl font-bold flex items-center gap-2">Create New Session</h3>
                 <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-5">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Course Name <span className="text-red-500">*</span></label>
                   <input 
                     autoFocus
                     type="text" 
                     placeholder="e.g. Executive Leadership 2026" 
                     className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                     value={newCourseName}
                     onChange={(e) => setNewCourseName(e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Company / Organization <span className="text-slate-400 font-normal">(Optional)</span></label>
                   <input 
                     type="text" 
                     placeholder="e.g. Globex Inc" 
                     className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                     value={newCompany}
                     onChange={(e) => setNewCompany(e.target.value)}
                   />
                 </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
                 <button 
                   disabled={!newCourseName}
                   onClick={handleCreateSession} 
                   className="px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                 >
                   Continue <Sparkles size={16} className="inline ml-1" />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* AI GENERATOR SETUP MODAL */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden">
              <div className="p-6 border-b border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                     <Sparkles className="text-indigo-600" size={20} />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-slate-900">LTEM Scenario Generator</h3>
                     <p className="text-xs text-slate-500">Auto-generate Tier 5 & 6 surveys</p>
                   </div>
                 </div>
                 <button onClick={finalizeSessionCreation} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-6">
                 
                 <div 
                   onClick={handleUploadSimulation}
                   className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-8 hover:bg-indigo-50 transition-colors cursor-pointer flex flex-col items-center justify-center text-center group"
                 >
                    {isUploading ? (
                      <Loader2 size={40} className="text-indigo-500 animate-spin mb-3" />
                    ) : (
                      <FileUp size={40} className="text-indigo-400 group-hover:text-indigo-600 transition-colors mb-3 transform group-hover:-translate-y-1" />
                    )}
                    <h4 className="font-semibold text-slate-900">{isUploading ? 'Analyzing course structure...' : 'Upload Course Materials'}</h4>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs">{isUploading ? 'Applying Thalheimer LTEM rules' : 'Drag & drop PPTs, PDFs, or Syllabus docs to auto-generate scenarios.'}</p>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">OR</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                 </div>

                 <button 
                   onClick={finalizeSessionCreation}
                   className="w-full flex items-center justify-center gap-3 border border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 px-4 py-4 rounded-xl font-medium transition-all"
                 >
                    <FolderOpen size={18} className="text-slate-400" />
                    Use Past Examples from Library
                 </button>

              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                 <button onClick={finalizeSessionCreation} className="px-5 py-2.5 rounded-xl font-medium text-slate-500 hover:text-slate-800 transition-colors underline decoration-slate-300 underline-offset-4">
                   Skip for now
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
