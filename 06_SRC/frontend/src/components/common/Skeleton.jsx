import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 dark:bg-zinc-800/60 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="flex flex-col bg-surface-card rounded-2xl border border-surface-border overflow-hidden p-0 shadow-xs">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-3.5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3 w-1/2 rounded-md" />
        <div className="mt-auto pt-2 border-t border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonRow = () => {
  return (
    <div className="p-4 rounded-2xl bg-surface-card border border-surface-border flex items-center gap-3.5">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-2/5 rounded-md" />
        <Skeleton className="h-3 w-3/5 rounded-md" />
      </div>
      <Skeleton className="h-7 w-20 rounded-full shrink-0" />
    </div>
  );
};

export default Skeleton;
