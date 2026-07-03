import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiGrid,
  FiCompass,
  FiRepeat,
  FiMessageSquare,
  FiUser,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'

const ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/explore', label: 'Explore', icon: FiCompass },
  { to: '/requests', label: 'Requests', icon: FiRepeat },
  { to: '/messages', label: 'Messages', icon: FiMessageSquare, uiOnly: true },
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings, uiOnly: true },
]

// Left navigation rail used on Dashboard / Explore / Requests / Profile pages.
export default function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-slate-100 bg-white px-3 py-6 lg:flex">
      {ITEMS.map(({ to, label, icon: Icon, uiOnly }) => (
        <NavLink
          key={label}
          to={uiOnly ? '#' : to}
          onClick={(e) => uiOnly && e.preventDefault()}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              isActive && !uiOnly
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
            }`
          }
        >
          <Icon size={18} />
          {label}
          {uiOnly && <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">soon</span>}
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
      >
        <FiLogOut size={18} />
        Logout
      </button>
    </aside>
  )
}
