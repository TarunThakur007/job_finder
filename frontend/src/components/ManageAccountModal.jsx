import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Building2, 
  Phone, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  Briefcase, 
  Save, 
  Shield, 
  Sparkles,
  Award,
  Calendar
} from 'lucide-react';

export default function ManageAccountModal({ currentUser, onClose, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'permissions'

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Tarun Thakur',
    email: currentUser?.email || 'admin@jobproof.io',
    phone: currentUser?.phone || '+1 (555) 019-2834',
    company: currentUser?.company || (currentUser?.role === 'ROLE_ADMIN' ? 'JobProof Core Governance' : 'Google'),
    title: currentUser?.title || (currentUser?.role === 'ROLE_ADMIN' ? 'Platform Administrator & Author' : 'Talent Partner'),
    bio: currentUser?.bio || 'Leading technology recruitment and job verification operations on JobProof.'
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isEmployee = currentUser?.role === 'ROLE_EMPLOYEE';

  const permissionsList = currentUser?.permissions || (
    isAdmin
      ? ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'EDIT_JOB_DETAILS', 'VIEW_APPLICATIONS', 'UPDATE_STATUS', 'POST_DIRECT_JOBS']
      : ['REVIEW_AI_VACANCIES', 'GRANT_PERMISSION', 'VIEW_APPLICATIONS']
  );

  const permissionLabels = {
    'REVIEW_AI_VACANCIES': { label: 'Review AI Vacancies', desc: 'Browse and inspect AI crawler staging queue from Greenhouse, Lever, and Ashby.' },
    'GRANT_PERMISSION': { label: 'Grant Live Permission', desc: 'Authorize AI-extracted listings to be published live with verified badge.' },
    'EDIT_JOB_DETAILS': { label: 'Edit Job & Salary Details', desc: 'Modify salary ranges, required skills, title, and application URLs before publishing.' },
    'VIEW_APPLICATIONS': { label: 'View Candidate Resumes', desc: 'Access candidate contact details, ATS match scorecard, and parsed experience.' },
    'UPDATE_STATUS': { label: 'Decide Candidate Status', desc: 'Shortlist, review, accept, or reject candidate job applications.' },
    'POST_DIRECT_JOBS': { label: 'Post Direct Vacancies', desc: 'Directly submit manual company openings into backend API.' }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name: formData.name,
      phone: formData.phone,
      company: formData.company,
      title: formData.title,
      bio: formData.bio
    };

    // Update in localStorage
    try {
      localStorage.setItem('jobproof_user', JSON.stringify(updated));
    } catch (err) {}

    if (onUpdateUser) {
      onUpdateUser(updated);
    }

    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#222228] border border-yellow-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#18181c] border-2 border-yellow-400 flex items-center justify-center text-2xl select-none shadow-md">
              {currentUser?.avatar || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{formData.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-yellow-400/15 border border-yellow-500/30 text-yellow-300'
                    : isEmployee
                    ? 'bg-yellow-400/20 border border-yellow-500/40 text-yellow-300'
                    : 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                }`}>
                  {isAdmin ? 'Admin Author' : isEmployee ? 'Company Recruiter' : 'Candidate'}
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span>{currentUser?.email || 'admin@jobproof.io'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold">Active Session</span>
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-[#18181c] rounded-2xl border border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Session</span>
          </button>

          {(isAdmin || isEmployee) && (
            <button
              type="button"
              onClick={() => setActiveTab('permissions')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'permissions'
                  ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Permissions ({permissionsList.length})</span>
            </button>
          )}
        </div>

        {savedNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Account profile details updated successfully!</span>
          </div>
        )}

        {/* TAB 1: PROFILE DETAILS FORM */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Email Address (Primary)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#18181c]/60 border border-gray-800 rounded-xl text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Company / Organization</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1.5">Professional Title / Headline</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#18181c] border border-gray-800 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1.5">Bio & Professional Summary</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3 bg-[#18181c] border border-gray-800 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Session</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs transition shadow-lg shadow-yellow-500/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: SECURITY & SESSION */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#18181c] border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Authentication Status
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  Active & Verified
                </span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Your session is authenticated via JobProof Security Engine. Active credential hash is validated against backend in-memory H2 database with Spring Security.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Clearance</span>
                <p className="font-black text-white text-sm">
                  {isAdmin ? 'Level 3 - Master Admin Author' : isEmployee ? 'Level 2 - Company Recruiter' : 'Level 1 - Candidate'}
                </p>
                <p className="text-[10px] text-yellow-400">Full operational rights enabled</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#18181c] border border-gray-800 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Session Active Since</span>
                <p className="font-black text-white text-sm flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Today, {new Date().toLocaleTimeString()}
                </p>
                <p className="text-[10px] text-gray-400">Logged in via JobProof Direct Portal</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 space-y-2">
              <span className="font-bold text-yellow-300 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Password & Credential Security
              </span>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                To update your secure password or rotate API access keys, you can verify your existing credentials with your admin author or trigger a secure credential reset.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out from All Devices</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PERMISSIONS BREAKDOWN */}
        {activeTab === 'permissions' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-bold">Assigned Operational Rights:</span>
              <span className="text-yellow-400 font-extrabold">{permissionsList.length} of 6 Enabled</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {Object.entries(permissionLabels).map(([key, item]) => {
                const hasPerm = permissionsList.includes(key);
                return (
                  <div
                    key={key}
                    className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition ${
                      hasPerm
                        ? 'bg-yellow-400/5 border-yellow-500/30 text-white'
                        : 'bg-[#18181c]/50 border-gray-800/80 text-gray-500'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className={`font-extrabold text-xs flex items-center gap-1.5 ${hasPerm ? 'text-white' : 'text-gray-400'}`}>
                        {hasPerm ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-gray-600 inline-block" />
                        )}
                        {item.label}
                      </p>
                      <p className="text-[11px] text-gray-400">{item.desc}</p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      hasPerm ? 'bg-yellow-400 text-gray-950' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {hasPerm ? 'Active' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-yellow-400 text-gray-950 font-black text-xs hover:bg-yellow-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
