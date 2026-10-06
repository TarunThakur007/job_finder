import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  ExternalLink, 
  Edit3, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  X, 
  MessageSquare,
  Award
} from 'lucide-react';

const KANBAN_STAGES = [
  { id: 'SAVED', title: 'Saved & Preparing', icon: '📌', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'APPLIED', title: 'Applied', icon: '📨', color: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' },
  { id: 'REVIEWING', title: 'Under Review', icon: '🔍', color: 'border-yellow-500/30 text-yellow-400 bg-yellow-400/15' },
  { id: 'INTERVIEWING', title: 'Interviewing', icon: '🗣️', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'ACCEPTED', title: 'Offer Extended', icon: '🎉', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' }
];

const INITIAL_DEFAULT_APPLICATIONS = [
  {
    id: 1001,
    companyName: 'Stripe',
    jobTitle: 'Senior Infrastructure Engineer',
    jobLocation: 'San Francisco, CA (Hybrid)',
    jobType: 'Full-Time',
    status: 'INTERVIEWING',
    salary: '$175,000 - $220,000 / yr',
    atsMatchScore: 96,
    appliedAt: 'Sep 18, 2026',
    notes: 'Completed technical screen with Staff Engineer. System Design interview scheduled for next Tuesday focusing on API rate limiting & event streams.',
    applyUrl: 'https://stripe.com/careers'
  },
  {
    id: 1002,
    companyName: 'Airbnb',
    jobTitle: 'Full Stack Product Engineer',
    jobLocation: 'Remote (US/Global)',
    jobType: 'Full-Time',
    status: 'REVIEWING',
    salary: '$160,000 - $195,000 / yr',
    atsMatchScore: 94,
    appliedAt: 'Sep 21, 2026',
    notes: 'Recruiter reached out on LinkedIn. Resume passed initial ATS filter with 94% match score.',
    applyUrl: 'https://careers.airbnb.com'
  },
  {
    id: 1003,
    companyName: 'Datadog',
    jobTitle: 'Distributed Systems Backend Specialist',
    jobLocation: 'New York, NY',
    jobType: 'Full-Time',
    status: 'APPLIED',
    salary: '$170,000 - $210,000 / yr',
    atsMatchScore: 92,
    appliedAt: 'Sep 23, 2026',
    notes: 'Direct employer application submitted via JobProof verified portal.',
    applyUrl: 'https://careers.datadoghq.com'
  },
  {
    id: 1004,
    companyName: 'Google',
    jobTitle: 'Senior Software Engineer (Cloud Platform)',
    jobLocation: 'Sunnyvale, CA',
    jobType: 'Full-Time',
    status: 'ACCEPTED',
    salary: '$190,000 - $245,000 / yr + Equity',
    atsMatchScore: 98,
    appliedAt: 'Aug 29, 2026',
    notes: 'Formal offer extended! Base $215k, currently reviewing equity vesting schedule and benefits package.',
    applyUrl: 'https://careers.google.com'
  },
  {
    id: 1005,
    companyName: 'Netflix',
    jobTitle: 'Real-Time Streaming Systems Engineer',
    jobLocation: 'Los Gatos, CA (Remote)',
    jobType: 'Full-Time',
    status: 'SAVED',
    salary: '$180,000 - $260,000 / yr',
    atsMatchScore: 89,
    appliedAt: 'Preparing application',
    notes: 'Tailoring resume bullet points with Kafka and streaming microservices metrics before submitting.',
    applyUrl: 'https://jobs.netflix.com'
  }
];

export default function ApplicationTrackerSection({ 
  currentUser, 
  liveJobs = [], 
  onRequireRegistration,
  onSelectJob 
}) {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('jobproof_tracked_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_DEFAULT_APPLICATIONS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Application Form State
  const [newAppForm, setNewAppForm] = useState({
    companyName: '',
    jobTitle: '',
    jobLocation: 'Remote',
    salary: '$130k - $180k / yr',
    status: 'APPLIED',
    atsMatchScore: 92,
    applyUrl: '',
    notes: ''
  });

  // Save to localStorage whenever applications change
  useEffect(() => {
    try {
      localStorage.setItem('jobproof_tracked_applications', JSON.stringify(applications));
    } catch (e) {}
  }, [applications]);

  // Sync with backend API if user has email
  useEffect(() => {
    if (currentUser?.email && !currentUser.isDemo) {
      fetch(`/api/applications/my?email=${encodeURIComponent(currentUser.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            // Merge with local applications
            const serverMapped = data.map((d) => ({
              id: d.id,
              companyName: d.companyName || 'Verified Company',
              jobTitle: d.jobTitle || 'Software Engineer',
              jobLocation: d.jobLocation || 'Remote',
              jobType: d.jobType || 'Full-Time',
              status: d.status || 'APPLIED',
              salary: '$140k - $190k / yr',
              atsMatchScore: d.atsMatchScore || 92,
              appliedAt: d.appliedAt || 'Recently',
              notes: d.coverNote || 'Direct application through JobProof verified portal.',
              applyUrl: ''
            }));

            setApplications((prev) => {
              const ids = new Set(serverMapped.map((s) => s.id));
              const remainingLocal = prev.filter((p) => !ids.has(p.id));
              return [...serverMapped, ...remainingLocal];
            });
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  // Stage Transitions
  const handleMoveStage = (appId, direction) => {
    const stageIds = KANBAN_STAGES.map((s) => s.id);
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const currentIdx = stageIds.indexOf(app.status);
        const nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
        if (nextIdx >= 0 && nextIdx < stageIds.length) {
          const nextStatus = stageIds[nextIdx];

          // Async backend update if applicable
          if (typeof app.id === 'number' && app.id < 1000) {
            fetch(`/api/applications/${app.id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: nextStatus, notes: app.notes || '' })
            }).catch(() => {});
          }

          return { ...app, status: nextStatus };
        }
        return app;
      })
    );

    if (selectedAppForDetail && selectedAppForDetail.id === appId) {
      const currentIdx = stageIds.indexOf(selectedAppForDetail.status);
      const nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
      if (nextIdx >= 0 && nextIdx < stageIds.length) {
        setSelectedAppForDetail((prev) => ({ ...prev, status: stageIds[nextIdx] }));
      }
    }
  };

  const handleUpdateNotes = (appId, newNotes) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, notes: newNotes } : app))
    );
    if (selectedAppForDetail && selectedAppForDetail.id === appId) {
      setSelectedAppForDetail((prev) => ({ ...prev, notes: newNotes }));
    }

    if (typeof appId === 'number' && appId < 1000) {
      fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: newNotes })
      }).catch(() => {});
    }
  };

  const handleDeleteApplication = (appId) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    if (selectedAppForDetail && selectedAppForDetail.id === appId) {
      setSelectedAppForDetail(null);
    }
    if (typeof appId === 'number' && appId < 1000) {
      fetch(`/api/applications/${appId}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, appId) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnStage = (e, targetStageId) => {
    e.preventDefault();
    if (!draggedAppId) return;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === draggedAppId) {
          if (typeof app.id === 'number' && app.id < 1000) {
            fetch(`/api/applications/${app.id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: targetStageId, notes: app.notes || '' })
            }).catch(() => {});
          }
          return { ...app, status: targetStageId };
        }
        return app;
      })
    );

    setDraggedAppId(null);
  };

  const handleCreateNewApplication = (e) => {
    e.preventDefault();
    if (!newAppForm.companyName.trim() || !newAppForm.jobTitle.trim()) return;

    const newApp = {
      id: Date.now(),
      companyName: newAppForm.companyName.trim(),
      jobTitle: newAppForm.jobTitle.trim(),
      jobLocation: newAppForm.jobLocation || 'Remote',
      jobType: 'Full-Time',
      status: newAppForm.status || 'APPLIED',
      salary: newAppForm.salary || '$140,000 - $190,000 / yr',
      atsMatchScore: parseInt(newAppForm.atsMatchScore) || 94,
      appliedAt: 'Today',
      notes: newAppForm.notes.trim() || 'Tracked via JobProof Candidate Cockpit.',
      applyUrl: newAppForm.applyUrl.trim()
    };

    setApplications([newApp, ...applications]);
    setShowAddModal(false);
    setNewAppForm({
      companyName: '',
      jobTitle: '',
      jobLocation: 'Remote',
      salary: '$130k - $180k / yr',
      status: 'APPLIED',
      atsMatchScore: 92,
      applyUrl: '',
      notes: ''
    });
  };

  // Filter applications by search term
  const filteredApps = applications.filter((app) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      app.companyName.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      (app.notes && app.notes.toLowerCase().includes(q))
    );
  });

  // Cockpit Analytics
  const totalTracked = applications.length;
  const interviewingCount = applications.filter((a) => a.status === 'INTERVIEWING').length;
  const offersCount = applications.filter((a) => a.status === 'ACCEPTED').length;
  const appliedCount = applications.filter((a) => a.status === 'APPLIED' || a.status === 'REVIEWING').length;
  const conversionRate = totalTracked > 0 ? Math.round(((interviewingCount + offersCount) / totalTracked) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Cockpit Executive Analytics Banner */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-yellow-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>JobProof Candidate Cockpit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Application <span className="text-yellow-400">Kanban Tracker</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Organize your interviews, track company pipeline progression from Applied to Offer, record notes, and monitor your career conversion velocity in one unified dashboard.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#18181c] p-4 rounded-2xl border border-gray-800">
            <div className="px-3 py-1 border-r border-gray-800/80">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tracked</p>
              <p className="text-xl font-black text-white mt-0.5">{totalTracked}</p>
            </div>
            <div className="px-3 py-1 border-r border-gray-800/80">
              <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">In Pipeline</p>
              <p className="text-xl font-black text-yellow-400 mt-0.5">{appliedCount}</p>
            </div>
            <div className="px-3 py-1 border-r border-gray-800/80">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Interviews</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">{interviewingCount}</p>
            </div>
            <div className="px-3 py-1">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Offers Won</p>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{offersCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tracked companies, roles, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#222228] border border-gray-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400 bg-[#222228] px-3.5 py-2.5 rounded-2xl border border-gray-800">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span>Interview Conversion: <strong className="text-white">{conversionRate}%</strong></span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Track New Application</span>
          </button>
        </div>
      </div>

      {/* 5-STAGE KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {KANBAN_STAGES.map((stage) => {
          const stageApps = filteredApps.filter((a) => a.status === stage.id);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnStage(e, stage.id)}
              className="bg-[#222228]/80 border border-gray-800/80 rounded-3xl p-4 flex flex-col min-h-[550px] shadow-xl space-y-3.5 transition-colors"
            >
              {/* Stage Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{stage.icon}</span>
                  <h3 className="text-xs font-extrabold text-white tracking-wide">
                    {stage.title}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${stage.color}`}>
                  {stageApps.length}
                </span>
              </div>

              {/* Application Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[680px] pr-1">
                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onClick={() => setSelectedAppForDetail(app)}
                    className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 hover:border-yellow-500/50 cursor-pointer transition-all duration-200 space-y-3 shadow-md hover:shadow-yellow-500/5 group"
                  >
                    {/* Top Row: Company & ATS score */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-yellow-400" />
                          {app.companyName}
                        </p>
                        <h4 className="text-xs font-black text-white group-hover:text-yellow-400 transition-colors line-clamp-1 mt-0.5">
                          {app.jobTitle}
                        </h4>
                      </div>

                      {app.atsMatchScore && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black flex-shrink-0">
                          {app.atsMatchScore}% ATS
                        </span>
                      )}
                    </div>

                    {/* Metadata chips */}
                    <div className="space-y-1 text-[11px] text-gray-400">
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{app.jobLocation}</span>
                      </p>
                      <p className="flex items-center gap-1.5 font-bold text-gray-300">
                        <DollarSign className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                        <span>{app.salary || '$150k / yr'}</span>
                      </p>
                    </div>

                    {/* Quick Note preview */}
                    {app.notes && (
                      <p className="text-[10px] text-gray-400 line-clamp-2 bg-[#222228] p-2 rounded-xl border border-gray-800/80 italic">
                        "{app.notes}"
                      </p>
                    )}

                    {/* Card Footer: Stage controls & delete */}
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-1">
                        {stage.id !== 'SAVED' && (
                          <button
                            onClick={() => handleMoveStage(app.id, 'prev')}
                            title="Move to previous stage"
                            className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {stage.id !== 'ACCEPTED' && (
                          <button
                            onClick={() => handleMoveStage(app.id, 'next')}
                            title="Advance to next stage"
                            className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-yellow-400 transition"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedAppForDetail(app)}
                          title="Edit details & notes"
                          className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          title="Remove application"
                          className="p-1 rounded-lg hover:bg-rose-950/40 text-gray-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {stageApps.length === 0 && (
                  <div className="py-12 px-3 text-center border-2 border-dashed border-gray-800 rounded-2xl text-gray-600 text-[11px] font-medium">
                    Drag applications here or advance from previous stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* APPLICATION DETAIL & NOTES MODAL */}
      {selectedAppForDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#222228] border border-yellow-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-gray-950 flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/20">
                  {selectedAppForDetail.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {selectedAppForDetail.jobTitle}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="font-bold text-yellow-400">{selectedAppForDetail.companyName}</span>
                    <span>•</span>
                    <span>{selectedAppForDetail.jobLocation}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppForDetail(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Stage Navigator */}
            <div className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Pipeline Stage</p>
              <div className="flex items-center justify-between gap-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-yellow-400/10 border border-yellow-500/40 text-yellow-400 font-extrabold text-xs">
                  {KANBAN_STAGES.find((s) => s.id === selectedAppForDetail.status)?.title || selectedAppForDetail.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveStage(selectedAppForDetail.id, 'prev')}
                    className="px-3 py-1.5 rounded-xl border border-gray-800 text-gray-300 hover:text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous Stage
                  </button>
                  <button
                    onClick={() => handleMoveStage(selectedAppForDetail.id, 'next')}
                    className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition flex items-center gap-1 shadow-md"
                  >
                    Advance Stage <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#18181c] border border-gray-800">
                <p className="text-gray-500 font-medium">Estimated Compensation</p>
                <p className="font-extrabold text-white mt-1">{selectedAppForDetail.salary}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#18181c] border border-gray-800">
                <p className="text-gray-500 font-medium">ATS Match Score</p>
                <p className="font-extrabold text-emerald-400 mt-1">{selectedAppForDetail.atsMatchScore}% Compatibility</p>
              </div>
            </div>

            {/* Preparation & Interview Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-yellow-400" />
                Interview & Preparation Notes
              </label>
              <textarea
                rows={4}
                value={selectedAppForDetail.notes || ''}
                onChange={(e) => handleUpdateNotes(selectedAppForDetail.id, e.target.value)}
                placeholder="Log recruiter names, interview questions, upcoming round dates, or compensation negotiation notes..."
                className="w-full bg-[#18181c] border border-gray-800 focus:border-yellow-400 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none transition leading-relaxed resize-none"
              />
            </div>

            {/* External URL action if available */}
            {selectedAppForDetail.applyUrl && (
              <a
                href={selectedAppForDetail.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#18181c] hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <span>Open Employer Portal Listing</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-gray-800">
              <button
                onClick={() => handleDeleteApplication(selectedAppForDetail.id)}
                className="px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Remove Application
              </button>
              <button
                onClick={() => setSelectedAppForDetail(null)}
                className="px-6 py-2 rounded-xl bg-yellow-400 text-gray-950 font-black text-xs hover:bg-yellow-300 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRACK NEW APPLICATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#222228] border border-yellow-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-yellow-400" />
                  Track New Job Application
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Add external applications (LinkedIn, direct site, etc.) to your cockpit.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewApplication} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OpenAI, Microsoft"
                    value={newAppForm.companyName}
                    onChange={(e) => setNewAppForm({ ...newAppForm, companyName: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Target Job Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={newAppForm.jobTitle}
                    onChange={(e) => setNewAppForm({ ...newAppForm, jobTitle: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Location / Mode</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote, San Francisco"
                    value={newAppForm.jobLocation}
                    onChange={(e) => setNewAppForm({ ...newAppForm, jobLocation: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Initial Stage</label>
                  <select
                    value={newAppForm.status}
                    onChange={(e) => setNewAppForm({ ...newAppForm, status: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none cursor-pointer"
                  >
                    {KANBAN_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.icon} {s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Salary Expectation / Range</label>
                  <input
                    type="text"
                    placeholder="e.g. $160k - $200k / yr"
                    value={newAppForm.salary}
                    onChange={(e) => setNewAppForm({ ...newAppForm, salary: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Application URL</label>
                  <input
                    type="url"
                    placeholder="https://company.com/jobs/123"
                    value={newAppForm.applyUrl}
                    onChange={(e) => setNewAppForm({ ...newAppForm, applyUrl: e.target.value })}
                    className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Initial Notes</label>
                <textarea
                  rows={3}
                  placeholder="Referral contact, recruiter note, or interview date..."
                  value={newAppForm.notes}
                  onChange={(e) => setNewAppForm({ ...newAppForm, notes: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl p-3 text-white focus:border-yellow-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black shadow-lg shadow-yellow-500/20 transition"
                >
                  Add to Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
