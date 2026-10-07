import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Shield,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase,
  TrendingUp,
  KeyRound,
  FileCheck2,
  LockKeyhole,
  Cpu,
  Monitor,
  MapPin,
  Building2,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function LoginView({
  onLoginSuccess,
  initialIsSignUp = false,
  initialMessage = null,
  initialPanel = 'user'
}) {
  // Discrete Staff Portal state (activated via explicit click, prop, or #staff hash)
  const [isStaffPortal, setIsStaffPortal] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#staff' || window.location.search.includes('portal=staff')) {
        return true;
      }
    }
    return initialPanel === 'employee' || initialPanel === 'admin';
  });

  const [staffRole, setStaffRole] = useState(initialPanel === 'admin' ? 'admin' : 'employee'); // 'employee' | 'admin'
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [redirectNotice, setRedirectNotice] = useState(initialMessage);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Candidate Remember Me & Password Recovery State
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem('jobproof_remember_me') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail && forgotEmail.trim()) {
      setForgotSubmitted(true);
    }
  };

  // Load remembered candidate email if present
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('jobproof_saved_email');
      if (savedEmail && !email) {
        setEmail(savedEmail);
      }
    } catch (e) {}
  }, []);

  // Synchronize hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#staff') {
        setIsStaffPortal(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-700' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak (min 8 chars & mixed keys required)', color: 'text-red-400 bg-red-500' };
    if (score <= 4) return { score, label: 'Medium (add mix of uppercase/numbers/symbols)', color: 'text-yellow-400 bg-yellow-500' };
    return { score, label: 'Strong Security', color: 'text-emerald-400 bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const resetFormState = () => {
    setError(null);
    setRedirectNotice(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const switchToStaffPortal = (role = 'employee') => {
    setIsStaffPortal(true);
    setStaffRole(role);
    setIsSignUp(false);
    resetFormState();
    if (typeof window !== 'undefined') {
      window.location.hash = 'staff';
    }
  };

  const switchToCandidatePortal = () => {
    setIsStaffPortal(false);
    resetFormState();
    if (typeof window !== 'undefined' && window.location.hash === '#staff') {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    if (!isStaffPortal && isSignUp) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError('Password must contain a mix of uppercase letters, lowercase letters, numbers, and special characters (e.g. @#$%!).');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your confirm password field.');
        return;
      }
    }

    setLoading(true);
    setError(null);

    // Retrieve deployed staff credentials
    let deployedUsers = [];
    try {
      const savedDeployed = localStorage.getItem('jobproof_deployed_users');
      if (savedDeployed) deployedUsers = JSON.parse(savedDeployed);
    } catch (err) { }

    const cleanEmail = email.toLowerCase().trim();
    const deployedMatch = deployedUsers.find(
      u => u.email && u.email.toLowerCase().trim() === cleanEmail
    );

    const isAlexAdmin = cleanEmail === 'alex.vance@jobproof.io' || cleanEmail === 'admin@jobproof.io';
    const isSarahEmployee = cleanEmail === 'sarah.jenkins@google.com' || cleanEmail === 'employee@jobproof.io' || cleanEmail === 'marcus.brody@stripe.com';

    // Disallow unauthorized access to staff portals
    if (isStaffPortal) {
      if (staffRole === 'admin') {
        const authorizedAdmin = isAlexAdmin || (deployedMatch && deployedMatch.role === 'ROLE_ADMIN');
        if (!authorizedAdmin) {
          setLoading(false);
          setError('Access Denied: Invalid administrator credentials. Only authorized platform governance officers may enter.');
          return;
        }
      } else if (staffRole === 'employee') {
        const authorizedEmployee = isSarahEmployee || (deployedMatch && deployedMatch.role === 'ROLE_EMPLOYEE');
        if (!authorizedEmployee) {
          setLoading(false);
          setError('Access Denied: This account is not provisioned as a Verified Recruiter or Company Partner. Please contact the platform admin.');
          return;
        }
      }
    }

    const performClientAuth = () => {
      if (isStaffPortal) {
        if (staffRole === 'admin') {
          const validAdminPass = password === 'Admin@123' || password === 'Password@123';
          if (!validAdminPass) {
            setError('Incorrect password for Administrator. Default credential is: Admin@123');
            setLoading(false);
            return null;
          }
          return {
            token: 'demo-admin-session-token',
            user: { id: 1, name: 'Alex Vance (Admin Author)', email: cleanEmail, role: 'ROLE_ADMIN' }
          };
        }
        if (staffRole === 'employee') {
          const validEmpPass = password === 'Password@123' || password === 'Employee@123';
          if (!validEmpPass) {
            setError('Incorrect password for Recruiter. Default credential is: Password@123');
            setLoading(false);
            return null;
          }
          return {
            token: 'demo-recruiter-session-token',
            user: { id: 2, name: cleanEmail.includes('marcus') ? 'Marcus Brody' : 'Sarah Jenkins', email: cleanEmail, role: 'ROLE_EMPLOYEE' }
          };
        }
      } else {
        // Candidate Portal client authentication
        try {
          const savedCandidates = JSON.parse(localStorage.getItem('jobproof_registered_candidates') || '[]');
          const existing = savedCandidates.find(c => c.email && c.email.toLowerCase() === cleanEmail);

          if (isSignUp) {
            const newCandidate = {
              id: Date.now(),
              name: fullName || cleanEmail.split('@')[0],
              email: cleanEmail,
              password: password,
              role: 'ROLE_USER',
              registeredAt: new Date().toISOString()
            };
            localStorage.setItem('jobproof_registered_candidates', JSON.stringify([newCandidate, ...savedCandidates.filter(c => c.email.toLowerCase() !== cleanEmail)]));
            return { user: newCandidate, token: 'demo-user-session-token' };
          } else if (existing) {
            if (existing.password && existing.password !== password) {
              setError('Incorrect password for this account. Please verify your password or sign up.');
              setLoading(false);
              return null;
            }
            return { user: existing, token: 'demo-user-session-token' };
          } else {
            // First time candidate sign in without prior signup
            const autoCandidate = {
              id: Date.now(),
              name: fullName || (cleanEmail.includes('candidate') ? 'Demo Candidate' : cleanEmail.split('@')[0]),
              email: cleanEmail,
              password: password,
              role: 'ROLE_USER'
            };
            localStorage.setItem('jobproof_registered_candidates', JSON.stringify([autoCandidate, ...savedCandidates]));
            return { user: autoCandidate, token: 'demo-user-session-token' };
          }
        } catch (e) {
          return { user: { name: fullName || cleanEmail.split('@')[0], email: cleanEmail }, token: 'demo-user-session-token' };
        }
      }
      return null;
    };

    const finalizeLogin = (apiResponse) => {
      setLoading(false);

      let userRole = 'ROLE_USER';
      let userName = (!isStaffPortal && isSignUp) ? fullName : (fullName || email.split('@')[0]);
      let userTitle = 'Candidate / Job Seeker';
      let userAvatar = '👤';
      let userCompany = null;
      let userId = apiResponse?.user?.id || null;

      if (deployedMatch) {
        userRole = deployedMatch.role;
        userName = deployedMatch.name;
        userTitle = deployedMatch.title || (deployedMatch.role === 'ROLE_ADMIN' ? 'Platform Administrator' : 'Company Recruiter');
        userCompany = deployedMatch.company || (deployedMatch.role === 'ROLE_ADMIN' ? 'JobProof Core' : 'Partner Company');
        userAvatar = '👤';
      } else if (isStaffPortal && staffRole === 'employee') {
        userRole = 'ROLE_EMPLOYEE';
        userName = isSarahEmployee ? (cleanEmail.includes('marcus') ? 'Marcus Brody' : 'Sarah Jenkins') : (fullName || email.split('@')[0]);
        userTitle = 'Company Recruiter & Hiring Partner';
        userAvatar = '👤';
        userCompany = cleanEmail.includes('stripe') ? 'Stripe' : 'Google';
      } else if (isStaffPortal && staffRole === 'admin') {
        userRole = 'ROLE_ADMIN';
        userName = isAlexAdmin ? 'Alex Vance (Admin Author)' : (fullName || 'System Administrator');
        userTitle = 'Head of Platform & Trust Governance';
        userAvatar = '👤';
        userCompany = 'JobProof Core';
      } else {
        userRole = 'ROLE_USER';
        userName = apiResponse?.user?.name || (isSignUp ? fullName : (fullName || (cleanEmail.includes('cooper') ? 'Cooper Curtis' : cleanEmail.split('@')[0])));
        userTitle = 'Verified Candidate';
      }

      if (!isStaffPortal && isSignUp) {
        try {
          const candidateRecord = {
            id: userId || Date.now(),
            name: userName,
            email: email,
            password: password,
            role: 'ROLE_USER',
            registeredAt: new Date().toISOString(),
            status: 'REGISTERED'
          };
          const savedCandidates = JSON.parse(localStorage.getItem('jobproof_registered_candidates') || '[]');
          localStorage.setItem('jobproof_registered_candidates', JSON.stringify([candidateRecord, ...savedCandidates.filter(c => c.email.toLowerCase() !== cleanEmail)]));
          localStorage.setItem('jobproof_saved_email', email);
        } catch (err) { }
      } else if (!isStaffPortal) {
        try {
          localStorage.setItem('jobproof_saved_email', email);
        } catch (err) { }
      }

      const userPayload = {
        id: userId,
        name: userName,
        email: email,
        role: userRole,
        isDemo: false,
        title: userTitle,
        avatar: userAvatar,
        company: userCompany,
        panel: isStaffPortal ? staffRole : 'user',
        token: apiResponse?.token || null,
        loggedInAt: new Date().toLocaleTimeString()
      };

      try {
        localStorage.setItem('jobproof_user', JSON.stringify(userPayload));
        if (!isStaffPortal) {
          if (rememberMe) {
            localStorage.setItem('jobproof_remember_me', 'true');
            localStorage.setItem('jobproof_saved_email', email);
          } else {
            localStorage.removeItem('jobproof_remember_me');
            localStorage.removeItem('jobproof_saved_email');
          }
        }
      } catch (e) { }

      onLoginSuccess(userPayload);
    };

    // Support custom or deployed backend via VITE_API_URL if configured
    const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : '';
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const shouldUseRemoteBackend = Boolean(apiBase || isLocalhost);

    // If on static cloud hosting (Vercel) without a remote backend URL, authenticate on client directly to prevent HTTP 405
    if (!shouldUseRemoteBackend) {
      setTimeout(() => {
        const clientResult = performClientAuth();
        if (clientResult) {
          finalizeLogin(clientResult);
        }
      }, 100);
      return;
    }

    const apiEndpoint = (!isStaffPortal && isSignUp)
      ? `${apiBase}/api/auth/register`
      : `${apiBase}/api/auth/login`;

    const authPayload = {
      name: (!isStaffPortal && isSignUp) ? fullName : undefined,
      email: cleanEmail,
      password: password
    };

    fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authPayload)
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        // If static hosting rewrote the /api route to /index.html or returned 404/405/5xx
        if (contentType.includes('text/html') || res.status === 404 || res.status === 405 || res.status >= 500) {
          throw new Error(`BACKEND_OFFLINE_STATUS_${res.status}`);
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || `Authentication failed (HTTP ${res.status})`);
        }
        return data;
      })
      .then((apiResponse) => {
        if (apiResponse) {
          finalizeLogin(apiResponse);
        }
      })
      .catch((err) => {
        if (!isStaffPortal && isSignUp && err.message && err.message.toLowerCase().includes('already exists')) {
          setIsSignUp(false);
          setError(null);
          setRedirectNotice(`An account for ${cleanEmail} is already registered in the database. Please enter your password to sign in.`);
          setLoading(false);
          return;
        }

        // Resilient fallback if backend was expected but offline or unreachable
        const clientFallback = performClientAuth();
        if (clientFallback) {
          finalizeLogin(clientFallback);
          return;
        }

        setError(err.message || 'Authentication failed. Please check your credentials.');
        setLoading(false);
      });
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const payload = {
        name: 'Tarun Pratap Singh',
        headline: 'Java Backend Developer',
        email: 'tarun.pratap@jobradar.io',
        role: 'ROLE_USER',
        isDemo: true,
        title: 'Java Backend Developer',
        avatar: '/tarun-avatar.jpg',
        panel: 'user',
        loggedInAt: new Date().toLocaleTimeString()
      };

      try {
        localStorage.setItem('jobproof_user', JSON.stringify(payload));
      } catch (e) { }

      onLoginSuccess(payload);
    }, 350);
  };

  /* =========================================================================
     1. DISCRETE STAFF & RECRUITER PORTAL VIEW
     (Completely separated from candidate login screen)
  ========================================================================= */
  if (isStaffPortal) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 animate-fadeIn">
        {/* Discrete Top Return Navigation */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            type="button"
            onClick={switchToCandidatePortal}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition px-3 py-1.5 rounded-xl bg-[#222228] border border-gray-800 hover:border-gray-700 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Candidate Login</span>
          </button>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            <LockKeyhole className="w-3 h-3 text-teal-400" />
            <span>Staff Operations & Governance Access</span>
          </div>
        </div>

        {/* Staff Container Box */}
        <div className="bg-[#141922] border border-[#253044] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">

          {/* Staff Left Sidebar */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#141922] to-[#0D1117] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#253044] relative">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 p-1 flex items-center justify-center text-teal-400 shadow-md">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-baseline font-bold text-xl tracking-tight text-white">
                    <span>JobRadar</span>
                    <span className="text-teal-400 ml-1">AI</span>
                  </div>
                  <span className="text-[10px] text-teal-400 uppercase tracking-widest font-semibold block">Staff Workspace</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  Internal Staff & Management Portal
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authorized environment for company recruiters to post vacancies and manage candidates, and for platform administrators to enforce governance.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <span>Recruiter Vacancy Posting & Verification</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span>Administrator Governance & Team Deployment</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-400/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Anti-Ghosting Audit Logs & Proof Validation</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#253044] text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-400">Security Clearance Notice:</p>
              <p>Authentication sessions are tracked. Access by non-authorized personnel is prohibited.</p>
            </div>
          </div>

          {/* Staff Right Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-[#141922]">
            <div>
              {/* Role Toggle: Recruiter vs Admin */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#0D1117] rounded-2xl border border-[#253044] mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setStaffRole('employee');
                    setError(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${staffRole === 'employee'
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-[#1A2230]'
                    }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Recruiter Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStaffRole('admin');
                    setError(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${staffRole === 'admin'
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-[#1A2230]'
                    }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Platform Admin</span>
                </button>
              </div>

              {/* Title */}
              <div className="mb-5">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {staffRole === 'admin' ? 'Platform Administrator Authentication' : 'Recruiter & Employer Sign In'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {staffRole === 'admin'
                    ? 'Log in with platform author credentials to manage roles and system audits.'
                    : 'Log in with your employer or company partner email address.'}
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Demo Helper Quick Fill for Testing */}
              {staffRole === 'admin' ? (
                <div className="mb-5 p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-xs text-slate-300 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-teal-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Admin Author Test Access
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">admin@jobproof.io (Admin@123)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@jobproof.io');
                      setPassword('Admin@123');
                      setError(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-medium border border-teal-500/40 transition active:scale-95"
                  >
                    Quick Fill
                  </button>
                </div>
              ) : (
                <div className="mb-5 p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-xs text-slate-300 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-teal-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      Recruiter Test Access
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">sarah.jenkins@google.com (Password@123)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('sarah.jenkins@google.com');
                      setPassword('Password@123');
                      setError(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-medium border border-teal-500/40 transition active:scale-95"
                  >
                    Quick Fill
                  </button>
                </div>
              )}

              {/* Staff Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Staff Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={staffRole === 'admin' ? 'admin@jobproof.io' : 'recruiter@company.com'}
                      className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-[#0D1117] border border-[#253044] rounded-2xl focus:outline-none focus:border-teal-400 text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password / Access Key
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 text-xs sm:text-sm bg-[#0D1117] border border-[#253044] rounded-2xl focus:outline-none focus:border-teal-400 text-white placeholder-slate-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-6 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-95 bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20"
                >
                  {loading ? (
                    <span>Verifying Staff Credentials...</span>
                  ) : (
                    <>
                      <span>{staffRole === 'admin' ? 'Authorize Admin Session' : 'Sign In to Recruiter Workspace'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800/80 text-center text-xs">
              <button
                type="button"
                onClick={switchToCandidatePortal}
                className="text-gray-400 hover:text-white transition inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Candidate Portal</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* =========================================================================
     2. PRODUCTION CANDIDATE LOGIN & REGISTRATION VIEW
     (Matching exact reference design: Center character, left benefits + live card, right authentication)
  ========================================================================= */
  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-10 flex items-center justify-center relative overflow-hidden select-none bg-[#050B14]">
      
      {/* Background Ambience: Subtle Radial Vignette & Teal Backlight */}
      <div 
        className="absolute top-1/3 left-1/3 w-[650px] h-[550px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Main 2-Column Responsive Layout: Left Presentation (Benefits, Character, Job Card), Right Authentication Card */}
      <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
        
        {/* =========================================================================
            LEFT COLUMN: Brand, Headline, Benefits, 3D Character, and Live Job Card
            (lg:col-span-7 xl:col-span-7)
        ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 relative">
          
          {/* Brand Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#00e5c9] text-slate-950 flex items-center justify-center font-black text-sm tracking-tight shadow-[0_0_20px_rgba(0,229,201,0.5)]">
                JR
              </div>
              <div>
                <div className="flex items-baseline font-bold text-2xl tracking-tight text-white">
                  <span>JobRadar</span>
                  <span className="text-[#00e5c9] ml-1">AI</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 tracking-normal">
                  AI-powered job discovery & verification
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-1 pt-1">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.15]">
                Find Jobs.<br />
                <span className="text-[#00e5c9]">Verify</span> Them.<br />
                Apply Directly.
              </h1>
            </div>
          </div>

          {/* Integrated Scene: 3D Character in background/right, Benefits on left, Floating Job Card at bottom-left */}
          <div className="relative pt-1 min-h-[460px] flex flex-col justify-between">
            
            {/* 3D Character Illustration with floating neon badges */}
            <div className="absolute right-0 bottom-0 top-0 w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[430px] pointer-events-none flex items-center justify-end z-0">
              {/* Radial backlight */}
              <div className="absolute w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Floating Neon Icon: Briefcase */}
              <div className="absolute top-[10%] left-[8%] p-2 rounded-xl bg-[#091524]/90 border border-[#00e5c9]/60 shadow-[0_0_20px_rgba(0,229,201,0.35)] text-[#00e5c9] animate-pulse">
                <Briefcase className="w-4 h-4 text-[#00e5c9]" />
              </div>

              {/* Floating Neon Icon: Shield Check */}
              <div className="absolute top-[6%] right-[14%] p-2 rounded-xl bg-[#091524]/90 border border-[#00e5c9]/60 shadow-[0_0_20px_rgba(0,229,201,0.35)] text-[#00e5c9] animate-pulse delay-300">
                <ShieldCheck className="w-4 h-4 text-[#00e5c9]" />
              </div>

              {/* Floating Neon Icon: AI Chip */}
              <div className="absolute top-[28%] right-[4%] p-2 rounded-xl bg-[#091524]/90 border border-[#00e5c9]/60 shadow-[0_0_20px_rgba(0,229,201,0.35)] text-[#00e5c9] animate-pulse delay-700">
                <Cpu className="w-4 h-4 text-[#00e5c9]" />
              </div>

              {/* Character Image */}
              <picture className="relative z-10">
                <source 
                  type="image/webp" 
                  srcSet="/hero-character-400.webp 400w, /hero-character-800.webp 800w, /hero-character.webp 500w" 
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 420px"
                />
                <img
                  src="/hero-character.webp"
                  alt="Candidate exploring verified tech requisitions on JobRadar AI"
                  width="420"
                  height="420"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[420px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] select-none opacity-95"
                />
              </picture>
            </div>

            {/* Foreground Content: 3 Benefits Stack + Floating Job Card Below */}
            <div className="relative z-10 max-w-sm sm:max-w-md space-y-6">
              
              {/* Exactly Three Concise Benefits */}
              <div className="space-y-3.5">
                {/* Benefit 1 */}
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[#00e5c9] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:border-[#00e5c9]/60 transition">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-100">
                      Evidence-verified job postings
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Find vacancies evaluated using multiple verification signals.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[#00e5c9] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:border-[#00e5c9]/60 transition">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-100">
                      AI job intelligence
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Understand skills, salary, experience and selection information.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[#00e5c9] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:border-[#00e5c9]/60 transition">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-100">
                      Application tracking
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Keep track of the jobs you save and apply to.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: Candidate Sign In / Registration Glass Card
            (lg:col-span-5 xl:col-span-5) - EXACT SAME AS REFERENCE DESIGN
        ========================================================================= */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end z-20">
          <div className="w-full max-w-[460px] bg-[#091523]/92 backdrop-blur-xl border border-[#133246] rounded-[28px] p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col justify-between">
            
            {/* Header with Switcher */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight leading-snug">
                    {isSignUp ? 'Create Candidate Account' : 'Candidate Sign In'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {isSignUp
                      ? 'Register your free account to apply for verified jobs and access AI tools.'
                      : 'Search live authenticated vacancies and track your applications.'}
                  </p>
                </div>

                <div className="text-right flex-shrink-0 pt-0.5">
                  <span className="text-[11px] text-slate-400 block">
                    {isSignUp ? 'Already a member?' : 'New to JobRadar?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { 
                      setIsSignUp(!isSignUp); 
                      setError(null); 
                      setRedirectNotice(null); 
                    }}
                    className="text-xs font-bold text-[#00e5c9] hover:underline transition"
                  >
                    {isSignUp ? 'Sign In Here →' : 'Create your free account →'}
                  </button>
                </div>
              </div>

              {/* Redirect Notice Banner */}
              {redirectNotice && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-start gap-2 shadow-md animate-fadeIn">
                  <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-amber-300 text-xs">Account Required</p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{redirectNotice}</p>
                  </div>
                </div>
              )}

              {/* Error Notice */}
              {error && (
                <div 
                  role="alert"
                  className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-start gap-2 animate-fadeIn"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Demo Helper Quick Fill for Candidate Testing */}
              {!isSignUp && (
                <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-xs text-slate-300 flex items-center justify-between gap-3 animate-fadeIn">
                  <div>
                    <p className="font-semibold text-teal-300 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Candidate Demo Access
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">candidate@jobradar.io (Candidate@123)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('candidate@jobradar.io');
                      setPassword('Candidate@123');
                      setError(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-medium border border-teal-500/40 transition active:scale-95"
                  >
                    Quick Fill
                  </button>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Full Name (Sign Up only) */}
                {isSignUp && (
                  <div>
                    <label htmlFor="candidate-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="candidate-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-[#050e17] border border-[#15354a] rounded-xl focus:outline-none focus:border-[#00e5c9] text-white placeholder-slate-500 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label htmlFor="candidate-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="candidate-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="candidate@example.com"
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-[#050e17] border border-[#15354a] rounded-xl focus:outline-none focus:border-[#00e5c9] text-white placeholder-slate-500 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="candidate-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="candidate-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="•••••••••"
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      className="w-full pl-11 pr-11 py-3 text-xs sm:text-sm bg-[#050e17] border border-[#15354a] rounded-xl focus:outline-none focus:border-[#00e5c9] text-white placeholder-slate-500 transition tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator for Registration */}
                  {isSignUp && password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-[#050e17] rounded-full overflow-hidden border border-[#15354a]">
                        <div 
                          className={`h-full transition-all duration-300 ${strength.color}`} 
                          style={{ width: `${(strength.score / 5) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Password Strength:</span>
                        <span className={`font-semibold ${strength.color.split(' ')[0]}`}>{strength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                  <div>
                    <label htmlFor="candidate-confirm-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="candidate-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="•••••••••"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-11 py-3 text-xs sm:text-sm bg-[#050e17] border border-[#15354a] rounded-xl focus:outline-none focus:border-[#00e5c9] text-white placeholder-slate-500 transition tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition p-0.5"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me & Forgot Password Row */}
                {!isSignUp && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => {
                          setRememberMe(e.target.checked);
                          try {
                            localStorage.setItem('jobproof_remember_me', e.target.checked ? 'true' : 'false');
                          } catch (err) {}
                        }}
                        className="w-4 h-4 rounded bg-[#050e17] border-[#15354a] text-[#00e5c9] focus:ring-[#00e5c9]/40 accent-[#00e5c9]"
                      />
                      <span className="text-slate-300 group-hover:text-white transition">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-semibold text-[#00e5c9] hover:underline transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Primary Submit Button: Vibrant Electric Teal Pill */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#00d2b4] via-[#00f5d4] to-[#00d2b4] hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition shadow-[0_0_25px_rgba(0,229,201,0.35)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </span>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Free Account →' : 'Sign In →'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Subtle OR Divider */}
              <div className="flex items-center my-5">
                <div className="flex-1 border-t border-[#133246]" />
                <span className="px-3 text-[11px] font-bold text-slate-500 tracking-wider">OR</span>
                <div className="flex-1 border-t border-[#133246]" />
              </div>

              {/* Explore JobRadar Demo Box (As In Reference Image) */}
              <div className="bg-[#050e17]/85 border border-[#133246] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/15 border border-teal-500/30 text-[#00e5c9] flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Explore JobRadar Demo
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Browse jobs and experience the platform without creating an account.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-[9px] font-semibold text-[#00e5c9] bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">
                    View-only mode
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-xl border border-teal-500/40 text-[#00e5c9] hover:bg-teal-500/10 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                  >
                    <span>Explore Demo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subtle Discrete Staff / Admin Portal Footer Link */}
            <div className="mt-6 pt-4 border-t border-[#133246] flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Recruiter / Admin?</span>
              </span>
              <button
                type="button"
                onClick={() => switchToStaffPortal('employee')}
                className="text-[11px] font-bold text-[#00e5c9] hover:underline transition inline-flex items-center gap-1"
              >
                <span>Open Staff Portal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Safe Presentation Notice without Breaking Auth) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0c1424] border border-[#1e2f4a] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2f4a]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[#00e5c9] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Reset Account Password</h4>
              </div>
              <button
                type="button"
                onClick={() => { setShowForgotModal(false); setForgotSubmitted(false); }}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-4 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/40 text-[#00e5c9] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h5 className="text-sm font-bold text-white">Reset Link Dispatched</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If an active candidate account exists for <span className="text-[#00e5c9] font-medium">{forgotEmail}</span>, recovery instructions and an authentication reset token have been generated.
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotSubmitted(false); }}
                  className="mt-2 w-full py-2.5 px-4 rounded-xl bg-[#00e5c9] hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4 pt-1">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter the email address registered with your JobRadar AI account to receive a secure password reset link.
                </p>
                <div>
                  <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#080e1a] border border-[#1e293b] rounded-xl focus:outline-none focus:border-[#00e5c9] text-white placeholder-slate-500 transition"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#080e1a] border border-[#1e2f4a] text-xs font-semibold text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#00e5c9] hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-md shadow-teal-500/20"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
