import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/AuthContext.jsx'
import { login as loginApi } from '../services/api.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await loginApi(form)
    await login(form)
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="container-page flex min-h-[calc(100vh-64px)] items-center justify-center py-12 page-enter">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-slate-500">Log in to keep swapping skills.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="label-field">Email</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30" />
              Remember me
            </label>
            <a href="#" className="font-medium text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-400">OR</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        <button type="button" className="btn-outline w-full py-3">
          <FcGoogle size={18} /> Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-slate-500">
          Don\u2019t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
