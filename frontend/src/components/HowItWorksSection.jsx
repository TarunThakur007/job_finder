import { Database, ShieldCheck, Cpu, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    name: 'Collect',
    stage: 'Job Sources',
    title: 'Collect Requisitions',
    description: 'Continuously ingests official ATS feeds across Greenhouse, Lever, Ashby, and verified career portals.',
    icon: Database,
    isVerification: false,
    badge: '01 Collect'
  },
  {
    step: '02',
    name: 'Verify',
    stage: 'Verification',
    title: 'Deterministic Verification',
    description: 'Cryptographic domain verification, HTTP 200 validation, and automated purging of closed or ghost listings.',
    icon: ShieldCheck,
    isVerification: true,
    badge: '02 Verify'
  },
  {
    step: '03',
    name: 'Analyze',
    stage: 'AI Analysis',
    title: 'AI Synthesize',
    description: 'Extracts real compensation ranges, detects tech stacks, and identifies duplicates without inventing data.',
    icon: Cpu,
    isVerification: false,
    badge: '03 Analyze'
  },
  {
    step: '04',
    name: 'Apply',
    stage: 'Direct Application',
    title: 'Direct Application',
    description: 'Routes candidates directly to the authentic employer portal with zero intermediary agencies or recruiter spam.',
    icon: ArrowUpRight,
    isVerification: true,
    badge: '04 Apply'
  }
];

export default function HowItWorksSection({ onExploreJobs, onUploadResume }) {
  return (
    <section id="how-it-works-section" className="bg-transparent py-14 px-4 sm:px-6 lg:px-8 border-b border-[#253044] relative transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141922] border border-[#253044] text-slate-300 text-xs font-mono font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Verification Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How <span className="text-teal-400">Direct Verification</span> Works
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            From official ATS feeds directly to employer career endpoints in four transparent stages.
          </p>
        </div>

        {/* 4 Steps Grid with Thin Teal Connecting Line */}
        <div className="relative">
          {/* Thin Teal Connecting Line across steps on desktop */}
          <div 
            className="hidden lg:block absolute top-1/2 left-8 right-8 h-[1px] bg-gradient-to-r from-teal-500/20 via-teal-400/40 to-teal-500/20 pointer-events-none -translate-y-6 z-0" 
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {STEPS.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#141922] border border-[#253044] hover:border-teal-500/50 p-5 rounded-2xl flex flex-col justify-between select-none transition-all duration-200 shadow-sm hover:bg-[#1A2230] group hover:-translate-y-0.5 hover:shadow-teal-500/10 hover:shadow-lg"
                >
                  {/* Step Pill & Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold border ${
                      s.isVerification 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                    }`}>
                      {s.badge}
                    </span>
                    <span className="text-xl font-black text-slate-500 group-hover:text-teal-400 font-mono transition-colors">
                      {s.step}
                    </span>
                  </div>

                  {/* Step Icon */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 shadow-sm transition-colors ${
                    s.isVerification
                      ? 'bg-[#0D1117] border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20'
                      : 'bg-[#0D1117] border-teal-500/30 text-teal-400 group-hover:bg-teal-500/20'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  {/* Step Title & Description */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {s.stage}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  {/* Micro Indicator */}
                  <div className="mt-4 pt-3 border-t border-[#253044] flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-slate-400">{s.name} Stage</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
