import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Briefcase, 
  Users, 
  Star, 
  TrendingUp, 
  Award,
  Zap
} from 'lucide-react';

export default function FeatureSpotlightSection({
  onNavigateResume,
  onNavigateExperience,
  onPostJobClick
}) {
  return (
    <div className="space-y-8 py-8 bg-transparent">
      
      {/* 1. AI RESUME ANALYZER SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 border border-gray-800 rounded-3xl relative overflow-hidden bg-[#18181c] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#222228] border border-yellow-500/30 text-yellow-400 text-xs font-mono font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>INTELLIGENT ATS SYNTHESIS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Benchmark Your Profile with <span className="text-yellow-400">Engineered Precision</span>
              </h2>

              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Avoid algorithmic rejections. Audit technical keyword density, calculate exact ATS compatibility, and generate role-calibrated impact metrics before dispatching applications.
              </p>

              {/* Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Real-Time 0–100 ATS Metric Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Missing Keyword Taxonomy Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Quantitative Impact Bullet Synthesis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Zero-Telemetry Local Privacy Guarantee</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  onClick={onNavigateResume}
                  className="px-5 py-3 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold text-xs transition shadow-md hover:shadow-teal-500/25 active:scale-95 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Launch Resume AI Analyzer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual Badge Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-[#141922] border border-[#253044] rounded-2xl p-5 space-y-4 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#253044]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Diagnostic Scorecard</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Live Score
                  </span>
                </div>

                {/* Score Gauge Widget (Teal Trust/ATS Score) */}
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#0D1117] border border-[#253044]">
                  <div className="w-14 h-14 rounded-xl border-2 border-teal-400 bg-teal-500/10 flex items-center justify-center text-lg font-mono font-black text-teal-400 shadow-sm tabular-nums">
                    94%
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">ATS System Alignment</p>
                    <p className="text-[11px] font-mono text-emerald-400 font-bold">Senior Role Standard</p>
                    <p className="text-xs text-slate-400 mt-0.5">Audited across 50+ enterprise algorithms</p>
                  </div>
                </div>

                {/* Matched Keywords Pill Group */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Detected Tokens:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Distributed Systems'].map((kw) => (
                      <span key={kw} className="px-2.5 py-1 rounded-lg bg-[#0D1117] text-slate-300 border border-[#253044] text-[11px] font-mono">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
