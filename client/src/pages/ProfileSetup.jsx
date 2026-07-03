import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCamera, FiX, FiGithub, FiLinkedin, FiLink, FiPlus } from 'react-icons/fi'
import { updateProfile } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Evenings']

function TagInput({ tags, setTags, placeholder, colorClass }) {
  const [value, setValue] = useState('')

  const addTag = () => {
    const v = value.trim()
    if (v && !tags.includes(v)) setTags([...tags, v])
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field"
        />
        <button type="button" onClick={addTag} className="btn-outline px-3">
          <FiPlus size={16} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className={`${colorClass} flex items-center gap-1.5`}>
            {t}
            <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
              <FiX size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const [form, setForm] = useState({
    fullName: user?.name || '',
    bio: user?.bio || '',
    college: user?.college || '',
    department: user?.department || '',
    year: user?.year || '1st Year',
    experience: 'Intermediate',
    availability: [],
    github: user?.socials?.github || '',
    linkedin: user?.socials?.linkedin || '',
    portfolio: user?.socials?.portfolio || '',
  })
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || [])
  const [skillsWanted, setSkillsWanted] = useState(user?.skillsWanted || [])
  const [photoPreview, setPhotoPreview] = useState(user?.avatar || '')
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const toggleAvailability = (opt) => {
    setForm((f) => ({
      ...f,
      availability: f.availability.includes(opt)
        ? f.availability.filter((a) => a !== opt)
        : [...f.availability, opt],
    }))
  }

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (file) setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      skillsOffered,
      skillsWanted,
      avatar: photoPreview,
      socials: { github: form.github, linkedin: form.linkedin, portfolio: form.portfolio },
    }
    const res = await updateProfile(user?.id, payload)
    setUser?.((u) => ({ ...u, ...res.data }))
    setSaving(false)
    navigate('/dashboard')
  }

  return (
    <div className="container-page max-w-3xl py-12 page-enter">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-slate-900">Set up your profile</h1>
        <p className="mt-2 text-slate-500">Tell other students what you can teach and what you\u2019re hoping to learn.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-8 p-8">
        {/* Photo */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-soft" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiCamera size={26} />
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-soft">
              <FiCamera size={14} />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          </div>
          <p className="text-xs text-slate-400">Upload a profile photo</p>
        </div>

        {/* Basic info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label-field">Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Bio</label>
            <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} placeholder="A short line about what drives you..." className="input-field resize-none" />
          </div>
          <div>
            <label className="label-field">College</label>
            <input name="college" value={form.college} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">Department</label>
            <input name="department" value={form.department} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">Current Year</label>
            <select name="year" value={form.year} onChange={handleChange} className="input-field">
              {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Experience Level</label>
            <select name="experience" value={form.experience} onChange={handleChange} className="input-field">
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label-field">Skills I Can Teach</label>
            <TagInput tags={skillsOffered} setTags={setSkillsOffered} placeholder="e.g. React" colorClass="skill-tag-offer" />
          </div>
          <div>
            <label className="label-field">Skills I Want To Learn</label>
            <TagInput tags={skillsWanted} setTags={setSkillsWanted} placeholder="e.g. Photoshop" colorClass="skill-tag-want" />
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="label-field">Availability</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => toggleAvailability(opt)}
                className={`chip ${form.availability.includes(opt) ? 'chip-active' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Socials */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label-field">GitHub</label>
            <div className="relative">
              <FiGithub className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input name="github" value={form.github} onChange={handleChange} placeholder="username" className="input-field pl-11" />
            </div>
          </div>
          <div>
            <label className="label-field">LinkedIn</label>
            <div className="relative">
              <FiLinkedin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="username" className="input-field pl-11" />
            </div>
          </div>
          <div>
            <label className="label-field">Portfolio</label>
            <div className="relative">
              <FiLink className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="yoursite.com" className="input-field pl-11" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
