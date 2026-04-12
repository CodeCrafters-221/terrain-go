export default function Loader() {
  return (
    <div className="min-h-screen bg-background-dark px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6">
        {/* Hero skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-2/3 rounded-lg bg-surface-dark" />
          <div className="h-4 w-1/2 rounded-md bg-surface-dark/80" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-surface-highlight bg-surface-dark"
            >
              <div className="h-40 w-full bg-surface-highlight/60" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 rounded-md bg-surface-highlight/60" />
                <div className="h-4 w-1/2 rounded-md bg-surface-highlight/50" />
                <div className="h-4 w-2/3 rounded-md bg-surface-highlight/50" />
                <div className="pt-2">
                  <div className="h-9 w-full rounded-xl bg-primary/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}