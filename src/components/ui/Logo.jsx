// ─────────────────────────────────────────
// NGOLogo — Globe avec cœur humanitaire
// ─────────────────────────────────────────
export function NGOLogo({ size = 40, dark = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cercle extérieur */}
      <circle cx="24" cy="24" r="22"
        stroke={dark ? "#c9a84c" : "#1a3c2e"}
        strokeWidth="2.5" fill="none" />

      {/* Lignes du globe */}
      <ellipse cx="24" cy="24" rx="10" ry="22"
        stroke={dark ? "#c9a84c" : "#1a3c2e"}
        strokeWidth="1.5" fill="none" opacity="0.5" />
      <line x1="2" y1="24" x2="46" y2="24"
        stroke={dark ? "#c9a84c" : "#1a3c2e"}
        strokeWidth="1.5" opacity="0.5" />
      <path d="M7 14 Q24 18 41 14"
        stroke={dark ? "#c9a84c" : "#1a3c2e"}
        strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M7 34 Q24 30 41 34"
        stroke={dark ? "#c9a84c" : "#1a3c2e"}
        strokeWidth="1.2" fill="none" opacity="0.4" />

      {/* Cœur central */}
      <path
        d="M24 30 C24 30 14 24 14 18 C14 15 16.5 13 19.5 13 C21.5 13 23 14.2 24 15.5
           C25 14.2 26.5 13 28.5 13 C31.5 13 34 15 34 18 C34 24 24 30 24 30Z"
        fill={dark ? "#c9a84c" : "#1a3c2e"}
        opacity="0.9"
      />

      {/* Pousses au-dessus du cœur */}
      <path d="M24 13 C24 13 24 10 21 9 C21 9 22 12 24 13Z"
        fill={dark ? "#e8c97a" : "#3d7a5a"} opacity="0.8" />
      <path d="M24 13 C24 13 24 10 27 9 C27 9 26 12 24 13Z"
        fill={dark ? "#e8c97a" : "#3d7a5a"} opacity="0.8" />
    </svg>
  );
}

// ─────────────────────────────────────────
// LogoText — Logo + Nom + Slogan
// ─────────────────────────────────────────
export function LogoText({ dark = false, lang = "fr" }) {
  return (
    <div className="flex items-center gap-2.5">
      <NGOLogo size={38} dark={dark} />
      <div>
        <div
          className={`font-bold text-lg leading-tight tracking-tight
            ${dark ? "text-amber-300" : "text-emerald-900"}`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          NGO
          <span className={dark ? "text-white" : "text-emerald-700"}>
            {" "}Tracker
          </span>
        </div>
        <div className={`text-xs leading-none
          ${dark ? "text-emerald-300/60" : "text-emerald-700/60"}`}>
          {lang === "fr" ? "Gérez. Suivez. Impactez." : "Manage. Track. Impact."}
        </div>
      </div>
    </div>
  );
}
