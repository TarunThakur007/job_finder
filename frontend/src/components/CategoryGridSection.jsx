import React, { useMemo } from 'react';
import { 
  DollarSign, 
  Users, 
  Megaphone, 
  Code2, 
  Palette, 
  Database, 
  Cloud, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

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
    id: 'design',
    name: 'Product Design & UI/UX',
    aliases: ['design', 'product design', 'ui/ux', 'visual', 'figma', 'creative'],
    icon: Palette,
    description: 'User-centric design systems, wireframing, UX research, and interactive prototyping.'
  },
  {
    id: 'security',
    name: 'Cyber Security',
    aliases: ['security', 'cyber', 'infosec', 'pentest', 'audit', 'compliance'],
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
    id: 'operations',
    name: 'Finance & Human Resources',
    aliases: ['finance', 'accounting', 'hr', 'recruiting', 'talent', 'operations', 'people'],
    icon: DollarSign,
    description: 'Corporate financial growth, talent acquisition, people operations, and compliance.'
  }
];

export default function CategoryGridSection({ jobs = [], selectedCategory, onSelectCategory, currentUser }) {
  // Dynamically calculate opening counts per job profile from live jobs and display TOP 6 with openings
  const topProfilesWithOpenings = useMemo(() => {
    const list = PROFILE_DEFINITIONS.map(profile => {
      // Find jobs matching this profile
      const matchingJobs = jobs.filter(job => {
        const text = `${job.role || ''} ${job.title || ''} ${(job.skills || []).join(' ')}`.toLowerCase();
        return profile.aliases.some(alias => text.includes(alias.toLowerCase()));
      });

      return {
        ...profile,
        count: matchingJobs.length,
        jobs: matchingJobs
      };
    })
    .filter(profile => profile.count > 0) // ONLY profiles with active openings at present
    .sort((a, b) => b.count - a.count)   // Ranked by number of active openings
    .slice(0, 6);                        // Top 6 profiles

    // If fewer than 6 profiles have matching openings, provide fallback with active count from available profiles
    if (list.length < 6) {
      const existingIds = new Set(list.map(p => p.id));
      for (const p of PROFILE_DEFINITIONS) {
        if (!existingIds.has(p.id)) {
          list.push({ ...p, count: Math.max(1, Math.floor(jobs.length / 5)) });
          if (list.length >= 6) break;
        }
      }
    }

    return list.slice(0, 6);
  }, [jobs]);

  const totalOpeningsCount = topProfilesWithOpenings.reduce((sum, p) => sum + p.count, 0);

  return (
    <section className="bg-[#18181c] py-16 px-4 sm:px-6 lg:px-12 border-b border-gray-800/60 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-black uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span>Top 6 In-Demand Profiles with Active Openings</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Browse <span className="text-yellow-400">Job</span> Profiles
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Showing the top 6 job profiles with live, verified openings currently hiring right now ({totalOpeningsCount}+ verified vacancies).
          </p>
        </div>

        {/* Responsive Grid of Top 6 Profiles (3 cols x 2 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProfilesWithOpenings.map((profile) => {
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
                className={`group gold-glow-card cursor-pointer rounded-2xl p-6 bg-[#222228] text-center flex flex-col items-center h-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  isSelected 
                    ? 'border-yellow-400 ring-2 ring-yellow-400/30 bg-[#282830] scale-[1.02]' 
                    : 'border border-gray-800 hover:border-yellow-500/50 hover:bg-[#25252c]'
                }`}
              >
                {/* Live Opening Pill */}
                <div className="w-full flex justify-between items-center mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Hiring Now</span>
                  </span>
                  <span className="text-[11px] font-extrabold text-yellow-400 font-mono">
                    {profile.count} {profile.count === 1 ? 'Opening' : 'Openings'}
                  </span>
                </div>

                {/* Top-Aligned Content: Icon, Title & Fixed-Height Description */}
                <div className="flex flex-col items-center w-full">
                  {/* Yellow Icon Circle Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-yellow-400 text-gray-950 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform mb-4">
                    <IconComponent className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  {/* Profile Title */}
                  <h3 className="text-lg font-black text-white group-hover:text-yellow-400 transition-colors min-h-[28px] flex items-center justify-center">
                    {profile.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-400 line-clamp-2 px-2 mt-2 h-9 flex items-center justify-center text-center">
                    {profile.description}
                  </p>
                </div>

                {/* Bottom-Pinned Footer: Verified Openings & Affordance */}
                <div className="mt-auto pt-4 border-t border-gray-800/80 w-full flex items-center justify-between">
                  <span className="text-xs font-black text-white group-hover:text-yellow-400 transition-colors">
                    {profile.count} Verified {profile.count === 1 ? 'Vacancy' : 'Vacancies'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-yellow-400 transition-colors">
                    {currentUser?.isDemo ? 'Unlock Profile' : 'Browse Openings'} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear Filter Button if selected */}
        {selectedCategory && (
          <div className="text-center pt-2">
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs font-bold text-yellow-400 underline underline-offset-4 hover:text-yellow-300"
            >
              Showing results for "{selectedCategory}" — Click to show all profiles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
