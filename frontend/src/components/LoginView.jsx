import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Anchor,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
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
      const userPayload = {
        name: isSignUp ? fullName : (email.includes('cooper') ? 'Cooper Curtis' : email.split('@')[0]),
        email: email,
        role: email.toLowerCase().includes('admin') || email.toLowerCase().includes('sarah') ? 'ROLE_ADMIN' : 'ROLE_USER',
        title: 'Software Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        loggedInAt: new Date().toLocaleTimeString()
      };
      
      try {
        localStorage.setItem('jobproof_user', JSON.stringify(userPayload));
      } catch (e) {}

      onLoginSuccess(userPayload);
    }, 500);
  };

  const handleQuickDemoLogin = (type) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const payload = type === 'candidate' ? {
        name: 'Cooper Curtis',
        email: 'cooper.curtis@jobproof.io',
        role: 'ROLE_USER',
        title: 'Senior Full Stack Engineer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        loggedInAt: new Date().toLocaleTimeString()
      } : {
        name: 'Sarah Jenkins (Admin)',
        email: 'sarah.admin@jobproof.io',
        role: 'ROLE_ADMIN',
        title: 'System Administrator & Recruiter',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
        loggedInAt: new Date().toLocaleTimeString()
      };

      try {
        localStorage.setItem('jobproof_user', JSON.stringify(payload));
      } catch (e) {}

      onLoginSuccess(payload);
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 animate-fadeIn bg-[#18181c]">
      <div className="w-full max-w-5xl bg-[#222228] rounded-3xl overflow-hidden border border-yellow-500/30 shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        
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
                Log in or register to access verified employer listings, real-time trust scores, AI ATS resume parser, and direct application tracking.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Multi-point Corporate Domain & ATS Verification</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span>AI ATS Resume Parser & Skill Gap Detection</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-gray-800 flex items-center gap-3">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-[#18181c] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="User" />
              <img className="w-8 h-8 rounded-full border-2 border-[#18181c] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" alt="User" />
              <img className="w-8 h-8 rounded-full border-2 border-[#18181c] object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80" alt="User" />
            </div>
            <p className="text-xs text-gray-400">
              Joined by <span className="font-bold text-white">25,000+ engineers</span> & verified employers.
            </p>
          </div>
        </div>

        {/* Right Side: Login / Register Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between bg-[#222228]">
          <div>
            {/* Header Tabs */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {isSignUp ? 'Create Secure Account' : 'Welcome Back'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isSignUp ? 'Register with 8+ char mixed-key password' : 'Log in to explore jobs and analyze your resume'}
                </p>
              </div>

              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                className="text-xs font-bold text-yellow-400 hover:text-yellow-300 underline underline-offset-4"
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
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('candidate')}
                  className="py-2.5 px-3 rounded-xl bg-[#18181c] hover:bg-gray-800 border border-gray-800 text-xs font-bold text-gray-300 hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-yellow-400" /> Candidate Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="py-2.5 px-3 rounded-xl bg-[#18181c] hover:bg-gray-800 border border-gray-800 text-xs font-bold text-gray-300 hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" /> Admin Console Demo
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
