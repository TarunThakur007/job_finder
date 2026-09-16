import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Users,
  MessageSquare,
  ChevronDown, 
  Bot, 
  Settings
} from 'lucide-react';

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
  const [dashboardOpen, setDashboardOpen] = useState(true);

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-[#0B0E14] text-slate-300 border-r border-slate-800/80 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between`}
    >
      <div className="h-full px-5 py-6 overflow-y-auto flex flex-col justify-between">
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30 text-lg">
                🎯
              </div>
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                JobProof
              </span>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {/* Dashboard Accordion Item */}
            <div>
              <button
                onClick={() => {
                  setActiveTab('dashboard-overview');
                  setDashboardOpen(!dashboardOpen);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab.startsWith('dashboard')
                    ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-md shadow-blue-900/40 border border-blue-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${dashboardOpen ? 'rotate-180' : ''}`} />
              </button>

              {dashboardOpen && (
                <div className="pl-11 pr-2 pt-1.5 space-y-1">
                  <button
                    onClick={() => setActiveTab('dashboard-overview')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === 'dashboard-overview'
                        ? 'text-blue-400 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Overview & Verification
                  </button>
                  <button
                    onClick={() => setActiveTab('dashboard-analytics')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === 'dashboard-analytics'
                        ? 'text-blue-400 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Analytics & Insights
                  </button>
                </div>
              )}
            </div>

            {/* Job Post */}
            <button
              onClick={() => setActiveTab('job-post')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'job-post'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Job Post</span>
            </button>

            {/* Applied */}
            <button
              onClick={() => setActiveTab('applied')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'applied'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Applied</span>
            </button>

            {/* Community */}
            <button
              onClick={() => setActiveTab('community')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'community'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Community</span>
            </button>

            {/* Message */}
            <button
              onClick={() => setActiveTab('message')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'message'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Message</span>
            </button>

            {/* AI Assistant */}
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'ai-assistant'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>AI Assistant</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 uppercase">
                AI
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Card */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xs">
              JP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">JobProof Pro</p>
              <p className="text-[10px] text-slate-400 truncate">Verification Engine</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

