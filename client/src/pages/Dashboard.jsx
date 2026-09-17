import { useEffect, useState } from 'react'
import { FiUsers, FiClock, FiCheckCircle, FiShare2, FiBell, FiCalendar, FiVideo } from 'react-icons/fi'
import Sidebar from '../components/Sidebar.jsx'
import SearchBar from '../components/SearchBar.jsx'
import UserCard from '../components/UserCard.jsx'
import Loader from '../components/Loader.jsx'
import Modal from '../components/Modal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  fetchDashboard,
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  getMySessions,
  joinSession,
} from '../services/api.js'

const STAT_CONFIG = [
  { key: 'connections', label: 'Connections', icon: FiUsers, color: 'bg-primary/10 text-primary' },
  { key: 'pendingRequests', label: 'Pending Requests', icon: FiClock, color: 'bg-amber-50 text-amber-500' },
  { key: 'completedSwaps', label: 'Completed Swaps', icon: FiCheckCircle, color: 'bg-accent/10 text-accent-dark' },
  { key: 'skillsShared', label: 'Skills Shared', icon: FiShare2, color: 'bg-secondary/10 text-secondary' },
]

// Small, deterministic date/time formatting shared by both real-data widgets below.
// Absolute (not "x ago") so it never needs re-computation client-side.
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
function formatTime(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}
function formatDateTime(d) {
  return `${formatDate(d)}, ${formatTime(d)}`
}

// Builds the "Connections" count: distinct people the current user has an
// Accepted SwapRequest with, counting each counterpart once even if there
// are multiple accepted requests with the same person.
function countConnections(sentRequests, receivedRequests, currentUserId) {
  const counterpartIds = new Set()

  sentRequests.forEach((r) => {
    if (r.status === 'Accepted' && r.receiver?._id) {
      counterpartIds.add(String(r.receiver._id))
    }
  })

  receivedRequests.forEach((r) => {
    if (r.status === 'Accepted' && r.sender?._id) {
      counterpartIds.add(String(r.sender._id))
    }
  })

  counterpartIds.delete(String(currentUserId))
  return counterpartIds.size
}

// "Completed Swaps": sessions the existing timing logic already reports as
// completed (session.computedState, from the same sessionTiming rules used
// by My Sessions / Join Meeting). Not derived from Accepted requests.
function countCompletedSessions(sessions) {
  return sessions.filter((s) => s.computedState === 'completed').length
}

// Picks the other participant on a session relative to the current user.
function otherParticipant(session, currentUserId) {
  const teacherId = session.teacher?._id ? String(session.teacher._id) : String(session.teacher)
  return teacherId === String(currentUserId) ? session.student : session.teacher
}

// Builds the compact "Upcoming Sessions" list from real sessions: anything
// not yet completed/cancelled, soonest first.
function buildUpcomingSessions(sessions, currentUserId) {
  return sessions
    .filter((s) => s.computedState === 'upcoming' || s.computedState === 'live')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 3)
    .map((s) => {
      const other = otherParticipant(s, currentUserId)
      return {
        id: s._id,
        sessionId: s._id,
        withUser: other?.name || 'Unknown',
        avatar:
          other?.profileImage ||
          'https://ui-avatars.com/api/?name=' + encodeURIComponent(other?.name || '?'),
        skill: s.skill,
        date: formatDate(s.scheduledDate),
        time: formatTime(s.scheduledDate),
        state: s.computedState,
        hasMeetLink: !!s.meetLink,
      }
    })
}

// Builds the "Recent Activity" feed purely from real, already-existing data
// (swap requests + sessions) -- no Notification/Activity model, nothing invented.
function buildRecentActivity(sentRequests, receivedRequests, sessions, currentUserId) {
  const items = []

  receivedRequests.forEach((r) => {
    const otherName = r.sender?.name || 'A student'
    if (r.status === 'Pending') {
      items.push({
        id: `recv-${r._id}`,
        type: 'request',
        text: `${otherName} sent you a swap request for ${r.offeredSkill}`,
        ts: r.createdAt,
      })
    } else if (r.status === 'Accepted') {
      items.push({
        id: `recv-${r._id}`,
        type: 'accept',
        text: `You accepted ${otherName}'s ${r.offeredSkill} request`,
        ts: r.updatedAt || r.createdAt,
      })
    } else if (r.status === 'Rejected') {
      items.push({
        id: `recv-${r._id}`,
        type: 'reject',
        text: `You rejected ${otherName}'s ${r.offeredSkill} request`,
        ts: r.updatedAt || r.createdAt,
      })
    }
  })

  sentRequests.forEach((r) => {
    const otherName = r.receiver?.name || 'A student'
    if (r.status === 'Pending') {
      items.push({
        id: `sent-${r._id}`,
        type: 'request',
        text: `You sent ${otherName} a request for ${r.offeredSkill}`,
        ts: r.createdAt,
      })
    } else if (r.status === 'Accepted') {
      items.push({
        id: `sent-${r._id}`,
        type: 'accept',
        text: `${otherName} accepted your ${r.offeredSkill} request`,
        ts: r.updatedAt || r.createdAt,
      })
    } else if (r.status === 'Rejected') {
      items.push({
        id: `sent-${r._id}`,
        type: 'reject',
        text: `${otherName} rejected your ${r.offeredSkill} request`,
        ts: r.updatedAt || r.createdAt,
      })
    }
  })

  sessions.forEach((s) => {
    const other = otherParticipant(s, currentUserId)
    const otherName = other?.name || 'a student'
    if (s.computedState === 'completed') {
      items.push({
        id: `sess-complete-${s._id}`,
        type: 'complete',
        text: `You completed a ${s.skill} session with ${otherName}`,
        ts: s.scheduledDate,
      })
    } else if (s.computedState === 'upcoming' || s.computedState === 'live') {
      items.push({
        id: `sess-scheduled-${s._id}`,
        type: 'session',
        text: `Session with ${otherName} for ${s.skill} on ${formatDateTime(s.scheduledDate)}`,
        ts: s.createdAt,
      })
    }
  })

  return items
    .filter((i) => i.ts)
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, 5)
    .map((i) => ({ ...i, time: formatDateTime(i.ts) }))
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [requestTarget, setRequestTarget] = useState(null)
  const [joiningId, setJoiningId] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([fetchDashboard(), getSentRequests(), getReceivedRequests(), getMySessions()])
      .then(([dashboardRes, sentRes, receivedRes, sessionsRes]) => {
        if (!active) return

        const sentRequests = sentRes.data.requests || []
        const receivedRequests = receivedRes.data.requests || []
        const sessions = sessionsRes.data.sessions || []

        setData({
          stats: {
            connections: countConnections(sentRequests, receivedRequests, user?._id),
            pendingRequests: dashboardRes.data.dashboard.pendingRequests,
            completedSwaps: countCompletedSessions(sessions),
            skillsShared: dashboardRes.data.dashboard.skillsOffered,
          },

          recommended: [],

          recentActivity: buildRecentActivity(sentRequests, receivedRequests, sessions, user?._id),

          upcomingSessions: buildUpcomingSessions(sessions, user?._id),
        })
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user?._id])

  const handleConfirmRequest = async () => {
    if (!requestTarget) return
    await sendRequest({
      receiverId: requestTarget._id,
      offeredSkill: user?.skillsOffered?.[0] || "General",
      requestedSkill: requestTarget.skillsOffered?.[0] || "General",
      message: `${user?.name || "A student"} wants to swap skills with you.`,
    })
    setRequestTarget(null)
  }

  const handleJoin = async (sessionId) => {
    if (joiningId) return // prevent double-click
    try {
      setJoiningId(sessionId)
      const response = await joinSession(sessionId)
      window.open(response.data.meetLink, '_blank')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Unable to join this session right now.')
    } finally {
      setJoiningId(null)
    }
  }

  const recommended = (data?.recommended || []).filter((s) =>
    `${s.name} ${s.college} ${s.skillsOffered.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex page-enter">
      <Sidebar />
      <div className="container-page flex-1 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'Student'} 
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here's what's happening with your skill swaps.</p>

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
              {loading ? (
                <p className="mt-4 text-sm text-slate-400">Loading...</p>
              ) : (data?.recentActivity || []).length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">No recent activity yet.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {data.recentActivity.map((n) => (
                    <li key={n.id} className="text-sm">
                      <p className="text-slate-700">{n.text}</p>
                      <p className="text-xs text-slate-400">{n.time}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Upcoming sessions */}
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-800">
                <FiCalendar size={16} className="text-accent-dark" /> Upcoming Sessions
              </h3>
              {loading ? (
                <p className="mt-4 text-sm text-slate-400">Loading...</p>
              ) : (data?.upcomingSessions || []).length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">No upcoming sessions scheduled.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {data.upcomingSessions.map((s) => (
                    <li key={s.id} className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.withUser} className="h-9 w-9 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">{s.withUser}</p>
                        <p className="text-xs text-slate-400">{s.skill} &middot; {s.date}, {s.time}</p>
                      </div>
                      {s.state === 'live' && s.hasMeetLink ? (
                        <button
                          onClick={() => handleJoin(s.sessionId)}
                          disabled={joiningId === s.sessionId}
                          className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          <FiVideo size={12} />
                          {joiningId === s.sessionId ? '...' : 'Join'}
                        </button>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wide text-slate-300">
                          {s.state === 'live' ? 'no link' : 'upcoming'}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
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