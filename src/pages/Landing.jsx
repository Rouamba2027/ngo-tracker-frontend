import { useApp } from "../context/AppContext";
import { LogoText } from "../components/ui/Logo";
import { DarkToggle, LangToggle } from "../components/ui/Toggles";
import { useEffect, useRef } from "react";

export default function Landing() {
  const { t, dark, setPage } = useApp();
  const canvasRef = useRef(null);

  // Animated particles background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const stats = [
    { value: "100%", label: "Transparent" },
    { value: "3", label: "Rôles distincts" },
    { value: "∞", label: "Projets suivis" },
    { value: "24/7", label: "Disponible" },
  ];

  const features = [
    {
      icon: "🗂️",
      title: t.featProjects,
      desc: t.featProjectsDesc,
      accent: "from-emerald-400/20 to-emerald-600/10",
      border: "border-emerald-500/30",
    },
    {
      icon: "💰",
      title: t.featBudget,
      desc: t.featBudgetDesc,
      accent: "from-amber-400/20 to-amber-600/10",
      border: "border-amber-500/30",
    },
    {
      icon: "📊",
      title: t.featDash,
      desc: t.featDashDesc,
      accent: "from-emerald-400/20 to-teal-600/10",
      border: "border-teal-500/30",
    },
    {
      icon: "📄",
      title: t.featReports,
      desc: t.featReportsDesc,
      accent: "from-amber-400/20 to-orange-600/10",
      border: "border-orange-500/30",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-hidden ${
        dark ? "bg-emerald-950" : "bg-emerald-900"
      }`}
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #f59e0b, transparent)",
            top: "-200px",
            right: "-200px",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #10b981, transparent)",
            bottom: "-150px",
            left: "-150px",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-900 font-black text-sm shadow-lg shadow-amber-500/30">
            N
          </div>
          <span className="text-white font-bold text-lg tracking-tight">NGO Tracker</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Fonctionnalités", "À propos", "Contact"].map((item) => (
            <button
              key={item}
              className="text-white/50 hover:text-white text-sm transition-colors font-medium"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <LangToggle />
          <DarkToggle />
          <button
            onClick={() => setPage("login")}
            className="hidden md:block px-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            {t.loginBtn}
          </button>
          <button
            onClick={() => setPage("register-ong")}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-900 rounded-lg text-sm font-bold transition-all hover:shadow-lg hover:shadow-amber-400/30 hover:-translate-y-0.5"
          >
            {t.registerBtn}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span className="text-amber-300/80 text-xs font-medium tracking-widest uppercase">
            Plateforme NGO — Version 2.0
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 max-w-4xl"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}
        >
          Gérez vos projets
          <br />
          <span
            className="relative"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #fcd34d, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t.heroTitle2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-lg max-w-lg leading-relaxed mb-12 font-sans">
          {t.heroSub}
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap justify-center mb-20">
          <button
            onClick={() => setPage("register")}
            className="group px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 rounded-xl font-bold text-base transition-all hover:shadow-2xl hover:shadow-amber-400/40 hover:-translate-y-1 relative overflow-hidden"
          >
            <span className="relative z-10">Commencer gratuitement →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => setPage("login")}
            className="px-8 py-4 border border-white/20 text-white rounded-xl font-semibold text-base hover:border-white/40 hover:bg-white/5 transition-all backdrop-blur-sm"
          >
            {t.loginBtn}
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex gap-8 md:gap-16 flex-wrap justify-center">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="text-3xl font-black text-amber-400 mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.value}
              </div>
              <div className="text-white/40 text-xs uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-10">
            <p className="text-amber-400/60 text-xs uppercase tracking-widest mb-2">Fonctionnalités</p>
            <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group p-6 rounded-2xl border ${f.border} bg-gradient-to-br ${f.accent} backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-default`}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <div className="text-white font-bold text-sm mb-2">{f.title}</div>
                <div className="text-white/40 text-xs leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/5 px-8 py-4 flex items-center justify-between">
        <span className="text-white/20 text-xs">© 2025 NGO Tracker</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/20 text-xs">Système opérationnel</span>
        </div>
        <span className="text-white/20 text-xs">v2.0.0</span>
      </div>
    </div>
  );
}
