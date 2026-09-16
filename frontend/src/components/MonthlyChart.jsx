import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function MonthlyChart() {
  const [yearFilter, setYearFilter] = useState('2024');

  const learningData = [
    { month: 'Jul', height: '65%' },
    { month: 'Aug', height: '95%' },
    { month: 'Sep', height: '80%' },
    { month: 'Oct', height: '45%' },
    { month: 'Nov', height: '88%' },
    { month: 'Dec', height: '40%' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between h-full transition-colors">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">Learning Progress</h3>
        </div>

        {/* Year Selector Dropdown Pill */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-2xs">
            <span>{yearFilter}</span>
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative pt-6 pb-2 flex-1 flex flex-col justify-end">
        <div className="h-56 w-full flex items-end justify-between gap-3 px-2">
          {learningData.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Vertical Gradient Bar with rounded top & bottom corners matching image */}
              <div 
                className="w-full max-w-[36px] bg-gradient-to-t from-blue-600 via-blue-500 to-indigo-400 group-hover:from-blue-700 group-hover:to-indigo-500 rounded-lg transition-all duration-300 shadow-xs"
                style={{ height: item.height }}
              ></div>
            </div>
          ))}
        </div>

        {/* X Axis Month Labels */}
        <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 pt-3 px-2">
          {learningData.map((item) => (
            <span key={item.month} className="flex-1 text-center">
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
