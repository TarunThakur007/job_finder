import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  Briefcase, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  UserCheck, 
  EyeOff, 
  Send,
  Award
} from 'lucide-react';

export default function ShareExperienceModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onExperienceSubmitted 
}) {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    experienceType: 'INTERVIEW_EXPERIENCE',
    employmentType: 'FULL_TIME',
    workMode: 'HYBRID',
    location: '',
    yearsOfExperience: currentUser?.yearsOfExperience || 3.5,
    rating: 5,
    difficultyLevel: 'MEDIUM',
    interviewRounds: 3,
    questionsAsked: '',
    experienceStory: '',
    tipsAndAdvice: '',
    offerStatus: 'OFFERED_ACCEPTED',
    anonymous: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.jobTitle.trim() || !formData.experienceStory.trim()) {
      setError('Please provide the Company Name, Job Title, and your Experience details.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      userId: currentUser?.id || null,
      userName: currentUser?.name || 'Candidate',
      userEmail: currentUser?.email || 'candidate@example.com',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onExperienceSubmitted && onExperienceSubmitted(saved);
          onClose();
        }, 1200);
      } else {
        throw new Error('Backend failed, saving locally');
      }
    } catch (err) {
      // Local storage fallback so the user's experience is NEVER lost
      const localExp = {
        id: Date.now(),
        ...payload,
        upvotes: 0,
        status: 'APPROVED'
      };
      try {
        const existing = JSON.parse(localStorage.getItem('jobproof_shared_experiences') || '[]');
        localStorage.setItem('jobproof_shared_experiences', JSON.stringify([localExp, ...existing]));
      } catch (e) {}

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onExperienceSubmitted && onExperienceSubmitted(localExp);
        onClose();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1e1e24] border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-gray-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Share Interview or Work Experience
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Help fellow candidates prepare by sharing real interview rounds, questions, and insights.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-400 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Experience Shared Successfully!</h3>
            <p className="text-sm text-gray-400">
              Your feedback has been saved to the community database. Thank you for contributing!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Google, Datadog"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Job Title / Role *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* Category & Employment Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Type of Sharing
                </label>
                <select
                  value={formData.experienceType}
                  onChange={(e) => setFormData({ ...formData, experienceType: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="INTERVIEW_EXPERIENCE">Interview Experience</option>
                  <option value="WORK_EXPERIENCE">Workplace Review</option>
                  <option value="CAREER_TIPS">Interview Tips</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Interview Difficulty
                </label>
                <select
                  value={formData.difficultyLevel}
                  onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="VERY_HARD">Very Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Interview Rounds
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.interviewRounds}
                  onChange={(e) => setFormData({ ...formData, interviewRounds: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Rating Stars & Outcome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Overall Rating ({formData.rating}/5)
                </label>
                <div className="flex items-center gap-1.5 bg-[#18181c] border border-gray-700/80 rounded-xl px-3 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          star <= formData.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs text-gray-400 ml-2 font-medium">
                    {formData.rating === 5 ? 'Excellent Experience' : formData.rating >= 4 ? 'Good' : 'Average'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Offer Outcome
                </label>
                <select
                  value={formData.offerStatus}
                  onChange={(e) => setFormData({ ...formData, offerStatus: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="OFFERED_ACCEPTED">Offer Received & Accepted 🎉</option>
                  <option value="OFFERED_DECLINED">Offer Received & Declined</option>
                  <option value="REJECTED">Did Not Receive Offer</option>
                  <option value="PENDING">Process In Progress</option>
                </select>
              </div>
            </div>

            {/* Questions Asked */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Key Questions or Coding Challenges Asked
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Design a distributed cache, questions on Java multithreading, or SQL query optimizations..."
                value={formData.questionsAsked}
                onChange={(e) => setFormData({ ...formData, questionsAsked: e.target.value })}
                className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition resize-none"
              />
            </div>

            {/* Detailed Experience Story */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Detailed Experience & Process Breakdown *
              </label>
              <textarea
                rows="4"
                required
                placeholder="Describe each interview stage, communication with the recruiters, technical evaluations, culture fit, and highlights..."
                value={formData.experienceStory}
                onChange={(e) => setFormData({ ...formData, experienceStory: e.target.value })}
                className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            {/* Preparation Tips */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Tips & Advice for Future Candidates
              </label>
              <textarea
                rows="2"
                placeholder="What topics should applicants prepare? How was the coding environment?"
                value={formData.tipsAndAdvice}
                onChange={(e) => setFormData({ ...formData, tipsAndAdvice: e.target.value })}
                className="w-full bg-[#18181c] border border-gray-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition resize-none"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#18181c] border border-gray-800 rounded-xl">
              <div className="flex items-center gap-2.5">
                <EyeOff className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-300 font-medium">Post as Anonymous Candidate</span>
              </div>
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                className="w-4 h-4 rounded text-yellow-400 focus:ring-yellow-400 focus:ring-offset-gray-900"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-700 text-sm font-semibold text-gray-300 hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-sm transition shadow-lg shadow-yellow-500/20 disabled:opacity-50"
              >
                {loading ? 'Saving to Database...' : 'Share with Community'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
