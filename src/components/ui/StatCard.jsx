// ─────────────────────────────────────────
// StatCard — Carte KPI du dashboard
// Props : icon, iconBg, value, label,
//         trend, trendUp, dark
// ─────────────────────────────────────────
export default function StatCard({
  icon,
  iconBg,
  value,
  label,
  trend,
  trendUp,
  dark,
}) {
  return (
    <div
      className={`rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-xl
        ${dark
          ? "bg-emerald-900/40 border-emerald-800 hover:shadow-emerald-950/60"
          : "bg-white border-emerald-100 hover:shadow-emerald-100"}`}
    >
      {/* Icon + badge tendance */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-lg
              ${trendUp
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-600"}`}
          >
            {trend}
          </span>
        )}
      </div>

      {/* Valeur principale */}
      <div
        className={`text-3xl font-black mb-1
          ${dark ? "text-amber-300" : "text-emerald-900"}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {value}
      </div>

      {/* Label */}
      <div className={`text-sm ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
        {label}
      </div>
    </div>
  );
}
