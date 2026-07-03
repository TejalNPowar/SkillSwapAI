import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[calc(100vh-64px)] flex-col items-center justify-center text-center page-enter">
      <p className="font-display text-7xl font-extrabold text-primary/20">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you\u2019re looking for doesn\u2019t exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <FiArrowLeft /> Back to Home
      </Link>
    </div>
  )
}
