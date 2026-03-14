import { useApp } from "../context/AppContext";
import DashShell from "../components/layout/DashShell";
import StatCard from "../components/ui/StatCard";
import ProjectsTable from "../components/ui/ProjectsTable";

export default function DashViewer() {
  const { t, dark } = useApp();

  const navItems = [
    { section: t.viewerSpace },
    { icon: "📊", label: t.dashboard, active: true },
    { icon: "🗂️", label: t.myProjects },
    { icon: "💰", label: t.budget },
    { icon: "📄", label: t.myReports },
  ];

  return (
    <DashShell role="VIEWER" navItems={navItems}>
      <div className={`flex items-center gap-3 p-4 rounded-xl border mb-5
        ${dark ? "bg-blue-900/30 border-blue-800 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
        <span className="text-xl">👁️</span>
        <span className="text-sm">Accès lecture seule — vous pouvez consulter les projets, dépenses et rapports.</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon="🗂️" iconBg={dark ? "bg-emerald-900/50" : "bg-emerald-100"} value="5" label={t.activeProjects} dark={dark} />
        <StatCard icon="💰" iconBg={dark ? "bg-amber-900/20" : "bg-amber-50"} value="35.2M" label={t.totalBudget} dark={dark} />
        <StatCard icon="📄" iconBg={dark ? "bg-emerald-900/30" : "bg-emerald-50"} value="3" label={t.reports} dark={dark} />
      </div>

      <ProjectsTable showActions={false} />
    </DashShell>
  );
}