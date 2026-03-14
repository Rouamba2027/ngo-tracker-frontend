import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { createExpense, getProjects } from "../../api/api";

export default function ExpenseModal({ onClose, onSaved }) {
  const { t, dark } = useApp();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: "", amount: "", category: "material", description: "", date: new Date().toISOString().split("T")[0]
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjects().then(data => setProjects(data.projects || []));
  }, []);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit() {
    if (!form.projectId) return setError("Veuillez sélectionner un projet.");
    if (!form.amount || parseFloat(form.amount) <= 0) return setError("Veuillez entrer un montant valide.");
    setSaving(true);
    setError("");
    try {
      const data = await createExpense({
        projectId: form.projectId,
        amount: parseFloat(form.amount),
        category: form.category,
        description: form.description,
        date: form.date,
      });
      onSaved(data.expense);
      onClose();
    } catch (err) {
      setError(err.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
    ${dark ? "bg-emerald-950/50 border-emerald-800 text-white placeholder-emerald-700 focus:border-amber-400"
           : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`;

  const labelClass = `block text-xs font-semibold uppercase tracking-widest mb-2
    ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl ${dark ? "bg-emerald-900 border-emerald-800" : "bg-white border-emerald-100"}`}>

        <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? "border-emerald-800" : "border-emerald-100"}`}>
          <h2 className={`font-bold text-lg ${dark ? "text-white" : "text-emerald-900"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}>
            💰 {t.addExpenseTitle}
          </h2>
          <button onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dark ? "text-emerald-400 hover:bg-emerald-800" : "text-emerald-600 hover:bg-emerald-50"}`}>
            ✕
          </button>
        </div>

        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>{t.project} *</label>
            <select value={form.projectId} onChange={e => set("projectId", e.target.value)} className={inputClass}>
              <option value="">— Sélectionner un projet —</option>
              {projects.map(p => (
                <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>{t.amount} (FCFA) *</label>
            <input type="number" min="0" placeholder="0"
              value={form.amount} onChange={e => set("amount", e.target.value)}
              className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Date *</label>
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
              className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>{t.category}</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} className={inputClass}>
              <option value="material">{t.material}</option>
              <option value="transport">{t.transport}</option>
              <option value="staff">{t.staff}</option>
              <option value="other">{t.other}</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>{t.description}</label>
            <input type="text" placeholder="..."
              value={form.description} onChange={e => set("description", e.target.value)}
              className={inputClass} />
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className={`flex justify-end gap-3 px-6 py-4 border-t ${dark ? "border-emerald-800" : "border-emerald-100"}`}>
          <button onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${dark ? "text-emerald-400 hover:bg-emerald-800" : "text-emerald-600 hover:bg-emerald-50"}`}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50">
            {saving ? "Enregistrement..." : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}