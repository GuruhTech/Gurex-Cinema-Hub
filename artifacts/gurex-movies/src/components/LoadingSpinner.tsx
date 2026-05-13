export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-5 h-5", md: "w-10 h-10", lg: "w-16 h-16" };
  return (
    <div className="flex items-center justify-center py-16">
      <div className={`${sizes[size]} border-2 border-muted border-t-primary rounded-full animate-spin`} />
    </div>
  );
}

export function SkeletonCard({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const widths = { sm: "w-32 sm:w-36", md: "w-40 sm:w-44", lg: "w-48 sm:w-52" };
  return (
    <div className={`flex-shrink-0 ${widths[size]}`}>
      <div className="aspect-[2/3] skeleton rounded-xl" />
      <div className="mt-2 space-y-1.5">
        <div className="h-3.5 skeleton rounded w-5/6" />
        <div className="h-3 skeleton rounded w-3/6" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="mb-10">
      <div className="h-6 w-36 skeleton rounded mb-4" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="w-full h-[90vh] min-h-[580px] max-h-[820px] skeleton" />
  );
}
