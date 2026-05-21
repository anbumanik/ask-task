import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, delayClass }) => {
  return (
    <div
      className={`glass-card relative overflow-hidden rounded-2xl p-6 shadow-lg border border-slate-800/40 hover:shadow-brand-500/5 ${delayClass}`}
    >
      {/* Decorative background glow */}
      <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${colorClass}`}></div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            {value}
          </h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/30 bg-slate-900/40 ${colorClass.split(' ')[0]} shadow-inner`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Decorative micro line indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colorClass}`}></div>
    </div>
  );
};

export default StatCard;
