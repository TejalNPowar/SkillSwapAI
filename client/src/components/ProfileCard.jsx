import { FiStar } from 'react-icons/fi'

// Compact summary block, e.g. for the dashboard sidebar "your profile" card.
export default function ProfileCard({ user }) {
  if (!user) return null
  return (
    <div className="card p-5 text-center">
      <img
        src={user.avatar}
        alt={user.name}
        className="mx-auto h-16 w-16 rounded-full border-2 border-white object-cover shadow-soft"
      />
      <h3 className="mt-3 font-display text-sm font-semibold text-slate-800">{user.name}</h3>
      <p className="text-xs text-slate-500">{user.college}</p>
      <div className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-amber-500">
        <FiStar className="fill-amber-400 text-amber-400" size={13} />
        {user.rating} rating
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-xl bg-slate-50 py-2">
          <p className="font-display text-sm font-bold text-slate-800">{user.skillsOffered.length}</p>
          <p className="text-slate-500">Teaching</p>
        </div>
        <div className="rounded-xl bg-slate-50 py-2">
          <p className="font-display text-sm font-bold text-slate-800">{user.skillsWanted.length}</p>
          <p className="text-slate-500">Learning</p>
        </div>
      </div>
    </div>
  )
}
