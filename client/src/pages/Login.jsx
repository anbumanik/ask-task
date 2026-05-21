import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { addToast }               = useToast();
  const navigate                   = useNavigate();

  // If already logged in, skip to dashboard
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const validate = useCallback(() => {
    const errors = {};
    if (!email)                           errors.email    = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email    = 'Please enter a valid email address';
    if (!password)                        errors.password = 'Password is required';
    else if (password.length < 6)         errors.password = 'Password must be at least 6 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const userData = await login(email, password);
      addToast('Logged in successfully! Welcome back.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Invalid email or password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, validate, login, addToast, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1117] p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#4F46E5]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#7C3AED]/20 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F46E5]/20 text-[#4F46E5] shadow-lg ring-1 ring-[#4F46E5]/40">
            <Shield size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
            StaffSphere
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to your employee dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail size={16} />
              </span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) setFormErrors(p => ({ ...p, email: '' }));
                }}
                placeholder="Enter your email"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 bg-white/5 backdrop-blur transition focus:outline-none focus:ring-2 ${
                  formErrors.email
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-white/10 focus:ring-[#4F46E5]/40'
                }`}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-xs font-medium text-rose-400">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors(p => ({ ...p, password: '' }));
                }}
                placeholder="Enter your password"
                className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 bg-white/5 backdrop-blur transition focus:outline-none focus:ring-2 ${
                  formErrors.password
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-white/10 focus:ring-[#4F46E5]/40'
                }`}
              />
              {/* Eye toggle */}
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition"
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs font-medium text-rose-400">{formErrors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] py-3 text-sm font-semibold text-white shadow-lg shadow-[#4F46E5]/30 transition hover:bg-[#4338CA] active:scale-[.98] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Authenticating…
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] hover:underline transition">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
