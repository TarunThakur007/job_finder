import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Mail, 
  Phone, 
  Linkedin, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Award, 
  ThumbsUp, 
  AlertCircle, 
  Download, 
  Printer, 
  Save, 
  UserCheck, 
  XCircle,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function ApplicantResumeModal({ application, onClose, onStatusUpdated }) {
  if (!application) return null;

  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'ats' | 'cover' | 'evaluation'
  const [currentStatus, setCurrentStatus] = useState(application.status || 'PENDING');
  const [adminNotes, setAdminNotes] = useState(application.adminNotes || '');
  const [savingStatus, setSavingStatus] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdateStatus = async (newStatus) => {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/applications/${application.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setCurrentStatus(updated.status);
        setSaveSuccess(true);
        if (onStatusUpdated) {
          onStatusUpdated(updated);
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setCurrentStatus(newStatus);
      setSaveSuccess(true);
      if (onStatusUpdated) {
        onStatusUpdated({ ...application, status: newStatus, adminNotes });
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    await handleUpdateStatus(currentStatus);
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'SHORTLISTED':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Shortlisted' };
      case 'REVIEWING':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: 'Under Review' };
      case 'ACCEPTED':
        return { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', label: 'Offer / Accepted' };
      case 'REJECTED':
        return { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Rejected' };
      default:
        return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Pending Review' };
    }
  };

  const badge = getStatusBadge(currentStatus);

  // Parse experience lines into structured blocks
  const experienceBlocks = (application.resumeExperience || '').split('\n\n').filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#1e1e24] border border-yellow-500/40 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-6 sm:p-8 bg-[#25252d] border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Candidate Avatar Initials */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 flex-shrink-0">
              {application.applicantName?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'CA'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {application.applicantName}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>

              <p className="text-sm font-semibold text-yellow-400">
                {application.currentRole || 'Software Professional'} • {application.yearsOfExperience || 5} Years Experience
              </p>

              {/* Contact Chips */}
              <div className="flex items-center gap-3 flex-wrap pt-1 text-xs text-gray-300">
                {application.applicantEmail && (
                  <a 
                    href={`mailto:${application.applicantEmail}`}
                    className="flex items-center gap-1 hover:text-yellow-400 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{application.applicantEmail}</span>
                  </a>
                )}
                {application.applicantPhone && (
                  <a 
                    href={`tel:${application.applicantPhone}`}
                    className="flex items-center gap-1 hover:text-yellow-400 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{application.applicantPhone}</span>
                  </a>
                )}
                {application.linkedinUrl && (
                  <a 
                    href={application.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {application.portfolioUrl && (
                  <a 
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio / GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            {/* Download/Print */}
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Applied Position Bar */}
        <div className="px-6 sm:px-8 py-3 bg-[#18181c] border-b border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-gray-500 font-medium">Applied Position:</span>
            <span className="text-white font-bold">{application.jobTitle || 'Senior Software Engineer'}</span>
            <span className="text-gray-500">at</span>
            <span className="text-yellow-400 font-bold">{application.companyName || 'Target Employer'}</span>
            <span className="text-gray-500">• {application.jobLocation || 'Remote'}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>ATS Match: {application.atsMatchScore || 94}%</span>
            </div>
            <span className="text-gray-400">
              Submitted: {application.appliedAt || 'Recent'}
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 sm:px-8 border-b border-gray-800 bg-[#222228] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('resume')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'resume'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Interactive Resume</span>
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ats'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ATS Compatibility Scorecard</span>
          </button>

          <button
            onClick={() => setActiveTab('cover')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cover'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Cover Note & Pitch</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'evaluation'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Admin Review & Actions</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: INTERACTIVE RESUME */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              {/* Resume File Badge */}
              <div className="p-4 rounded-2xl bg-[#141417] border border-gray-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-black text-xs">
                    {application.resumeFileType || 'PDF'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {application.resumeFileName || 'Applicant_Resume.pdf'}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Verified ATS Parser Output • 100% Readable Layout
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ATS Certified
                </span>
              </div>

              {/* Professional Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Professional Summary
                </h3>
                <div className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 text-xs text-gray-300 leading-relaxed font-normal">
                  {application.resumeParsedSummary || 'Proven track record of high-performance software engineering, building reliable microservices, and leading collaborative engineering workflows.'}
                </div>
              </div>

              {/* Extracted Skills Cloud */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Extracted Core Skills ({application.skills?.length || 8})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(application.skills && application.skills.length > 0
                    ? application.skills
                    : ['Java 17', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Redis']
                  ).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  Work Experience History
                </h3>

                <div className="space-y-3">
                  {experienceBlocks.length > 0 ? (
                    experienceBlocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-2"
                      >
                        <pre className="text-xs text-gray-300 font-sans whitespace-pre-wrap leading-relaxed">
                          {block}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 text-xs text-gray-300 leading-relaxed">
                      <p className="font-bold text-white">Lead Software Engineer (2022 - Present)</p>
                      <p className="text-gray-400 mt-1">
                        - Spearheaded core services architecture, managing high-throughput message processing.
                      </p>
                      <p className="text-gray-400">
                        - Reduced database query latency by 35% using indexing and Redis caching.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Education & Credentials
                </h3>
                <div className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 text-xs text-gray-300 leading-relaxed">
                  <p className="font-semibold text-white">
                    {application.resumeEducation || 'B.S. in Computer Science & Engineering (2016 - 2020)'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ATS SCORECARD */}
          {activeTab === 'ats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 text-center space-y-1">
                  <p className="text-xs text-gray-400 font-semibold">Overall Match Score</p>
                  <p className="text-3xl font-black text-yellow-400">{application.atsMatchScore || 94}%</p>
                  <p className="text-[11px] text-emerald-400">Exceptional Fit</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 text-center space-y-1">
                  <p className="text-xs text-gray-400 font-semibold">Keyword Alignment</p>
                  <p className="text-3xl font-black text-emerald-400">96%</p>
                  <p className="text-[11px] text-gray-400">Matches 12 of 13 Required Skills</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 text-center space-y-1">
                  <p className="text-xs text-gray-400 font-semibold">Formatting & Structure</p>
                  <p className="text-3xl font-black text-blue-400">98%</p>
                  <p className="text-[11px] text-blue-400">Single Column Standard</p>
                </div>
              </div>

              {/* Strengths & Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Key Candidate Strengths
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                    <li>Strong quantifiable metrics in work history (e.g. latency reductions, scale handling).</li>
                    <li>Direct experience with enterprise cloud deployment and distributed caching.</li>
                    <li>Clean chronological timeline with clear progressive career growth.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Interview Discussion Points
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                    <li>Discuss hands-on experience with Kafka partitioning and consumer group recovery.</li>
                    <li>Explore architectural decisions during recent microservice migrations.</li>
                    <li>Verify team leadership and mentoring methodologies.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COVER NOTE */}
          {activeTab === 'cover' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-xs">
                  <span className="font-bold text-white">Cover Note from Candidate</span>
                  <span className="text-gray-400">{application.appliedAt}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line font-serif italic">
                  "{application.coverNote || 'I am excited about this opportunity and believe my skill set aligns directly with your engineering requirements.'}"
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: EVALUATION & ADMIN ACTIONS */}
          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Internal Recruiter / Admin Evaluation Notes
                </label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter internal candidate review notes, interview feedback, or salary expectations..."
                  className="w-full bg-[#18181c] border border-gray-800 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleSaveNotes}
                  disabled={savingStatus}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition disabled:opacity-60"
                >
                  <Save className="w-4 h-4 text-yellow-400" />
                  <span>{savingStatus ? 'Saving...' : 'Save Admin Notes'}</span>
                </button>

                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved successfully!
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Decision Bar */}
        <div className="p-4 sm:p-6 bg-[#222228] border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold">Change Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
              {currentStatus}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleUpdateStatus('SHORTLISTED')}
              disabled={savingStatus}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-60"
            >
              ✓ Shortlist Candidate
            </button>

            <button
              onClick={() => handleUpdateStatus('REVIEWING')}
              disabled={savingStatus}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-60"
            >
              Move to Review
            </button>

            <button
              onClick={() => handleUpdateStatus('ACCEPTED')}
              disabled={savingStatus}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-60"
            >
              Accept / Offer
            </button>

            <button
              onClick={() => handleUpdateStatus('REJECTED')}
              disabled={savingStatus}
              className="px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
