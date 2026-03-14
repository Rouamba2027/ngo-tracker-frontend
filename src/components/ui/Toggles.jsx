import { useApp } from "../../context/AppContext";

// ─────────────────────────────────────────
// DarkToggle — Bascule mode sombre/clair
// ─────────────────────────────────────────
export function DarkToggle() {
  const { dark, setDark } = useApp();
  return (
    <button
      onClick={() => setDark(!dark)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all
        ${dark
          ? "border-emerald-700 text-amber-300 bg-emerald-900/60 hover:bg-emerald-800/60"
          : "border-emerald-200 text-emerald-800 bg-white/70 hover:bg-emerald-50"}`}
    >
      {dark ? "☀️" : "🌙"}
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

// ─────────────────────────────────────────
// LangToggle — Bascule FR / EN
// ─────────────────────────────────────────
export function LangToggle() {
  const { lang, setLang } = useApp();
  return (
    <button
      onClick={() => setLang(lang === "fr" ? "en" : "fr")}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all
        ${lang === "fr"
          ? "border-amber-400/50 text-amber-700 bg-amber-50 hover:bg-amber-100"
          : "border-emerald-300/50 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"}`}
    >
      🌐 <span>{lang === "fr" ? "EN" : "FR"}</span>
    </button>
  );
}
