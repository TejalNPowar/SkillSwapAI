import { FiCheck, FiX, FiClock, FiCheckCircle } from 'react-icons/fi'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600',
  accepted: 'bg-accent/10 text-accent-dark',
  rejected: 'bg-red-50 text-red-500',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-slate-100 text-slate-500',
}

// Renders one request row with action buttons depending on direction/status.
// onAccept/onReject/onCancel/onComplete are optional handlers wired to services/api.js.
export default function RequestCard({ request, onAccept, onReject, onCancel, onComplete }) {
  const { user, skill, status, date, direction } = request

  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-display text-sm font-semibold text-slate-800">{user.name}</p>
          <p className="text-xs text-slate-500">{user.college}</p>
          <p className="mt-1 text-xs text-slate-600">
            Skill: <span className="font-semibold text-primary">{skill}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
          {status}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <FiClock size={12} /> {date}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        {direction === 'received' && status === 'pending' && (
          <>
            <button onClick={() => onAccept?.(request)} className="btn-accent !px-3 !py-1.5 text-xs">
              <FiCheck size={14} /> Accept
            </button>
            <button onClick={() => onReject?.(request)} className="btn-outline !px-3 !py-1.5 text-xs">
              <FiX size={14} /> Reject
            </button>
          </>
        )}
        {direction === 'sent' && status === 'pending' && (
          <button onClick={() => onCancel?.(request)} className="btn-outline !px-3 !py-1.5 text-xs">
            <FiX size={14} /> Cancel
          </button>
        )}
        {status === 'accepted' && (
          <button onClick={() => onComplete?.(request)} className="btn-primary !px-3 !py-1.5 text-xs">
            <FiCheckCircle size={14} /> Mark Completed
          </button>
        )}
      </div>
    </div>
  )
}
