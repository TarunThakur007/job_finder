import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Shield, 
  Briefcase, 
  Building2, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function DeployUserModal({ onClose, onUserDeployed, initialRole = 'ROLE_EMPLOYEE' }) {
  const [deployMode, setDeployMode] = useState('single'); // 'single' | 'batch'
  
  const isAdminInit = initialRole === 'ROLE_ADMIN';

  // Single User Form State
  const [singleForm, setSingleForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: initialRole, // 'ROLE_EMPLOYEE' | 'ROLE_ADMIN'
    company: isAdminInit ? 'JobProof Core' : 'Google',
    title: isAdminInit ? 'Platform Governance & Security Lead' : 'Senior Technical Recruiter',
    password: 'SecurePass123!'
  });

  // Batch Form State
  const [batchForm, setBatchForm] = useState({
    company: isAdminInit ? 'JobProof Security' : 'Stripe',
    role: initialRole,
    count: 3,
    titlePrefix: isAdminInit ? 'Platform Governance Lead' : 'Hiring Partner & Recruiter',
    emailDomain: isAdminInit ? 'jobproof.io' : 'stripe.com',
    basePassword: 'SecurePass123!'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!singleForm.name || !singleForm.email) {
      setError('Please provide a valid name and email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/users/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleForm)
      });

      let deployedUser;
      if (res.ok) {
        deployedUser = await res.json();
      } else {
        // Fallback local persistence
        deployedUser = {
          id: Date.now(),
          ...singleForm,
          createdAt: new Date().toISOString()
        };
      }

      // Save to localStorage so deployed user can log in right away
      try {
        const saved = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
        const updated = [deployedUser, ...saved.filter(u => u.email !== deployedUser.email)];
        localStorage.setItem('jobproof_deployed_users', JSON.stringify(updated));
      } catch (e) {}

      onUserDeployed([deployedUser]);
      onClose();
    } catch (err) {
      const fallbackUser = {
        id: Date.now(),
        ...singleForm,
        createdAt: new Date().toISOString()
      };
      try {
        const saved = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
        const updated = [fallbackUser, ...saved.filter(u => u.email !== fallbackUser.email)];
        localStorage.setItem('jobproof_deployed_users', JSON.stringify(updated));
      } catch (e) {}

      onUserDeployed([fallbackUser]);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    const count = parseInt(batchForm.count) || 3;
    if (count < 1 || count > 10) {
      setError('Please enter a count between 1 and 10.');
      return;
    }

    setLoading(true);
    setError(null);

    const generatedUsers = [];
    const compSlug = batchForm.company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const firstNames = ['Marcus', 'Elena', 'Julian', 'Sofia', 'Devon', 'Chloe', 'Nathan', 'Aria', 'Kiran', 'Lucas'];

    for (let i = 0; i < count; i++) {
      const fName = firstNames[i % firstNames.length];
      const lName = batchForm.company;
      generatedUsers.push({
        name: `${fName} ${lName} (${batchForm.role === 'ROLE_ADMIN' ? 'Admin' : 'Recruiter'})`,
        email: `${fName.toLowerCase()}.${compSlug}${i + 1}@${batchForm.emailDomain || 'company.com'}`,
        role: batchForm.role,
        company: batchForm.company,
        title: batchForm.titlePrefix || 'Talent Acquisition',
        password: batchForm.basePassword || 'SecurePass123!'
      });
    }

    try {
      const res = await fetch('/api/admin/users/deploy-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedUsers)
      });

      let deployedList = [];
      if (res.ok) {
        deployedList = await res.json();
      } else {
        deployedList = generatedUsers.map((u, idx) => ({ id: Date.now() + idx, ...u, createdAt: new Date().toISOString() }));
      }

      try {
        const saved = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
        const updated = [...deployedList, ...saved];
        localStorage.setItem('jobproof_deployed_users', JSON.stringify(updated));
      } catch (e) {}

      onUserDeployed(deployedList);
      onClose();
    } catch (err) {
      const fallbackList = generatedUsers.map((u, idx) => ({ id: Date.now() + idx, ...u, createdAt: new Date().toISOString() }));
      try {
        const saved = JSON.parse(localStorage.getItem('jobproof_deployed_users') || '[]');
        const updated = [...fallbackList, ...saved];
        localStorage.setItem('jobproof_deployed_users', JSON.stringify(updated));
      } catch (e) {}

      onUserDeployed(fallbackList);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#222228] border border-yellow-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="space-y-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
              singleForm.role === 'ROLE_ADMIN'
                ? 'bg-yellow-400/15 border border-yellow-500/30 text-yellow-300'
                : 'bg-yellow-400/10 border border-yellow-500/30 text-yellow-400'
            }`}>
              {singleForm.role === 'ROLE_ADMIN' ? <Shield className="w-3.5 h-3.5 text-yellow-400" /> : <UserPlus className="w-3.5 h-3.5 text-yellow-400" />}
              <span>{singleForm.role === 'ROLE_ADMIN' ? 'Platform Administrator Provisioning' : 'Company Employee Deployment'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Deploy <span className={singleForm.role === 'ROLE_ADMIN' ? 'text-yellow-400' : 'text-yellow-400'}>
                {singleForm.role === 'ROLE_ADMIN' ? 'New Platform Admin' : 'New Employee Account'}
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              {singleForm.role === 'ROLE_ADMIN' 
                ? 'Deploy an administrator with full system governance and operational rights.' 
                : 'Provision authorized company employee recruiters with job review and ATS rights.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deploy Mode Selector: Single vs Batch */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#18181c] rounded-2xl border border-gray-800">
          <button
            type="button"
            onClick={() => { setDeployMode('single'); setError(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              deployMode === 'single'
                ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Deploy Single Member</span>
          </button>

          <button
            type="button"
            onClick={() => { setDeployMode('batch'); setError(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              deployMode === 'batch'
                ? 'bg-yellow-400 text-gray-950 font-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Batch Deploy Multiple Employees</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SINGLE DEPLOY FORM */}
        {deployMode === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="space-y-4 text-xs">
            {/* Role Selection */}
            <div>
              <label className="block text-gray-300 font-bold mb-1.5">Assigned Platform Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSingleForm({ ...singleForm, role: 'ROLE_EMPLOYEE', title: 'Company Recruiter & Hiring Partner' })}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                    singleForm.role === 'ROLE_EMPLOYEE'
                      ? 'bg-yellow-400/10 border-yellow-400 text-white'
                      : 'bg-[#18181c] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-white text-xs">Employee / Recruiter</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Reviews AI vacancies, grants publishing permissions, reviews applicants</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSingleForm({ ...singleForm, role: 'ROLE_ADMIN', title: 'Platform Security & Governance Lead' })}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                    singleForm.role === 'ROLE_ADMIN'
                      ? 'bg-yellow-400/15 border-yellow-400 text-white'
                      : 'bg-[#18181c] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-white text-xs">Platform Administrator</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Full governance, security audit, crawls ATS feeds, deploys team members</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={singleForm.name}
                  onChange={(e) => setSingleForm({ ...singleForm, name: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Work Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. david.miller@google.com"
                  value={singleForm.email}
                  onChange={(e) => setSingleForm({ ...singleForm, email: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Company / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Stripe, Figma"
                  value={singleForm.company}
                  onChange={(e) => setSingleForm({ ...singleForm, company: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Official Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Talent Partner"
                  value={singleForm.title}
                  onChange={(e) => setSingleForm({ ...singleForm, title: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Contact Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={singleForm.phone || ''}
                  onChange={(e) => setSingleForm({ ...singleForm, phone: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Initial Access Password</label>
                <input
                  type="text"
                  required
                  value={singleForm.password}
                  onChange={(e) => setSingleForm({ ...singleForm, password: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 block">
              The provisioned member can sign in directly from the login page with this password.
            </span>

            <div className="pt-3 flex justify-end gap-3 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-yellow-400 text-gray-950 font-extrabold hover:bg-yellow-300 transition shadow-lg shadow-yellow-500/20 active:scale-95"
              >
                {loading ? 'Deploying...' : `Deploy ${singleForm.role === 'ROLE_ADMIN' ? 'Admin' : 'Employee'}`}
              </button>
            </div>
          </form>
        ) : (
          /* BATCH DEPLOY FORM */
          <form onSubmit={handleBatchSubmit} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-yellow-400" />
              <span>Bulk provision up to 10 employee recruiters simultaneously for an enterprise team.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe"
                  value={batchForm.company}
                  onChange={(e) => {
                    const comp = e.target.value;
                    const domain = comp.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
                    setBatchForm({ ...batchForm, company: comp, emailDomain: domain });
                  }}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Number of Employees to Deploy</label>
                <select
                  value={batchForm.count}
                  onChange={(e) => setBatchForm({ ...batchForm, count: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value={2}>2 Accounts</option>
                  <option value={3}>3 Accounts</option>
                  <option value={5}>5 Accounts</option>
                  <option value={10}>10 Accounts</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Email Domain</label>
                <input
                  type="text"
                  required
                  placeholder="stripe.com"
                  value={batchForm.emailDomain}
                  onChange={(e) => setBatchForm({ ...batchForm, emailDomain: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Technical Recruiter"
                  value={batchForm.titlePrefix}
                  onChange={(e) => setBatchForm({ ...batchForm, titlePrefix: e.target.value })}
                  className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1.5">Shared Access Password</label>
              <input
                type="text"
                required
                value={batchForm.basePassword}
                onChange={(e) => setBatchForm({ ...batchForm, basePassword: e.target.value })}
                className="w-full bg-[#18181c] border border-gray-800 rounded-xl px-4 py-2.5 text-white font-mono focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-yellow-400 text-gray-950 font-extrabold hover:bg-yellow-300 transition shadow-lg shadow-yellow-500/20 active:scale-95"
              >
                {loading ? 'Batch Deploying...' : `Deploy ${batchForm.count} Employee Accounts`}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
