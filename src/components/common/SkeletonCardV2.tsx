export default function SkeletonCardV2() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[4/3] w-full animate-pulse bg-slate-100 dark:bg-neutral-800" />
      <div className="p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-neutral-800" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
