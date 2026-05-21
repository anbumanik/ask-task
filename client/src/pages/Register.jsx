import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

/* ─── Defined OUTSIDE Register so it never gets recreated on re-render ─── */
const InputField = React.memo(({ label, name, type, placeholder, Icon, value, onChange, error }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Icon size={15} />
        </span>
      )}
      <input
        type={type || 'text'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full rounded-xl border py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-sm text-white placeholder-slate-500 bg-white/5 backdrop-blur-md transition focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-500 focus:ring-rose-500/30'
            : 'border-white/10 focus:ring-[#4F46E5]/40'
        }`}
      />
    </div>
    {error && <p className="mt-1 text-xs font-medium text-rose-400">{error}</p>}
  </div>
));

InputField.displayName = 'InputField';

/* ─────────────────────────────────────────────────────────────────────────── */

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const { addToast } = useToast();
  const navigate     = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  }, [errors]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                       e.name        = 'Please enter your full name';
    if (!form.email.trim())                      e.email       = 'Please enter your email address';
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email       = 'Enter a valid email (e.g. john@example.com)';
    if (!form.password)                          e.password    = 'Please enter a password';
    else if (form.password.length < 6)           e.password    = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post('/api/auth/register', {
        name:        form.name.trim(),
        email:       form.email.trim().toLowerCase(),
        password:    form.password,
      });
      addToast('✅ Registration successful! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [form, addToast, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1117] p-4 py-10">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-[#4F46E5]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#7C3AED]/20 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7C3AED]/20 text-[#7C3AED] ring-1 ring-[#7C3AED]/40 shadow-lg">
            <UserPlus size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">Register New Account</h1>
          <p className="mt-1 text-sm text-slate-400">Fill in your employee details below</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Employee Name */}
          <InputField
            label="user Name"
            name="name"
            placeholder="Enter your full name (e.g. John Doe)"
            Icon={UserPlus}
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          {/* Email */}
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email (e.g. john@company.com)"
            Icon={Mail}
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock size={15} />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password (min. 6 characters)"
                autoComplete="new-password"
                className={`w-full rounded-xl border py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 bg-white/5 backdrop-blur-md transition focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-white/10 focus:ring-[#4F46E5]/40'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition"
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-rose-400">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] py-3 text-sm font-semibold text-white shadow-lg shadow-[#7C3AED]/30 transition hover:bg-[#6D28D9] active:scale-[.98] disabled:opacity-60 mt-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registering…
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Register Account
              </>
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#4F46E5] hover:text-[#4338CA] hover:underline transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
