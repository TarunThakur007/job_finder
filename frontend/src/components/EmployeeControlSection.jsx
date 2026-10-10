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
  Rocket,
  Copy,
  CheckCheck,
  Globe,
  Link as LinkIcon,
  Filter,
  ChevronDown,
  X
} from 'lucide-react';
import EditAndGrantPermissionModal from './EditAndGrantPermissionModal';
import { formatTimeAgo } from '../utils/timeAgo';

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
  const [stagedSourceFilter, setStagedSourceFilter] = useState('ALL');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [copiedUrlId, setCopiedUrlId] = useState(null);
  const [closedJobs, setClosedJobs] = useState([]);
  const [closingJobIds, setClosingJobIds] = useState(new Set());
  const [reopeningJobIds, setReopeningJobIds] = useState(new Set());
  const [deletingJobIds, setDeletingJobIds] = useState(new Set());

  // Indian tech hubs for quick 1-click filtering (India locations only)
  const locationPills = [
    { id: 'ALL', label: 'All India Locations' },
    { id: 'Remote', label: '🌐 Remote (India)' },
    { id: 'Bengaluru', label: '🏙️ Bengaluru' },
    { id: 'Hyderabad', label: '🏙️ Hyderabad' },
    { id: 'Pune', label: '🏙️ Pune' },
    { id: 'Delhi NCR', label: '🏙️ Delhi NCR' },
    { id: 'Mumbai', label: '🏙️ Mumbai' },
    { id: 'Chennai', label: '🏙️ Chennai' },
    { id: 'Kolkata', label: '🏙️ Kolkata' },
    { id: 'Ahmedabad', label: '🏙️ Ahmedabad' },
    { id: 'Jaipur', label: '🏙️ Jaipur' },
  ];

  // Smart location matching for Indian metro hubs and remote variations
  const matchesLocation = (jobLoc, target) => {
    if (!target || target === 'ALL') return true;
    const l = (jobLoc || '').toLowerCase().trim();
    const t = target.toLowerCase().trim();
    if (t === 'remote') {
      return l.includes('remote') || l.includes('wfh') || l.includes('work from home') || l.includes('anywhere');
    }
    if (t === 'bengaluru' || t === 'bangalore') {
      return l.includes('bengaluru') || l.includes('bangalore');
    }
    if (t === 'delhi ncr' || t === 'delhi' || t === 'ncr') {
      return l.includes('delhi') || l.includes('noida') || l.includes('gurgaon') || l.includes('gurugram') || l.includes('ncr');
    }
    if (t === 'mumbai') {
      return l.includes('mumbai') || l.includes('navi mumbai') || l.includes('thane');
    }
    if (t === 'hyderabad') {
      return l.includes('hyderabad') || l.includes('secunderabad');
    }
    if (t === 'pune') {
      return l.includes('pune');
    }
    if (t === 'chennai') {
      return l.includes('chennai');
    }
    if (t === 'kolkata') {
      return l.includes('kolkata') || l.includes('calcutta');
    }
    if (t === 'ahmedabad') {
      return l.includes('ahmedabad');
    }
    if (t === 'jaipur') {
      return l.includes('jaipur');
    }
    return l.includes(t);
  };

  const INDIAN_REGION_KEYWORDS = [
    'india', 'bengaluru', 'bangalore', 'hyderabad', 'secunderabad',
    'pune', 'mumbai', 'delhi', 'gurugram', 'gurgaon', 'noida', 'ncr',
    'chennai', 'kolkata', 'ahmedabad', 'jaipur', 'kochi', 'cochin',
    'trivandrum', 'thiruvananthapuram', 'indore', 'bhopal', 'chandigarh',
    'mohali', 'lucknow', 'surat', 'vadodara', 'coimbatore', 'mysore',
    'mysuru', 'nagpur', 'visakhapatnam', 'vizag', 'bhubaneswar', 'goa',
    'karnataka', 'maharashtra', 'telangana', 'tamil nadu', 'haryana',
    'uttar pradesh', 'west bengal', 'gujarat', 'rajasthan', 'kerala'
  ];

  const isIndiaLocation = (raw) => {
    if (!raw) return false;
    const lower = raw.toLowerCase();
    if (lower.includes('united states') || lower.includes('germany') || lower.includes('berlin') ||
        lower.includes('london') || lower.includes('united kingdom') || lower.includes('san francisco') ||
        lower.includes('new york') || lower.includes('seattle') || lower.includes('washington') ||
        lower.includes('california') || lower.includes('munich') || lower.includes('toronto') || lower.includes('canada')) {
      return false;
    }
    return INDIAN_REGION_KEYWORDS.some(k => lower.includes(k));
  };

  // Dynamically extract all unique Indian locations discovered across all jobs
  const discoveredLocations = React.useMemo(() => {
    const locSet = new Set();
    const addLoc = (raw) => {
      if (!raw || typeof raw !== 'string') return;
      const clean = raw.trim();
      if (!clean || clean.length < 2) return;
      if (!isIndiaLocation(clean)) return;
      const lower = clean.toLowerCase();
      if (['remote', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'mumbai', 'delhi', 'gurugram', 'noida', 'chennai', 'kolkata', 'ahmedabad', 'jaipur'].includes(lower)) {
        return;
      }
      locSet.add(clean);
    };
    (pendingJobs || []).forEach(j => addLoc(j.location));
    (liveJobs || []).forEach(j => addLoc(j.location));
    (closedJobs || []).forEach(j => addLoc(j.location));
    return Array.from(locSet).slice(0, 30).sort((a, b) => a.localeCompare(b));
  }, [pendingJobs, liveJobs, closedJobs]);

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
        // If review queue has no staged vacancies, auto-sync Gemini AI jobs directly
        if (Array.isArray(data) && data.length === 0) {
          handleTriggerDiscovery('GEMINI_AI');
        }
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

  const handleGrantClosePermission = async (notification) => {
    const notifId = notification.id;
    const jId = notification.jobId;
    const jTitle = notification.jobTitle || 'Role';

    if (!window.confirm(`Grant Employee Permission to close "${jTitle}"? This role will be immediately unlisted from the public User page and moved to the Closed Vacancies section.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/notifications/${notifId}/confirm-close`, { method: 'POST' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true, message: n.message + ' [Closed with Employee Permission]' } : n));
        setUnreadNotificationsCount(prev => Math.max(0, prev - 1));

        if (jId && jId > 0) {
          if (onCloseJob) onCloseJob(jId);
          fetchClosedJobs();
        }

        setActionNotice({
          type: 'success',
          msg: `Employee Permission Granted: "${jTitle}" has been closed and removed from public search.`,
          actionLabel: 'View Closed Jobs',
          onAction: () => setEmployeeTab('closed')
        });
      }
    } catch (err) {
      console.error('Error granting close permission:', err);
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

  const handleRunFreshnessAudit = async () => {
    setAuditingFreshness(true);
    setActionNotice(null);
    try {
      const res = await fetch('/api/admin/audit-freshness', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const flagged = data.flaggedCount || data.closedCount || 0;
        setActionNotice({
          type: 'success',
          msg: `AI Freshness Sentinel Complete: Audited ${data.totalAudited || activePublishedJobs.length || 0} listings. ${flagged} closure update(s) delivered directly to the Job Closer Section!`,
          actionLabel: 'Open Job Closer Section →',
          onAction: () => setEmployeeTab('closed')
        });
        fetchClosedJobs();
        fetchPendingJobs(true);
      }
    } catch (e) {
      setActionNotice({ 
        type: 'info', 
        msg: 'Hourly Freshness Sentinel executed: updates sent directly to Closer section.',
        actionLabel: 'Open Closer Section →',
        onAction: () => setEmployeeTab('closed')
      });
    } finally {
      setAuditingFreshness(false);
      setTimeout(() => setActionNotice(null), 7000);
    }
  };

  useEffect(() => {
    fetchPendingJobs(false);
    fetchClosedJobs();
    const interval = setInterval(() => {
      fetchClosedJobs();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter pending vacancies based on source, location & search
  const filteredVacancies = pendingJobs.filter(j => {
    if (stagedSourceFilter !== 'ALL') {
      const src = (j.source || '').toLowerCase();
      if (stagedSourceFilter === 'GEMINI_AI' && !src.includes('gemini') && !src.includes('ingestion') && !src.includes('ai')) return false;
      if (stagedSourceFilter === 'JOOBLE' && !src.includes('jooble')) return false;
      if (stagedSourceFilter === 'USAJOBS' && !src.includes('usajobs')) return false;
      if (stagedSourceFilter === 'REMOTEOK' && !src.includes('remoteok')) return false;
      if (stagedSourceFilter === 'JOBICY' && !src.includes('jobicy')) return false;
      if (stagedSourceFilter === 'ARBEITNOW' && !src.includes('arbeitnow')) return false;
      if (stagedSourceFilter === 'ATS' && (src.includes('jobicy') || src.includes('remoteok') || src.includes('jooble') || src.includes('usajobs') || src.includes('arbeitnow') || src.includes('gemini'))) return false;
    }

    if (!matchesLocation(j.location, filterLocation)) return false;

    if (!vacancySearch) return true;
    const term = vacancySearch.toLowerCase();
    const compName = (j.company?.name || '').toLowerCase();
    const title = (j.title || '').toLowerCase();
    const location = (j.location || '').toLowerCase();
    const applyUrl = (j.applyUrl || '').toLowerCase();
    return compName.includes(term) || title.includes(term) || location.includes(term) || applyUrl.includes(term);
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
    let result = activePublishedJobs;
    if (filterLocation !== 'ALL') {
      result = result.filter(j => matchesLocation(j.location, filterLocation));
    }
    if (!activeJobsSearch) return result;
    const term = activeJobsSearch.toLowerCase().trim();
    return result.filter(j => {
      const compName = (typeof j.company === 'object' ? j.company?.name : j.company || '').toLowerCase();
      const title = (j.title || '').toLowerCase();
      const location = (j.location || '').toLowerCase();
      return compName.includes(term) || title.includes(term) || location.includes(term);
    });
  }, [activePublishedJobs, activeJobsSearch, filterLocation]);

  const filteredClosedJobs = React.useMemo(() => {
    const seen = new Set();
    const dedupedClosed = (closedJobs || []).filter(j => {
      const comp = typeof j.company === 'object' ? j.company?.name : j.company || '';
      const key = `${(j.title || '').trim().toLowerCase()}::${comp.trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    let result = dedupedClosed;
    if (filterLocation !== 'ALL') {
      result = result.filter(j => matchesLocation(j.location, filterLocation));
    }

    if (!closedJobsSearch) return result;
    const term = closedJobsSearch.toLowerCase().trim();
    return result.filter(j => {
      const compName = (typeof j.company === 'object' ? j.company?.name : j.company || '').toLowerCase();
      const title = (j.title || '').toLowerCase();
      const location = (j.location || '').toLowerCase();
      return compName.includes(term) || title.includes(term) || location.includes(term);
    });
  }, [closedJobs, closedJobsSearch, filterLocation]);

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
              {closedJobs.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-black">
                  {closedJobs.length} Inactive Vacancies Tracked
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>Automated Hourly Job Status & Closure Sentinel</span>
            </h3>

            <p className="text-xs text-gray-400 leading-relaxed">
              Every hour, the AI Sentinel inspects all live vacancies listed on the website. If an employer removes a position or their ATS flags it as closed/expired, the AI agent <strong>routes the closing update directly into the Job Closer Section</strong>. Jobs are instantly unlisted from the public User page without cluttering employee notifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setEmployeeTab('closed')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-bold transition active:scale-95 shadow-sm"
              title="Open Job Closer Section directly"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Direct to Closer Section</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                {closedJobs.length}
              </span>
            </button>

            <button
              type="button"
              onClick={handleRunFreshnessAudit}
              disabled={auditingFreshness}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-black transition shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${auditingFreshness ? 'animate-spin' : ''}`} />
              <span>{auditingFreshness ? 'Auditing Live URLs...' : 'Run Audit Now'}</span>
            </button>
          </div>
        </div>
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
          <span>Job Closer Section</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 font-mono font-bold">
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
              className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
              title="Ingest US Federal IT and Cyber jobs from USAJobs API"
            >
              <span>+ USAJobs Gov</span>
            </button>
            <button
              onClick={() => handleTriggerDiscovery('REMOTEOK')}
              disabled={discovering}
              className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
              title="Ingest verified remote developer roles from RemoteOK API"
            >
              <span>+ RemoteOK Feed</span>
            </button>
            <button
              onClick={() => handleTriggerDiscovery('JOBICY')}
              disabled={discovering}
              className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-purple-300 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
              title="Ingest engineering vacancies from Jobicy Remote API"
            >
              <span>+ Jobicy Remote</span>
            </button>
            <button
              onClick={() => handleTriggerDiscovery('ARBEITNOW')}
              disabled={discovering}
              className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
              title="Ingest European tech vacancies from Arbeitnow API"
            >
              <span>+ Arbeitnow Feed</span>
            </button>
            <button
              onClick={() => handleTriggerDiscovery('ATS')}
              disabled={discovering}
              className="px-3 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-60"
              title="Ingest direct ATS feeds (Greenhouse, Lever, Ashby)"
            >
              <span>+ Direct ATS</span>
            </button>
          </div>
        </div>

        {/* 🤖 GEMINI AI DIRECT EXTRACTION ENGINE STATUS */}
        <div className="bg-gradient-to-r from-amber-500/10 via-[#18181c] to-emerald-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white">Gemini AI Direct Extraction Engine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Feed Active
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Indian tech & fresher vacancies are automatically discovered and staged directly into your review queue below for verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button
              type="button"
              onClick={() => handleTriggerDiscovery('GEMINI_AI')}
              disabled={discovering}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-gray-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
              title="Automatically trigger Gemini AI extraction to discover and stage fresh Indian tech jobs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${discovering ? 'animate-spin' : ''}`} />
              <span>{discovering ? 'Extracting...' : 'Sync Gemini AI Jobs'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        {/* Feed Source Filter Chips & Search Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/60">
            <span className="text-[11px] font-bold text-gray-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-yellow-400" />
              Filter by Source Feed:
            </span>
            {[
              { id: 'ALL', label: `All Feeds (${pendingJobs.length})` },
              { id: 'GEMINI_AI', label: '🤖 Gemini AI Agent' },
              { id: 'JOOBLE', label: 'Jooble API' },
              { id: 'USAJOBS', label: 'USAJobs Gov' },
              { id: 'REMOTEOK', label: 'RemoteOK API' },
              { id: 'JOBICY', label: 'Jobicy Remote' },
              { id: 'ARBEITNOW', label: 'Arbeitnow API' },
              { id: 'ATS', label: 'Direct ATS' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setStagedSourceFilter(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                  stagedSourceFilter === chip.id
                    ? 'bg-yellow-400 text-gray-950 font-black shadow-sm shadow-yellow-400/20'
                    : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Location Quick Hub Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/60">
            <span className="text-[11px] font-bold text-gray-400 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-yellow-400" />
              Filter by Location:
            </span>
            {locationPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilterLocation(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                  filterLocation === pill.id
                    ? 'bg-yellow-400 text-gray-950 font-black shadow-sm shadow-yellow-400/20'
                    : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {pill.label}
              </button>
            ))}
            {/* Custom Location Select Dropdown */}
            <div className="relative inline-block">
              <select
                value={locationPills.some(p => p.id === filterLocation) ? '' : filterLocation}
                onChange={(e) => {
                  if (e.target.value) setFilterLocation(e.target.value);
                }}
                className="pl-2.5 pr-7 py-1.5 bg-[#18181c] border border-gray-800 hover:border-yellow-400/50 rounded-xl text-xs text-gray-300 font-semibold focus:outline-none focus:border-yellow-400 cursor-pointer appearance-none transition"
              >
                <option value="">More Cities...</option>
                {discoveredLocations.map((loc) => (
                  <option key={loc} value={loc}>📌 {loc}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {filterLocation !== 'ALL' && (
              <button
                type="button"
                onClick={() => setFilterLocation('ALL')}
                className="px-2 py-1 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-500/30 text-xs font-semibold flex items-center gap-1 transition"
                title="Reset location filter"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by job title, company, location, or apply link..."
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

                    {/* Trust Score Gauge */}
                    <div className="flex items-center gap-3 lg:flex-shrink-0">
                      <div className="text-right px-3 py-1.5 rounded-xl bg-[#222228] border border-gray-800">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Computed Trust</p>
                        <p className="text-sm font-black text-yellow-400">{trustScore}%</p>
                      </div>

                      {/* Reject / Discard */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRejectVacancy(job.id, job.title);
                        }}
                        className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition flex items-center justify-center border border-rose-800/40 active:scale-95"
                        title="Discard listing from review queue"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>

                  {/* AI Extracted Highlights & Job Summary */}
                  <div className="pt-2 text-xs">
                    <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">
                      <span className="font-bold text-gray-300 mr-1.5">AI Summary:</span>
                      {job.description ? job.description.replace(/<[^>]*>?/gm, '').slice(0, 220) + '...' : 'Verified position awaiting employee permission.'}
                    </p>
                  </div>

                  {/* 🔗 EMPLOYEE APPLICATION ENDPOINT VERIFICATION & PERMISSION CENTER */}
                  <div className="p-4 rounded-2xl bg-[#141418] border border-yellow-500/25 space-y-3.5 shadow-inner">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                            <LinkIcon className="w-3.5 h-3.5 text-yellow-400" />
                            Application Endpoint & Apply Link
                          </span>
                          {job.applyUrl && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-400/10 text-yellow-300 border border-yellow-500/30 flex items-center gap-1">
                              <Globe className="w-2.5 h-2.5" />
                              {job.applyUrl.startsWith('mailto:') 
                                ? 'Direct Email Apply' 
                                : (() => {
                                    try {
                                      return new URL(job.applyUrl).hostname.replace('www.', '');
                                    } catch(e) {
                                      return 'External Employer Link';
                                    }
                                  })()}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-300 font-mono truncate max-w-2xl select-all">
                          {job.applyUrl || 'Apply URL is missing - click Update Details to add one.'}
                        </p>
                      </div>

                      {/* Quick Apply URL Test & Copy Tools */}
                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                        {job.applyUrl && (
                          <>
                            <a
                              href={job.applyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-500/30 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm"
                              title="Test and verify authentic employer apply destination in a new browser tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-yellow-400" />
                              <span>Inspect & Test Apply Link</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleCopyApplyUrl(job.id, job.applyUrl)}
                              className="px-3 py-2 rounded-xl bg-[#222228] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                              title="Copy application link to clipboard"
                            >
                              {copiedUrlId === job.id ? (
                                <>
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => setEditingJob(job)}
                          className="px-3 py-2 rounded-xl bg-[#222228] hover:bg-gray-800 text-yellow-300 border border-yellow-500/30 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                          title="Update apply link, salary, or requirements"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Permission Status Gateway Banner & Primary Publish CTA */}
                    <div className="pt-3 border-t border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-300/90 font-medium">
                        <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>
                          <strong>Hidden from Candidates:</strong> Employee permission is required to list this job on the public User Section.
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={grantingIds.has(job.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          handleGrantPermission(job.id, job.title);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-gray-950 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                        title="Authorize apply link and publish live to candidate User Section"
                      >
                        {grantingIds.has(job.id) ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Publishing to User Section...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-gray-950 stroke-[2.5]" />
                            <span>Grant Permission (List in User Section)</span>
                          </>
                        )}
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

          {/* Location Quick Hub Filter Chips for Live Jobs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/60">
            <span className="text-[11px] font-bold text-gray-400 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              Filter by Location:
            </span>
            {locationPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilterLocation(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                  filterLocation === pill.id
                    ? 'bg-teal-400 text-gray-950 font-black shadow-sm shadow-teal-400/20'
                    : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {pill.label}
              </button>
            ))}
            {/* Custom Location Select Dropdown */}
            <div className="relative inline-block">
              <select
                value={locationPills.some(p => p.id === filterLocation) ? '' : filterLocation}
                onChange={(e) => {
                  if (e.target.value) setFilterLocation(e.target.value);
                }}
                className="pl-2.5 pr-7 py-1.5 bg-[#18181c] border border-gray-800 hover:border-teal-400/50 rounded-xl text-xs text-gray-300 font-semibold focus:outline-none focus:border-teal-400 cursor-pointer appearance-none transition"
              >
                <option value="">More Cities...</option>
                {discoveredLocations.map((loc) => (
                  <option key={loc} value={loc}>📌 {loc}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {filterLocation !== 'ALL' && (
              <button
                type="button"
                onClick={() => setFilterLocation('ALL')}
                className="px-2 py-1 rounded-lg bg-teal-400/10 hover:bg-teal-400/20 text-teal-400 border border-teal-500/30 text-xs font-semibold flex items-center gap-1 transition"
                title="Reset location filter"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search bar for active jobs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

            <div className="text-xs text-gray-400 font-semibold flex items-center gap-2">
              <span>Showing:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#18181c] border border-gray-800 text-teal-400 font-extrabold">
                {filteredActiveJobs.length} of {activePublishedJobs.length} Live Positions
              </span>
            </div>
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
                          <span 
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
                            title={`Agent last checked: ${job.lastVerified || job.postedDate}`}
                          >
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                            </span>
                            <span>Open • Checked {formatTimeAgo(job.lastVerified || job.postedDate)}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-gray-400 bg-[#222228] border border-gray-700">
                            ID: #{job.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-300 bg-[#222228] border border-gray-700">
                            {job.jobType || job.employmentType || 'Full-time'}
                          </span>
                          {job.summary && job.summary.includes('AI Freshness Sentinel Advisory') && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              AI Alert: Employee Permission Needed to Close
                            </span>
                          )}
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
                          className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50 ${
                            job.summary && job.summary.includes('AI Freshness Sentinel Advisory')
                              ? 'bg-rose-600 hover:bg-rose-500 border-rose-400 text-white shadow-rose-900/50 animate-pulse'
                              : 'bg-rose-950/80 hover:bg-rose-900 border-rose-600/60 hover:border-rose-500 text-rose-200 hover:text-white shadow-rose-950/30'
                          }`}
                          title="Close this opening and unlist it from the user page (moves to Closed tab)"
                        >
                          <Lock className="w-3.5 h-3.5 text-rose-300" />
                          <span>{isClosing ? 'Closing...' : (job.summary && job.summary.includes('AI Freshness Sentinel Advisory') ? 'Grant Permission to Close' : 'Close Job')}</span>
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

      {/* 3. JOB CLOSER SECTION (CLOSED VACANCIES) */}
      {employeeTab === 'closed' && (
        <div className="bg-[#222228] border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-400" />
                <span>Job Closer Section (Closed & Inactive Vacancies)</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                The AI Freshness Sentinel delivers role closure updates directly to this section. All roles here are immediately hidden from the public User page. You can review employer closure reasons, re-open any vacancy, or permanently delete records.
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
                  title="Permanently remove all closed jobs from database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove All Closed Jobs</span>
                </button>
              )}
            </div>
          </div>

          {/* AI AGENT DIRECT CLOSER FEED BANNER */}
          <div className="bg-[#17121b] border border-rose-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-inner">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center flex-shrink-0 text-rose-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-rose-300 uppercase tracking-wider">
                    AI Sentinel Direct Closing Feed
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    Direct Routing Active • No Notification Clutter
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  When employers close or expire a vacancy, the AI agent updates it directly in this Closer section. No manual notification triage is required.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunFreshnessAudit}
              disabled={auditingFreshness}
              className="px-4 py-2 rounded-xl bg-[#251b29] hover:bg-[#34243b] border border-rose-500/40 text-rose-200 text-xs font-bold transition flex items-center gap-2 flex-shrink-0 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${auditingFreshness ? 'animate-spin' : ''}`} />
              <span>{auditingFreshness ? 'Auditing URLs...' : 'Sync AI Closures'}</span>
            </button>
          </div>

          {/* Location Quick Hub Filter Chips for Closed Jobs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/60">
            <span className="text-[11px] font-bold text-gray-400 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Filter by Location:
            </span>
            {locationPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilterLocation(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                  filterLocation === pill.id
                    ? 'bg-rose-500 text-white font-black shadow-sm shadow-rose-500/20'
                    : 'bg-[#18181c] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {pill.label}
              </button>
            ))}
            {/* Custom Location Select Dropdown */}
            <div className="relative inline-block">
              <select
                value={locationPills.some(p => p.id === filterLocation) ? '' : filterLocation}
                onChange={(e) => {
                  if (e.target.value) setFilterLocation(e.target.value);
                }}
                className="pl-2.5 pr-7 py-1.5 bg-[#18181c] border border-gray-800 hover:border-rose-400/50 rounded-xl text-xs text-gray-300 font-semibold focus:outline-none focus:border-rose-400 cursor-pointer appearance-none transition"
              >
                <option value="">More Cities...</option>
                {discoveredLocations.map((loc) => (
                  <option key={loc} value={loc}>📌 {loc}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {filterLocation !== 'ALL' && (
              <button
                type="button"
                onClick={() => setFilterLocation('ALL')}
                className="px-2 py-1 rounded-lg bg-rose-400/10 hover:bg-rose-400/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition"
                title="Reset location filter"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search bar for closed jobs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

            <div className="text-xs text-gray-400 font-semibold flex items-center gap-2">
              <span>Showing:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#18181c] border border-gray-800 text-rose-400 font-extrabold">
                {filteredClosedJobs.length} of {closedJobs.length} Closed Positions
              </span>
            </div>
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
