import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Star, 
  ThumbsUp, 
  Sparkles, 
  PlusCircle, 
  HelpCircle, 
  MessageSquare, 
  Briefcase, 
  ShieldCheck, 
  Clock, 
  Filter,
  CheckCircle2,
  Share2,
  UserCheck
} from 'lucide-react';

export default function ExperienceBoardSection({ 
  currentUser, 
  onOpenShareModal,
  onRequireLogin
}) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, INTERVIEW_EXPERIENCE, WORK_EXPERIENCE, CAREER_TIPS
  const [upvotedIds, setUpvotedIds] = useState(new Set());

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experiences');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      } else {
        throw new Error('Fallback to local data');
      }
    } catch (err) {
      // Load fallback community data + local user experiences
      let localExps = [];
      try {
        localExps = JSON.parse(localStorage.getItem('jobproof_shared_experiences') || '[]');
      } catch (e) {}

      const defaultSeeds = [
        {
          id: 101,
          companyName: 'Stripe',
          jobTitle: 'Senior Backend Engineer',
          userName: 'Cooper Curtis',
          experienceType: 'INTERVIEW_EXPERIENCE',
          employmentType: 'FULL_TIME',
          workMode: 'HYBRID',
          location: 'San Francisco, CA',
          yearsOfExperience: 5.5,
          rating: 5,
          difficultyLevel: 'HARD',
          interviewRounds: 4,
          questionsAsked: '1. Design an idempotent payment webhook delivery queue.\n2. Concurrency handling in PostgreSQL using pessimistic vs optimistic locks.\n3. Live coding: Rate limiter using token bucket algorithm in Java.',
          experienceStory: 'The interview process at Stripe was exceptionally thorough yet collaborative. Round 1 was an architecture deep dive, followed by 2 live coding sessions that simulated real Stripe engineering workflows.',
          tipsAndAdvice: 'Focus deeply on distributed systems, idempotency keys, database transaction isolation levels, and writing clean, testable code.',
          offerStatus: 'OFFERED_ACCEPTED',
          anonymous: false,
          upvotes: 19,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 102,
          companyName: 'Datadog',
          jobTitle: 'Cloud Infrastructure & SRE Engineer',
          userName: 'Alex Morgan',
          experienceType: 'INTERVIEW_EXPERIENCE',
          employmentType: 'FULL_TIME',
          workMode: 'REMOTE',
          location: 'Remote, US',
          yearsOfExperience: 4.5,
          rating: 4,
          difficultyLevel: 'MEDIUM',
          interviewRounds: 3,
          questionsAsked: '1. How do you troubleshoot high tail latency in Kubernetes pods?\n2. Kafka partition rebalancing strategies.\n3. Prometheus metrics alerting best practices.',
          experienceStory: 'Very transparent communication from the recruitment team. The technical screening tested practical troubleshooting on Linux systems rather than abstract algorithmic puzzles.',
          tipsAndAdvice: 'Be ready to read log traces, explain eBPF or container networking basics, and highlight hands-on incident response experience.',
          offerStatus: 'OFFERED_ACCEPTED',
          anonymous: false,
          upvotes: 14,
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
        },
        {
          id: 103,
          companyName: 'Google',
          jobTitle: 'Full Stack Software Engineer',
          userName: 'Anonymous Candidate',
          experienceType: 'INTERVIEW_EXPERIENCE',
          employmentType: 'FULL_TIME',
          workMode: 'HYBRID',
          location: 'Mountain View, CA',
          yearsOfExperience: 3.0,
          rating: 5,
          difficultyLevel: 'HARD',
          interviewRounds: 5,
          questionsAsked: '1. Binary Tree maximum path sum with path reconstruction.\n2. Design Google Docs real-time collaborative text editor.\n3. Behavioral: Handling production incidents and cross-team conflicts.',
          experienceStory: 'Google onsite consisted of 3 coding rounds, 1 system design round, and 1 Googliness & Leadership round. The system design round focused heavily on operational data consistency and operational transformation.',
          tipsAndAdvice: 'Practice algorithmic thinking out loud and communicate trade-offs when designing high-scale distributed caches.',
          offerStatus: 'OFFERED_ACCEPTED',
          anonymous: true,
          upvotes: 27,
          createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
        }
      ];

      setExperiences([...localExps, ...defaultSeeds]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleUpvote = async (id) => {
    if (upvotedIds.has(id)) return;

    setUpvotedIds(prev => new Set(prev).add(id));
    setExperiences(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, upvotes: (exp.upvotes || 0) + 1 };
      }
      return exp;
    }));

    try {
      await fetch(`/api/experiences/${id}/upvote`, { method: 'POST' });
    } catch (e) {}
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesFilter = activeFilter === 'ALL' || exp.experienceType === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesFilter;

    const matchesQuery = 
      (exp.companyName && exp.companyName.toLowerCase().includes(query)) ||
      (exp.jobTitle && exp.jobTitle.toLowerCase().includes(query)) ||
      (exp.experienceStory && exp.experienceStory.toLowerCase().includes(query)) ||
      (exp.questionsAsked && exp.questionsAsked.toLowerCase().includes(query));

    return matchesFilter && matchesQuery;
  });

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'EASY':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Easy</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Medium</span>;
      case 'HARD':
      case 'VERY_HARD':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Hard</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Candidate Experience & Interview Insights
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl">
            Real interview questions, hiring rounds, and workplace feedback shared directly by authenticated candidates and engineers.
          </p>
        </div>

        <button
          onClick={() => {
            if (currentUser?.isDemo) {
              onRequireLogin && onRequireLogin("Please register or log in to share your interview experience with the community.");
              return;
            }
            onOpenShareModal && onOpenShareModal();
          }}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-sm shadow-xl shadow-yellow-500/20 transition active:scale-95 whitespace-nowrap"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Share Your Experience</span>
        </button>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 py-6">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company (e.g. Stripe, Google) or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1e24] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: 'ALL', label: 'All Reviews' },
            { id: 'INTERVIEW_EXPERIENCE', label: 'Interview Experiences' },
            { id: 'WORK_EXPERIENCE', label: 'Work Culture' },
            { id: 'CAREER_TIPS', label: 'Preparation Tips' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-yellow-400 text-gray-950 shadow-sm'
                  : 'bg-[#1e1e24] border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experiences List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading community experiences from database...
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="py-16 text-center bg-[#1e1e24]/40 border border-gray-800 rounded-2xl p-8">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Experiences Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            Be the first to share an interview experience or company review for the community!
          </p>
          <button
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-gray-950 font-bold text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Experience Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredExperiences.map((exp) => (
            <div 
              key={exp.id}
              className="bg-[#1e1e24] border border-gray-800 hover:border-gray-700/80 rounded-2xl p-6 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header Info */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-black text-white">{exp.companyName}</h3>
                      {getDifficultyBadge(exp.difficultyLevel)}
                    </div>
                    <p className="text-xs font-semibold text-yellow-400 mt-0.5">
                      {exp.jobTitle} • {exp.workMode}
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-[#18181c] px-2.5 py-1 rounded-xl border border-gray-800">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{exp.rating || 5}.0</span>
                  </div>
                </div>

                {/* Offer Status & Rounds Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded-lg bg-gray-800/80 text-[11px] text-gray-300 font-medium">
                    {exp.interviewRounds || 1} Rounds
                  </span>
                  {exp.offerStatus === 'OFFERED_ACCEPTED' && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Offer Accepted
                    </span>
                  )}
                  {exp.location && (
                    <span className="px-2 py-0.5 rounded-lg bg-gray-800/80 text-[11px] text-gray-400">
                      📍 {exp.location}
                    </span>
                  )}
                </div>

                {/* Questions Asked Section */}
                {exp.questionsAsked && (
                  <div className="mb-4 bg-[#18181c] p-3.5 rounded-xl border border-gray-800/80">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-yellow-400" />
                      Key Questions & Challenges Asked:
                    </span>
                    <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed">
                      {exp.questionsAsked}
                    </p>
                  </div>
                )}

                {/* Detailed Story */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Process & Experience:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                    {exp.experienceStory}
                  </p>
                </div>

                {/* Preparation Tips */}
                {exp.tipsAndAdvice && (
                  <div className="mb-4 p-3 bg-yellow-400/5 border border-yellow-400/15 rounded-xl">
                    <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider block mb-1">
                      💡 Advice for Candidates:
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {exp.tipsAndAdvice}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer: Author & Upvote */}
              <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
                    {exp.anonymous ? '?' : (exp.userName ? exp.userName.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <span>{exp.anonymous ? 'Anonymous Candidate' : (exp.userName || 'Community Member')}</span>
                </div>

                <button
                  onClick={() => handleUpvote(exp.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    upvotedIds.has(exp.id)
                      ? 'bg-yellow-400 text-gray-950 shadow-md shadow-yellow-500/20'
                      : 'bg-[#18181c] border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${upvotedIds.has(exp.id) ? 'fill-gray-950' : ''}`} />
                  <span>Helpful ({exp.upvotes || 0})</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
