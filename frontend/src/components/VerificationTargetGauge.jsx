import React from 'react';
import { MoreVertical } from 'lucide-react';

export default function VerificationTargetGauge({ percentage = 75.55 }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6 flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Monthly Target</h3>
          <p className="text-xs text-slate-400 mt-0.5">Target you've set for each month</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Semi-Circle SVG Gauge Meter */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-56 h-28" viewBox="0 0 200 100">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Progress Indigo Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#465FFF"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - percentage / 100)}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage Badge */}
        <div className="absolute top-10 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {percentage}%
          </span>
          <span className="mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            +10%
          </span>
        </div>
      </div>

      {/* Description Text */}
      <p className="text-xs text-center text-slate-500 leading-relaxed max-w-xs mx-auto">
        You achieved <span className="font-semibold text-slate-800">3,287 verifications today</span>, it's higher than last month. Keep up your good work!
      </p>

      {/* Bottom Summary Columns */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100 text-center">
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">Target</span>
          <span className="text-base font-bold text-slate-800 mt-0.5 block">5,000</span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">Verified</span>
          <span className="text-base font-bold text-slate-800 mt-0.5 block">3,782</span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">Today</span>
          <span className="text-base font-bold text-slate-800 mt-0.5 block">142</span>
        </div>
      </div>
    </div>
  );
}
