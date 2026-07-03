// Small pill used to display a single skill name.
// kind: "offer" | "want" controls the color treatment.
export default function SkillTag({ label, kind = 'offer' }) {
  const className = kind === 'offer' ? 'skill-tag-offer' : 'skill-tag-want'
  return <span className={className}>{label}</span>
}
