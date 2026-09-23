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

export default function LoginView({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginType, setLoginType] = useState('user'); // 'user' | 'employee' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [email, setEmail] = useState('cooper.curtis@example.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [confirmPassword, setConfirmPassword] = useState('SecurePass123!');
  const [fullName, setFullName] = useState('Cooper Curtis');
  
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
    if (type === 'user') {
      setEmail('cooper.curtis@example.com');
      setFullName('Cooper Curtis');
    } else if (type === 'employee') {
      setEmail('sarah.jenkins@google.com');
      setFullName('Sarah Jenkins');
    } else if (type === 'admin') {
      setEmail('alex.vance@jobproof.io');
      setFullName('Alex Vance');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    if (isSignUp) {
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

    setTimeout(() => {
      setLoading(false);
      let userRole = 'ROLE_USER';
      let userName = isSignUp ? fullName : (email.includes('cooper') ? 'Cooper Curtis' : email.split('@')[0]);
      let userTitle = 'Senior Full Stack Engineer';
      let userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120';
      let userCompany = null;

      if (loginType === 'employee') {
        userRole = 'ROLE_EMPLOYEE';
        userName = isSignUp ? fullName : (email.includes('sarah') ? 'Sarah Jenkins' : email.split('@')[0]);
        userTitle = 'Company Recruiter & Hiring Partner';
        userAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120';
        userCompany = 'Google';
      } else if (loginType === 'admin') {
        userRole = 'ROLE_ADMIN';
        userName = isSignUp ? fullName : (email.includes('alex') ? 'Alex Vance' : 'System Administrator');
        userTitle = 'Head of Platform & Trust Governance';
        userAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120';
        userCompany = 'JobProof Core';
      }

      const userPayload = {
        name: userName,
        email: email,
        role: userRole,
        title: userTitle,
        avatar: userAvatar,
        company: userCompany,
        panel: loginType,
        loggedInAt: new Date().toLocaleTimeString()
      };
      
      try {
        localStorage.setItem('jobproof_user', JSON.stringify(userPayload));
      } catch (e) {}

      onLoginSuccess(userPayload);
    }, 450);
  };

  const handleQuickDemoLogin = (type) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let payload;
      if (type === 'user') {
        payload = {
          name: 'Cooper Curtis',
          email: 'cooper.curtis@jobproof.io',
          role: 'ROLE_USER',
          title: 'Senior Full Stack Engineer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
          panel: 'user',
          loggedInAt: new Date().toLocaleTimeString()
        };
      } else if (type === 'employee') {
        payload = {
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@google.com',
          role: 'ROLE_EMPLOYEE',
          title: 'Company Recruiter & Hiring Partner',
          company: 'Google',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
          panel: 'employee',
          loggedInAt: new Date().toLocaleTimeString()
        };
      } else {
        payload = {
          name: 'Alex Vance',
          email: 'alex.vance@jobproof.io',
          role: 'ROLE_ADMIN',
          title: 'Head of Platform & Trust Governance',
          company: 'JobProof Core',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
          panel: 'admin',
          loggedInAt: new Date().toLocaleTimeString()
        };
      }

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
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-500/30 overflow-hidden">
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
              <img className="w-8 h-8 rounded-full border-2 border-[#18181c] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="User" />
              <img className="w-8 h-8 rounded-full border-2 border-[#18181c] object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80" alt="Employee" />
              <img className="w-8 h-8 rounded-full border-2 border-[#18181c] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" alt="Admin" />
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
                  {isSignUp 
                    ? (loginType === 'employee' 
                        ? 'Create Employee Account' 
                        : loginType === 'admin' 
                        ? 'Register Admin Access' 
                        : 'Create Candidate Account') 
                    : (loginType === 'employee' 
                        ? 'Employee Panel Login' 
                        : loginType === 'admin' 
                        ? 'Admin Console Login' 
                        : 'User Panel Login')}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {loginType === 'employee'
                    ? 'Review AI vacancies, edit details, grant permissions to publish live, and view applicants'
                    : loginType === 'admin'
                    ? 'Platform administration, security audit, and employer moderation governance'
                    : 'Search verified jobs, apply directly, and analyze your resume with AI'}
                </p>
              </div>

              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                className="text-xs font-bold text-yellow-400 hover:text-yellow-300 underline underline-offset-4 whitespace-nowrap ml-2"
              >
                {isSignUp ? 'Sign In' : 'Register'}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
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
                      placeholder="Cooper Curtis"
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
                    placeholder="cooper.curtis@example.com"
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
                    <span>{isSignUp ? 'Create Secure Account' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-800 space-y-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">
                Instant Demo Access (Choose Panel)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user')}
                  className="py-2.5 px-2 rounded-xl bg-[#18181c] hover:bg-gray-800 border border-gray-800 text-[11px] font-bold text-gray-300 hover:text-white transition flex flex-col sm:flex-row items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-yellow-400" />
                  <span>User Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('employee')}
                  className="py-2.5 px-2 rounded-xl bg-[#18181c] hover:bg-gray-800 border border-yellow-500/30 text-[11px] font-bold text-yellow-400 hover:text-yellow-300 transition flex flex-col sm:flex-row items-center justify-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Employee Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="py-2.5 px-2 rounded-xl bg-[#18181c] hover:bg-gray-800 border border-purple-500/30 text-[11px] font-bold text-purple-300 hover:text-purple-200 transition flex flex-col sm:flex-row items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
