import React from 'react';
import { Anchor, Code2, PlusCircle, LogIn, LogOut, User, Sparkles, Activity } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  healthStatus,
  currentUser,
  onLogout,
  onLoginClick,
  onPostJobClick
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#18181c]/95 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
        
        {/* Brand Logo: Anchor / Hook + JobHook / JobProof */}
        <div 
          onClick={() => setActiveTab('dashboard-overview')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-500/30 group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/logo.png" alt="JobProof Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-baseline font-black text-xl sm:text-2xl tracking-tight text-white">
            <span>Job</span>
            <span className="text-yellow-400">Proof</span>
          </div>
        </div>

        {/* Navigation Tab Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#222228] p-1.5 rounded-full border border-gray-800">
          <button
            onClick={() => setActiveTab('dashboard-overview')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'dashboard-overview'
                ? 'bg-yellow-400 text-gray-950 shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            Find Jobs
          </button>
          <button
            onClick={() => setActiveTab('resume-analyzer')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'resume-analyzer'
                ? 'bg-yellow-400 text-gray-950 shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            Resume AI
          </button>
          <button
            onClick={() => setActiveTab('admin-panel')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'admin-panel'
                ? 'bg-yellow-400 text-gray-950 shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            Admin Panel
          </button>
        </nav>

        {/* Right Section: Backend Health, Login & Source Code Button */}
        <div className="flex items-center gap-3">
          {/* Backend Health Badge */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] bg-[#222228] border border-gray-800 rounded-full px-3.5 py-1.5 text-gray-400">
            <span className={`w-2 h-2 rounded-full ${healthStatus?.data ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span className="font-semibold text-gray-300">
              Backend: {healthStatus?.loading ? 'Checking...' : healthStatus?.data ? 'Connected' : 'Standalone'}
            </span>
          </div>

          {/* Login or User Avatar */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 bg-[#222228] pl-2 pr-3 py-1 rounded-full border border-gray-800">
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-yellow-400"
              />
              <span className="text-xs font-bold text-white hidden sm:inline">{currentUser.name}</span>
              <button
                onClick={onLogout}
                className="p-1 text-gray-400 hover:text-red-400 transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 px-3 py-2 transition"
            >
              Login
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
