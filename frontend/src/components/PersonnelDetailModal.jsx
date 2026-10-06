import { 
  X, 
  Shield, 
  Briefcase, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  UserCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function PersonnelDetailModal({ 
  member, 
  onClose, 
  onEditPermissions, 
  onRevokeAccess 
}) {
  if (!member) return null;

  const isAdmin = member.role === 'ROLE_ADMIN' || member.role === 'ADMIN';
  const memberPerms = member.permissions || ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'VIEW_APPLICATIONS'];

  const allAvailablePermissions = [
    {
      id: 'REVIEW_AI_VACANCIES',
      label: 'Review AI Vacancies',
      desc: 'Browse and inspect AI crawler staging queue from Greenhouse, Lever, and Ashby.'
    },
    {
      id: 'GRANT_PERMISSION',
      label: 'Grant Live Permission',
      desc: 'Authorize AI-extracted listings to be published live with verified badge.'
    },
    {
      id: 'EDIT_JOB_DETAILS',
      label: 'Edit Job & Salary Details',
      desc: 'Modify salary ranges, required skills, title, and application URLs before publishing.'
    },
    {
      id: 'VIEW_APPLICATIONS',
      label: 'View Candidate Resumes',
      desc: 'Access candidate contact details, ATS match scorecard, and parsed experience.'
    },
    {
      id: 'UPDATE_STATUS',
      label: 'Decide Candidate Status',
      desc: 'Shortlist, review, accept, or reject candidate job applications.'
    },
    {
      id: 'POST_DIRECT_JOBS',
      label: 'Post Direct Vacancies',
      desc: 'Directly submit manual company openings into backend API.'
    }
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently Deployed';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#222228] border border-yellow-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl select-none shadow-md border-2 ${
              isAdmin 
                ? 'bg-yellow-500/10 border-yellow-400 text-yellow-200' 
                : 'bg-yellow-400/10 border-yellow-400 text-yellow-300'
            }`}>
              {member.avatar || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">{member.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                  isAdmin
                    ? 'bg-yellow-400/15 border border-yellow-500/30 text-yellow-300'
                    : 'bg-yellow-400/20 border border-yellow-500/40 text-yellow-300'
                }`}>
                  {isAdmin ? <Shield className="w-3 h-3 text-yellow-400" /> : <Briefcase className="w-3 h-3 text-yellow-400" />}
                  {isAdmin ? 'Platform Administrator' : 'Company Employee / Recruiter'}
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span>{member.email}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-semibold">{member.status || 'ACTIVE'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-yellow-400" />
              Company / Organization
            </span>
            <p className="font-extrabold text-white text-sm">
              {member.company || (isAdmin ? 'JobProof Core Governance' : 'Partner Company')}
            </p>
            <p className="text-[11px] text-gray-400">{member.title || (isAdmin ? 'Platform Authority Lead' : 'Senior Recruiter')}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              Deployer / Author Attribution
            </span>
            <p className="font-extrabold text-white text-sm">
              {member.author || 'Alex Vance (Admin Author)'}
            </p>
            <p className="text-[11px] text-yellow-400 font-semibold">Authorized by Platform Authority</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Deployed / Created Date
            </span>
            <p className="font-extrabold text-white text-sm">{formatDate(member.createdAt)}</p>
            <p className="text-[11px] text-gray-400">Recorded in Platform Governance Logs</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Direct Contact
            </span>
            <p className="font-extrabold text-white text-sm">{member.phone || '+1 (555) 438-9921'}</p>
            <p className="text-[11px] text-gray-400">Verified Work Contact</p>
          </div>
        </div>

        {/* Operational Permissions Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-yellow-400" />
              <span>Operational Clearance & Permissions ({memberPerms.length} of 6 Granted)</span>
            </h3>
            {onEditPermissions && (
              <button
                onClick={() => {
                  onClose();
                  onEditPermissions(member);
                }}
                className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1"
              >
                <span>Edit Permissions</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {allAvailablePermissions.map((perm) => {
              const isGranted = memberPerms.includes(perm.id);
              return (
                <div
                  key={perm.id}
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 transition ${
                    isGranted
                      ? 'bg-yellow-400/5 border-yellow-500/30 text-white'
                      : 'bg-[#18181c]/50 border-gray-800/80 text-gray-500'
                  }`}
                >
                  {isGranted ? (
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className={`font-extrabold text-[11px] ${isGranted ? 'text-white' : 'text-gray-500'}`}>
                      {perm.label}
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight">{perm.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 flex items-center justify-between border-t border-gray-800 text-xs">
          {onRevokeAccess ? (
            <button
              onClick={() => {
                onClose();
                onRevokeAccess(member);
              }}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Revoke Personnel Access</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            {onEditPermissions && (
              <button
                onClick={() => {
                  onClose();
                  onEditPermissions(member);
                }}
                className="px-4 py-2 rounded-xl bg-[#18181c] hover:bg-gray-800 border border-yellow-500/30 text-yellow-400 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Adjust Permissions</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs transition"
            >
              Close Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
