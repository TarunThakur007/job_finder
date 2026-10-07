import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Building2, 
  RefreshCw, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Radio, 
  Bell, 
  Clock, 
  Edit3, 
  Layers,
  Lock,
  RotateCcw,
  Archive,
  ArrowRight,
  MapPin,
  Check,
  Send,
  Wand2,
  Cpu,
  FileText,
  Store,
  Rocket
} from 'lucide-react';
import EditAndGrantPermissionModal from './EditAndGrantPermissionModal';

export default function EmployeeControlSection({ 
  liveJobs = [], 
  allJobs = [],
  currentUser, 
  onPostJobClick, 
  onLoginAsEmployee, 
  onSelectView, 
  onJobApproved,
  onCloseJob,
  onReopenJob,
  onDeleteJob
}) {
  // Tabs: 'staging' (AI queue) | 'live' (User page published) | 'closed' (Closed vacancies)
  const [employeeTab, setEmployeeTab] = useState('staging');

  // Vacancies Staging & Review State
  const [pendingJobs, setPendingJobs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [discovering, setDiscovering] = useState(false);
  const [vacancySearch, setVacancySearch] = useState('');
  const [activeJobsSearch, setActiveJobsSearch] = useState('');
  const [closedJobsSearch, setClosedJobsSearch] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [grantingIds, setGrantingIds] = useState(new Set());

  // Gemini AI Raw Vacancy Ingestion & Permission Gateway State
  const [aiIngestText, setAiIngestText] = useState('');
  const [isAiIngesting, setIsAiIngesting] = useState(false);
  const [ingestNotice, setIngestNotice] = useState(null);
  const [showAiIngestBox, setShowAiIngestBox] = useState(true);

  // Closed & Active Jobs Tracking State
  const [closedJobs, setClosedJobs] = useState([]);
  const [closingJobIds, setClosingJobIds] = useState(new Set());
  const [reopeningJobIds, setReopeningJobIds] = useState(new Set());
  const [deletingJobIds, setDeletingJobIds] = useState(new Set());

  // Hourly AI Job Freshness & Closed Vacancy Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [auditingFreshness, setAuditingFreshness] = useState(false);

  const fetchClosedJobs = async () => {
    try {
      const res = await fetch('/api/jobs/closed').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const seen = new Set();
        const deduped = (Array.isArray(data) ? data : []).filter(j => {
          const comp = typeof j.company === 'object' ? j.company?.name : j.company || '';
          const key = `${(j.title || '').trim().toLowerCase()}::${comp.trim().toLowerCase()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setClosedJobs(deduped);
      } else {
        const fallback = (allJobs || []).filter(j => j.verificationStatus === 'CLOSED' || j.isClosed);
        const seen = new Set();
        const deduped = fallback.filter(j => {
          const comp = typeof j.company === 'object' ? j.company?.name : j.company || '';
          const key = `${(j.title || '').trim().toLowerCase()}::${comp.trim().toLowerCase()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setClosedJobs(deduped);
      }
    } catch (e) {
      const fallback = (allJobs || []).filter(j => j.verificationStatus === 'CLOSED' || j.isClosed);
      setClosedJobs(fallback);
    }
  };

  const handleCloseJob = async (job) => {
    const compName = typeof job.company === 'object' ? job.company?.name : job.company;
    if (!window.confirm(`Are you sure you want to close "${job.title}" at ${compName || 'Employer'}? It will be immediately unlisted from the public User page.`)) {
      return;
    }

    setClosingJobIds(prev => new Set(prev).add(job.id));
    try {
      const res = await fetch(`/api/jobs/${job.id}/close`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json().catch(() => ({ ...job, verificationStatus: 'CLOSED', isClosed: true }));
        setClosedJobs(prev => [updated, ...prev.filter(j => j.id !== job.id)]);
        if (onCloseJob) onCloseJob(job.id);

        // AUTOMATICALLY DELETE NOTIFICATION FOR THIS JOB FROM WEBSITE
        setNotifications(prev => prev.filter(n => n.jobId !== job.id));
        setUnreadNotificationsCount(prev => {
          const hadUnread = notifications.some(n => n.jobId === job.id && !n.isRead);
          return hadUnread ? Math.max(0, prev - 1) : prev;
        });

        setActionNotice({
          type: 'success',
          msg: `Job Closed: "${job.title}" has been unlisted from the User page and its notification cleared.`,
          actionLabel: 'View Closed Jobs',
          onAction: () => setEmployeeTab('closed')
        });
      }
    } catch (e) {
      console.error('Error closing job:', e);
    } finally {
      setClosingJobIds(prev => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  };

  const handleDeleteLiveJob = async (job) => {
    const compName = typeof job.company === 'object' ? job.company?.name : job.company || 'Employer';
    if (!window.confirm(`Permanently delete "${job.title}" at ${compName}? It will be purged from the platform and the crawler will not bring it back.`)) {
      return;
    }
    setDeletingJobIds(prev => new Set(prev).add(job.id));
    try {
      await fetch(`/api/jobs/${job.id}/permanent`, { method: 'DELETE' });
      setClosedJobs(prev => prev.filter(j => j.id !== job.id));
      setPendingJobs(prev => prev.filter(j => j.id !== job.id));
      if (onDeleteJob) onDeleteJob(job.id);

      // AUTOMATICALLY DELETE NOTIFICATION FOR THIS JOB FROM WEBSITE
      setNotifications(prev => prev.filter(n => n.jobId !== job.id));
      setUnreadNotificationsCount(prev => {
        const hadUnread = notifications.some(n => n.jobId === job.id && !n.isRead);
        return hadUnread ? Math.max(0, prev - 1) : prev;
      });

      setActionNotice({
        type: 'success',
        msg: `Job Permanently Deleted: "${job.title}" and its notifications have been completely purged from the website.`
      });
    } catch (e) {
      console.error('Error deleting live job:', e);
    } finally {
      setDeletingJobIds(prev => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  };

  const handleRemoveAllClosedJobs = async () => {
    if (filteredClosedJobs.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently remove and purge all (${filteredClosedJobs.length}) closed jobs? This will permanently delete them from the database and remove any corresponding notifications.`)) {
      return;
    }

    const closedIds = new Set(filteredClosedJobs.map(j => j.id));
    try {
      // Optimistically clear closed jobs and their notifications
      setClosedJobs(prev => prev.filter(j => !closedIds.has(j.id)));
      setNotifications(prev => prev.filter(n => !closedIds.has(n.jobId)));
      setUnreadNotificationsCount(prev => {
        const removedUnread = notifications.filter(n => closedIds.has(n.jobId) && !n.isRead).length;
        return Math.max(0, prev - removedUnread);
      });

      const res = await fetch('/api/jobs/closed/all', { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionNotice({
          type: 'success',
          msg: `Purged: Successfully removed all closed jobs (${data.removedCount || filteredClosedJobs.length} records) and cleared corresponding notifications.`
        });
      }
    } catch (e) {
      console.error('Error removing all closed jobs:', e);
    } finally {
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleReopenJob = async (job) => {
    setReopeningJobIds(prev => new Set(prev).add(job.id));
    try {
      const res = await fetch(`/api/jobs/${job.id}/reopen`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json().catch(() => ({ ...job, verificationStatus: 'VERIFIED', isClosed: false }));
        setClosedJobs(prev => prev.filter(j => j.id !== job.id));
        if (onReopenJob) onReopenJob(job.id);
        setActionNotice({
          type: 'success',
          msg: `Job Reopened: "${job.title}" has been restored and is now visible on the public User page!`,
          actionLabel: 'View Live on User Page →',
          onAction: () => onSelectView && onSelectView('dashboard-overview')
        });
      }
    } catch (e) {
      console.error('Error reopening job:', e);
    } finally {
      setReopeningJobIds(prev => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  };

  const handlePermanentDelete = async (job) => {
    if (!window.confirm(`Permanently delete vacancy "${job.title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingJobIds(prev => new Set(prev).add(job.id));
    try {
      await fetch(`/api/jobs/${job.id}/permanent`, { method: 'DELETE' });
      setClosedJobs(prev => prev.filter(j => j.id !== job.id));
      if (onDeleteJob) onDeleteJob(job.id);
      setNotifications(prev => prev.filter(n => n.jobId !== job.id));
      setActionNotice({
        type: 'success',
        msg: `Job Permanently Deleted: "${job.title}" has been purged and blacklisted from crawler re-ingestion.`
      });
    } catch (e) {
      console.error('Error deleting job:', e);
    } finally {
      setDeletingJobIds(prev => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  };

  const fetchPendingJobs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [pendingRes, statsRes] = await Promise.all([
        fetch('/api/admin/vacancies/pending').catch(() => null),
        fetch('/api/admin/stats').catch(() => null)
      ]);

      if (pendingRes && pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingJobs(data);
      }
      if (statsRes && statsRes.ok) {
        const stats = await statsRes.json();
        setAdminStats(stats);
      }
    } catch (err) {
      console.error('Error loading AI vacancies:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadNotificationsCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Error fetching employee notifications:', e);
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Error marking notification read:', e);
    }
  };

  const handleGrantPermission = async (jobId, jobTitle) => {
    if (grantingIds.has(jobId)) return;
    setGrantingIds(prev => new Set(prev).add(jobId));

    try {
      // Optimistically remove from pending staging list without full page reload
      setPendingJobs(prev => prev.filter(j => j.id !== jobId));
      
      // Optimistically update employee metrics counters
      setAdminStats(prev => prev ? {
        ...prev,
        activeJobs: (prev.activeJobs || 0) + 1,
        totalJobs: (prev.totalJobs || 0) + 1,
        pendingReviews: Math.max(0, (prev.pendingReviews || 1) - 1)
      } : {
        activeJobs: (liveJobs.length || 0) + 1,
        totalJobs: (liveJobs.length || 0) + 1
      });

      const res = await fetch(`/api/admin/vacancies/${jobId}/approve`, { method: 'PUT' });
      if (res.ok) {
        const approvedJob = await res.json().catch(() => null);
        setActionNotice({
          type: 'success',
          msg: `Permission Granted: "${jobTitle}" has been moved to the user page!`,
          actionLabel: 'View on User Page →',
          onAction: () => onSelectView && onSelectView('dashboard-overview')
        });
        // Silently sync state with server in the background
        fetchPendingJobs(true);
        if (onJobApproved) {
          onJobApproved(approvedJob || jobId);
        }
      } else {
        throw new Error('Approval request failed');
      }
    } catch (err) {
      console.error('Error granting permission:', err);
      // Restore on failure
      fetchPendingJobs(true);
      setActionNotice({
        type: 'warning',
        msg: `Could not complete permission grant for "${jobTitle}". Please try again.`
      });
    } finally {
      setGrantingIds(prev => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleRejectVacancy = async (jobId, jobTitle) => {
    if (!window.confirm(`Reject and permanently discard "${jobTitle}"?`)) return;
    try {
      setPendingJobs(prev => prev.filter(j => j.id !== jobId));
      setAdminStats(prev => prev ? {
        ...prev,
        pendingReviews: Math.max(0, (prev.pendingReviews || 1) - 1)
      } : prev);

      const res = await fetch(`/api/admin/vacancies/${jobId}/reject`, { method: 'DELETE' });
      if (res.ok) {
        setActionNotice({
          type: 'info',
          msg: `Discarded AI vacancy: "${jobTitle}" removed from staging.`
        });
        fetchPendingJobs(true);
      }
    } catch (err) {
      console.error('Error rejecting vacancy:', err);
      fetchPendingJobs(true);
    } finally {
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleTriggerDiscovery = async (source = 'ALL') => {
    setDiscovering(true);
    setActionNotice(null);
    try {
      const res = await fetch(`/api/admin/vacancies/discover?source=${source}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setActionNotice({
          type: 'success',
          msg: `AI Agent Discovered ${data.stagedCount || 0} open vacancies from ${source}. Added to your review queue!`
        });
        fetchPendingJobs(true);
      }
    } catch (err) {
      setActionNotice({ type: 'info', msg: `AI Discovery triggered for ${source}.` });
    } finally {
      setDiscovering(false);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const samplePresets = [
    {
      label: '🏪 Local Business',
      desc: 'Jaipur IT agency walk-in',
      text: 'Urgent Hiring: Senior Frontend React Developer at Krishna Web Infotech (Local IT Agency, Jaipur). Salary: ₹6.5 - 10 LPA. 3 openings. Skills: React, Tailwind CSS, JavaScript, Redux. Walk-in interview: B-14 Malviya Nagar, Jaipur. Apply: jobs@krishnaweb.in or WhatsApp 9829012345.'
    },
    {
      label: '🚀 Tech Startup',
      desc: 'Bengaluru AI startup',
      text: 'We are hiring! Founding Full Stack Engineer at NextWave AI (Bengaluru Tech Startup, Hybrid). Salary: ₹18 - 28 LPA + 0.5% Equity. Skills: Next.js, Python, FastAPI, PostgreSQL, LangChain. Apply at https://nextwave.ai/careers or founders@nextwave.ai'
    },
    {
      label: '🏢 MNC Enterprise',
      desc: 'Gurugram Cloud team',
      text: 'Tata Consultancy Services (TCS) is hiring Cloud Infrastructure Engineer. Location: Gurugram / Hyderabad (MNC). Salary: ₹12 - 18 LPA. 15 vacancies. Skills: AWS, Kubernetes, Terraform, Linux, CI/CD. Apply via TCS iON portal or careers.tcs.com/apply/cloud-dev'
    }
  ];

  const handleAiIngestSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!aiIngestText.trim()) return;

    setIsAiIngesting(true);
    setIngestNotice(null);

    try {
      const res = await fetch('/api/admin/vacancies/ai-ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: aiIngestText.trim() })
      });

      if (res.ok) {
        const stagedJob = await res.json();
        setPendingJobs(prev => [stagedJob, ...prev.filter(j => j.id !== stagedJob.id)]);
        setAdminStats(prev => prev ? {
          ...prev,
          pendingReviews: (prev.pendingReviews || 0) + 1
        } : prev);

        const compLabel = stagedJob.company?.name || 'Employer';
        const typeLabel = stagedJob.company?.industry ? ` [${stagedJob.company.industry.replace('_', ' ')}]` : '';

        setIngestNotice({
          type: 'success',
          msg: `✨ Gemini AI Extracted & Staged: "${stagedJob.title}" at ${compLabel}${typeLabel}! Review and grant permission below to publish live on the website.`
        });

        setActionNotice({
          type: 'success',
          msg: `AI Vacancy Ingested: "${stagedJob.title}" staged in queue awaiting employee permission!`,
          actionLabel: 'Review Staged Job ↓',
          onAction: () => {
            const el = document.getElementById(`staged-job-${stagedJob.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        });

        setAiIngestText('');
      } else {
        const errText = await res.text();
        setIngestNotice({
          type: 'error',
          msg: errText || 'Could not parse job details. Please check the text and try again.'
        });
      }
    } catch (err) {
      console.error('Error during AI ingestion:', err);
      setIngestNotice({
        type: 'error',
        msg: 'Network or server error while connecting to Gemini AI.'
      });
    } finally {
      setIsAiIngesting(false);
    }
  };

  const handleRunFreshnessAudit = async () => {
    setAuditingFreshness(true);
    setActionNotice(null);
    try {
      const res = await fetch('/api/admin/audit-freshness', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setActionNotice({
          type: 'success',
          msg: `AI Freshness Sentinel Audit Complete: Audited ${data.totalAudited || 0} listings. ${data.closedCount || 0} closed vacancies detected & unlisted.`
        });
        fetchNotifications();
        fetchPendingJobs(true);
      }
    } catch (e) {
      setActionNotice({ type: 'info', msg: 'Hourly Freshness Sentinel executed.' });
    } finally {
      setAuditingFreshness(false);
      setTimeout(() => setActionNotice(null), 6000);
    }
  };

  useEffect(() => {
    fetchPendingJobs(false);
    fetchNotifications();
    fetchClosedJobs();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchClosedJobs();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter pending vacancies based on search
  const filteredVacancies = pendingJobs.filter(j => {
    if (!vacancySearch) return true;
    const term = vacancySearch.toLowerCase();
    const compName = (j.company?.name || '').toLowerCase();
    const title = (j.title || '').toLowerCase();
    const location = (j.location || '').toLowerCase();
    return compName.includes(term) || title.includes(term) || location.includes(term);
  });

  const activePublishedJobs = React.useMemo(() => {
    const list = (liveJobs || []).filter(j => !j.isClosed && j.verificationStatus !== 'CLOSED');
    const seen = new Set();
    return list.filter(j => {
      const comp = typeof j.company === 'object' ? j.company?.name : j.company || '';
      const key = `${(j.title || '').trim().toLowerCase()}::${comp.trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [liveJobs]);

  const filteredActiveJobs = React.useMemo(() => {
    if (!activeJobsSearch) return activePublishedJobs;
    const term = activeJobsSearch.toLowerCase().trim();
    return activePublishedJobs.filter(j => {
      const compName = (typeof j.company === 'object' ? j.company?.name : j.company || '').toLowerCase();
      const title = (j.title || '').toLowerCase();
      const location = (j.location || '').toLowerCase();
      return compName.includes(term) || title.includes(term) || location.includes(term);
    });
  }, [activePublishedJobs, activeJobsSearch]);

  const filteredClosedJobs = React.useMemo(() => {
    const seen = new Set();
    const dedupedClosed = (closedJobs || []).filter(j => {
      const comp = typeof j.company === 'object' ? j.company?.name : j.company || '';
      const key = `${(j.title || '').trim().toLowerCase()}::${comp.trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (!closedJobsSearch) return dedupedClosed;
    const term = closedJobsSearch.toLowerCase().trim();
    return dedupedClosed.filter(j => {
      const compName = (typeof j.company === 'object' ? j.company?.name : j.company || '').toLowerCase();
      const title = (j.title || '').toLowerCase();
      const location = (j.location || '').toLowerCase();
      return compName.includes(term) || title.includes(term) || location.includes(term);
    });
  }, [closedJobs, closedJobsSearch]);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto py-8 px-4">
      
      {/* Employee Operations Banner */}
      <div className="bg-[#222228] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-yellow-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
            <span>Company Employee & Recruiter Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Vacancy Review & <span className="text-yellow-400">Website Publishing Center</span>
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your role is to review AI-discovered job responses from official ATS feeds, update and refine job details (title, salary, requirements, apply links), and grant permission to publish verified jobs live to the website.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {onSelectView && (
            <button
              type="button"
              onClick={() => onSelectView('dashboard-overview')}
              className="px-4 py-2.5 rounded-xl bg-[#18181c] hover:bg-gray-800 text-yellow-400 border border-yellow-500/30 text-xs font-bold transition flex items-center gap-2 active:scale-95 shadow-sm"
              title="Inspect published jobs on live website"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Preview Live Website</span>
            </button>
          )}

          {onPostJobClick && (
            <button
              onClick={onPostJobClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition shadow-lg shadow-yellow-500/20 active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Post Manual Vacancy</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-yellow-950/40 border-yellow-500/40 text-yellow-300'
        }`}>
          <div className="flex items-center gap-3 flex-1">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{actionNotice.msg}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {actionNotice.onAction && (
              <button
                onClick={actionNotice.onAction}
                className="px-3 py-1.5 rounded-xl bg-yellow-400 text-gray-950 font-black text-xs hover:bg-yellow-300 transition shadow-sm active:scale-95"
              >
                {actionNotice.actionLabel || 'View on User Page →'}
              </button>
            )}
            <button onClick={() => setActionNotice(null)} className="text-gray-400 hover:text-white p-1">✕</button>
          </div>
        </div>
      )}

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
          <p className="text-xs text-gray-400 font-semibold">AI Staging Queue</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">{pendingJobs.length}</p>
          <p className="text-[11px] text-amber-400/80 mt-1">Awaiting review & approval</p>
        </div>

        <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
          <p className="text-xs text-gray-400 font-semibold">Live on User Page</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{activePublishedJobs.length}</p>
          <p className="text-[11px] text-emerald-400/80 mt-1">Active verified candidate openings</p>
        </div>

        <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
          <p className="text-xs text-gray-400 font-semibold">Closed Vacancies</p>
          <p className="text-3xl font-extrabold text-rose-400 mt-1">{closedJobs.length}</p>
          <p className="text-[11px] text-rose-400/80 mt-1">Unlisted from candidate view</p>
        </div>

        <div className="bg-[#222228] border border-gray-800 p-5 rounded-3xl">
          <p className="text-xs text-gray-400 font-semibold">Connected Feeds</p>
          <p className="text-3xl font-extrabold text-yellow-400 mt-1">8 Sources</p>
          <p className="text-[11px] text-gray-400 mt-1">Greenhouse • Lever • Ashby • APIs</p>
        </div>
      </div>

      {/* HOURLY AI VACANCY FRESHNESS & CLOSURE SENTINEL */}
      <div className="bg-[#222228] border border-yellow-500/30 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                Hourly AI Job Freshness Agent Active (Cron: 00 * * * *)
              </span>
              {unreadNotificationsCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-black animate-pulse">
                  {unreadNotificationsCount} Closed Roles Detected
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>Automated Hourly Job Status & Closure Sentinel</span>
            </h3>

            <p className="text-xs text-gray-400 leading-relaxed">
              Every hour, the AI Sentinel pings all live vacancies listed on the website. If an employer removes the position or their ATS flags it as closed/expired, the AI agent <strong>instantly unlists it</strong> from the public search and dispatches an alert here for employee review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
                unreadNotificationsCount > 0
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/50'
                  : 'bg-[#18181c] border-gray-800 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Bell className={`w-4 h-4 ${unreadNotificationsCount > 0 ? 'text-rose-400 animate-bounce' : 'text-gray-400'}`} />
              <span>Closure Alerts</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                unreadNotificationsCount > 0 ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}>
                {unreadNotificationsCount}
              </span>
            </button>

            <button
              onClick={handleRunFreshnessAudit}
              disabled={auditingFreshness}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${auditingFreshness ? 'animate-spin' : ''}`} />
              <span>{auditingFreshness ? 'Auditing Live URLs...' : 'Run Audit Now'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Notification Drawer */}
        {showNotificationDrawer && (
          <div className="pt-4 border-t border-gray-800/80 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Automated Freshness Sentinel Logs ({notifications.length})
              </span>
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="text-xs text-gray-400 hover:text-white font-bold"
              >
                Close Drawer ✕
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 italic">
                All live listings are active and returning HTTP 200 OK. No closed vacancies detected.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      notif.isRead
                        ? 'bg-[#18181c] border-gray-800 text-gray-400'
                        : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-2 flex-wrap">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="text-white font-extrabold">{notif.jobTitle || notif.title || 'Role Closed'}</span>
                        {notif.companyName && (
                          <span className="px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-mono">
                            {notif.companyName}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-gray-500">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent hourly audit'}
                        {notif.reason ? ` • ${notif.reason}` : ''}
                      </p>
                    </div>

                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkNotificationRead(notif.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold border border-rose-500/40 whitespace-nowrap"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3-WAY WORKSPACE TAB SWITCHER */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-800 pb-2">
        <button
          type="button"
          onClick={() => setEmployeeTab('staging')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm active:scale-95 ${
            employeeTab === 'staging'
              ? 'bg-amber-400 text-gray-950 font-black shadow-amber-400/20'
              : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Staging Queue</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">
            {pendingJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setEmployeeTab('live')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm active:scale-95 ${
            employeeTab === 'live'
              ? 'bg-teal-400 text-gray-950 font-black shadow-teal-400/20'
              : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Live on User Page (Close Vacancies)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">
            {activePublishedJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setEmployeeTab('closed')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm active:scale-95 ${
            employeeTab === 'closed'
              ? 'bg-rose-500 text-white font-black shadow-rose-500/20'
              : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Closed Jobs & Inactive Vacancies</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">
            {closedJobs.length}
          </span>
        </button>
      </div>

      {/* AI VACANCY STAGING QUEUE */}
      {employeeTab === 'staging' && (
      <div className="bg-[#222228] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>AI Response Review & Publishing Queue</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Review AI-discovered openings, update salary ranges & apply URLs, and publish live to the website with 100% verified status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleTriggerDiscovery('ALL')}
              disabled={discovering}
              className="px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3 h-3 ${discovering ? 'animate-spin' : ''}`} />
              <span>{discovering ? 'Discovering...' : 'Fetch All Sources'}</span>
            </button>
            <button
              onClick={() => handleTriggerDiscovery('JOOBLE')}
              disabled={discovering}
              className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-yellow-300 border border-yellow-500/30 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
              title="Ingest global tech vacancies from Jooble API"
            >
              <span>+ Jooble Feed</span>
            </button>
            <button
              onClick={() => handleTriggerDiscovery('USAJOBS')}
              disabled={discovering}
              className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-yellow-300 border border-yellow-500/30 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
              title="Ingest US Federal IT and Cyber jobs from USAJobs API"
            >
              <span>+ USAJobs Gov</span>
            </button>
          </div>
        </div>

        {/* 🤖 GEMINI AI SMART VACANCY INGESTION BOX */}
        <div className="bg-[#18181c] border border-amber-500/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-28 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                  Gemini AI Extraction Engine
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  Staging → Employee Permission Gateway
                </span>
              </div>
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                <span>Smart Vacancy Ingestion (Local Business • Startup • MNC)</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed max-w-3xl">
                Paste any unstructured text: WhatsApp broadcast, Telegram job circular, LinkedIn snippet, or raw description. Gemini automatically extracts <strong>Title, Skills, Salary, Location, and Company Type</strong>, then pushes the vacancy into the <strong>Staging Queue below</strong> for your review and permission granting before it appears live on the User page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAiIngestBox(!showAiIngestBox)}
              className="text-xs text-gray-400 hover:text-white font-bold self-start sm:self-center px-3 py-1.5 rounded-lg bg-[#222228] border border-gray-700"
            >
              {showAiIngestBox ? 'Hide Ingestion Box ▲' : 'Show Ingestion Box ▼'}
            </button>
          </div>

          {showAiIngestBox && (
            <div className="space-y-4 pt-2 relative z-10 animate-fadeIn">
              {/* Quick Sample Presets */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Load Sample Circular:
                </span>
                {samplePresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setAiIngestText(preset.text);
                      setIngestNotice(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#222228] hover:bg-gray-800 text-gray-300 hover:text-amber-400 border border-gray-700/80 text-[11px] font-semibold transition active:scale-95 flex items-center gap-1.5"
                    title={preset.desc}
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>

              {/* Raw Text Input Area */}
              <div className="relative">
                <textarea
                  rows={4}
                  value={aiIngestText}
                  onChange={(e) => setAiIngestText(e.target.value)}
                  placeholder="Paste WhatsApp message, LinkedIn post, Telegram circular, or raw vacancy description here... (e.g. 'Urgent hiring: React Developer at Apex Tech, Jaipur. Salary 6-10 LPA. Skills: React, Tailwind. Contact: hr@apex.in')"
                  className="w-full p-4 bg-[#222228] border border-gray-700 focus:border-amber-400 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition leading-relaxed resize-y min-h-[90px]"
                />
              </div>

              {/* Action Buttons & Ingestion Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-gray-400 flex items-center gap-2">
                  <span>{aiIngestText.length} characters</span>
                  {aiIngestText.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAiIngestText('')}
                      className="text-gray-500 hover:text-rose-400 underline font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isAiIngesting || !aiIngestText.trim()}
                  onClick={handleAiIngestSubmit}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-gray-950 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAiIngesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini AI Extracting & Staging...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Extract with Gemini AI & Stage Vacancy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Feedback Notice */}
              {ingestNotice && (
                <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn ${
                  ingestNotice.type === 'success' 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {ingestNotice.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <span>{ingestNotice.msg}</span>
                  </div>
                  <button onClick={() => setIngestNotice(null)} className="text-gray-400 hover:text-white p-1">✕</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={vacancySearch}
              onChange={(e) => setVacancySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="text-xs text-gray-400 font-semibold flex items-center gap-2">
            <span>Showing:</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#18181c] border border-gray-800 text-yellow-400 font-extrabold">
              {filteredVacancies.length} of {pendingJobs.length} Staged Positions
            </span>
          </div>
        </div>

        {/* Vacancy Cards List */}
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-yellow-400" />
            Loading AI response queue...
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
            <p className="font-bold text-gray-300">All AI-Discovered Vacancies Have Been Reviewed & Published!</p>
            <p className="text-gray-500 max-w-sm mx-auto">
              Click "Fetch New AI Vacancies" above to run the ingestion pipeline across Greenhouse, Lever, Ashby, and job board APIs.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVacancies.map((job) => {
              const compName = job.company?.name || 'Verified Employer';
              const salaryDisplay = job.salaryDisplay || (job.salaryMin ? `$${(job.salaryMin/1000).toFixed(0)}k - $${(job.salaryMax/1000).toFixed(0)}k / yr` : 'Salary not disclosed');
              const trustScore = job.trustScore || 88;

              return (
                <div
                  key={job.id}
                  id={`staged-job-${job.id}`}
                  className="bg-[#18181c] border border-gray-800 hover:border-yellow-500/40 rounded-2xl p-5 sm:p-6 transition shadow-lg space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/10 text-amber-400 border border-amber-500/30">
                          Awaiting Review & Permission
                        </span>
                        
                        {/* Company Type Badge (Local Business / Startup / MNC) */}
                        {job.company?.industry && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                            job.company.industry === 'LOCAL_BUSINESS' 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : job.company.industry === 'STARTUP'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : job.company.industry === 'MNC'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {job.company.industry === 'LOCAL_BUSINESS' && '🏪 Local Business'}
                            {job.company.industry === 'STARTUP' && '🚀 Startup'}
                            {job.company.industry === 'MNC' && '🏢 MNC Enterprise'}
                            {job.company.industry === 'REGIONAL_AGENCY' && '🤝 Regional Agency'}
                            {!['LOCAL_BUSINESS', 'STARTUP', 'MNC', 'REGIONAL_AGENCY'].includes(job.company.industry) && job.company.industry}
                          </span>
                        )}

                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#222228] text-gray-300 border border-gray-700">
                          {job.source || 'AI Ingestion'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#222228] text-gray-300 border border-gray-700">
                          {job.employmentType || 'Full-time'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          {job.vacanciesCount || 1} {(job.vacanciesCount || 1) === 1 ? 'Opening in Field' : 'Openings in Field'}
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-white">{job.title}</h4>

                      <p className="text-xs text-gray-400 flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="font-bold text-gray-200">{compName}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{job.location || 'Remote / Hybrid'}</span>
                        </span>
                        <span>•</span>
                        <span className="text-yellow-400 font-bold">{salaryDisplay}</span>
                      </p>

                      {/* AI Extracted Skills Badges */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-gray-500 font-bold uppercase mr-1">Skills:</span>
                          {job.skills.map((skill, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="px-2 py-0.5 rounded-md bg-[#222228] text-gray-300 text-[10px] font-mono border border-gray-700/60"
                            >
                              {typeof skill === 'object' ? skill.name : skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Trust Gauge & Action CTAs */}
                    <div className="flex flex-wrap items-center gap-3 lg:flex-shrink-0">
                      <div className="text-right pr-2">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Computed Trust</p>
                        <p className="text-base font-black text-yellow-400">{trustScore}%</p>
                      </div>

                      {/* Edit & Update Details Button */}
                      <button
                        type="button"
                        onClick={() => setEditingJob(job)}
                        className="px-4 py-2.5 rounded-xl bg-[#222228] hover:bg-gray-800 text-yellow-300 text-xs font-bold transition flex items-center gap-1.5 border border-yellow-500/30 active:scale-95"
                        title="Update title, salary, or apply link before publishing"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Job Details</span>
                      </button>

                      {/* Grant Permission & Publish Live Button */}
                      <button
                        type="button"
                        disabled={grantingIds.has(job.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          handleGrantPermission(job.id, job.title);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        title="Authorize AI response and publish live to public website"
                      >
                        {grantingIds.has(job.id) ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Granting Permission...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Grant Permission & Publish Live</span>
                          </>
                        )}
                      </button>

                      {/* Reject / Discard */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRejectVacancy(job.id, job.title);
                        }}
                        className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition flex items-center justify-center border border-rose-800/40 active:scale-95"
                        title="Discard listing"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>

                  {/* AI Extracted Highlights & Apply URL Check */}
                  <div className="pt-3 border-t border-gray-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <p className="text-gray-400 line-clamp-1 max-w-2xl text-[11px]">
                      <span className="font-bold text-gray-300 mr-1.5">AI Summary:</span>
                      {job.description ? job.description.replace(/<[^>]*>?/gm, '').slice(0, 160) + '...' : 'Verified vacancy discovered from official employer career feed.'}
                    </p>

                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-yellow-400 hover:underline flex items-center gap-1 flex-shrink-0"
                      >
                        <span>Check Apply Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* 2. LIVE PUBLISHED JOBS (ACTIVE ON USER PAGE - WITH CLOSE JOB ACTION) */}
      {employeeTab === 'live' && (
        <div className="bg-[#222228] border border-teal-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                <span>Live Active Jobs on Public User Page</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                These vacancies are currently visible to candidates on the User page. As an employer or recruiter, click <strong className="text-rose-400">"Close Job"</strong> to immediately unlist any position when hiring has finished.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs font-bold">
                {filteredActiveJobs.length} Active Positions
              </span>
            </div>
          </div>

          {/* Search bar for active jobs */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search live jobs by title, company, location..."
              value={activeJobsSearch}
              onChange={(e) => setActiveJobsSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Active Job Cards */}
          {filteredActiveJobs.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl space-y-2">
              <Briefcase className="w-8 h-8 text-teal-400 mx-auto opacity-60" />
              <p className="font-bold text-gray-300">No active positions matching search</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActiveJobs.map((job) => {
                const compName = typeof job.company === 'object' ? job.company?.name : job.company || 'Verified Employer';
                const salary = job.salaryDisplay || job.salary || (job.salaryMin ? `$${(job.salaryMin/1000).toFixed(0)}k - $${(job.salaryMax/1000).toFixed(0)}k / yr` : 'Competitive');
                const isClosing = closingJobIds.has(job.id);

                return (
                  <div
                    key={job.id}
                    className="bg-[#18181c] border border-gray-800 hover:border-teal-500/40 rounded-2xl p-5 sm:p-6 transition shadow-lg space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Live on User Page
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-gray-400 bg-[#222228] border border-gray-700">
                            ID: #{job.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-300 bg-[#222228] border border-gray-700">
                            {job.jobType || job.employmentType || 'Full-time'}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-white hover:text-teal-300 transition-colors">
                          {job.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <span className="text-white font-bold flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-teal-400" />
                            {compName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            {job.location || 'Remote'}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-amber-400 font-bold">{salary}</span>
                        </div>
                      </div>

                      {/* Action: Close Job CTA */}
                      <div className="flex items-center gap-3 lg:flex-shrink-0">
                        {job.applyUrl && (
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-xl bg-[#222228] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-700 transition flex items-center gap-1"
                            title="Inspect public application page"
                          >
                            <span>ATS Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {/* Action: Close Job CTA */}
                        <button
                          type="button"
                          disabled={isClosing}
                          onClick={() => handleCloseJob(job)}
                          className="px-3.5 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 hover:border-rose-500 text-rose-200 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-950/30 active:scale-95 disabled:opacity-50"
                          title="Close this opening and unlist it from the user page (moves to Closed tab)"
                        >
                          <Lock className="w-3.5 h-3.5 text-rose-400" />
                          <span>{isClosing ? 'Closing...' : 'Close Job'}</span>
                        </button>

                        {/* Action: Delete Job Permanently */}
                        <button
                          type="button"
                          disabled={deletingJobIds.has(job.id)}
                          onClick={() => handleDeleteLiveJob(job)}
                          className="p-2.5 rounded-xl bg-[#222228] hover:bg-rose-950 text-gray-400 hover:text-rose-300 border border-gray-700 hover:border-rose-600 transition flex items-center justify-center active:scale-95 disabled:opacity-50"
                          title="Permanently delete vacancy so it never appears again in live or closed jobs"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. CLOSED JOBS & INACTIVE VACANCIES */}
      {employeeTab === 'closed' && (
        <div className="bg-[#222228] border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-400" />
                <span>Closed Jobs & Inactive Vacancies</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                These vacancies have been closed by recruiters or flagged as closed by the hourly AI Freshness Agent. They are completely unlisted from the public User page. You can reopen or permanently delete them here.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold">
                {filteredClosedJobs.length} Closed Positions
              </span>
              {filteredClosedJobs.length > 0 && (
                <button
                  type="button"
                  onClick={handleRemoveAllClosedJobs}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95"
                  title="Permanently remove all closed jobs from database and clear all related notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove All Closed Jobs</span>
                </button>
              )}
            </div>
          </div>

          {/* Search bar for closed jobs */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search closed jobs by title, company, location..."
              value={closedJobsSearch}
              onChange={(e) => setClosedJobsSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Closed Job Cards */}
          {filteredClosedJobs.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-2xl space-y-2">
              <Lock className="w-8 h-8 text-rose-400 mx-auto opacity-60" />
              <p className="font-bold text-gray-300">No closed vacancies currently recorded</p>
              <p className="text-gray-500 max-w-sm mx-auto">
                When you close an active requisition from the "Live on User Page" tab or when the hourly AI Freshness Agent unlists an expired vacancy, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClosedJobs.map((job) => {
                const compName = typeof job.company === 'object' ? job.company?.name : job.company || 'Verified Employer';
                const salary = job.salaryDisplay || job.salary || (job.salaryMin ? `$${(job.salaryMin/1000).toFixed(0)}k - $${(job.salaryMax/1000).toFixed(0)}k / yr` : 'Competitive');
                const isReopening = reopeningJobIds.has(job.id);
                const isDeleting = deletingJobIds.has(job.id);

                return (
                  <div
                    key={job.id}
                    className="bg-[#181313] border border-red-900/60 hover:border-red-600/60 rounded-2xl p-5 sm:p-6 transition shadow-lg space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-400" />
                            Closed • Hidden from User Page
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-gray-400 bg-[#222228] border border-gray-700">
                            ID: #{job.id}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-slate-300">
                          {job.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <span className="text-white font-bold flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-rose-400" />
                            {compName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            {job.location || 'Remote'}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-amber-400 font-bold">{salary}</span>
                        </div>

                        <p className="text-[11px] text-rose-300/80 font-mono mt-1">
                          Status: {job.summary || 'Hiring closed by employer or expired on career portal.'}
                        </p>
                      </div>

                      {/* Action Buttons: Reopen and Delete */}
                      <div className="flex items-center gap-2.5 lg:flex-shrink-0">
                        <button
                          type="button"
                          disabled={isReopening}
                          onClick={() => handleReopenJob(job)}
                          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                          title="Restore this job to live active status on User page"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isReopening ? 'animate-spin' : ''}`} />
                          <span>{isReopening ? 'Reopening...' : 'Re-open Job'}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handlePermanentDelete(job)}
                          className="p-2.5 rounded-xl bg-[#222228] hover:bg-rose-950 text-gray-400 hover:text-rose-300 border border-gray-700 hover:border-rose-600 transition flex items-center justify-center active:scale-95 disabled:opacity-50"
                          title="Permanently delete this record"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* EDIT & GRANT PERMISSION MODAL */}
      {editingJob && (
        <EditAndGrantPermissionModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onPermissionGranted={(updatedJob) => {
            // Optimistically update lists and counters without full page reload
            setPendingJobs(prev => prev.filter(j => j.id !== updatedJob.id));
            setAdminStats(prev => prev ? {
              ...prev,
              activeJobs: (prev.activeJobs || 0) + 1,
              totalJobs: (prev.totalJobs || 0) + 1,
              pendingReviews: Math.max(0, (prev.pendingReviews || 1) - 1)
            } : {
              activeJobs: (liveJobs.length || 0) + 1,
              totalJobs: (liveJobs.length || 0) + 1
            });
            setActionNotice({
              type: 'success',
              msg: `Permission Granted & Details Updated: "${updatedJob.title}" has been moved to the user page!`,
              actionLabel: 'View on User Page →',
              onAction: () => onSelectView && onSelectView('dashboard-overview')
            });
            // Silently synchronize in background
            fetchPendingJobs(true);
            if (onJobApproved) {
              onJobApproved(updatedJob);
            }
            setTimeout(() => setActionNotice(null), 5000);
          }}
        />
      )}

    </div>
  );
}
