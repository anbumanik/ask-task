import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { CardSkeleton, ChartSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import {
  Users,
  UserCheck,
  UserMinus,
  Briefcase,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

// Harmony colors for glassmorphic charts
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl border border-slate-700 bg-slate-900/90 p-3 shadow-xl"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        {label && <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>}
        <p className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: payload[0].color || payload[0].payload?.fill }}
          ></span>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      addToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStatsffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* KPI Skeleton grids */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        {/* Charts Skeleton grids */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  // Fallback state if API errors out
  if (!stats) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-lg text-slate-400">Failed to render dashboard metrics.</p>
        <button
          onClick={fetchStats}
          className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/25"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate highest staffing department
  const getTopDepartment = useCallback(() => {
    if (!stats.departmentStats || stats.departmentStats.length === 0) return 'None';
    const top = [...stats.departmentStats].sort((a, b) => b.count - a.count)[0];
    return `${top.department} (${top.count})`;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* 1. Statistics Cards Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          colorClass="from-brand-500 to-indigo-500 text-brand-400"
          delayClass="delay-75"
        />
        <StatCard
          title="Active Staff"
          value={stats.activeEmployees}
          icon={UserCheck}
          colorClass="from-emerald-500 to-teal-500 text-emerald-400"
          delayClass="delay-100"
        />
        <StatCard
          title="Inactive Staff"
          value={stats.inactiveEmployees}
          icon={UserMinus}
          colorClass="from-rose-500 to-pink-500 text-rose-400"
          delayClass="delay-150"
        />
        <StatCard
          title="Top Department"
          value={getTopDepartment()}
          icon={Briefcase}
          colorClass="from-amber-500 to-orange-500 text-amber-400"
          delayClass="delay-200"
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart: Monthly Joining Trend */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/40">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-brand-400 h-5 w-5" />
            <h4 className="text-md font-bold text-white">Monthly Hires Timeline</h4>
          </div>
          <div className="h-[300px] w-full">
            {stats.monthlyStats && stats.monthlyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Hired Employees"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                    dot={{ r: 4, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No hiring history data found.
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart: Department-wise Count */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/40">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-emerald-400 h-5 w-5" />
            <h4 className="text-md font-bold text-white">Department Headcount</h4>
          </div>
          <div className="h-[300px] w-full">
            {stats.departmentStats && stats.departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.departmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Employees" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {stats.departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No department mappings found.
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart: Department Distribution Share */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/40 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="text-amber-400 h-5 w-5" />
            <h4 className="text-md font-bold text-white">Department Distribution Ratio</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
            <div className="h-[250px] md:col-span-2">
              {stats.departmentStats && stats.departmentStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.departmentStats}
                      dataKey="count"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
                    >
                      {stats.departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No department ratio metrics.
                </div>
              )}
            </div>

            {/* Side legend description */}
            <div className="space-y-3.5 bg-slate-950/20 p-5 rounded-2xl border border-slate-800/40">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Headcount Share</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {stats.departmentStats.map((dept, index) => (
                  <div key={dept.department} className="flex items-center gap-2 text-slate-300">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="truncate">{dept.department}:</span>
                    <span className="font-bold text-white">{dept.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
