import { useApp } from "../../context/AppContext";
import { getUsers, deleteUser } from "../../api/api";
import { useState, useEffect } from "react";
import DashShell from "../../components/layout/DashShell";

const adminNavItems = (t) => [
  { section: t.dashboard },
  { icon: "📊", label: t.dashboard },
  { icon: "🗂️", label: t.projects },
  { icon: "💰", label: t.budget },
  { icon: "📄", label: t.reports },
  { section: "Admin" },
  { icon: "👥", label: t.users, active: true },
  { icon: "🏢", label: t.organization },
];

export default function UsersPage() {
  const { t, dark, currentUser } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "MANAGER" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [creating, setCreating] = useState(false);
  const role = currentUser?.role || "VIEWER";

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data.users || []))
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

  async function handleDelete(id) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => (u.id || u._id) !== id));
    } catch(err) { alert(err.message); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setFormError("Tous les champs sont requis.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setFormError("");
    setCreating(true);
    try {
      const token = localStorage.getItem("ngo_token");
      const res = await fetch(
        (import.meta.env?.VITE_API_URL || "http://localhost:5000/api") + "/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la création.");
      setUsers(prev => [...prev, data.user]);
      setFormSuccess(`Compte ${form.role} créé pour ${form.name} !`);
      setForm({ name: "", email: "", password: "", role: "MANAGER" });
      setTimeout(() => { setFormSuccess(""); setShowForm(false); }, 2000);
    } catch(err) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  }

  const roleColor = {
    ADMIN:   "bg-amber-100 text-amber-700",
    MANAGER: "bg-emerald-100 text-emerald-700",
    VIEWER:  "bg-blue-100 text-blue-700",
  };

  return (
    <DashShell role="ADMIN" navItems={adminNavItems(t)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-emerald-900"}`}
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {t.users}
        </h2>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(""); setFormSuccess(""); }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all"
        >
          {showForm ? "✕ Annuler" : "+ Nouveau membre"}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className={`mb-6 rounded-2xl border p-6 ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
          <h3 className={`font-bold text-lg mb-4 ${dark ? "text-white" : "text-emerald-900"}`}>
            Créer un nouveau membre
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-1 ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
                Nom complet
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Nom complet"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${dark ? "bg-emerald-950/50 border-emerald-800 text-white" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-1 ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="email@organisation.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${dark ? "bg-emerald-950/50 border-emerald-800 text-white" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-1 ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
                Mot de passe
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Minimum 8 caractères"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${dark ? "bg-emerald-950/50 border-emerald-800 text-white" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-1 ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
                Rôle
              </label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${dark ? "bg-emerald-950/50 border-emerald-800 text-white" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}
              >
                <option value="MANAGER">🧑‍💼 Manager</option>
                <option value="VIEWER">👁️ Viewer</option>
              </select>
            </div>
            {formError && (
              <div className="md:col-span-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                ⚠️ {formError}
              </div>
            )}
            {formSuccess && (
              <div className="md:col-span-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                ✅ {formSuccess}
              </div>
            )}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                {creating ? "Création..." : "Créer le compte"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className={`text-center py-20 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>Chargement...</div>}

      <div className="grid gap-3">
        {users.map(u => (
          <div key={u.id || u._id} className={`rounded-2xl border p-4 flex items-center justify-between ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${dark ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                {u.name?.[0] || "?"}
              </div>
              <div>
                <div className={`font-semibold text-sm ${dark ? "text-white" : "text-emerald-900"}`}>{u.name}</div>
                <div className={`text-xs ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>{u.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColor[u.role]}`}>{u.role}</span>
              {u.role !== "ADMIN" && (
                <button onClick={() => handleDelete(u.id || u._id)}
                  className="text-red-400 hover:text-red-600 text-sm transition-colors">🗑️</button>
              )}
            </div>
          </div>
        ))}
        {!loading && users.length === 0 && (
          <div className={`text-center py-20 ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>
            Aucun membre. Cliquez sur "+ Nouveau membre" pour en ajouter.
          </div>
        )}
      </div>
    </DashShell>
  );
}
