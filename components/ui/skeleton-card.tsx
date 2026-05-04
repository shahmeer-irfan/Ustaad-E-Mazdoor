const skeletonStyle = {
  background: "var(--bg-card)",
  boxShadow: "inset 0 0 0 1px var(--border)",
} as const;

const blockStyle = { background: "var(--bg-elevated)" } as const;
const accentStyle = { background: "var(--brand-dim)" } as const;

export function JobCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 animate-pulse"
      style={skeletonStyle}
    >
      <div className="flex flex-col gap-2">
        <div className="h-5 rounded-lg w-3/4" style={blockStyle} />
        <div className="h-6 rounded-full w-20" style={accentStyle} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 rounded w-full" style={blockStyle} />
        <div className="h-4 rounded w-5/6" style={blockStyle} />
      </div>
      <div className="flex gap-2">
        <div className="h-6 rounded-full w-20" style={blockStyle} />
        <div className="h-6 rounded-full w-24" style={blockStyle} />
      </div>
      <div className="h-px" style={{ background: "var(--border)" }} />
      <div className="flex items-center justify-between">
        <div className="h-5 rounded w-28" style={accentStyle} />
        <div className="h-9 rounded-xl w-20" style={accentStyle} />
      </div>
    </div>
  );
}

export function FreelancerCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 animate-pulse"
      style={skeletonStyle}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full" style={accentStyle} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 rounded w-1/2" style={blockStyle} />
          <div className="h-3 rounded w-1/3" style={blockStyle} />
        </div>
      </div>
      <div className="h-6 rounded-full w-24" style={accentStyle} />
      <div className="flex flex-col gap-2">
        <div className="h-4 rounded w-full" style={blockStyle} />
        <div className="h-4 rounded w-4/5" style={blockStyle} />
      </div>
      <div className="h-px" style={{ background: "var(--border)" }} />
      <div className="flex items-center justify-between">
        <div className="h-5 rounded w-24" style={accentStyle} />
        <div className="h-9 rounded-xl w-20" style={accentStyle} />
      </div>
    </div>
  );
}
