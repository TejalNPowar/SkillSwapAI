import { useEffect, useState } from 'react'
import { FiUsers, FiClock, FiCheckCircle, FiShare2, FiBell, FiCalendar } from 'react-icons/fi'
import Sidebar from '../components/Sidebar.jsx'
import SearchBar from '../components/SearchBar.jsx'
import UserCard from '../components/UserCard.jsx'
import Loader from '../components/Loader.jsx'
import Modal from '../components/Modal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchDashboard, sendRequest } from '../services/api.js'
import { upcomingSessions } from '../data/notifications.js'

const STAT_CONFIG = [
  { key: 'connections', label: 'Connections', icon: FiUsers, color: 'bg-primary/10 text-primary' },
  { key: 'pendingRequests', label: 'Pending Requests', icon: FiClock, color: 'bg-amber-50 text-amber-500' },
  { key: 'completedSwaps', label: 'Completed Swaps', icon: FiCheckCircle, color: 'bg-accent/10 text-accent-dark' },
  { key: 'skillsShared', label: 'Skills Shared', icon: FiShare2, color: 'bg-secondary/10 text-secondary' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [requestTarget, setRequestTarget] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchDashboard(user?.id).then((res) => {
      if (active) {
        setData(res.data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [user?.id])

  const handleConfirmRequest = async () => {
    if (!requestTarget) return
    await sendRequest({ fromUserId: user?.id, toUserId: requestTarget.id, skill: requestTarget.skillsOffered[0] })
    setRequestTarget(null)
  }

  const recommended = (data?.recommended || []).filter((s) =>
    `${s.name} ${s.college} ${s.skillsOffered.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex page-enter">
      <Sidebar />
      <div className="container-page flex-1 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'Student'} \uD83D\uDC4B</h1>
        <p className="mt-1 text-sm text-slate-500">Here\u2019s what\u2019s happening with your skill swaps.</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="card p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-slate-800">
                {loading ? <span className="skeleton inline-block h-6 w-10 align-middle" /> : data?.stats?.[key]}
              </p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-800">Recommended for you</h2>
              <div className="w-full sm:w-72">
                <SearchBar value={search} onChange={setSearch} placeholder="Search recommendations..." />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {loading ? (
                <Loader variant="card" count={4} />
              ) : (
                recommended.map((s) => <UserCard key={s.id} user={s} onRequest={setRequestTarget} />)
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Recent activity */}
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-800">
                <FiBell size={16} className="text-primary" /> Recent Activity
              </h3>
              <ul className="mt-4 space-y-4">
                {(data?.recentActivity || []).map((n) => (
                  <li key={n.id} className="text-sm">
                    <p className="text-slate-700">{n.text}</p>
                    <p className="text-xs text-slate-400">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upcoming sessions */}
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-800">
                <FiCalendar size={16} className="text-accent-dark" /> Upcoming Sessions
              </h3>
              <ul className="mt-4 space-y-4">
                {upcomingSessions.map((s) => (
                  <li key={s.id} className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.withUser} className="h-9 w-9 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700">{s.withUser}</p>
                      <p className="text-xs text-slate-400">{s.skill} \u00b7 {s.date}, {s.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!requestTarget} onClose={() => setRequestTarget(null)} title="Send Swap Request">
        {requestTarget && (
          <div>
            <div className="flex items-center gap-3">
              <img src={requestTarget.avatar} alt={requestTarget.name} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-slate-800">{requestTarget.name}</p>
                <p className="text-xs text-slate-500">{requestTarget.college}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Send a request to learn <span className="font-semibold text-primary">{requestTarget.skillsOffered[0]}</span> from {requestTarget.name.split(' ')[0]}?
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setRequestTarget(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleConfirmRequest} className="btn-primary flex-1">Send Request</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
