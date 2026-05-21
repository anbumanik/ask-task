import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import {
  User, Mail, Briefcase, Tag, Calendar, Shield,
  Camera, Edit3, Save, X, LogOut, Upload,
} from 'lucide-react';

const API = 'http://localhost:5000';

// ─── Avatar helper ─────────────────────────────────────────────────────────
const Avatar = ({ src, name, size = 28 }) => {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return src ? (
    <img
      src={`${API}${src}`}
      alt={name}
      className="rounded-full object-cover w-full h-full"
    />
  ) : (
    <span className="text-white font-bold" style={{ fontSize: size }}>
      {initials}
    </span>
  );
};

// ─── Detail Card ───────────────────────────────────────────────────────────
const InfoCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">{value || '—'}</p>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const EmployeeDashboard = () => {
  const { user: authUser, token, logout } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', department: '', designation: '' });

  const fileRef = useRef(null);

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API}/api/profile/me`, { headers });
        setProfile(data);
        setEditForm({ name: data.name, department: data.department, designation: data.designation });
      } catch {
        addToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Save edited profile
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`${API}/api/profile/update`, editForm, { headers });
      setProfile(data);
      setEditing(false);
      addToast('Profile updated successfully!', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  }, [editForm, headers, addToast]);

  // Upload profile image
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be less than 5MB', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('profileImage', file);
    setUploading(true);
    try {
      const { data } = await axios.post(`${API}/api/profile/upload-image`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      setProfile(prev => ({ ...prev, profileImage: data.profileImage }));
      addToast('Profile photo updated!', 'success');
    } catch {
      addToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  }, [headers, addToast]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0f1117]">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#4F46E5] border-t-transparent" />
      </div>
    );
  }

  const joinDate = profile?.joiningDate
    ? new Date(profile.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f1117] text-white">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-[#4F46E5]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#7C3AED]/20 blur-3xl" />

      {/* Top navbar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]/20 text-[#4F46E5]">
            <Shield size={18} />
          </div>
          <span className="text-sm font-bold tracking-wide text-white">StaffSphere</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30"
        >
          <LogOut size={14} />
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10">

        {/* Profile card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

          {/* Avatar + name row */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">

            {/* Avatar with upload overlay */}
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#4F46E5]/50 bg-[#1a1d27] shadow-xl overflow-hidden">
                <Avatar src={profile?.profileImage} name={profile?.name} size={36} />
              </div>

              {/* Camera button */}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#4F46E5] shadow-lg ring-2 ring-[#0f1117] transition hover:bg-[#4338CA] disabled:opacity-60"
                title="Upload photo"
              >
                {uploading
                  ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  : <Camera size={15} />
                }
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Name + role */}
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <input
                  value={editForm.name}
                  onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                />
              ) : (
                <h1 className="text-2xl font-extrabold text-white">{profile?.name}</h1>
              )}
              <p className="mt-1 text-sm text-slate-400">{profile?.email}</p>
              <span className="mt-2 inline-block rounded-full border border-[#4F46E5]/40 bg-[#4F46E5]/20 px-3 py-0.5 text-xs font-semibold text-[#818cf8] capitalize">
                {profile?.role}
              </span>
            </div>

            {/* Edit / Save buttons */}
            <div className="flex gap-2 shrink-0">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#4338CA] disabled:opacity-60"
                  >
                    {saving
                      ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      : <Save size={13} />}
                    Save
                  </button>
                  <button
                    onClick={() => { setEditing(false); setEditForm({ name: profile.name, department: profile.department, designation: profile.designation }); }}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                  >
                    <X size={13} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#4F46E5]/40 bg-[#4F46E5]/10 px-4 py-2 text-xs font-semibold text-[#818cf8] transition hover:bg-[#4F46E5]/20"
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-7 border-t border-white/10" />

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard icon={Mail}     label="Email"       value={profile?.email}       color="bg-[#4F46E5]/80" />
            <InfoCard icon={Shield}   label="Role"        value={profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}        color="bg-[#7C3AED]/80" />

            {/* Department – editable */}
            {editing ? (
              <div className="flex items-center gap-4 rounded-2xl border border-[#4F46E5]/40 bg-[#4F46E5]/5 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#06B6D4]/80">
                  <Briefcase size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Department</p>
                  <input
                    value={editForm.department}
                    onChange={e => setEditForm(p => ({ ...p, department: e.target.value }))}
                    className="mt-0.5 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                  />
                </div>
              </div>
            ) : (
              <InfoCard icon={Briefcase} label="Department" value={profile?.department} color="bg-[#06B6D4]/80" />
            )}

            {/* Designation – editable */}
            {editing ? (
              <div className="flex items-center gap-4 rounded-2xl border border-[#4F46E5]/40 bg-[#4F46E5]/5 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#22C55E]/80">
                  <Tag size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Designation</p>
                  <input
                    value={editForm.designation}
                    onChange={e => setEditForm(p => ({ ...p, designation: e.target.value }))}
                    className="mt-0.5 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                  />
                </div>
              </div>
            ) : (
              <InfoCard icon={Tag}      label="Designation" value={profile?.designation} color="bg-[#22C55E]/80" />
            )}

            <InfoCard icon={Calendar}  label="Joined On"   value={joinDate}             color="bg-[#EF4444]/80" />
          </div>

          {/* Upload hint */}
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-slate-500">
            <Upload size={13} />
            Click the camera icon on your avatar to upload a profile photo (JPG/PNG, max 5MB)
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
