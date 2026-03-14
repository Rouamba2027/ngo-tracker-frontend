import { createContext, useContext, useState, useEffect } from "react";
import { getMe, getToken, clearToken } from "./api/api";

export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export function AppProvider({ children, t, dark, setDark, lang, setLang, page, setPage }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,     setLoading]     = useState(true);

  // Restaure la session au démarrage si un token existe
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    getMe()
      .then(data => {
        setCurrentUser(data.user);
        const dashMap = { ADMIN: "dash-admin", MANAGER: "dash-manager", VIEWER: "dash-viewer" };
        setPage(dashMap[data.user.role] || "landing");
      })
      .catch(() => { clearToken(); })
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    clearToken();
    setCurrentUser(null);
    setPage("landing");
  }

  return (
    <AppContext.Provider value={{
      t, dark, setDark, lang, setLang, page, setPage,
      currentUser, setCurrentUser, logout, loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}
