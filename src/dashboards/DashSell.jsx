import { useApp } from "../../context/AppContext";

export default function DashShell({ children, role, navItems = [] }) {
  const { t, dark, setDark, currentUser, logout, setPage } = useApp();

  const pageMap = {
    [t?.dashboard]:    role === "ADMIN" ? "dash-admin" : role === "MANAGER" ? "dash-manager" : "dash-viewer",
    [t?.projects]:     "projects",
    [t?.myProjects]:   "projects",
    [t?.budget]:       "expenses",
    [t?.addExpense]:   "expenses",
    [t?.reports]:      "reports",
    [t?.myReports]:    "reports",
    [t?.users]:        "users",
    [t?.organization]: "organization",
  };

  function goHome() {
    if (role === "ADMIN") setPage("dash-admin");
    else if (role === "MANAGER") setPage("dash-manager");
    else setPage("dash-viewer");
  }

  return (
    <div className={`min-h-screen flex ${dark ? "bg-emerald-950" : "bg-gray-50"}`}>
      <aside className={`w-64 shrink-0 flex flex-col border-r ${dark ? "bg-emerald-900/60 border-emerald-800" : "bg-white border-emerald-100"}`}>
        <div className={`px-6 py-5 border-b ${dark ? "border-emerald-800" : "border-emerald-100"}`}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
            <span className="text-2xl">🌿</span>
            <span className={`font-black text-lg tracking-tight ${dark ? "text-white" : "text-emerald-900"}`}
              style={{ fontFamily: "'Playfair Display', serif" }}>NGO Tracker</span>
          </div>
          {currentUser && (
            <div className={`mt-3 text-xs ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>
              {currentUser.orgName || "Organisation"}
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item, i) => {
            if (item.section) return (
              <div key={i} className={`px-3 pt-4 pb-1 text-xs font-bold uppercase tracking-widest ${dark ? "text-emerald-600" : "text-emerald-500/60"}`}>
                {item.section}
              </div>
            );
            return (
              <button key={i}
                onClick={() => { const p = pageMap[item.label]; if (p) setPage(p); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${item.active
                    ? dark ? "bg-emerald-700/50 text-white" : "bg-emerald-100 text-emerald-900"
                    : dark ? "text-emerald-400/70 hover:bg-emerald-800/50 hover:text-white"
                           : "text-emerald-700/70 hover:bg-emerald-50 hover:text-emerald-900"}`}>
                <span>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${dark ? "bg-amber-500/20 text-amber-300" : "bg-amber-100 text-amber-700"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`px-4 py-4 border-t ${dark ? "border-emerald-800" : "border-emerald-100"}`}>
          {currentUser && (
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${dark ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                {currentUser.name?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-emerald-900"}`}>{currentUser.name}</div>
                <div className={`text-xs truncate ${dark ? "text-emerald-500" : "text-emerald-500/70"}`}>{currentUser.role}</div>
              </div>
            </div>
          )}
          <button onClick={logout}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${dark ? "text-red-400/70 hover:bg-red-900/20 hover:text-red-400" : "text-red-500/70 hover:bg-red-50 hover:text-red-600"}`}>
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`px-8 py-4 border-b flex items-center justify-between shrink-0 ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
          <div className="flex items-center gap-3">
            <button onClick={goHome}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dark ? "bg-emerald-800 text-emerald-300 hover:bg-emerald-700" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
              ←
            </button>
            <div>
              <h1 onClick={goHome}
                className={`text-xl font-bold cursor-pointer hover:opacity-70 transition-opacity ${dark ? "text-white" : "text-emerald-900"}`}
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {t?.dashboard || "Dashboard"}
              </h1>
              <p className={`text-xs mt-0.5 ${dark ? "text-emerald-500" : "text-emerald-500/70"}`}>
                {currentUser?.orgName} · {new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDark(d => !d)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${dark ? "bg-emerald-800 text-amber-300 hover:bg-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
              {dark ? "☀️" : "🌙"}
            </button>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${role === "ADMIN" ? dark ? "bg-amber-500/20 text-amber-300" : "bg-amber-100 text-amber-700" : role === "MANAGER" ? dark ? "bg-emerald-700/50 text-emerald-300" : "bg-emerald-100 text-emerald-700" : dark ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-700"}`}>
              {role}
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}