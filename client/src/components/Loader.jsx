// Generic loading indicator. Use `variant="card"` for grid skeletons,
// or the default spinner for inline loading states.
export default function Loader({ variant = 'spinner', count = 1 }) {
  if (variant === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-2/3 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-5/6 rounded" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
    </div>
  )
}
