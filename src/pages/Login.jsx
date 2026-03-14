import { useState } from "react";
import { useApp } from "../context/AppContext";
import { LogoText } from "../components/ui/Logo";
import { DarkToggle, LangToggle } from "../components/ui/Toggles";
import { login } from "../api/api";

// ─────────────────────────────────────────
// Login — Page de connexion (3 rôles)
// ─────────────────────────────────────────
export default function Login() {
  const { t, dark, setPage, setCurrentUser } = useApp();

  const [role,    setRole]    = useState("ADMIN");
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [error,   setError]   = useState("");

  // ── Définition des rôles ──
  const roles = [
    { id: "ADMIN",   icon: "👑",    label: t.roleAdmin,   color: "amber"   },
    { id: "MANAGER", icon: "🧑‍💼", label: t.roleManager, color: "emerald" },
    { id: "VIEWER",  icon: "👁️",   label: t.roleViewer,  color: "gold"    },
  ];

  // ── Config panneau gauche par rôle ──
  const roleConfig = {
    ADMIN: {
      gradient: dark ? "from-emerald-950 to-emerald-900" : "from-emerald-900 to-emerald-800",
      welcome:  t.welcomeAdmin,
      desc:     t.adminDesc,
      emoji:    "👑",
      tagColor: "text-amber-400",
      btnColor: "from-amber-400 to-amber-300 text-emerald-900 hover:shadow-amber-400/30",
    },
    MANAGER: {
      gradient: dark ? "from-emerald-950 to-emerald-900" : "from-emerald-800 to-emerald-700",
      welcome:  t.welcomeManager,
      desc:     t.managerDesc,
      emoji:    "🧑‍💼",
      tagColor: "text-emerald-300",
      btnColor: "from-emerald-600 to-emerald-500 text-white hover:shadow-emerald-600/30",
    },
    VIEWER: {
      gradient: dark ? "from-emerald-950 to-emerald-900" : "from-emerald-900 to-amber-900",
      welcome:  t.welcomeViewer,
      desc:     t.viewerDesc,
      emoji:    "👁️",
      tagColor: "text-amber-300",
      btnColor: "from-amber-600 to-amber-500 text-white hover:shadow-amber-600/30",
    },
  };
  const cfg = roleConfig[role];

  // ── Connexion normale ──
  async function handleLogin() {
  if (!email || !pass) return setError(t.fillAll);
  if (role === "ADMIN" && !orgCode) return setError(t.orgCodeRequired);
  setError("");
  try {
    const data = await login({ email, password: pass, role, orgCode: orgCode || undefined });
    setCurrentUser(data.user);
    const dashMap = { ADMIN: "dash-admin", MANAGER: "dash-manager", VIEWER: "dash-viewer" };
    setPage(dashMap[data.user.role]);
  } catch (err) {
    setError(err.message || "Erreur de connexion.");
  }
}

  // ── Connexion démo rapide ──
  async function demo(r) {
  const demoPass = { ADMIN: "Admin1234!", MANAGER: "Manager1234!", VIEWER: "Viewer1234!" };
  setRole(r);
  setEmail(r.toLowerCase() + "@croixrouge.bf");
  setPass(demoPass[r]);
  if (r === "ADMIN") setOrgCode("NGO-BF-2025-0042");
  else setOrgCode("");
  setError("");
  try {
    const data = await login({
      email:   r.toLowerCase() + "@croixrouge.bf",
      password: demoPass[r],
      role:    r,
      orgCode: r === "ADMIN" ? "NGO-BF-2025-0042" : undefined,
    });
    setCurrentUser(data.user);
    const dashMap = { ADMIN: "dash-admin", MANAGER: "dash-manager", VIEWER: "dash-viewer" };
    setPage(dashMap[data.user.role]);
  } catch (err) {
    setError(err.message || "Erreur de connexion démo.");
  }
}

  // ── Couleur du bouton de sélection de rôle ──
  const roleCardClass = (r) => {
    const selected = role === r.id;
    const selectedColor =
      r.color === "amber"   ? "border-amber-400   bg-amber-50" :
      r.color === "emerald" ? "border-emerald-500 bg-emerald-50" :
                              "border-amber-600   bg-amber-50";
    const selectedText =
      r.color === "amber"   ? "text-amber-700"   :
      r.color === "emerald" ? "text-emerald-700" :
                              "text-amber-800";
    const idle = dark
      ? "border-emerald-900 bg-emerald-950/50 hover:border-emerald-700"
      : "border-emerald-100 bg-emerald-50/50 hover:border-emerald-300";
    const idleText = dark ? "text-emerald-300/70" : "text-emerald-700/70";

    return {
      card: `py-3 px-2 rounded-xl border-2 text-center transition-all cursor-pointer
        ${selected ? selectedColor : idle}`,
      text: `text-xs font-semibold ${selected ? selectedText : idleText}`,
    };
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau gauche personnalisé par rôle ── */}
      <div className={`hidden lg:flex w-[42%] bg-gradient-to-br ${cfg.gradient}
        flex-col justify-center items-center p-12 relative overflow-hidden transition-all duration-500`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center">
          <LogoText dark />

          <div className="mt-12 mb-6 text-7xl">{cfg.emoji}</div>

          <h2
            className="text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {cfg.welcome}
          </h2>
          <p className={`text-sm leading-relaxed max-w-xs ${cfg.tagColor} opacity-80`}>
            {cfg.desc}
          </p>

          {/* Infos champs */}
          <div className="mt-10 space-y-4 text-left w-full max-w-xs">
            {[
              role === "ADMIN" ? [t.orgCode, "Code unique de votre organisation"] : null,
              ["Email", "Votre identifiant personnel"],
              [t.password, "Votre mot de passe sécurisé"],
            ].filter(Boolean).map(([k, v], i) => (
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

      {/* ── Formulaire (droite) ── */}
      <div className={`flex-1 flex items-center justify-center p-8
        ${dark ? "bg-emerald-950" : "bg-emerald-50"} transition-colors`}>
        <div className="w-full max-w-md">

          {/* Barre sup */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setPage("landing")}
              className={`text-sm font-medium transition-colors
                ${dark
                  ? "text-emerald-400/70 hover:text-white"
                  : "text-emerald-700/60 hover:text-emerald-900"}`}
            >
              {t.backHome}
            </button>
            <div className="flex gap-2">
              <LangToggle />
              <DarkToggle />
            </div>
          </div>

          <h1
            className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-emerald-900"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.loginTitle}
          </h1>
          <p className={`text-sm mb-8 ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
            {t.loginSub}
          </p>

          {/* Sélection du rôle */}
          <div className="mb-6">
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-3
              ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
              {t.yourRole}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => {
                const cls = roleCardClass(r);
                return (
                  <button
                    key={r.id}
                    onClick={() => { setRole(r.id); setError(""); }}
                    className={cls.card}
                  >
                    <div className="text-2xl mb-1">{r.icon}</div>
                    <div className={cls.text}>{r.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code ONG — Admin uniquement */}
          {role === "ADMIN" && (
            <div className={`mb-5 p-4 rounded-xl border-2 border-dashed border-amber-300
              transition-all ${dark ? "bg-amber-900/10" : "bg-amber-50"}`}>
              <label className="block text-xs font-bold uppercase tracking-widest
                text-amber-600 mb-2">
                🏢 {t.orgCode}
              </label>
              <input
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                placeholder="NGO-BF-2025-0042"
                className={`w-full px-3 py-2.5 rounded-lg border text-sm font-mono
                  font-semibold tracking-widest outline-none transition-all
                  ${dark
                    ? "bg-emerald-950/60 border-amber-700/40 text-amber-200 placeholder-emerald-700 focus:border-amber-400"
                    : "bg-white border-amber-200 text-amber-800 placeholder-amber-300 focus:border-amber-400"}`}
              />
              <p className="text-xs text-amber-600/70 mt-1.5">{t.orgCodeHint}</p>
            </div>
          )}

          {/* Code ONG — Manager / Viewer */}
          {(role === "MANAGER" || role === "VIEWER") && (
            <div className="mb-5">
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-2
                ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
                {t.orgCodeLogin}
              </label>
              <input
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                placeholder="NGO-BF-2025-0042"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-mono
                  outline-none transition-all
                  ${dark
                    ? "bg-emerald-950/50 border-emerald-800 text-emerald-200 placeholder-emerald-700 focus:border-emerald-500"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800 focus:border-emerald-400"}`}
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2
              ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                ${dark
                  ? "bg-emerald-950/50 border-emerald-800 text-white placeholder-emerald-700 focus:border-amber-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`}
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-6">
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2
              ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
              {t.password}
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                ${dark
                  ? "bg-emerald-950/50 border-emerald-800 text-white placeholder-emerald-700 focus:border-amber-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`}
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Bouton connexion */}
          <button
            onClick={handleLogin}
            className={`w-full py-3.5 rounded-xl font-bold text-base bg-gradient-to-r
              ${cfg.btnColor} hover:shadow-lg hover:-translate-y-0.5 transition-all`}
          >
            {t.connect}
          </button>

          {/* Séparateur démo */}
          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${dark ? "bg-emerald-800" : "bg-emerald-100"}`} />
            <span className={`text-xs ${dark ? "text-emerald-600" : "text-emerald-500/70"}`}>
              {t.demoAccounts}
            </span>
            <div className={`flex-1 h-px ${dark ? "bg-emerald-800" : "bg-emerald-100"}`} />
          </div>

          {/* Boutons démo */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              ["ADMIN",   "👑",    "amber"  ],
              ["MANAGER", "🧑‍💼", "emerald"],
              ["VIEWER",  "👁️",   "gold"   ],
            ].map(([r, ic, c]) => (
              <button
                key={r}
                onClick={() => demo(r)}
                className={`py-2.5 rounded-lg text-xs font-semibold border transition-all
                  ${c === "amber"
                    ? "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                    : c === "emerald"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                      : "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"}`}
              >
                {ic} {r === "ADMIN" ? "Admin" : r === "MANAGER" ? "Manager" : "Viewer"}
              </button>
            ))}
          </div>

          {/* Lien inscription */}
          <p className={`text-center text-sm
            ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
            {t.noAccount}{" "}
            <button
              onClick={() => setPage("register")}
              className="text-amber-600 font-semibold hover:underline"
            >
              {t.createAccount}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
