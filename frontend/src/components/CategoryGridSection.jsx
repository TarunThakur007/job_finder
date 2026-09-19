import React from 'react';
import { 
  DollarSign, 
  Users, 
  Megaphone, 
  Code2, 
  Palette, 
  Database, 
  Cloud, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'finance',
    name: 'Finance',
    icon: DollarSign,
    count: '500+ new job posted',
    description: 'Explore financial records and transactions'
  },
  {
    id: 'hr',
    name: 'Human Resource',
    icon: Users,
    count: '600+ new job posted',
    description: 'Recruit, manage, and support company employees'
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    icon: Megaphone,
    count: '1k+ new job posted',
    description: 'Promote brands online with marketing strategies'
  },
  {
    id: 'developer',
    name: 'Web Developer',
    icon: Code2,
    count: '2k+ new job posted',
    description: 'Build and maintain websites for clients'
  },
  {
    id: 'design',
    name: 'Arts & Design',
    icon: Palette,
    count: '500+ new job posted',
    description: 'Create visual content for branding and media'
  },
  {
    id: 'data',
    name: 'Data Science & AI',
    icon: Database,
    count: '800+ new job posted',
    description: 'Analyze data pipelines and machine learning models'
  },
  {
    id: 'cloud',
    name: 'Cloud Architecture',
    icon: Cloud,
    count: '450+ new job posted',
    description: 'Manage cloud infrastructure and DevOps pipelines'
  },
  {
    id: 'security',
    name: 'Cyber Security',
    icon: ShieldCheck,
    count: '350+ new job posted',
    description: 'Secure networks and conduct security audits'
  }
];

export default function CategoryGridSection({ selectedCategory, onSelectCategory }) {
  return (
    <section className="bg-[#18181c] py-16 px-4 sm:px-6 lg:px-12 border-b border-gray-800/60 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Browse <span className="text-yellow-400">Job</span> Category
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Explore diverse job opportunities tailored to your skills. Start your career journey today!
          </p>
        </div>

        {/* Responsive Grid of Category Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                aria-label={`Browse ${cat.name} jobs: ${cat.count}`}
                onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onSelectCategory) onSelectCategory(cat.name);
                  }
                }}
                className={`group gold-glow-card cursor-pointer rounded-2xl p-6 bg-[#222228] text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  isSelected ? 'border-yellow-400 ring-2 ring-yellow-400/30 bg-[#282830]' : 'border-gray-800'
                }`}
              >
                {/* Yellow Icon Circle Badge */}
                <div className="w-14 h-14 rounded-full bg-yellow-400 text-gray-950 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-7 h-7 stroke-[2.2]" />
                </div>

                {/* Category Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 px-2">
                    {cat.description}
                  </p>
                </div>

                {/* Job Count & Browse Affordance */}
                <div className="pt-3 border-t border-gray-800/80 w-full flex items-center justify-between">
                  <span className="text-xs font-extrabold text-yellow-400 tracking-wide">
                    {cat.count}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-yellow-400 transition-colors">
                    Browse Jobs <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
              className="text-xs font-semibold text-yellow-400 underline underline-offset-4 hover:text-yellow-300"
            >
              Show all categories
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
