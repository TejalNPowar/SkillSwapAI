import { Link } from 'react-router-dom'
import { FiStar, FiMapPin } from 'react-icons/fi'
import SkillTag from './SkillTag.jsx'

// Card used in Dashboard "Recommended" and Explore Skills grid.
export default function UserCard({ user, onRequest }) {
  return (
    <div className="card group flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-softer">
      <div className="flex items-start gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-soft"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold text-slate-800">{user.name}</h3>
          <p className="flex items-center gap-1 truncate text-xs text-slate-500">
            <FiMapPin size={12} /> {user.college}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-amber-500">
            <FiStar className="fill-amber-400 text-amber-400" size={13} />
            {user.rating}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Offers</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsOffered.slice(0, 3).map((s) => (
              <SkillTag key={s} label={s} kind="offer" />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Wants</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsWanted.slice(0, 3).map((s) => (
              <SkillTag key={s} label={s} kind="want" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Link to={`/profile/${user.id}`} className="btn-outline flex-1">
          View Profile
        </Link>
        <button onClick={() => onRequest?.(user)} className="btn-primary flex-1">
          Request
        </button>
      </div>
    </div>
  )
}
