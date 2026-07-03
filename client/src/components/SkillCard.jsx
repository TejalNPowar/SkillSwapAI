const ICON_BG = [
  'bg-primary/10 text-primary',
  'bg-accent/10 text-accent-dark',
  'bg-secondary/10 text-secondary',
]

// Used on the landing page "Popular Skills" section.
export default function SkillCard({ name, index = 0 }) {
  const colorClass = ICON_BG[index % ICON_BG.length]
  return (
    <span
      className={`inline-flex cursor-default items-center rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-soft ${colorClass}`}
    >
      {name}
    </span>
  )
}
