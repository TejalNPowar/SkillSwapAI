import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore Skills' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/requests', label: 'Requests' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-primary ${isActive ? 'text-primary' : 'text-slate-600'}`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
            S
          </span>
          <span className="font-display text-lg font-bold text-slate-800">
            SkillSwap <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2">
              <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full border-2 border-primary/30 object-cover" />
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="text-slate-700 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)} end={l.to === '/'}>
                {l.label}
              </NavLink>
            ))}
            <hr className="border-slate-100" />
            {isAuthenticated ? (
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                View Profile
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost flex-1">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
