import { useApp } from "../context/AppContext";
import DashShell from "../components/layout/DashShell";
import StatCard from "../components/ui/StatCard";
import ProjectsTable from "../components/ui/ProjectsTable";

export default function DashManager() {
  const { t, dark } = useApp();

  const navItems = [
    { section: t.managerSpace },
    { icon: "📊", label: t.dashboard,  active: true },
    { icon: "🗂️", label: t.myProjects },
    { icon: "💰", label: t.addExpense  },
    { icon: "📄", label: t.myReports  },
  ];

  return (
    <DashShell role="MANAGER" navItems={navItems}>
      <div className={`flex items-center gap-3 p-4 rounded-xl border mb-5
        ${dark ? "bg-emerald-900/30 border-emerald-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
        <span className="text-xl">ℹ️</span>
        <span className="text-sm">{t.restrictedMsg}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon="🗂️" iconBg={dark ? "bg-emerald-900/50" : "bg-emerald-100"} value="3" label={t.myProjects} dark={dark} />
        <StatCard icon="⚠️" iconBg={dark ? "bg-red-900/20" : "bg-red-50"} value="1" label={t.overBudget} trend="Urgent" trendUp={false} dark={dark} />
        <StatCard icon="📄" iconBg={dark ? "bg-emerald-900/30" : "bg-emerald-50"} value="4" label={t.reports} dark={dark} />
      </div>

      <ProjectsTable showActions={true} role="MANAGER" />
    </DashShell>
  );
}