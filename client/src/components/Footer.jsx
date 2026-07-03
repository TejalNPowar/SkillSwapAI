import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
              S
            </span>
            <span className="font-display text-lg font-bold text-slate-800">SkillSwap AI</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            A place where students trade what they know for what they want to learn.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-primary hover:text-white">
              <FiGithub size={16} />
            </a>
            <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-primary hover:text-white">
              <FiLinkedin size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-slate-800">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Careers</a></li>
            <li><a href="#" className="hover:text-primary">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-slate-800">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><a href="#" className="hover:text-primary">Privacy</a></li>
            <li><a href="#" className="hover:text-primary">Terms</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-slate-800">Get in touch</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><a href="#" className="hover:text-primary">Contact</a></li>
            <li><a href="#" className="hover:text-primary">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} SkillSwap AI. Built for students, by students.
      </div>
    </footer>
  )
}
