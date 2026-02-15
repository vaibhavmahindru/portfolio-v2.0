/**
 * Skeleton loaders that match the card/section shapes used across the site.
 * Used as Suspense fallbacks for lazy-loaded sections.
 */

const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`glow-border rounded-md bg-card p-5 space-y-3 ${className}`}>
    <div className="skeleton h-4 w-1/3 rounded" />
    <div className="skeleton h-3 w-2/3 rounded" />
    <div className="skeleton h-3 w-1/2 rounded" />
    <div className="flex gap-2 pt-1">
      <div className="skeleton h-5 w-12 rounded" />
      <div className="skeleton h-5 w-12 rounded" />
      <div className="skeleton h-5 w-12 rounded" />
    </div>
  </div>
);

/** Skeleton for a full section with header + grid of cards */
export const SectionSkeleton = () => (
  <div className="px-6 py-12 md:py-24">
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-8 w-48 rounded" />
      </div>
      <div className="grid gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
);

/** Skeleton for the status panel */
export const PanelSkeleton = () => (
  <div className="px-6 py-16">
    <div className="max-w-4xl mx-auto">
      <div className="glow-border rounded-md bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="skeleton w-2 h-2 rounded-full" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SectionSkeleton;

