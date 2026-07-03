import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiStar, FiAward, FiCalendar, FiGithub, FiLinkedin, FiLink } from 'react-icons/fi'
import Sidebar from '../components/Sidebar.jsx'
import SkillTag from '../components/SkillTag.jsx'
import Modal from '../components/Modal.jsx'
import { students } from '../data/students.js'
import { useAuth } from '../context/AuthContext.jsx'
import { sendRequest } from '../services/api.js'

export default function Profile() {
  const { id } = useParams()
  const { user: authUser } = useAuth()
  const profileUser = id ? students.find((s) => s.id === id) || students[0] : authUser
  const isOwnProfile = !id

  const [showRequest, setShowRequest] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSendRequest = async () => {
    await sendRequest({ fromUserId: authUser?.id, toUserId: profileUser.id, skill: profileUser.skillsOffered[0] })
    setSent(true)
    setShowRequest(false)
  }

  if (!profileUser) return null

  return (
    <div className="flex page-enter">
      <Sidebar />
      <div className="flex-1 pb-12">
        {/* Cover */}
        <div className="relative h-48 w-full overflow-hidden sm:h-60">
          <img src={profileUser.cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="container-page -mt-14">
          <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-end">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-soft"
            />
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-slate-900">{profileUser.name}</h1>
              <p className="text-sm text-slate-500">
                {profileUser.department} \u00b7 {profileUser.year} \u00b7 {profileUser.college}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-amber-500">
                <FiStar className="fill-amber-400 text-amber-400" size={15} /> {profileUser.rating} rating
              </div>
            </div>
            {!isOwnProfile && (
              <button
                onClick={() => (sent ? null : setShowRequest(true))}
                className={sent ? 'btn-accent' : 'btn-primary'}
                disabled={sent}
              >
                {sent ? 'Request Sent' : 'Request Skill Swap'}
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-800">About</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{profileUser.bio}</p>
              </div>

              <div className="card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-800">Skills Offered</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileUser.skillsOffered.map((s) => (
                    <SkillTag key={s} label={s} kind="offer" />
                  ))}
                </div>
                <h2 className="mt-5 font-display text-lg font-semibold text-slate-800">Skills Wanted</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileUser.skillsWanted.map((s) => (
                    <SkillTag key={s} label={s} kind="want" />
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-800">
                  <FiAward className="text-primary" /> Achievements
                </h2>
                <ul className="mt-3 space-y-2">
                  {profileUser.achievements.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-800">
                  <FiCalendar className="text-primary" /> Availability
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileUser.availability.map((a) => (
                    <span key={a} className="chip">{a}</span>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-display text-sm font-semibold text-slate-800">Experience Level</h3>
                <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {profileUser.experience}
                </span>
              </div>

              <div className="card p-6">
                <h3 className="font-display text-sm font-semibold text-slate-800">Social Links</h3>
                <div className="mt-3 space-y-2 text-sm">
                  {profileUser.socials.github && (
                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-primary">
                      <FiGithub size={15} /> {profileUser.socials.github}
                    </a>
                  )}
                  {profileUser.socials.linkedin && (
                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-primary">
                      <FiLinkedin size={15} /> {profileUser.socials.linkedin}
                    </a>
                  )}
                  {profileUser.socials.portfolio && (
                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-primary">
                      <FiLink size={15} /> {profileUser.socials.portfolio}
                    </a>
                  )}
                  {!profileUser.socials.github && !profileUser.socials.linkedin && !profileUser.socials.portfolio && (
                    <p className="text-slate-400">No links added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showRequest} onClose={() => setShowRequest(false)} title="Send Swap Request">
        <p className="text-sm text-slate-600">
          Send a request to learn <span className="font-semibold text-primary">{profileUser.skillsOffered[0]}</span> from {profileUser.name.split(' ')[0]}?
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => setShowRequest(false)} className="btn-outline flex-1">Cancel</button>
          <button onClick={handleSendRequest} className="btn-primary flex-1">Send Request</button>
        </div>
      </Modal>
    </div>
  )
}
