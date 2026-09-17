export default function StatCard({
  icon,
  title,
  value,
  color,
}) {
  return (

    <div className="card p-5 flex items-center gap-4 hover:scale-[1.02] transition">

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color}`}
      >
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h2 className="text-2xl font-bold text-slate-800">
          {value}
        </h2>

      </div>

    </div>

  );
}