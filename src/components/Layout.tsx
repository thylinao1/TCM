import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Sessions', icon: <LayoutDashboard size={20} /> },
    { path: '/insights', label: 'Global Insights', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
            Blue Morning
          </h1>
          <p className="text-slate-400 text-sm mt-1">Consultancy Platform</p>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-slate-50 sm:p-10 p-4">
        <div className="max-w-7xl mx-auto backdrop-blur-sm bg-white/60 p-8 rounded-3xl shadow-sm border border-slate-200/60 min-h-[calc(100vh-5rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
