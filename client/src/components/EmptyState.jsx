import { FiInbox } from 'react-icons/fi'

// Reusable empty-state block. Pass an icon, title, and short instruction
// so every blank screen tells the user what to do next.
export default function EmptyState({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  description = 'Once there\u2019s activity, it will show up here.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon size={26} />
      </div>
      <h3 className="font-display text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
