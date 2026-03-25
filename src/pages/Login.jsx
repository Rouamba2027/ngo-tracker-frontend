import { useState } from "react";
import { useApp } from "../context/AppContext";
import { LogoText } from "../components/ui/Logo";
import { DarkToggle, LangToggle } from "../components/ui/Toggles";
import { login } from "../api/api";

export default function Login() {
  const { t, dark, setPage, setCurrentUser } = useApp();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !pass) {
      setError("Email et mot de passe sont requis.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await login({
        email,
        password: pass,
        orgCode: orgCode || undefined,
      });
      setCurrentUser(data.user);

      // Redirection selon le rôle
      const dashMap = { ADMIN: "dash-admin", MANAGER: "dash-manager", VIEWER: "dash-viewer" };
      setPage(dashMap[data.user.role]);
    } catch (err) {
      setError(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  async function demo() {
    // Optionnel : démo admin
    setEmail("admin@croixrouge.bf");
    setPass("Admin1234!");
    setOrgCode("NGO-BF-2026-0001");
    setError("");
    setLoading(true);
    try {
      const data = await login({
        email: "admin@croixrouge.bf",
        password: "Admin1234!",
        orgCode: "NGO-BF-2026-0001",
      });
      setCurrentUser(data.user);
      setPage("dash-admin");
    } catch (err) {
      setError(err.message || "Erreur de connexion démo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Panneau gauche */}
      <div className={`hidden lg:flex w-[42%] bg-gradient-to-br from-emerald-900 to-emerald-800 flex-col justify-center items-center p-12 relative overflow-hidden`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <LogoText dark />
          <div className="mt-12 mb-6 text-7xl">🌿</div>
          <h2 className="text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Bienvenue sur NGO Tracker
          </h2>
          <p className="text-emerald-300/70 text-sm leading-relaxed max-w-xs">
            Gérez vos projets, budgets et rapports en toute transparence.
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className={`flex-1 flex items-center justify-center p-8 ${dark ? "bg-emerald-950" : "bg-emerald-50"} transition-colors`}>
        <div className="w-full max-w-md">

          {/* Barre sup */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setPage("landing")}
              className={`text-sm font-medium transition-colors ${dark ? "text-emerald-400/70 hover:text-white" : "text-emerald-700/60 hover:text-emerald-900"}`}>
              ← Accueil
            </button>
            <div className="flex gap-2">
              <LangToggle />
              <DarkToggle />
            </div>
          </div>

          <h1 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-emerald-900"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Connexion
          </h1>
          <p className={`text-sm mb-8 ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
            Accédez à votre espace de gestion
          </p>

          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">⚠️ {error}</div>}

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
          />
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="Mot de passe"
            className="mb-4 w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
          />
          <input
            type="text"
            value={orgCode}
            onChange={e => setOrgCode(e.target.value.toUpperCase())}
            placeholder="Code ONG (Admin uniquement)"
            className="mb-6 w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
          />

          <button onClick={handleLogin} disabled={loading} className="w-full py-3.5 rounded-xl font-bold text-base bg-amber-400 hover:shadow-lg transition-all">
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {/* Démo */}
          <button onClick={demo} disabled={loading} className="w-full py-2.5 mt-4 rounded-lg text-xs font-semibold border">
            👑 Connexion Admin démo
          </button>

          <p className="text-center text-sm mt-5">
            Pas encore de compte ?{" "}
            <button onClick={() => setPage("register-ong")} className="text-amber-600 font-semibold hover:underline">
              Créer une ONG
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}