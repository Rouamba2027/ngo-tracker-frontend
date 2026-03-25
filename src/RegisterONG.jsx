import { useState } from "react";
import { useApp } from "../context/AppContext";
import { LogoText } from "../components/ui/Logo";
import { DarkToggle, LangToggle } from "../components/ui/Toggles";
import InputField from "../components/ui/InputField";
import { register } from "../api/api";

export default function RegisterONG() {
  const { t, dark, setPage, setCurrentUser } = useApp();

  const [orgName,  setOrgName]  = useState("");
  const [recp,     setRecp]     = useState("");
  const [country,  setCountry]  = useState("");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

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
    if (!orgName || !recp || !country || !name || !email || !pass)
      return setError("Tous les champs sont requis.");
    if (pass.length < 8)
      return setError("Le mot de passe doit contenir au moins 8 caractères.");
    setError("");
    try {
      const data = await register({ name, email, password: pass, orgName, receiptNumber: recp, country });
      setSuccess("Compte créé ! Code ONG : " + data.orgCode);
      setCurrentUser(data.user);
      setTimeout(() => setPage("dash-admin"), 2000);
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription.");
    }
  }

  return (
    <div className={`min-h-screen flex ${dark ? "bg-emerald-950" : "bg-emerald-50"} transition-colors`}>

      {/* Panneau gauche */}
      <div className="hidden lg:flex w-[38%] bg-gradient-to-br from-emerald-900 to-emerald-800 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <LogoText dark />
          <div className="mt-10 text-6xl mb-4">🏢</div>
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Créer votre ONG
          </h2>
          <p className="text-emerald-300/60 text-sm max-w-xs">
            Enregistrez votre organisation et gérez vos projets en toute transparence.
          </p>
          <div className="mt-10 space-y-4 text-left w-full max-w-xs">
            {[
              ["Code ONG unique", "Généré automatiquement à la création"],
              ["Compte Administrateur", "Vous gérez votre organisation"],
              ["Ajout de membres", "Créez les comptes de votre équipe"],
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
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
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
            Créer votre ONG
          </h1>
          <p className={`text-sm mb-8 ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
            Remplissez les informations de votre organisation
          </p>

          {/* Informations ONG */}
          <div className={`mb-6 p-4 rounded-2xl border ${dark ? "border-emerald-800 bg-emerald-900/30" : "border-emerald-200 bg-emerald-50"}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${dark ? "text-emerald-400" : "text-emerald-700"}`}>
              🏢 Informations de l'organisation
            </p>
            <InputField label="Nom de l'ONG" value={orgName} onChange={setOrgName} placeholder="ex: Croix Rouge Burkina" dark={dark} />
            <InputField label="Numéro de récépissé" value={recp} onChange={setRecp} placeholder="ex: 2024-ONG-00142" dark={dark} />
            <div className="mb-4">
              <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}>
                Pays
              </label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all appearance-none ${dark ? "bg-emerald-950/50 border-emerald-800 text-white" : "bg-white border-emerald-200 text-emerald-900"}`}
              >
                <option value="">Choisir un pays</option>
                {countries.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Informations Admin */}
          <div className={`mb-6 p-4 rounded-2xl border ${dark ? "border-amber-800/40 bg-amber-900/10" : "border-amber-200 bg-amber-50"}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${dark ? "text-amber-400" : "text-amber-700"}`}>
              👑 Compte Administrateur
            </p>
            <InputField label="Nom complet" value={name} onChange={setName} placeholder="Votre nom" dark={dark} />
            <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="votre@email.com" dark={dark} />
            <InputField label="Mot de passe" type="password" value={pass} onChange={setPass} placeholder="Minimum 8 caractères" dark={dark} />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">⚠️ {error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">✅ {success}</div>
          )}

          <button onClick={handleRegister}
            className="w-full py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-700 to-emerald-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2">
            Créer mon ONG
          </button>

          <p className={`text-center text-sm mt-5 ${dark ? "text-emerald-400/60" : "text-emerald-700/60"}`}>
            Déjà un compte ?{" "}
            <button onClick={() => setPage("login")} className="text-amber-600 font-semibold hover:underline">
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
