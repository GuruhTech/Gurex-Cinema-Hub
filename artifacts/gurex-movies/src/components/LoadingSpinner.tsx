export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-5 h-5", md: "w-10 h-10", lg: "w-16 h-16" };
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizes[size]} border-2 border-muted border-t-primary rounded-full animate-spin`} />
    </div>
  );
}

export function SkeletonCard({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-32 sm:w-36", md: "w-40 sm:w-44", lg: "w-48 sm:w-52" };
  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      <div className="skeleton rounded-xl aspect-[2/3]" />
      <div className="mt-2 space-y-1">
        <div className="skeleton h-3.5 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="skeleton w-1 h-6 rounded-full" />
        <div className="skeleton h-6 rounded w-40" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[85vh] min-h-[560px] max-h-[800px] overflow-hidden bg-card">
      <div className="skeleton absolute inset-0" />
      <div className="absolute bottom-20 left-16 space-y-4">
        <div className="skeleton h-4 rounded w-24" />
        <div className="skeleton h-14 rounded w-96" />
        <div className="skeleton h-4 rounded w-72" />
        <div className="skeleton h-4 rounded w-80" />
        <div className="skeleton h-4 rounded w-64" />
        <div className="flex gap-3 mt-6">
          <div className="skeleton h-12 rounded-full w-36" />
          <div className="skeleton h-12 rounded-full w-36" />
        </div>
      </div>
    </div>
  );
}
