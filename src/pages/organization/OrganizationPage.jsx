import { useApp } from "../../context/AppContext";
import { getOrganization, updateOrganization } from "../../api/api";
import { useState, useEffect } from "react";
import DashShell from "../../components/layout/DashShell";

const adminNavItems = (t) => [
  { section: t.dashboard },
  { icon: "📊", label: t.dashboard },
  { icon: "🗂️", label: t.projects },
  { icon: "💰", label: t.budget },
  { icon: "📄", label: t.reports },
  { section: "Admin" },
  { icon: "👥", label: t.users },
  { icon: "🏢", label: t.organization, active: true },
];

export default function OrganizationPage() {
  const { t, dark, currentUser } = useApp();
  const [org, setOrg] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const role = currentUser?.role || "VIEWER";

  useEffect(() => {
    getOrganization()
      .then(data => { setOrg(data.organization); setName(data.organization.name); })
      .finally(() => setLoading(false));
  }, []);

  if (role !== "ADMIN") return (
    <DashShell role={role} navItems={[]}>
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <span className="text-5xl">⛔</span>
        <p className="text-red-500 font-semibold text-lg">Accès réservé aux administrateurs.</p>
      </div>
    </DashShell>
  );

  async function handleSave() {
    setSaving(true);
    try {
      const data = await updateOrganization({ name });
      setOrg(data.organization);
      setSuccess("Organisation mise à jour !");
      setTimeout(() => setSuccess(""), 3000);
    } catch(err) { alert(err.message); }
    finally { setSaving(false); }
  }

  return (
    <DashShell role="ADMIN" navItems={adminNavItems(t)}>
      <h2 className={`text-2xl font-bold mb-6 ${dark ? "text-white" : "text-emerald-900"}`}
        style={{ fontFamily: "'Playfair Display', serif" }}>
        {t.organization}
      </h2>

      {loading && <div className={`text-center py-20 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>Chargement...</div>}

      {org && (
        <div className={`rounded-2xl border p-6 max-w-lg ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
          <div className="mb-5">
            <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>Code ONG</div>
            <div className={`font-mono font-bold text-lg ${dark ? "text-amber-300" : "text-amber-600"}`}>{org.orgCode}</div>
          </div>
          <div className="mb-5">
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>Nom</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${dark ? "bg-emerald-950/50 border-emerald-800 text-white focus:border-amber-400" : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`} />
          </div>
          <div className="mb-5">
            <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>Membres</div>
            <div className={`font-bold text-2xl ${dark ? "text-white" : "text-emerald-900"}`}>{org.memberCount}</div>
          </div>
          {success && <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">✅ {success}</div>}
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-all disabled:opacity-50">
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      )}
    </DashShell>
  );
}