import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiUsers,
  FiBookOpen,
  FiTrendingUp,
  FiUserPlus,
  FiSearch,
  FiRepeat,
} from 'react-icons/fi'
import SkillCard from '../components/SkillCard.jsx'
import { popularSkills } from '../data/skills.js'

const FEATURES = [
  {
    icon: FiBookOpen,
    title: 'Teach Skills',
    desc: 'Share what you\u2019re good at — from React to public speaking — and build a teaching portfolio as you go.',
  },
  {
    icon: FiTrendingUp,
    title: 'Learn Skills',
    desc: 'Pick up new skills directly from peers who are actually using them, not just reading about them.',
  },
  {
    icon: FiUsers,
    title: 'Grow Network',
    desc: 'Every swap is a new connection. Build a circle of students across colleges who can vouch for you.',
  },
]

const STEPS = [
  { icon: FiUserPlus, title: 'Create Profile', desc: 'List what you can teach and what you want to learn.' },
  { icon: FiSearch, title: 'Find Students', desc: 'Browse matches based on skills, college, and availability.' },
  { icon: FiRepeat, title: 'Exchange Skills', desc: 'Schedule a session and swap knowledge — no money involved.' },
]

const TESTIMONIALS = [
  {
    name: 'Meera Joshi',
    role: 'CS Student, VIT Vellore',
    avatar: 'https://i.pravatar.cc/100?img=44',
    quote: 'I taught Excel for two weeks and walked away knowing enough Figma to redesign my own portfolio.',
  },
  {
    name: 'Arjun Das',
    role: 'EE Student, IIT Madras',
    avatar: 'https://i.pravatar.cc/100?img=33',
    quote: 'Found a DSA study partner in three days. We still pair up every weekend before contests.',
  },
  {
    name: 'Fatima Sheikh',
    role: 'Design Student, NID',
    avatar: 'https://i.pravatar.cc/100?img=48',
    quote: 'Traded UI critiques for Python help. It felt more honest than any paid course I\u2019ve tried.',
  },
]

export default function Landing() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              For students, by students
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Learn Faster. <span className="text-primary">Teach Smarter.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-slate-600 sm:text-lg">
              Exchange skills with students around the world — no fees, no middlemen, just knowledge for knowledge.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary px-6 py-3 text-base">
                Get Started <FiArrowRight />
              </Link>
              <Link to="/explore" className="btn-outline px-6 py-3 text-base">
                Explore Skills
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[12, 32, 8, 25].map((n) => (
                  <img key={n} src={`https://i.pravatar.cc/100?img=${n}`} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">2,400+</span> students already swapping skills
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -top-8 -left-8 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-10 -right-4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
            <div className="relative mx-auto w-full max-w-sm rounded-card border border-slate-100 bg-white p-6 shadow-softer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/100?img=47" className="h-11 w-11 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-display text-sm font-semibold text-slate-800">Tejal Mehra</p>
                    <p className="text-xs text-slate-500">VNIT Nagpur</p>
                  </div>
                </div>
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent-dark">Online</span>
              </div>
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Offering</p>
                <p className="mt-1 font-display text-sm font-semibold text-primary">React + UI/UX Design</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Wants to learn</p>
                <p className="mt-1 font-display text-sm font-semibold text-accent-dark">Machine Learning</p>
              </div>
              <button className="btn-primary mt-5 w-full">Request Swap</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900">Everything a skill exchange needs</h2>
          <p className="mt-3 text-slate-500">Three simple ideas, one platform.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 transition hover:-translate-y-1 hover:shadow-softer">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-800">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-500">Three steps from sign-up to your first swap.</p>
          </div>
          <div className="relative mt-14 grid gap-10 sm:grid-cols-3">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-slate-200 sm:block" />
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-glow">
                  <Icon size={22} />
                </div>
                <p className="mt-4 font-display text-base font-semibold text-slate-800">
                  {i + 1}. {title}
                </p>
                <p className="mt-1.5 max-w-[220px] text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular skills */}
      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900">Popular skills on the platform</h2>
          <p className="mt-3 text-slate-500">A glimpse of what students are teaching and learning right now.</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {popularSkills.map((s, i) => (
            <SkillCard key={s} name={s} index={i} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900">Students are talking</h2>
            <p className="mt-3 text-slate-500">Real swaps, real progress.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <p className="text-sm leading-relaxed text-slate-600">\u201c{t.quote}\u201d</p>
                <div className="mt-5 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="font-display text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-card bg-gradient-to-r from-primary to-secondary px-8 py-14 text-center text-white">
          <h2 className="font-display text-3xl font-bold">Ready to swap your first skill?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">Join thousands of students learning from each other, one swap at a time.</p>
          <Link to="/register" className="btn-accent mt-7 inline-flex px-7 py-3 text-base">
            Create your profile <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}
