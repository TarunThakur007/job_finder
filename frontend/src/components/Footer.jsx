import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigateTab, onPostJobClick }) {
  return (
    <footer className="bg-[#090B0F] border-t border-[#253044] text-slate-400 pt-12 pb-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 flex items-center justify-center font-bold text-sm tracking-tight shadow-sm shadow-teal-500/20">
                JR
              </div>
              <div className="flex items-baseline font-bold text-lg tracking-tight text-white">
                <span>JobRadar</span>
                <span className="text-teal-400 ml-1">AI</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Verified jobs. Transparent applications. Direct application pipelines, verified salary benchmarks, and automated ATS compatibility synthesis.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-[11px] font-semibold">100% Direct Employer Verification Pipeline</span>
            </div>
          </div>

          {/* Column 1: For Candidates */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono tracking-wider text-white font-semibold">
              Candidates
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('dashboard-overview')} 
                  className="hover:text-teal-400 transition text-left"
                >
                  Browse Openings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('resume-analyzer')} 
                  className="hover:text-teal-400 transition text-left"
                >
                  Resume AI & ATS Audit
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('application-tracker')} 
                  className="hover:text-teal-400 transition text-left"
                >
                  Application Tracker
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('experience-board')} 
                  className="hover:text-teal-400 transition text-left"
                >
                  Interview Experiences
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: For Employers */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono tracking-wider text-white font-semibold">
              Employers
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button 
                  onClick={() => onPostJobClick && onPostJobClick()} 
                  className="hover:text-teal-300 transition text-left font-medium text-teal-400"
                >
                  + Post a Direct Requisition
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('employee-panel')} 
                  className="hover:text-teal-400 transition text-left"
                >
                  Employee Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('admin-panel')} 
                  className="hover:text-teal-400 transition text-left"
                >
                  Admin Console
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Direct API Webhooks</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Tech */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono tracking-wider text-white font-semibold">
              System Architecture
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Spring Boot 3 REST API</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>React 18 & Vite Frontend</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Obsidian & Electric Teal</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>H2 & JPA Persistence</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & System Status */}
        <div className="pt-6 border-t border-[#253044] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>
            &copy; 2026 <strong className="text-white font-medium">JobRadar AI</strong>. Verified jobs. Transparent applications.
          </p>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-[#141922] border border-[#253044] px-3 py-1 rounded-xl shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
