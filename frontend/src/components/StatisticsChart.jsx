import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

export default function StatisticsChart() {
  const [yearFilter, setYearFilter] = useState('2024');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between h-full relative transition-colors">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">Application Status</h3>
          {/* Legend Dots */}
          <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Application Sent</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Interviews</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Rejected</span>
            </span>
          </div>
        </div>

        {/* Year Selector Dropdown Pill */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-2xs">
            <span>{yearFilter}</span>
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* SVG Multi-Line Spline Chart Area */}
      <div className="relative pt-6 pb-2">
        <div className="h-56 w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="30" x2="600" y2="30" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="600" y2="80" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="130" x2="600" y2="130" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="180" x2="600" y2="180" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="4 4" />

            {/* Line 1: Application Sent (Blue) */}
            <path
              d="M 20 150 C 90 120, 160 110, 220 50 C 280 180, 360 80, 440 60 C 500 70, 560 50, 580 40"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Line 2: Interviews (Green) */}
            <path
              d="M 20 160 C 90 135, 160 130, 220 75 C 280 170, 360 100, 440 90 C 500 100, 560 80, 580 70"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Line 3: Rejected (Purple) */}
            <path
              d="M 20 170 C 90 155, 160 145, 220 115 C 280 165, 360 140, 440 125 C 500 130, 560 115, 580 110"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Active Highlight vertical dashed line at September (x = 220) */}
            <line x1="220" y1="20" x2="220" y2="190" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Data Dots on September */}
            <circle cx="220" cy="50" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="220" cy="75" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="220" cy="115" r="4.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
          </svg>

          {/* Tooltip Overlay matching the reference image popover */}
          <div className="absolute left-[33%] top-[10%] -translate-x-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200/90 dark:border-slate-700 text-xs min-w-[170px] z-10 space-y-1.5 animate-fadeIn">
            <p className="font-bold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1 text-[11px]">
              September
            </p>
            <div className="space-y-1 font-semibold text-[11px]">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>Application Sent :</span>
                </span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 ml-1">300</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Interviews :</span>
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 ml-1">60</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Rejected :</span>
                </span>
                <span className="font-extrabold text-purple-600 dark:text-purple-400 ml-1">240</span>
              </div>
            </div>
          </div>
        </div>

        {/* X Axis Month Labels */}
        <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 pt-3 px-2">
          <span>Jul</span>
          <span>Aug</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>
    </div>
  );
}
