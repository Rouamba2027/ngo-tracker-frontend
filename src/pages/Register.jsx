import { useState } from "react";
import { useApp } from "../context/AppContext";
import { LogoText } from "../components/ui/Logo";
import { DarkToggle, LangToggle } from "../components/ui/Toggles";
import InputField from "../components/ui/InputField";
import { register } from "../api/api";

// ─────────────────────────────────────────
// Register — Page d'inscription (3 types)
// ─────────────────────────────────────────
export default function Register() {
  const { t, dark, setPage, setCurrentUser } = useApp();

  const [type,         setType]         = useState("ONG");
  const [orgName,      setOrgName]      = useState("");
  const [recp,         setRecp]         = useState("");
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [pass,         setPass]         = useState("");
  const [country,      setCountry]      = useState("");
  const [orgCodeInput, setOrgCodeInput] = useState("");
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  const types = [
    { id: "ONG",     icon: "🏢",    label: t.typeONG     },
    { id: "MANAGER", icon: "🧑‍💼", label: t.typeManager },
    { id: "VIEWER",  icon: "👁️",   label: t.typeViewer  },
  ];

  const countries = [
    ["BF", "🇧🇫 Burkina Faso"],
    ["CI", "🇨🇮 Côte d'Ivoire"],
    ["SN", "🇸🇳 Sénégal"],
    ["ML", "🇲🇱 Mali"],
    ["TG", "🇹🇬 Togo"],
    ["BJ", "🇧🇯 Bénin"],
    ["GN", "🇬🇳 Guinée"],
    ["NE", "🇳🇪 Niger"],
  ];

  async function handleRegister() {
  if (!name || !email || !pass) return setError(t.fillAll);
  if (type === "ONG" && (!orgName || !recp || !country)) return setError(t.fillAll);
  if ((type === "MANAGER" || type === "VIEWER") && !orgCodeInput) return setError(t.fillAll);
  if (pass.length < 8) return setError(t.minPass);
  setError("");
  try {
    const payload = type === "ONG"
      ? { type, name, email, password: pass, orgName, receiptNumber: recp, country }
      : { type, name, email, password: pass, orgCode: orgCodeInput };
    const data = await register(payload);
    setSuccess((t.successReg || "Compte créé !") + " Code ONG : " + data.orgCode);
    setCurrentUser(data.user);
    setTimeout(() => {
      const dashMap = { ADMIN: "dash-admin", MANAGER: "dash-manager", VIEWER: "dash-viewer" };
      setPage(dashMap[data.user.role]);
    }, 2000);
  } catch (err) {
    setError(err.message || "Erreur lors de l'inscription.");
  }
}
  return (
    <div className={`min-h-screen flex ${dark ? "bg-emerald-950" : "bg-emerald-50"} transition-colors`}>

      {/* ── Panneau gauche ── */}
      <div className="hidden lg:flex w-[38%] bg-gradient-to-br from-emerald-900 to-emerald-800
        flex-col justify-center items-center p-12 relative overflow-hidden">

        <div className="relative z-10 text-center">
          <LogoText dark />

          <div className="mt-10 text-6xl mb-4">🌿</div>
          <h2
            className="text-xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.registerTitle}
          </h2>
          <p className="text-emerald-300/60 text-sm max-w-xs">{t.registerSub}</p>

          {/* Résumé des types de comptes */}
          <div className="mt-10 space-y-4 text-left w-full max-w-xs">
            {[
              [t.typeONG,     "Compte Admin, code ONG unique généré"],
              [t.typeManager, "Rattaché au code ONG de votre organisation"],
              [t.typeViewer,  "Accès lecture seule sur invitation"],
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

      {/* ── Formulaire (droite) ── */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
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
            {t.registerTitle}
          </h1>
          <p className={`text-sm mb-8 ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
            {t.registerSub}
          </p>

          {/* Type de compte */}
          <div className="mb-6">
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-3
              ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
              {t.accountType}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {types.map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => setType(tp.id)}
                  className={`py-3 px-2 rounded-xl border-2 text-center transition-all
                    ${type === tp.id
                      ? "border-amber-400 bg-amber-50"
                      : dark
                        ? "border-emerald-800 bg-emerald-900/40 hover:border-emerald-700"
                        : "border-emerald-100 bg-emerald-50/50 hover:border-emerald-300"}`}
                >
                  <div className="text-2xl mb-1">{tp.icon}</div>
                  <div className={`text-xs font-semibold
                    ${type === tp.id
                      ? "text-amber-700"
                      : dark ? "text-emerald-300/70" : "text-emerald-700/70"}`}>
                    {tp.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Champs spécifiques ONG */}
          {type === "ONG" && (
            <>
              <InputField
                label={t.orgName}
                value={orgName}
                onChange={setOrgName}
                placeholder="ex: Croix Rouge Burkina"
                dark={dark}
              />
              <InputField
                label={t.receiptNum}
                value={recp}
                onChange={setRecp}
                placeholder="ex: 2024-ONG-00142"
                hint={t.receiptHint}
                dark={dark}
              />
              <div className="mb-4">
                <label className={`block text-xs font-semibold uppercase tracking-widest mb-2
                  ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
                  {t.country}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none
                    transition-all appearance-none
                    ${dark
                      ? "bg-emerald-950/50 border-emerald-800 text-white focus:border-amber-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`}
                >
                  <option value="">{t.selectCountry}</option>
                  {countries.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Champs Manager / Viewer — Code ONG requis */}
          {(type === "MANAGER" || type === "VIEWER") && (
            <div className={`mb-5 p-4 rounded-xl border-2 border-dashed
              ${dark
                ? "border-emerald-700 bg-emerald-900/30"
                : "border-emerald-300 bg-emerald-50"}`}>
              <label className={`block text-xs font-bold uppercase tracking-widest mb-2
                ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
                🏢 {t.orgCodeLogin}
              </label>
              <input
                value={orgCodeInput}
                onChange={(e) => setOrgCodeInput(e.target.value.toUpperCase())}
                placeholder="NGO-BF-2025-0042"
                className={`w-full px-3 py-2.5 rounded-lg border text-sm font-mono
                  font-semibold tracking-widest outline-none transition-all
                  ${dark
                    ? "bg-emerald-950/50 border-emerald-800 text-white placeholder-emerald-700"
                    : "bg-white border-emerald-200 text-emerald-900"}`}
              />
            </div>
          )}

          {/* Champs communs */}
          <InputField label={t.fullName}   value={name}  onChange={setName}  placeholder="Nom complet"       dark={dark} />
          <InputField label={t.emailLabel} type="email"  value={email} onChange={setEmail} placeholder="votre@email.com" dark={dark} />
          <InputField label={t.passLabel}  type="password" value={pass} onChange={setPass} placeholder="••••••••"        dark={dark} />

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
              ✅ {success}
            </div>
          )}

          {/* Bouton créer */}
          <button
            onClick={handleRegister}
            className="w-full py-3.5 rounded-xl font-bold text-base bg-gradient-to-r
              from-emerald-700 to-emerald-600 text-white hover:shadow-lg
              hover:shadow-emerald-700/25 hover:-translate-y-0.5 transition-all mt-2"
          >
            {t.createBtn}
          </button>

          {/* Lien connexion */}
          <p className={`text-center text-sm mt-5
            ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
            {t.alreadyAccount}{" "}
            <button
              onClick={() => setPage("login")}
              className="text-amber-600 font-semibold hover:underline"
            >
              {t.loginBtn}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
