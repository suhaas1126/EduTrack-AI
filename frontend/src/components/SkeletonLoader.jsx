import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-panel p-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-8 w-28 bg-slate-300 dark:bg-slate-650 rounded" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="glass-panel overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 flex justify-between items-center">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div
                key={cIdx}
                className={`h-4 bg-slate-200 dark:bg-slate-700 rounded ${
                  cIdx === 0 ? 'flex-1' : cIdx === 1 ? 'w-24' : 'w-32'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-panel p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-24 h-24 rounded-full bg-slate-300 dark:bg-slate-700" />
        <div className="flex-1 space-y-3 w-full text-center md:text-left">
          <div className="h-6 w-48 bg-slate-300 dark:bg-slate-700 rounded mx-auto md:mx-0" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-750 rounded mx-auto md:mx-0" />
          <div className="flex gap-2 justify-center md:justify-start">
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 h-40" />
        <div className="glass-panel p-6 h-40 col-span-2" />
      </div>
    </div>
  );
};
