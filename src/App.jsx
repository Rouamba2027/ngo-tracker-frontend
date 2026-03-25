import { useState, useEffect } from "react"
import { AppProvider, useApp } from "./AppContext"
import T from "./translations"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import RegisterONG from "./pages/RegisterONG"
import DashAdmin from "./dashboards/DashAdmin"
import DashManager from "./dashboards/DashManager"
import DashViewer from "./dashboards/DashViewer"
import ProjectsPage from "./pages/projects/ProjectsPage"
import ExpensesPage from "./pages/expenses/ExpensesPage"
import ReportsPage from "./pages/reports/ReportsPage"
import UsersPage from "./pages/users/UsersPage"
import OrganizationPage from "./pages/organization/OrganizationPage"

function AppContent() {
  const { page, dark, loading } = useApp()
  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#052e16",color:"white",fontSize:"18px"}}>Chargement...</div>
  if (page === "landing")      return <Landing />
  if (page === "login")        return <Login />
  if (page === "register")     return <Register />
  if (page === "register-ong") return <RegisterONG />
  if (page === "dash-admin")   return <DashAdmin />
  if (page === "dash-manager") return <DashManager />
  if (page === "dash-viewer")  return <DashViewer />
  if (page === "projects")     return <ProjectsPage />
  if (page === "expenses")     return <ExpensesPage />
  if (page === "reports")      return <ReportsPage />
  if (page === "users")        return <UsersPage />
  if (page === "organization") return <OrganizationPage />
  return <Landing />
}

export default function App() {
  const [page, setPage] = useState("landing")
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState("fr")
  useEffect(() => {
    const font = document.createElement("link")
    font.rel = "stylesheet"
    font.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap"
    document.head.appendChild(font)
  }, [])
  return (
    <AppProvider t={T[lang]} dark={dark} setDark={setDark} lang={lang} setLang={setLang} page={page} setPage={setPage}>
      <style>{`@keyframes shimmer{from{background-position:-200% 0}to{background-position:200% 0}}`}</style>
      <AppContent />
    </AppProvider>
  )
}
