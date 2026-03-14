import { useApp } from "../context/AppContext";
import { LogoText } from "../components/ui/Logo";
import { DarkToggle, LangToggle } from "../components/ui/Toggles";

export default function Landing() {
  const { t, dark, setPage } = useApp();

  const features = [
    { icon: "🗂️", title: t.featProjects, desc: t.featProjectsDesc },
    { icon: "💰", title: t.featBudget,   desc: t.featBudgetDesc   },
    { icon: "📊", title: t.featDash,     desc: t.featDashDesc     },
    { icon: "📄", title: t.featReports,  desc: t.featReportsDesc  },
  ];

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden
      ${dark ? "bg-emerald-950" : "bg-emerald-900"}`}>

      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20
          ${dark ? "bg-amber-400" : "bg-emerald-500"}`}
          style={{ transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
          style={{ transform: "translate(-30%,30%)" }} />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <LogoText dark />
        <div className="flex items-center gap-2">
          <LangToggle />
          <DarkToggle />
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25
          rounded-full px-4 py-1.5 text-amber-300 text-xs font-medium mb-8 tracking-wide">
          🌍 {t.tagline}
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 max-w-3xl"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {t.heroTitle}<br />
          <span className="text-amber-300">{t.heroTitle2}</span>
        </h1>

        <p className="text-white/55 text-lg max-w-md leading-relaxed mb-12">{t.heroSub}</p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button onClick={() => setPage("login")}
            className="px-8 py-4 border-2 border-white/25 text-white rounded-xl font-semibold
              text-base hover:border-white/60 hover:bg-white/5 transition-all">
            {t.loginBtn}
          </button>
          <button onClick={() => setPage("register")}
            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-300 text-emerald-900
              rounded-xl font-bold text-base hover:shadow-xl hover:shadow-amber-400/30
              hover:-translate-y-0.5 transition-all">
            {t.registerBtn}
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
        {features.map((f, i) => (
          <div key={i} className={`p-8 text-center border-r border-white/10 last:border-r-0
            hover:bg-white/5 transition-colors
            ${dark ? "bg-emerald-950/80" : "bg-emerald-900/80"}`}>
            <div className="text-3xl mb-3">{f.icon}</div>
            <div className="text-white font-semibold text-sm mb-1">{f.title}</div>
            <div className="text-white/40 text-xs">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}