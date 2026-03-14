import { useApp } from "../../context/AppContext";
import { getProjects, deleteProject } from "../../api/api";
import { useState, useEffect } from "react";
import DashShell from "../../components/layout/DashShell";
import ProjectModal from "../../components/ui/ProjectModal";
import ProjectEditModal from "../../components/ui/ProjectEditModal";

export default function ProjectsPage() {
  const { t, dark, currentUser } = useApp();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    getProjects()
      .then(data => setProjects(data.projects || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const role = currentUser?.role || "VIEWER";

  const navItems = role === "ADMIN" ? [
    { section: t.dashboard },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.projects, active: true },
    { icon: "💰", label: t.budget },
    { icon: "📄", label: t.reports },
    { section: "Admin" },
    { icon: "👥", label: t.users },
    { icon: "🏢", label: t.organization },
  ] : role === "MANAGER" ? [
    { section: t.managerSpace },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.myProjects, active: true },
    { icon: "💰", label: t.addExpense },
    { icon: "📄", label: t.myReports },
  ] : [
    { section: t.viewerSpace },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.myProjects, active: true },
    { icon: "💰", label: t.budget },
    { icon: "📄", label: t.myReports },
  ];

  const statusColor = {
    active:   "bg-emerald-100 text-emerald-700",
    pending:  "bg-orange-100 text-orange-700",
    done:     "bg-blue-100 text-blue-700",
    exceeded: "bg-red-100 text-red-700",
  };

  async function handleDelete(id) {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(x => (x.id || x._id) !== id));
    } catch(err) { alert(err.message); }
  }

  return (
    <DashShell role={role} navItems={navItems}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-emerald-900"}`}
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {t.projects}
        </h2>
        {role !== "VIEWER" && (
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all">
            + {t.newProject}
          </button>
        )}
      </div>

      {loading && <div className={`text-center py-20 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>Chargement...</div>}
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-4">
          {projects.map(p => (
            <div key={p.id || p._id} className={`rounded-2xl border p-5 ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`font-bold text-base ${dark ? "text-white" : "text-emerald-900"}`}>{p.name}</h3>
                  <p className={`text-sm mt-0.5 ${dark ? "text-emerald-400/70" : "text-emerald-600/60"}`}>{p.domain}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[p.status] || statusColor.active}`}>
                    {p.status}
                  </span>
                  {role !== "VIEWER" && (
                    <button onClick={() => setEditProject(p)}
                      className={`text-xs px-2 py-1 rounded-lg transition-all ${dark ? "text-emerald-400 hover:bg-emerald-800" : "text-emerald-600 hover:bg-emerald-50"}`}>
                      ✏️
                    </button>
                  )}
                  {role === "ADMIN" && (
                    <button onClick={() => handleDelete(p.id || p._id)}
                      className={`text-xs px-2 py-1 rounded-lg transition-all ${dark ? "text-red-400 hover:bg-red-900/20" : "text-red-500 hover:bg-red-50"}`}>
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className={dark ? "text-emerald-400/60" : "text-emerald-600/60"}>Alloué : </span>
                  <span className={`font-semibold ${dark ? "text-white" : "text-emerald-900"}`}>
                    {(p.budgetAllocated || 0).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <div>
                  <span className={dark ? "text-emerald-400/60" : "text-emerald-600/60"}>Dépensé : </span>
                  <span className={`font-semibold ${p.budgetPct > 100 ? "text-red-500" : dark ? "text-emerald-300" : "text-emerald-700"}`}>
                    {(p.budgetSpent || 0).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <div className="flex-1">
                  <div className={`h-2 rounded-full ${dark ? "bg-emerald-900" : "bg-emerald-100"}`}>
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(p.budgetPct || 0, 100)}%`,
                        background: p.budgetPct > 100 ? "#ef4444" : p.budgetPct > 80 ? "#f59e0b" : "#10b981"
                      }} />
                  </div>
                </div>
                <span className={`text-xs font-bold ${p.budgetPct > 100 ? "text-red-500" : dark ? "text-emerald-300" : "text-emerald-700"}`}>
                  {p.budgetPct || 0}%
                </span>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className={`text-center py-20 ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>
              Aucun projet trouvé.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onSaved={(project) => setProjects(prev => [project, ...prev])}
        />
      )}

      {editProject && (
        <ProjectEditModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onSaved={(updated) => {
            setProjects(prev => prev.map(p => (p.id || p._id) === (updated.id || updated._id) ? updated : p));
            setEditProject(null);
          }}
        />
      )}
    </DashShell>
  );
}