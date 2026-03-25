import { useState } from "react";
import { useApp } from "../context/AppContext";
import { LogoText } from "../components/ui/Logo";
import { DarkToggle, LangToggle } from "../components/ui/Toggles";
import { login } from "../api/api";

export default function Login() {
  const { t, dark, setPage, setCurrentUser } = useApp();

  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !pass) return setError("Email et mot de passe sont requis.");
    setError("");
    setLoading(true);
    try {
      const data = await login({ email, password: pass, orgCode: orgCode || undefined });
      setCurrentUser(data.user);
      const dashMap = { ADMIN: "dash-admin", MANAGER: "dash-manager", VIEWER: "dash-viewer" };
      setPage(dashMap[data.user.role]);
    } catch (err) {
      setError(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  async function demo() {
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
      const dashMap = { ADMIN: "dash-admin", MANAGER: "dash-manager", VIEWER: "dash-viewer" };
      setPage(dashMap[data.user.role]);
    } catch (err) {
      setError(err.message || "Erreur de connexion démo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Panneau gauche */}
      <div className={`hidden lg:flex w-[42%] bg-gradient-to-br from-emerald-900 to-emerald-800
        flex-col justify-center items-center p-12 relative overflow-hidden`}>
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
          <div className="mt-10 space-y-4 text-left w-full max-w-xs">
            {[
              ["Email", "Votre identifiant personnel"],
              ["Mot de passe", "Votre mot de passe sécurisé"],
              ["Code ONG", "Requis uniquement pour les Admins"],
            ].map(([k, v], i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400/70 mt-1.5 shrink-0" />
                <div>
                  <div className="text-white text-sm font-semibold">{k}</div>
                  <div className="text-white/40 text-xs">{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className={`flex-1 flex items-center justify-center p-8
        ${dark ? "bg-emerald-950" : "bg-emerald-50"} transition-colors`}>
        <div className="w-full max-w-md">

          {/* Barre sup */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setPage("landing")}
              className={`text-sm font-medium transition-colors
                ${dark ? "text-emerald-400/70 hover:text-white" : "text-emerald-700/60 hover:text-emerald-900"}`}>
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

          {/* Email */}
          <div className="mb-4">
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2
              ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                ${dark ? "bg-emerald-950/50 border-emerald-800 text-white placeholder-emerald-700 focus:border-amber-400"
                       : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`}
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-4">
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2
              ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
              Mot de passe
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                ${dark ? "bg-emerald-950/50 border-emerald-800 text-white placeholder-emerald-700 focus:border-amber-400"
                       : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`}
            />
          </div>

          {/* Code ONG — optionnel pour Admin */}
          <div className={`mb-6 p-4 rounded-xl border-2 border-dashed border-amber-300/50 transition-all
            ${dark ? "bg-amber-900/10" : "bg-amber-50/50"}`}>
            <label className="block text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
              🏢 Code ONG <span className="text-amber-400/60 font-normal">(Admin uniquement)</span>
            </label>
            <input
              value={orgCode}
              onChange={e => setOrgCode(e.target.value.toUpperCase())}
              placeholder="NGO-BF-2025-0042"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm font-mono font-semibold
                tracking-widest outline-none transition-all
                ${dark ? "bg-emerald-950/60 border-amber-700/40 text-amber-200 placeholder-emerald-700 focus:border-amber-400"
                       : "bg-white border-amber-200 text-amber-800 placeholder-amber-300 focus:border-amber-400"}`}
            />
            <p className="text-xs text-amber-600/60 mt-1.5">Laissez vide si vous êtes Manager ou Viewer</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-base bg-gradient-to-r
              from-amber-400 to-amber-300 text-emerald-900 hover:shadow-lg hover:-translate-y-0.5
              transition-all disabled:opacity-50">
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {/* Démo */}
          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${dark ? "bg-emerald-800" : "bg-emerald-100"}`} />
            <span className={`text-xs ${dark ? "text-emerald-600" : "text-emerald-500/70"}`}>
              Compte démo
            </span>
            <div className={`flex-1 h-px ${dark ? "bg-emerald-800" : "bg-emerald-100"}`} />
          </div>

          <button onClick={demo} disabled={loading}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold border transition-all
              ${dark ? "bg-emerald-900/40 border-emerald-700 text-emerald-300 hover:bg-emerald-800"
                     : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"}`}>
            👑 Connexion Admin démo
          </button>

          <p className={`text-center text-sm mt-5 ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
            Pas encore de compte ?{" "}
            <button onClick={() => setPage("register-ong")}
              className="text-amber-600 font-semibold hover:underline">
              Créer une ONG
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
