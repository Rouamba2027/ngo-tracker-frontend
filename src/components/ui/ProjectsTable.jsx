import { useApp } from "../../context/AppContext";

// ─────────────────────────────────────────
// ProjectsTable — Tableau des projets
// Props : showActions (bool)
// ─────────────────────────────────────────
export default function ProjectsTable({ showActions = true }) {
  const { t, dark } = useApp();

  const projects = [
    { name: "Vaccination Zone Nord",   domain: t.health,    budget: "12 500 000", spent: "8 200 000",  pct: 66,  status: "active"  },
    { name: "Forage villages Sahel",   domain: t.water,     budget: "8 000 000",  spent: "9 200 000",  pct: 115, status: "pending" },
    { name: "Écoles primaires Bobo",   domain: t.education, budget: "15 000 000", spent: "15 000 000", pct: 100, status: "done"    },
    { name: "Nutrition enfants Ouaga", domain: t.health,    budget: "7 000 000",  spent: "2 100 000",  pct: 30,  status: "active"  },
  ];

  const statusMap = {
    active:  "bg-emerald-100 text-emerald-700",
    pending: "bg-orange-100 text-orange-700",
    done:    "bg-blue-100 text-blue-700",
  };

  const statusLabel = {
    active:  t.active,
    pending: t.pending,
    done:    t.done,
  };

  const headers = [
    t.recentProjects.replace("récents", "").replace("Recent", ""),
    t.domain, t.allocated, t.spent, t.progress, t.status,
    ...(showActions ? [t.actions] : []),
  ];

  return (
    <div className={`rounded-2xl border overflow-hidden
      ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>

      {/* En-tête carte */}
      <div className={`flex items-center justify-between px-6 py-4 border-b
        ${dark ? "border-emerald-800" : "border-emerald-50"}`}>
        <h3 className={`font-bold text-base
          ${dark ? "text-amber-300" : "text-emerald-900"}`}>
          {t.recentProjects}
        </h3>
        {showActions && (
          <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            {t.newProject}
          </button>
        )}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-xs uppercase tracking-widest font-semibold
              ${dark
                ? "bg-emerald-950/50 text-emerald-600"
                : "bg-emerald-50 text-emerald-600/70"}`}>
              {headers.map((h, i) => (
                <th key={i} className="px-5 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {projects.map((p, i) => (
              <tr
                key={i}
                className={`border-t transition-colors
                  ${dark
                    ? "border-emerald-800/50 hover:bg-emerald-800/20"
                    : "border-emerald-50 hover:bg-emerald-50"}`}
              >
                {/* Nom du projet */}
                <td className="px-5 py-4">
                  <div className={`font-semibold text-sm
                    ${dark ? "text-white" : "text-emerald-900"}`}>
                    {p.name}
                  </div>
                </td>

                {/* Domaine */}
                <td className={`px-5 py-4 text-sm
                  ${dark ? "text-emerald-400/70" : "text-emerald-700/60"}`}>
                  {p.domain}
                </td>

                {/* Budget alloué */}
                <td className={`px-5 py-4 text-sm font-mono
                  ${dark ? "text-emerald-300" : "text-emerald-800"}`}>
                  {p.budget}
                </td>

                {/* Dépensé */}
                <td className={`px-5 py-4 text-sm font-mono font-semibold
                  ${p.pct > 100 ? "text-red-500" : dark ? "text-emerald-300" : "text-emerald-800"}`}>
                  {p.spent}
                </td>

                {/* Progression */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-1.5 rounded-full min-w-16
                      ${dark ? "bg-emerald-900" : "bg-emerald-100"}`}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(p.pct, 100)}%`,
                          background:
                            p.pct > 100 ? "#ef4444"
                            : p.pct > 80 ? "#f59e0b"
                            : "#10b981",
                        }}
                      />
                    </div>
                    <span className={`text-xs font-semibold
                      ${p.pct > 100 ? "text-red-500"
                        : dark ? "text-emerald-400/70" : "text-emerald-600/70"}`}>
                      {p.pct > 100 ? t.exceeded : p.pct + "%"}
                    </span>
                  </div>
                </td>

                {/* Statut */}
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold
                    px-2.5 py-1 rounded-full ${statusMap[p.status]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {statusLabel[p.status]}
                  </span>
                </td>

                {/* Actions */}
                {showActions && (
                  <td className="px-5 py-4 text-lg">✏️ 📄</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
