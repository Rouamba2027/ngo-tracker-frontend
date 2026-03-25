import { useApp } from "../../context/AppContext";
import { getUsers, deleteUser, createUser } from "../../api/api";
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

  // ✅ Nouveaux states pour création
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleInput, setRoleInput] = useState("MANAGER");

  const role = currentUser?.role || "VIEWER";

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data.users || []))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Création utilisateur
  async function handleCreateUser() {
    if (!name || !email || !password) {
      return alert("Remplis tous les champs");
    }

    try {
      const data = await createUser({
        name,
        email,
        password,
        role: roleInput,
      });

      setUsers(prev => [...prev, data.user]);

      setName("");
      setEmail("");
      setPassword("");

      alert("Utilisateur créé !");
    } catch (err) {
      alert(err.message);
    }
  }

  // ❌ Suppression utilisateur
  async function handleDelete(id) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => (u.id || u._id) !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (role !== "ADMIN") return (
    <DashShell role={role} navItems={[]}>
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <span className="text-5xl">⛔</span>
        <p className="text-red-500 font-semibold text-lg">
          Accès réservé aux administrateurs.
        </p>
      </div>
    </DashShell>
  );

  const roleColor = {
    ADMIN: "bg-amber-100 text-amber-700",
    MANAGER: "bg-emerald-100 text-emerald-700",
    VIEWER: "bg-blue-100 text-blue-700",
  };

  return (
    <DashShell role="ADMIN" navItems={adminNavItems(t)}>
      
      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-bold ${dark ? "text-white" : "text-emerald-900"}`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.users}
        </h2>
      </div>

      {/* 🔥 FORMULAIRE CREATION */}
      <div className={`mb-6 p-4 rounded-2xl border ${
        dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"
      }`}>
        <h3 className="font-bold mb-3">➕ Créer un utilisateur</h3>

        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="MANAGER">MANAGER</option>
            <option value="VIEWER">VIEWER</option>
          </select>

          <button
            onClick={handleCreateUser}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
          >
            Créer
          </button>
        </div>
      </div>

      {/* 🔄 LOADING */}
      {loading && (
        <div className={`text-center py-20 ${
          dark ? "text-emerald-400" : "text-emerald-600"
        }`}>
          Chargement...
        </div>
      )}

      {/* 👥 LISTE USERS */}
      <div className="grid gap-3">
        {users.map(u => (
          <div
            key={u.id || u._id}
            className={`rounded-2xl border p-4 flex items-center justify-between ${
              dark
                ? "bg-emerald-900/40 border-emerald-800"
                : "bg-white border-emerald-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                dark ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800"
              }`}>
                {u.name?.[0] || "?"}
              </div>

              <div>
                <div className={`font-semibold text-sm ${
                  dark ? "text-white" : "text-emerald-900"
                }`}>
                  {u.name}
                </div>
                <div className={`text-xs ${
                  dark ? "text-emerald-400/60" : "text-emerald-600/60"
                }`}>
                  {u.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                roleColor[u.role]
              }`}>
                {u.role}
              </span>

              <button
                onClick={() => handleDelete(u.id || u._id)}
                className="text-red-400 hover:text-red-600 text-sm transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashShell>
  );
}