export default function RouteSkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans relative overflow-x-clip pb-8 max-w-md mx-auto px-4 pt-3">
      {/* Top Header Skeleton Bar */}
      <div className="flex items-center justify-between py-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full animate-skeleton shrink-0 border-2 border-indigo-50" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-28 rounded-md animate-skeleton" />
            <div className="h-3 w-16 rounded-full animate-skeleton" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-14 rounded-2xl animate-skeleton" />
          <div className="h-7 w-14 rounded-2xl animate-skeleton" />
          <div className="w-8 h-8 rounded-2xl animate-skeleton" />
        </div>
      </div>

      {/* Main Hero Card Skeleton */}
      <div className="w-full h-44 rounded-3xl bg-white/80 border border-slate-100/80 p-5 shadow-xs flex flex-col justify-between mb-4 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-5 w-36 rounded-lg animate-skeleton" />
            <div className="h-3.5 w-48 rounded-md animate-skeleton" />
          </div>
          <div className="w-10 h-10 rounded-2xl animate-skeleton" />
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full animate-skeleton" />
          <div className="flex justify-between items-center">
            <div className="h-3 w-20 rounded animate-skeleton" />
            <div className="h-3 w-16 rounded animate-skeleton" />
          </div>
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="h-28 rounded-2xl bg-white/80 border border-slate-100/80 p-3 flex flex-col justify-between shadow-2xs">
          <div className="w-8 h-8 rounded-xl animate-skeleton" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 rounded animate-skeleton" />
            <div className="h-2.5 w-14 rounded animate-skeleton" />
          </div>
        </div>
        <div className="h-28 rounded-2xl bg-white/80 border border-slate-100/80 p-3 flex flex-col justify-between shadow-2xs">
          <div className="w-8 h-8 rounded-xl animate-skeleton" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 rounded animate-skeleton" />
            <div className="h-2.5 w-14 rounded animate-skeleton" />
          </div>
        </div>
      </div>

      {/* List Card Skeleton */}
      <div className="h-24 rounded-2xl bg-white/80 border border-slate-100/80 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl animate-skeleton shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded animate-skeleton" />
            <div className="h-3 w-24 rounded animate-skeleton" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full animate-skeleton shrink-0" />
      </div>
    </div>
  );
}
