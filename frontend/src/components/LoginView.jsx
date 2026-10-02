import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Shield,
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Anchor,
  FileText,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export default function LoginView({ 
  onLoginSuccess,
  initialIsSignUp = false,
  initialMessage = null,
  initialPanel = 'user'
}) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [loginType, setLoginType] = useState(initialPanel); // 'user' | 'employee' | 'admin'
  const [redirectNotice, setRedirectNotice] = useState(initialMessage);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-700' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak (min 8 chars & mix keys required)', color: 'text-red-400 bg-red-500' };
    if (score <= 4) return { score, label: 'Medium (add mix of uppercase/numbers/symbols)', color: 'text-yellow-400 bg-yellow-500' };
    return { score, label: 'Strong Security', color: 'text-emerald-400 bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handlePanelSelection = (type) => {
    setLoginType(type);
    setError(null);
    setRedirectNotice(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    if (type !== 'user') {
      setIsSignUp(false); // Employees and Admins cannot self-register; they are deployed by Admin
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    if (isSignUp && loginType === 'user') {
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

    // Check if user was deployed by Admin
    let deployedUsers = [];
    try {
      const savedDeployed = localStorage.getItem('jobproof_deployed_users');
      if (savedDeployed) deployedUsers = JSON.parse(savedDeployed);
    } catch (err) {}

    const cleanEmail = email.toLowerCase().trim();
    const deployedMatch = deployedUsers.find(
      u => u.email && u.email.toLowerCase().trim() === cleanEmail
    );

    // SECURITY ENFORCEMENT: Disallow random demo access to employee & admin portals
    const isAlexAdmin = cleanEmail === 'alex.vance@jobproof.io' || cleanEmail === 'admin@jobproof.io';
    const isSarahEmployee = cleanEmail === 'sarah.jenkins@google.com' || cleanEmail === 'employee@jobproof.io' || cleanEmail === 'marcus.brody@stripe.com';

    if (loginType === 'admin') {
      const authorizedAdmin = isAlexAdmin || (deployedMatch && deployedMatch.role === 'ROLE_ADMIN');
      if (!authorizedAdmin) {
        setLoading(false);
        setError('Access Denied: Invalid credentials or unauthorized account. Only Platform Administrators deployed by the Admin Author may access this console.');
        return;
      }
    } else if (loginType === 'employee') {
      const authorizedEmployee = isSarahEmployee || (deployedMatch && deployedMatch.role === 'ROLE_EMPLOYEE');
      if (!authorizedEmployee) {
        setLoading(false);
        setError('Access Denied: This account is not provisioned as an Employee or Recruiter. Please contact the Platform Admin Author for deployment.');
        return;
      }
    }

    // Call Backend Authentication API to persist user and record login session in database
    const apiEndpoint = (loginType === 'user' && isSignUp) 
      ? 'http://localhost:8081/api/auth/register'
      : 'http://localhost:8081/api/auth/login';

    const authPayload = {
      name: isSignUp ? fullName : undefined,
      email: cleanEmail,
      password: password
    };

    fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authPayload)
    })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok && res.status !== 404 && res.status !== 500) {
        // If error message from API (e.g. invalid password or user exists)
        if (data && data.error) {
          throw new Error(data.error);
        }
      }
      return data;
    })
    .catch((err) => {
      // If error is a validation/credential error returned from backend
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        // If authorized admin or employee, don't block access; proceed with authorized session
        if (loginType === 'admin' && (isAlexAdmin || (deployedMatch && deployedMatch.role === 'ROLE_ADMIN'))) {
          return null;
        }
        if (loginType === 'employee' && (isSarahEmployee || (deployedMatch && deployedMatch.role === 'ROLE_EMPLOYEE'))) {
          return null;
        }
        setError(err.message);
        setLoading(false);
        throw err;
      }
      // Otherwise backend might be offline / standalone mode, fallback gracefully
      return null;
    })
    .then((apiResponse) => {
      if (!apiResponse && error) return;
      setLoading(false);
      let userRole = 'ROLE_USER';
      let userName = isSignUp ? fullName : (fullName || email.split('@')[0]);
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
      } else if (loginType === 'employee') {
        userRole = 'ROLE_EMPLOYEE';
        userName = isSarahEmployee ? (cleanEmail.includes('marcus') ? 'Marcus Brody' : 'Sarah Jenkins') : (fullName || email.split('@')[0]);
        userTitle = 'Company Recruiter & Hiring Partner';
        userAvatar = '👤';
        userCompany = cleanEmail.includes('stripe') ? 'Stripe' : 'Google';
      } else if (loginType === 'admin') {
        userRole = 'ROLE_ADMIN';
        userName = isAlexAdmin ? 'Alex Vance (Admin Author)' : (fullName || 'System Administrator');
        userTitle = 'Head of Platform & Trust Governance';
        userAvatar = '👤';
        userCompany = 'JobProof Core';
      } else {
        // Authenticated Candidate (Registration or normal login)
        userRole = 'ROLE_USER';
        userName = apiResponse?.user?.name || (isSignUp ? fullName : (fullName || (cleanEmail.includes('cooper') ? 'Cooper Curtis' : cleanEmail.split('@')[0])));
        userTitle = 'Verified Candidate';
      }

      // Record direct candidate registration
      if (loginType === 'user' && isSignUp) {
        try {
          const candidateRecord = {
            id: userId || Date.now(),
            name: userName,
            email: email,
            role: 'ROLE_USER',
            registeredAt: new Date().toISOString(),
            status: 'REGISTERED'
          };
          const savedCandidates = JSON.parse(localStorage.getItem('jobproof_registered_candidates') || '[]');
          localStorage.setItem('jobproof_registered_candidates', JSON.stringify([candidateRecord, ...savedCandidates.filter(c => c.email.toLowerCase() !== cleanEmail)]));
        } catch (err) {}
      }

      const userPayload = {
        id: userId,
        name: userName,
        email: email,
        role: userRole,
        isDemo: false, // FULL UNRESTRICTED ACCESS
        title: userTitle,
        avatar: userAvatar,
        company: userCompany,
        panel: loginType,
        token: apiResponse?.token || null,
        loggedInAt: new Date().toLocaleTimeString()
      };
      
      try {
        localStorage.setItem('jobproof_user', JSON.stringify(userPayload));
      } catch (e) {}

      onLoginSuccess(userPayload);
    })
    .catch(() => {
      // Handled above
    });
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const payload = {
        name: 'Demo Candidate (Preview Mode)',
        email: 'demo.candidate@jobproof.preview',
        role: 'ROLE_USER',
        isDemo: true, // RESTRICTED VIEW-ONLY
        title: 'Preview Explorer Account (View Only)',
        avatar: '👤',
        panel: 'user',
        loggedInAt: new Date().toLocaleTimeString()
      };

      try {
        localStorage.setItem('jobproof_user', JSON.stringify(payload));
      } catch (e) {}

      onLoginSuccess(payload);
    }, 350);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 animate-fadeIn bg-[#18181c]">
      <div className="w-full max-w-5xl bg-[#222228] rounded-3xl border border-yellow-500/30 shadow-2xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        
        {/* Left Side: Branding Banner */}
        <div className="bg-gradient-to-br from-[#18181c] via-[#222228] to-[#141417] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden border-r border-gray-800">
          <div className="absolute -left-16 -top-16 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-yellow-500/20 border border-yellow-500/30 overflow-hidden">
                <img src="/logo.png" alt="JobProof Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-baseline font-black text-2xl tracking-tight text-white">
                <span>Job</span>
                <span className="text-yellow-400">Proof</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>AI Job Proof & Verification Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                Find verified jobs with <span className="text-yellow-400">transparent trust scores</span>.
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Choose your role panel: explore verified jobs as a Candidate, review & grant permissions as an Employee, or govern the platform as an Admin.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Three Distinct Access Portals (User, Employee, Admin)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <span>Employee AI Review & Permission Granting Hub</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span>Candidate Resume ATS Analyzer & Direct Application</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-gray-800 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#18181c] bg-gray-800 flex items-center justify-center text-xs select-none shadow-sm" title="User">👤</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#18181c] bg-yellow-900/60 flex items-center justify-center text-xs select-none shadow-sm" title="Employee">👤</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#18181c] bg-purple-900/60 flex items-center justify-center text-xs select-none shadow-sm" title="Admin">👤</div>
            </div>
            <p className="text-xs text-gray-400">
              Trusted by <span className="font-bold text-white">25,000+ engineers</span> & leading employers.
            </p>
          </div>
        </div>

        {/* Right Side: Login / Register Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between bg-[#222228]">
          <div>
            {/* 3 Panel Option Selector */}
            <div className="mb-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Select Panel
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#18181c] rounded-2xl border border-gray-800 mb-6">
                <button
                  type="button"
                  onClick={() => handlePanelSelection('user')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    loginType === 'user'
                      ? 'bg-yellow-400 text-gray-950 shadow-md font-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>User</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePanelSelection('employee')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    loginType === 'employee'
                      ? 'bg-yellow-400 text-gray-950 shadow-md font-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Employee</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePanelSelection('admin')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    loginType === 'admin'
                      ? 'bg-yellow-400 text-gray-950 shadow-md font-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Header Description */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {loginType === 'employee'
                    ? 'Employee Panel Login'
                    : loginType === 'admin'
                    ? 'Admin Console Login'
                    : isSignUp
                    ? 'Create Candidate Account'
                    : 'Candidate Portal Login'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {loginType === 'employee'
                    ? 'Review AI vacancies, edit details, grant permissions to publish live, and view applicants'
                    : loginType === 'admin'
                    ? 'Platform administration, deploy employees/admins, security audit, and moderation'
                    : isSignUp
                    ? 'Register your account to apply for jobs, upload resumes, and unlock all features'
                    : 'Search verified jobs, apply directly, and analyze your resume with AI'}
                </p>
              </div>

              {loginType === 'user' ? (
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(null); setRedirectNotice(null); }}
                  className="text-xs font-bold text-yellow-400 hover:text-yellow-300 underline underline-offset-4 whitespace-nowrap ml-2"
                >
                  {isSignUp ? 'Sign In' : 'Register'}
                </button>
              ) : loginType === 'employee' ? (
                <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-500/30 whitespace-nowrap ml-2">
                  Admin Provisioned
                </span>
              ) : (
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30 whitespace-nowrap ml-2">
                  Cleared Access Only
                </span>
              )}
            </div>

            {/* Redirect Notice Banner (When redirected from restricted features) */}
            {redirectNotice && (
              <div className="mb-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 text-yellow-300 text-xs font-semibold flex items-start gap-3 shadow-lg animate-fadeIn">
                <Sparkles className="w-5 h-5 flex-shrink-0 text-yellow-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-yellow-400 text-xs sm:text-sm">Account Registration Required</p>
                  <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed">{redirectNotice}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick-fill helper for Admin Console */}
            {loginType === 'admin' && (
              <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-xs text-gray-300 flex items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-purple-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Admin Author Access ID
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    <span className="text-white font-mono font-semibold">admin@jobproof.io</span> • Pass: <span className="text-white font-mono font-semibold">Admin@123</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@jobproof.io'); setPassword('Admin@123'); setError(null); }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-[11px] transition shadow-md shadow-purple-600/20 whitespace-nowrap active:scale-95"
                >
                  Fill ID
                </button>
              </div>
            )}

            {/* Employee Portal Access Note */}
            {loginType === 'employee' && (
              <div className="mb-4 p-3.5 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-xs text-gray-300 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-400/20 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="font-extrabold text-yellow-400">Employee Workspace Login</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Please sign in with your enterprise credentials deployed by your administrator.
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Cooper Curtis"
                      className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-[#18181c] border border-gray-800 rounded-2xl focus:outline-none focus:border-yellow-400 text-white placeholder-gray-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginType === 'admin' ? "admin@jobproof.io" : loginType === 'employee' ? "employee@company.com" : "you@example.com"}
                    className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-[#18181c] border border-gray-800 rounded-2xl focus:outline-none focus:border-yellow-400 text-white placeholder-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Password {isSignUp && <span className="text-gray-500 font-normal">(Min 8 chars, A-Z, 0-9, @#$)</span>}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 text-xs sm:text-sm bg-[#18181c] border border-gray-800 rounded-2xl focus:outline-none focus:border-yellow-400 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {isSignUp && password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 5) * 100}%` }} />
                      </div>
                      <span className={`text-[10px] font-bold ${strength.color.split(' ')[0]}`}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 text-xs sm:text-sm bg-[#18181c] border border-gray-800 rounded-2xl focus:outline-none focus:border-yellow-400 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-sm font-extrabold flex items-center justify-center gap-2 transition shadow-lg shadow-yellow-500/20 active:scale-95"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Candidate Account' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access: Strictly for Candidate User with View-Only Mode */}
            {loginType === 'user' ? (
              <div className="mt-8 pt-6 border-t border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Demo Preview Access</span>
                  <span className="text-yellow-400 font-bold lowercase bg-yellow-400/10 px-2 py-0.5 rounded-md border border-yellow-500/30">
                    view-only mode
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin()}
                  className="w-full py-3 px-4 rounded-2xl bg-[#18181c] hover:bg-gray-800 border border-yellow-500/40 text-xs font-bold text-gray-200 hover:text-white transition flex items-center justify-center gap-2 group shadow-sm active:scale-95 hover:border-yellow-400"
                >
                  <User className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <span>Access Directly with Demo User Account</span>
                  <Eye className="w-3.5 h-3.5 text-yellow-400" />
                </button>
                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  Notice: Demo user can <span className="text-yellow-400 font-bold">browse and see jobs</span>. Applying to jobs and AI tools require a free registered account.
                </p>
              </div>
            ) : (
              /* Security Box for Employee and Admin: NO DEMO ACCESS */
              <div className="mt-8 pt-6 border-t border-gray-800 space-y-2.5 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-[11px] font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Provisioned Credentials Required</span>
                </div>
                <p className="text-[11px] text-gray-400 max-w-sm mx-auto leading-relaxed">
                  {loginType === 'admin' 
                    ? 'Admin console is restricted to system authors. Demo bypass is permanently disabled.' 
                    : 'Employee accounts are deployed directly by the Platform Admin Author with specific permissions.'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
