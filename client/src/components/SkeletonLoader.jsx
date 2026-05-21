import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-6 border border-slate-805/40 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1 mr-4">
          <div className="h-4 w-24 rounded bg-slate-800"></div>
          <div className="h-8 w-16 rounded bg-slate-800"></div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-slate-800"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800"></div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800/40 bg-slate-900/10 backdrop-blur-md animate-pulse">
      {/* Table Header skeleton */}
      <div className="flex border-b border-slate-800 bg-slate-900/40 p-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 px-2">
            <div className="h-4 rounded bg-slate-800 w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Table Body rows */}
      <div className="divide-y divide-slate-800/50">
        {Array.from({ length: rows }).map((_, rIndex) => (
          <div key={rIndex} className="flex p-4 items-center">
            {Array.from({ length: cols }).map((_, cIndex) => (
              <div key={cIndex} className="flex-1 px-2">
                {cIndex === 0 ? (
                  // Employee Name Column: Circle avatar + double line
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-800 shrink-0"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 rounded bg-slate-800 w-3/4"></div>
                      <div className="h-2.5 rounded bg-slate-800 w-1/2"></div>
                    </div>
                  </div>
                ) : cIndex === cols - 1 ? (
                  // Actions Column: Buttons
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-800"></div>
                    <div className="h-8 w-8 rounded-lg bg-slate-800"></div>
                  </div>
                ) : (
                  // Standard columns
                  <div className="h-4 rounded bg-slate-800 w-5/6"></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/40 animate-pulse space-y-4">
      <div className="h-5 w-40 rounded bg-slate-800"></div>
      <div className="h-[250px] w-full rounded-xl bg-slate-800/40 flex items-end justify-between p-4">
        <div className="h-[40%] w-[10%] rounded-t bg-slate-800/60"></div>
        <div className="h-[75%] w-[10%] rounded-t bg-slate-800/60"></div>
        <div className="h-[60%] w-[10%] rounded-t bg-slate-800/60"></div>
        <div className="h-[90%] w-[10%] rounded-t bg-slate-800/60"></div>
        <div className="h-[50%] w-[10%] rounded-t bg-slate-800/60"></div>
        <div className="h-[80%] w-[10%] rounded-t bg-slate-800/60"></div>
      </div>
    </div>
  );
};
