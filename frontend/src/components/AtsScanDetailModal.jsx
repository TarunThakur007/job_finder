import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  User, 
  Mail, 
  Check, 
  ArrowRight,
  BookOpen,
  Download
} from 'lucide-react';

export default function AtsScanDetailModal({ scan, onClose, onAuditUpdated }) {
  if (!scan) return null;

  const atsScore = scan.overallAtsScore ?? scan.atsScore ?? 85;
  const targetRole = scan.targetJobRole || scan.targetRole || 'Software Professional';
  const fileName = scan.filename || scan.fileName || 'resume.pdf';
  const candidateName = scan.candidateName || (fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') : 'Candidate User');
  const candidateEmail = scan.candidateEmail || (candidateName ? `${candidateName.toLowerCase().replace(/\s+/g, '.')}@candidate.io` : 'candidate@jobproof.io');
  const analyzedAt = scan.analyzedAt || scan.uploadedAt || 'Recently';
  const extractedSkills = scan.extractedSkills || [];
  const missingSkills = scan.missingCriticalSkills || scan.missingSkills || [];
  const bulletImprovements = (scan.bulletEnhancements || scan.bulletImprovements || []).map(b => ({
    original: b.originalBullet || b.original,
    improved: b.improvedBullet || b.improved,
    reason: b.improvementReason || b.reason
  }));
  const recommendations = scan.improvementRecommendations || scan.recommendations || [];
  const rawReadiness = scan.careerReadiness || (atsScore >= 88 ? 'CAREER_READY' : (missingSkills.length > 2 ? 'NEEDS_UPSKILLING' : 'WEAK_BULLETS'));

  const [auditNotes, setAuditNotes] = useState(scan.adminNotes || '');
  const [appropriate, setAppropriate] = useState(scan.appropriateUsage !== false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-yellow-400 border-yellow-500/30 bg-yellow-400/15';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getReadinessBadge = (r) => {
    switch (r?.toUpperCase()) {
      case 'CAREER_READY':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
          label: 'Career Ready - High ATS Match',
          desc: 'Resume aligns closely with current job market requirements.'
        };
      case 'NEEDS_UPSKILLING':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
          label: 'Needs Key Skill Upskilling',
          desc: 'Missing key domain tools or competencies for the target role.'
        };
      case 'WEAK_BULLETS':
        return {
          bg: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
          label: 'Action Bullets Need STAR Impact',
          desc: 'Experience entries lack measurable metrics or outcome verbs.'
        };
      default:
        return {
          bg: 'bg-yellow-400/15 text-yellow-400 border-yellow-500/30',
          label: 'Evaluating Career Fit',
          desc: 'Diagnostic in review.'
        };
    }
  };

  const readinessInfo = getReadinessBadge(rawReadiness);

  const handleSaveAudit = () => {
    setSavedSuccess(true);
    if (onAuditUpdated) {
      onAuditUpdated({
        ...scan,
        appropriateUsage: appropriate,
        adminNotes: auditNotes
      });
    }
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1c1c22] border border-gray-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn my-auto">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-800 flex items-start justify-between gap-4 bg-[#222228]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/15 border border-yellow-500/30 text-yellow-300 flex items-center justify-center font-black text-xl flex-shrink-0">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white">{candidateName}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${readinessInfo.bg}`}>
                  {readinessInfo.label}
                </span>
                {appropriate ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> Legitimate Career Journey Data
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3" /> Flagged for Review
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
                  Target: <strong className="text-white">{targetRole}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  {candidateEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  {fileName}
                </span>
                {analyzedAt && (
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {analyzedAt.toString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/api/admin/resume-scans/${scan.id}/download`}
              download={fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs shadow-md shadow-yellow-500/20 transition active:scale-95 cursor-pointer"
              title="Download full candidate resume file from database"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Resume</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Top Score & Diagnostic Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${getScoreColor(atsScore)}`}>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Overall ATS Score</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black">{atsScore}</span>
                  <span className="text-sm font-semibold opacity-70">/ 100</span>
                </div>
                <p className="text-[11px] mt-1 text-gray-300">Automated Parser Evaluation</p>
              </div>
              <div className="w-14 h-14 rounded-2xl border border-current/20 flex items-center justify-center font-black text-2xl">
                <Award className="w-7 h-7" />
              </div>
            </div>

            <div className="bg-[#222228] p-4 rounded-2xl border border-gray-800 md:col-span-2 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">Career Readiness Assessment</p>
                <h4 className="text-sm font-bold text-white mt-1">{readinessInfo.label}</h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{readinessInfo.desc}</p>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-gray-800/80 mt-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {extractedSkills.length} Matched Skills
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> {missingSkills.length} Skill Gaps
                </span>
                <span className="flex items-center gap-1.5 text-yellow-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> {bulletImprovements.length} AI Bullet Upgrades
                </span>
              </div>
            </div>
          </div>

          {/* Extracted Skills vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Extracted Skills */}
            <div className="bg-[#222228] p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Found Competencies & Skills</span>
                </h4>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  {extractedSkills.length} Identified
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-40 overflow-y-auto">
                {extractedSkills.length > 0 ? (
                  extractedSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium">
                      {sk}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No skills extracted from resume</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-[#222228] p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Missing Skills for Target Role</span>
                </h4>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                  {missingSkills.length} Gaps
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-40 overflow-y-auto">
                {missingSkills.length > 0 ? (
                  missingSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium">
                      + {sk}
                    </span>
                  ))
                ) : (
                  <p className="text-emerald-400 font-medium">✓ Outstanding match! No critical skill gaps detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* AI Bullet Point Transformations (STAR Method) */}
          {bulletImprovements.length > 0 && (
            <div className="bg-[#222228] p-5 rounded-2xl border border-gray-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>AI Resume Bullet Improvements (STAR Method)</span>
                </h4>
                <span className="text-[10px] text-gray-400">User's Career Enhancement Output</span>
              </div>

              <div className="space-y-3">
                {bulletImprovements.map((b, idx) => (
                  <div key={idx} className="bg-[#18181c] p-4 rounded-xl border border-gray-800 space-y-2.5">
                    {b.original && (
                      <div>
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">User's Original Bullet:</span>
                        <p className="text-gray-300 text-xs bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20 italic">
                          "{b.original}"
                        </p>
                      </div>
                    )}
                    {b.improved && (
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          JobProof AI Career-Optimized Bullet:
                        </span>
                        <p className="text-emerald-200 text-xs bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20 font-medium">
                          "{b.improved}"
                        </p>
                      </div>
                    )}
                    {b.reason && (
                      <p className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1">
                        <ArrowRight className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                        <span><strong>Enhancement Rationale:</strong> {b.reason}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Recommendations for Candidate Career Path */}
          {recommendations.length > 0 && (
            <div className="bg-[#222228] p-5 rounded-2xl border border-gray-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-yellow-400" />
                <span>Actionable Recommendations Generated for User</span>
              </h4>
              <ul className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-gray-300 text-xs bg-[#18181c] p-2.5 rounded-xl border border-gray-800/80">
                    <span className="w-5 h-5 rounded-full bg-yellow-400/15 text-yellow-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Admin Audit & Career Journey Quality Verification */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-yellow-400" />
                  <span>Admin Quality Verification & Career Building Audit</span>
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Confirm the candidate is using the tool smoothly with appropriate, legitimate career data.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#18181c] px-3 py-1.5 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition">
                <input
                  type="checkbox"
                  checked={appropriate}
                  onChange={(e) => setAppropriate(e.target.checked)}
                  className="rounded text-yellow-400 focus:ring-0 bg-gray-900 border-gray-700 w-4 h-4"
                />
                <span className="text-xs font-bold text-white">Appropriate Career Data</span>
              </label>
            </div>

            <div>
              <textarea
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                placeholder="Optional admin audit notes on candidate's career progression or tool usage..."
                rows={2}
                className="w-full p-3 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400">
                {savedSuccess ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Audit observation recorded!
                  </span>
                ) : 'Audit status informs platform health analytics.'}
              </span>
              <button
                type="button"
                onClick={handleSaveAudit}
                className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black font-bold text-xs transition active:scale-95 shadow-md shadow-yellow-500/20"
              >
                Save Audit Note
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#222228] flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">
            Scan ID: {scan.id || 'N/A'} • Evaluated by JobProof AI
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
