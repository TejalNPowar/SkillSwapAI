import { FiX } from 'react-icons/fi'

// Generic centered modal. Render conditionally from the parent with `open`.
export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-fadeUp rounded-card bg-white p-6 shadow-softer">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-600" aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
