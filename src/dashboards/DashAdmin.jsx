import { useApp } from "../context/AppContext";
import DashShell from "../components/layout/DashShell";
import StatCard from "../components/ui/StatCard";
import ProjectsTable from "../components/ui/ProjectsTable";

// ─────────────────────────────────────────
// DashAdmin — Dashboard Administrateur
// Accès complet : stats, graphiques,
// projets, alertes, FAB
// ─────────────────────────────────────────
export default function DashAdmin() {
  const { t, dark } = useApp();

  const navItems = [
    { section: t.dashboard },
    { icon: "📊", label: t.dashboard,    active: true },
    { icon: "🗂️", label: t.projects,    badge: "8"   },
    { icon: "💰", label: t.budget                     },
    { icon: "📄", label: t.reports                    },
    { section: "Admin" },
    { icon: "👥", label: t.users        },
    { icon: "🏢", label: t.organization },
    { icon: "⚙️", label: t.settings    },
  ];

  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"];
  const vals   = [55, 70, 45, 85, 62, 75];

  const alerts = [
    { icon: "🚨", title: "Forage villages Sahel",    sub: "9.2M / 8M FCFA — Budget dépassé",   pct: "+15%", color: "red"    },
    { icon: "⚠️", title: "Vaccination Zone Nord",    sub: "8.2M / 12.5M FCFA — Seuil atteint", pct: "66%",  color: "orange" },
    { icon: "✅", title: "Nutrition enfants Ouaga",  sub: "2.1M / 7M FCFA — Sous contrôle",    pct: "30%",  color: "green"  },
  ];

  const donutLegend = [
    [t.health,    "#1a3c2e", "40%"],
    [t.education, "#c9a84c", "25%"],
    [t.water,     "#3d7a5a", "20%"],
    [t.others,    "#e67e22", "15%"],
  ];

  return (
    <DashShell role="ADMIN" navItems={navItems}>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon="🗂️" iconBg={dark ? "bg-emerald-900/50" : "bg-emerald-100"} value="8"     label={t.activeProjects} trend="+2"     trendUp dark={dark} />
        <StatCard icon="💰" iconBg={dark ? "bg-amber-900/30"   : "bg-amber-50"}    value="42.5M" label={t.totalBudget}    trend="+12%"   trendUp dark={dark} />
        <StatCard icon="✅" iconBg={dark ? "bg-blue-900/30"    : "bg-blue-50"}     value="5"     label={t.completed}      trend="+3"     trendUp dark={dark} />
        <StatCard icon="⚠️" iconBg={dark ? "bg-red-900/30"    : "bg-red-50"}      value="2"     label={t.overBudget}     trend="Urgent" trendUp={false} dark={dark} />
      </div>

      {/* ── Graphiques ── */}
      <div className="grid grid-cols-3 gap-5 mb-6">

        {/* Graphique barres — dépenses mensuelles */}
        <div className={`col-span-2 rounded-2xl border p-5
          ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`font-bold text-base
              ${dark ? "text-amber-300" : "text-emerald-900"}`}>
              {t.monthlyExpenses}
            </h3>
            <span className={`text-xs cursor-pointer hover:text-amber-500 transition-colors
              ${dark ? "text-emerald-600" : "text-emerald-500/60"}`}>
              {t.viewDetails}
            </span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {months.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all hover:opacity-80 relative overflow-hidden"
                  style={{
                    height: `${vals[i]}%`,
                    background: vals[i] === 85
                      ? "linear-gradient(180deg,#c9a84c,#e8c97a)"
                      : "linear-gradient(180deg,#3d7a5a,#1a3c2e)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)",
                      animation: "shimmer 2s infinite",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </div>
                <span className={`text-xs
                  ${dark ? "text-emerald-600" : "text-emerald-500/60"}`}>
                  {m}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut — répartition budgets */}
        <div className={`rounded-2xl border p-5
          ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
          <h3 className={`font-bold text-base mb-4
            ${dark ? "text-amber-300" : "text-emerald-900"}`}>
            {t.budgetShare}
          </h3>

          {/* SVG Donut */}
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="-rotate-90" viewBox="0 0 42 42" width="112" height="112">
              <circle cx="21" cy="21" r="15.91" fill="none"
                stroke={dark ? "#052e16" : "#f0fdf4"} strokeWidth="5" />
              <circle cx="21" cy="21" r="15.91" fill="none"
                stroke="#1a3c2e" strokeWidth="5" strokeDasharray="40 60" />
              <circle cx="21" cy="21" r="15.91" fill="none"
                stroke="#c9a84c" strokeWidth="5" strokeDasharray="25 75" strokeDashoffset="-40" />
              <circle cx="21" cy="21" r="15.91" fill="none"
                stroke="#3d7a5a" strokeWidth="5" strokeDasharray="20 80" strokeDashoffset="-65" />
              <circle cx="21" cy="21" r="15.91" fill="none"
                stroke="#e67e22" strokeWidth="5" strokeDasharray="15 85" strokeDashoffset="-85" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-xl font-black ${dark ? "text-amber-300" : "text-emerald-900"}`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                8
              </span>
              <span className={`text-xs ${dark ? "text-emerald-600" : "text-emerald-500/60"}`}>
                projets
              </span>
            </div>
          </div>

          {/* Légende donut */}
          <div className="space-y-2">
            {donutLegend.map(([l, c, v]) => (
              <div key={l} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                  <span className={dark ? "text-emerald-400/70" : "text-emerald-700/70"}>{l}</span>
                </div>
                <span className={`font-semibold ${dark ? "text-amber-300" : "text-emerald-900"}`}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tableau projets ── */}
      <ProjectsTable showActions />

      {/* ── Alertes budgétaires ── */}
      <div className={`mt-5 rounded-2xl border p-5
        ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
        <h3 className={`font-bold text-base mb-4
          ${dark ? "text-amber-300" : "text-emerald-900"}`}>
          {t.budgetAlerts}
        </h3>
        <div className="space-y-3">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-4 rounded-xl border-l-4
                ${a.color === "red"    ? "bg-red-50    border-red-500"
                : a.color === "orange" ? "bg-orange-50 border-orange-400"
                :                       "bg-emerald-50 border-emerald-400"}`}
            >
              <span className="text-xl">{a.icon}</span>
              <div className="flex-1">
                <div className={`font-semibold text-sm
                  ${dark ? "text-white" : "text-emerald-900"}`}>
                  {a.title}
                </div>
                <div className={`text-xs mt-0.5
                  ${dark ? "text-emerald-600" : "text-emerald-600/70"}`}>
                  {a.sub}
                </div>
              </div>
              <span className={`font-bold text-sm
                ${a.color === "red"    ? "text-red-500"
                : a.color === "orange" ? "text-orange-500"
                :                       "text-emerald-500"}`}>
                {a.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAB — bouton flottant ── */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br
        from-emerald-700 to-emerald-600 text-white text-2xl rounded-full
        shadow-xl shadow-emerald-700/40 hover:scale-105 hover:shadow-2xl
        transition-all flex items-center justify-center">
        ＋
      </button>
    </DashShell>
  );
}
