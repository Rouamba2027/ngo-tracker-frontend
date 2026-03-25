import { useState } from "react";
import { useApp } from "../context/AppContext";
import { DarkToggle, LangToggle } from "../components/ui/Toggles";
import InputField from "../components/ui/InputField";
import { createUser } from "../api/api";

export default function Register() {
  const { t, dark, currentUser, setPage } = useApp();

  // Seul ADMIN peut accéder
  if (!currentUser || currentUser.role !== "ADMIN") {
    setPage("dash-admin");
    return null;
  }

  const [role, setRole] = useState("MANAGER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    { id: "MANAGER", label: t.typeManager, icon: "🧑‍💼" },
    { id: "VIEWER",  label: t.typeViewer,  icon: "👁️" },
  ];

  async function handleCreate() {
    if (!name || !email || !pass) return setError("Tous les champs sont requis.");
    if (pass.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.");
    setError("");
    try {
      const data = await createUser({ name, email, password: pass, role });
      setSuccess(`Utilisateur ${data.user.role} créé : ${data.user.email}`);
      setName(""); setEmail(""); setPass("");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la création de l'utilisateur.");
    }
  }

  return (
    <div className={`min-h-screen flex ${dark ? "bg-emerald-950" : "bg-emerald-50"}`}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className={`text-3xl font-bold mb-4 ${dark ? "text-white" : "text-emerald-900"}`}>
            Créer un utilisateur
          </h1>

          {/* Sélection du rôle */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase mb-2">Type de compte</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`py-2 px-2 rounded-xl border-2 text-center
                    ${role === r.id ? "border-amber-400 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
                  <div className="text-2xl">{r.icon}</div>
                  <div className="text-sm font-semibold">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Champs nom / email / mot de passe */}
          <InputField label="Nom complet" value={name} onChange={setName} placeholder="Nom complet" dark={dark} />
          <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="exemple@email.com" dark={dark} />
          <InputField label="Mot de passe" type="password" value={pass} onChange={setPass} placeholder="••••••••" dark={dark} />

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded">{success}</div>}

          <button
            onClick={handleCreate}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-bold"
          >
            Créer l'utilisateur
          </button>

          <p className="text-sm mt-4 text-center">
            <button onClick={() => setPage("dash-admin")} className="text-amber-600 font-semibold hover:underline">
              Retour au tableau de bord
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}