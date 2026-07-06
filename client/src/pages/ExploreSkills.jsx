import { useEffect, useMemo, useState } from 'react'
import { FiFilter } from 'react-icons/fi'
import Sidebar from '../components/Sidebar.jsx'
import SearchBar from '../components/SearchBar.jsx'
import UserCard from '../components/UserCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Modal from '../components/Modal.jsx'

import { skillCategories } from '../data/skills.js'
import { sendRequest, getUsers  } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced']
const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Evenings']
const PAGE_SIZE = 6


export default function ExploreSkills() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [experience, setExperience] = useState('All')
  const [college, setCollege] = useState('All')
  const [availability, setAvailability] = useState('All')
  const [page, setPage] = useState(1)
  const [requestTarget, setRequestTarget] = useState(null)

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const colleges = useMemo(() => ['All', ...new Set(students.map((s) => s.college))], [students])

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = `${s.name} ${s.college} ${(s.skillsOffered || []).join(' ')} ${(s.skillsWanted ||[]).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory = category === 'All' ||( s.skillsOffered || []).some((sk) => sk.toLowerCase().includes(category.toLowerCase()))
      const matchesExperience = experience === 'All' || s.experience === experience
      const matchesCollege = college === 'All' || s.college === college
      const matchesAvailability = availability === 'All' || (s.availability || []).includes(availability)
      return matchesSearch && matchesCategory && matchesExperience && matchesCollege && matchesAvailability
    })
  }, [students, search, category, experience, college, availability])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const updateFilter = (setter) => (val) => {
    setter(val)
    setPage(1)
  }

  const handleConfirmRequest = async () => {
    if (!requestTarget) return
    await sendRequest({ fromUserId: user?.id, toUserId: requestTarget._id, skill: requestTarget.skillsOffered[0] })
    setRequestTarget(null)
  }


  useEffect(() => {

    const fetchUsers = async () => {

        try {

            const response = await getUsers();

            console.log("Users:", response.data.users);

            setStudents(response.data.users);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    fetchUsers();

}, []);





  return (
    <div className="flex page-enter">
      <Sidebar />
      <div className="container-page flex-1 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Explore Skills</h1>
        <p className="mt-1 text-sm text-slate-500">Find students whose skills match what you want to learn.</p>

        <div className="mt-6">
          <SearchBar value={search} onChange={updateFilter(setSearch)} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 text-slate-400">
            <FiFilter size={14} /> Filters:
          </span>
          <select value={category} onChange={(e) => updateFilter(setCategory)(e.target.value)} className="input-field w-auto py-2 text-sm">
            <option value="All">Category: All</option>
            {skillCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={experience} onChange={(e) => updateFilter(setExperience)(e.target.value)} className="input-field w-auto py-2 text-sm">
            <option value="All">Experience: All</option>
            {EXPERIENCE_OPTIONS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <select value={college} onChange={(e) => updateFilter(setCollege)(e.target.value)} className="input-field w-auto py-2 text-sm">
            {colleges.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'College: All' : c}</option>
            ))}
          </select>
          <select value={availability} onChange={(e) => updateFilter(setAvailability)(e.target.value)} className="input-field w-auto py-2 text-sm">
            <option value="All">Availability: All</option>
            {AVAILABILITY_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          {paginated.length === 0 ? (
            <EmptyState
              title="No students match these filters"
              description="Try widening your search or clearing a filter to see more students."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((s) => (
                <UserCard key={s._id} user={s} onRequest={setRequestTarget} />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                  page === i + 1 ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!requestTarget} onClose={() => setRequestTarget(null)} title="Send Swap Request">
        {requestTarget && (
          <div>
            <div className="flex items-center gap-3">
              <img
                  src={
                      requestTarget.profileImage ||
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(requestTarget.name)
                  }
                  alt={requestTarget.name}
                  className="h-12 w-12 rounded-full object-cover"
              />
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
