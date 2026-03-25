import { useState } from "react";
import { useApp } from "../context/AppContext";
import { register } from "../api/api";

export default function Register() {
  const { t, dark, setPage, setCurrentUser } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
    receiptNumber: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.password || !form.orgName) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await register({ type: "ONG", ...form });
      setCurrentUser(data.user);
      setPage("dash-admin"); // redirige seulement après succès
    } catch (err) {
      setError(err.message || "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${dark ? "bg-emerald-950" : "bg-emerald-50"}`}>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Créer une ONG</h1>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">⚠️ {error}</div>}

        <input name="name" placeholder="Nom complet" value={form.name} onChange={handleChange} className="mb-4 w-full px-4 py-3 rounded-xl border" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-4 w-full px-4 py-3 rounded-xl border" />
        <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} className="mb-4 w-full px-4 py-3 rounded-xl border" />
        <input name="orgName" placeholder="Nom ONG" value={form.orgName} onChange={handleChange} className="mb-4 w-full px-4 py-3 rounded-xl border" />
        <input name="receiptNumber" placeholder="Numéro reçu / SIRET" value={form.receiptNumber} onChange={handleChange} className="mb-4 w-full px-4 py-3 rounded-xl border" />
        <input name="country" placeholder="Pays" value={form.country} onChange={handleChange} className="mb-4 w-full px-4 py-3 rounded-xl border" />

        <button onClick={handleSubmit} disabled={loading} className="w-full py-3.5 rounded-xl font-bold text-base bg-amber-400 hover:shadow-lg">
          {loading ? "Création..." : "Créer le compte"}
        </button>

        <p className="text-center text-sm mt-5">
          Déjà un compte ?{" "}
          <button onClick={() => setPage("login")} className="text-amber-600 font-semibold hover:underline">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}