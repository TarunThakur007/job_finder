import React, { useMemo } from 'react';
import { 
  DollarSign, 
  Users, 
  Megaphone, 
  Code2, 
  Database, 
  Cloud, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Smartphone,
  Activity,
  CheckCircle2
} from 'lucide-react';

// Profile definitions strictly corresponding to real roles in the database (NO design / fake categories)
const PROFILE_DEFINITIONS = [
  {
    id: 'backend',
    name: 'Backend Development',
    aliases: ['backend', 'java', 'spring', 'python', 'golang', 'node', 'server', 'database', 'rest api', 'sql', 'microservice'],
    icon: Database,
    description: 'High-throughput APIs, microservices, databases, and distributed backend systems.'
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    aliases: ['frontend', 'react', 'ui', 'vue', 'angular', 'web', 'javascript', 'typescript', 'tailwind', 'next.js'],
    icon: Code2,
    description: 'Interactive web applications, modern responsive UI, and component design systems.'
  },
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    aliases: ['full stack', 'fullstack', 'software engineer', 'software developer', 'application engineer'],
    icon: Layers,
    description: 'End-to-end web architectures, full stack services, and scalable cloud systems.'
  },
  {
    id: 'ai-data',
    name: 'Data Science & AI',
    aliases: ['ai', 'data', 'machine learning', 'ml', 'deep learning', 'nlp', 'data science', 'llm', 'analytics'],
    icon: Sparkles,
    description: 'Machine learning pipelines, predictive analytics, big data, and generative AI models.'
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps Engineering',
    aliases: ['cloud', 'devops', 'infrastructure', 'sre', 'reliability', 'kubernetes', 'docker', 'aws', 'gcp', 'terraform'],
    icon: Cloud,
    description: 'Cloud infrastructure automation, Kubernetes orchestration, and resilient CI/CD pipelines.'
  },
  {
    id: 'security',
    name: 'Cyber Security & Trust',
    aliases: ['security', 'cyber', 'infosec', 'pentest', 'audit', 'compliance', 'abuse'],
    icon: ShieldCheck,
    description: 'Network defense, threat intelligence, vulnerability audits, and application security.'
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Growth Marketing',
    aliases: ['marketing', 'sales', 'growth', 'business development', 'account executive', 'seo', 'content'],
    icon: Megaphone,
    description: 'Enterprise revenue pipelines, brand expansion, and direct market customer acquisition.'
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    aliases: ['mobile', 'android', 'ios', 'swift', 'kotlin', 'react native', 'flutter'],
    icon: Smartphone,
    description: 'Native and cross-platform mobile experiences for iOS, Android, and distributed endpoints.'
  },
  {
    id: 'operations',
    name: 'Finance & Operations',
    aliases: ['finance', 'accounting', 'hr', 'recruiting', 'talent', 'operations', 'people', 'analyst'],
    icon: DollarSign,
    description: 'Corporate financial growth, talent acquisition, people operations, and operational workflows.'
  }
];

export default function CategoryGridSection({ jobs = [], selectedCategory, onSelectCategory, currentUser }) {
  // Dynamically calculate opening counts per job profile strictly from live jobs in the database
  // Profiles with 0 openings in database are strictly excluded!
  const profilesWithActiveOpenings = useMemo(() => {
    return PROFILE_DEFINITIONS.map(profile => {
      const matchingJobs = jobs.filter(job => {
        const skillsText = Array.isArray(job.skills) ? job.skills.join(' ') : (job.skills || '');
        const text = `${job.role || ''} ${job.title || ''} ${skillsText}`.toLowerCase();
        return profile.aliases.some(alias => text.includes(alias.toLowerCase()));
      });

      return {
        ...profile,
        count: matchingJobs.length,
        jobs: matchingJobs
      };
    })
    .filter(profile => profile.count > 0) // STRICTLY profiles with real openings present right now
    .sort((a, b) => b.count - a.count);
  }, [jobs]);

  const totalOpeningsCount = profilesWithActiveOpenings.reduce((sum, p) => sum + p.count, 0);

  return (
    <section className="bg-transparent py-14 px-4 sm:px-6 lg:px-8 border-b border-gray-800/80 relative transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181c] border border-yellow-500/30 text-yellow-400 text-xs font-mono font-semibold shadow-sm">
            <Activity className="w-3.5 h-3.5 text-yellow-400" />
            <span>AUTHENTICATED DATABASE PIPELINES</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Active Verified <span className="text-yellow-400">Engineering Domains</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Only categories with verified active vacancies currently present in the database ({totalOpeningsCount}+ verified requisitions).
          </p>
        </div>

        {/* Responsive Grid of Active Profiles matching Dashboard Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profilesWithActiveOpenings.map((profile) => {
            const IconComponent = profile.icon;
            const isSelected = selectedCategory === profile.name;

            return (
              <div
                key={profile.id}
                role="button"
                tabIndex={0}
                aria-label={`Browse ${profile.name} jobs: ${profile.count} active openings`}
                onClick={() => onSelectCategory && onSelectCategory(profile.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onSelectCategory) onSelectCategory(profile.name);
                  }
                }}
                className={`p-5 rounded-2xl flex flex-col justify-between cursor-pointer select-none transition-all duration-200 border ${
                  isSelected 
                    ? 'border-teal-400 ring-2 ring-teal-400/30 bg-[#1A2230] shadow-lg shadow-teal-500/10' 
                    : 'bg-[#141922] border-[#253044] hover:border-teal-500/50 hover:bg-[#1A2230] hover:shadow-md hover:shadow-teal-500/5 hover:-translate-y-0.5'
                }`}
              >
                {/* Profile Top Row: Icon + Count Pill */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'bg-teal-500 text-white font-bold' 
                      : 'bg-[#0D1117] border border-[#253044] text-teal-400'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 tabular-nums flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{profile.count} {profile.count === 1 ? 'Open Position' : 'Open Positions'}</span>
                  </span>
                </div>

                {/* Profile Info */}
                <div className="space-y-1.5 mb-4">
                  <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center justify-between">
                    <span>{profile.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-teal-400' : 'text-slate-500'}`} />
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {profile.description}
                  </p>
                </div>

                {/* Micro Footer Indicator */}
                <div className="pt-3 border-t border-[#253044] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Openings</span>
                  </span>
                  <span className="text-teal-400 font-semibold group-hover:text-teal-300">
                    View Jobs →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
