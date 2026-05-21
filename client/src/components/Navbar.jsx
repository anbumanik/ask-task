import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Get human readable title from route path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Analytics';
    if (path.startsWith('/employees')) return 'Employee Directory';
    return 'Admin Panel';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/40 glass-panel px-6">
      {/* Left side: Hamburger on mobile + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white md:text-xl">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Current date + Profile pill */}
      <div className="flex items-center gap-4">
        {/* Date Display - Hidden on extra small mobile */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-800/40">
          <Calendar size={13} className="text-brand-400" />
          <span>{getFormattedDate()}</span>
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/20 px-3 py-1.5 border border-slate-800/40">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold">
            <User size={12} />
          </div>
          <span className="hidden text-xs font-semibold text-slate-200 md:inline">
            {user?.name || 'Administrator'}
          </span>
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
