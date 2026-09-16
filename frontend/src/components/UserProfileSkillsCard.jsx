import React from 'react';
import { Sparkles } from 'lucide-react';

export default function UserProfileSkillsCard() {
  const skills = [
    { name: 'Research', percentage: 60, color: '#3B82F6', trackColor: '#DBEAFE' },
    { name: 'UX', percentage: 70, color: '#F97316', trackColor: '#FFEDD5' },
    { name: 'UI', percentage: 90, color: '#10B981', trackColor: '#D1FAE5' },
    { name: 'Figma', percentage: 85, color: '#6366F1', trackColor: '#E0E7FF' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full transition-colors">
      {/* Top User Info & Action Button */}
      <div className="flex items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
            alt="Cooper Curtis"
            className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100 dark:border-slate-700 shadow-xs"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">Cooper Curtis</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Product Designer</p>
          </div>
        </div>

        <button className="px-3.5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Suggestion</span>
        </button>
      </div>

      {/* Circular Progress Gauge Rings Grid */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {skills.map((skill) => {
          const radius = 28;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (skill.percentage / 100) * circumference;

          return (
            <div key={skill.name} className="flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 70 70">
                  {/* Background Track */}
                  <circle
                    cx="35"
                    cy="35"
                    r={radius}
                    stroke={skill.trackColor}
                    strokeWidth="6"
                    fill="transparent"
                    className="dark:opacity-30"
                  />
                  {/* Active Arc */}
                  <circle
                    cx="35"
                    cy="35"
                    r={radius}
                    stroke={skill.color}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center Percentage */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">
                    {skill.percentage}%
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
