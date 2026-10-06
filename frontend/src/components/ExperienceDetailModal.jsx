import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Briefcase, 
  Star, 
  HelpCircle, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Check, 
  User, 
  Mail, 
  Clock, 
  MapPin, 
  Award, 
  ShieldCheck,
  Flag
} from 'lucide-react';

export default function ExperienceDetailModal({ experience, onClose, onStatusUpdated, onDelete }) {
  if (!experience) return null;

  const [currentStatus, setCurrentStatus] = useState(experience.status || 'APPROVED');
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      if (onStatusUpdated) {
        await onStatusUpdated(experience.id, newStatus);
      }
      setCurrentStatus(newStatus);
      setActionSuccess(`Status changed to ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff?.toUpperCase()) {
      case 'HARD':
      case 'CHALLENGING':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getOfferBadge = (outcome) => {
    const o = outcome?.toUpperCase() || '';
    if (o.includes('OFFER') || o.includes('ACCEPTED')) {
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    } else if (o.includes('REJECT')) {
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
    return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  };

  const getStatusBadge = (st) => {
    switch (st?.toUpperCase()) {
      case 'APPROVED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'FLAGGED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1c1c22] border border-gray-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn my-auto">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-800 flex items-start justify-between gap-4 bg-[#222228]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/15 border border-yellow-500/30 text-yellow-300 flex items-center justify-center font-black text-xl flex-shrink-0">
              <Building2 className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white">{experience.companyName || 'Target Company'}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(currentStatus)}`}>
                  {currentStatus}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadge(experience.difficultyLevel)}`}>
                  {experience.difficultyLevel || 'Medium'} Difficulty
                </span>
                {experience.offerStatus && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getOfferBadge(experience.offerStatus)}`}>
                    {experience.offerStatus}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-gray-200 font-semibold">
                  <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
                  {experience.jobTitle || 'Role Not Specified'}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  {experience.anonymous ? 'Shared Anonymously' : (experience.userName || 'Community Candidate')}
                </span>
                {experience.userEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    {experience.userEmail}
                  </span>
                )}
                {experience.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    {experience.location}
                  </span>
                )}
                {experience.createdAt && (
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(experience.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {actionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#222228] p-3.5 rounded-2xl border border-gray-800">
              <p className="text-[10px] uppercase font-bold text-gray-400">Interview Rating</p>
              <div className="flex items-center gap-1 mt-1 text-amber-400 font-bold text-base">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{experience.rating || 5} / 5</span>
              </div>
            </div>

            <div className="bg-[#222228] p-3.5 rounded-2xl border border-gray-800">
              <p className="text-[10px] uppercase font-bold text-gray-400">Rounds Faced</p>
              <p className="text-base font-extrabold text-white mt-1">
                {experience.interviewRounds || 1} Rounds
              </p>
            </div>

            <div className="bg-[#222228] p-3.5 rounded-2xl border border-gray-800">
              <p className="text-[10px] uppercase font-bold text-gray-400">Candidate Experience</p>
              <p className="text-base font-extrabold text-yellow-400 mt-1">
                {experience.yearsOfExperience ? `${experience.yearsOfExperience} Yrs` : 'Entry / College'}
              </p>
            </div>

            <div className="bg-[#222228] p-3.5 rounded-2xl border border-gray-800">
              <p className="text-[10px] uppercase font-bold text-gray-400">Community Upvotes</p>
              <div className="flex items-center gap-1.5 mt-1 text-white font-bold text-base">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                <span>{experience.upvotes || 0} Helpful</span>
              </div>
            </div>
          </div>

          {/* Interview Questions Encounted */}
          <div className="bg-[#222228] p-5 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-yellow-400" />
                <span>Interview Questions & Technical Challenges Reported</span>
              </h4>
              <span className="text-[10px] text-gray-400">Career Knowledge Contribution</span>
            </div>

            {(() => {
              const parsedQuestions = Array.isArray(experience.questionsAsked)
                ? experience.questionsAsked
                : typeof experience.questionsAsked === 'string'
                ? experience.questionsAsked.split('\n').map(q => q.trim()).filter(q => q.length > 0)
                : [];

              return parsedQuestions.length > 0 ? (
                <div className="space-y-2">
                  {parsedQuestions.map((q, idx) => (
                    <div key={idx} className="bg-[#18181c] p-3 rounded-xl border border-gray-800 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/15 text-yellow-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <p className="text-gray-200 text-xs leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No specific questions listed separately in submission.</p>
              );
            })()}
          </div>

          {/* Full Narrative Experience Story */}
          <div className="bg-[#222228] p-5 rounded-2xl border border-gray-800 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
              <MessageSquare className="w-4 h-4 text-yellow-400" />
              <span>Full Candidate Interview Journey & Story</span>
            </h4>
            <div className="bg-[#18181c] p-4 rounded-xl border border-gray-800 text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">
              {experience.experienceStory || 'No story details provided.'}
            </div>
          </div>

          {/* Preparation Tips & Career Advice */}
          {experience.tipsAndAdvice && (
            <div className="bg-[#222228] p-5 rounded-2xl border border-gray-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Candidate's Advice to Future Applicants</span>
              </h4>
              <div className="bg-[#18181c] p-4 rounded-xl border border-gray-800 text-emerald-200 text-xs leading-relaxed italic">
                "{experience.tipsAndAdvice}"
              </div>
            </div>
          )}

          {/* Admin Moderation Bar: Appropriate Data Check */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-yellow-400" />
                  <span>Admin Moderation & Content Appropriateness Control</span>
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Verify candidate experience is legitimate, free of spam or confidential leaks, and beneficial for job seekers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleUpdateStatus('APPROVED')}
                disabled={updating || currentStatus === 'APPROVED'}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Verify for Community</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('FLAGGED')}
                disabled={updating || currentStatus === 'FLAGGED'}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Flag for Investigation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onDelete) {
                    onDelete(experience.id, experience.companyName);
                    onClose();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition flex items-center gap-1.5 ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Inappropriate Content</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#222228] flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">
            Submission ID #{experience.id} • User Experience Board
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs transition"
          >
            Close Story
          </button>
        </div>

      </div>
    </div>
  );
}
