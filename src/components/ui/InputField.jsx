// ─────────────────────────────────────────
// InputField — Champ de saisie réutilisable
// Props : label, type, value, onChange,
//         placeholder, hint, dark
// ─────────────────────────────────────────
export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
  dark,
}) {
  return (
    <div className="mb-4">
      <label
        className={`block text-xs font-semibold uppercase tracking-widest mb-2
          ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
          ${dark
            ? "bg-emerald-950/50 border-emerald-800 text-white placeholder-emerald-700 focus:border-amber-400"
            : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`}
      />

      {hint && (
        <p className={`text-xs mt-1 ${dark ? "text-emerald-600" : "text-emerald-600/60"}`}>
          {hint}
        </p>
      )}
    </div>
  );
}
