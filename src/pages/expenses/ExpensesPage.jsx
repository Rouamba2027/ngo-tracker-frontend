import { useApp } from "../../context/AppContext";
import { getExpenses, updateExpense, deleteExpense } from "../../api/api";
import { useState, useEffect } from "react";
import DashShell from "../../components/layout/DashShell";
import ExpenseModal from "../../components/ui/ExpenseModal";

function ExpenseEditModal({ expense, onClose, onSaved, dark, t }) {
  const [form, setForm] = useState({
    amount: expense.amount || "",
    category: expense.category || "other",
    description: expense.description || "",
    date: expense.date?.slice(0, 10) || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit() {
    if (!form.amount) return setError("Le montant est requis.");
    setSaving(true);
    setError("");
    try {
      const data = await updateExpense(expense.id || expense._id, {
        amount: parseFloat(form.amount),
        category: form.category,
        description: form.description,
        date: form.date || undefined,
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
    ${dark ? "bg-emerald-950/50 border-emerald-800 text-white focus:border-amber-400"
           : "bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-amber-400"}`;
  const labelClass = `block text-xs font-semibold uppercase tracking-widest mb-2
    ${dark ? "text-emerald-400/70" : "text-emerald-700/70"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`w-full max-w-md rounded-2xl border shadow-2xl ${dark ? "bg-emerald-900 border-emerald-800" : "bg-white border-emerald-100"}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? "border-emerald-800" : "border-emerald-100"}`}>
          <h2 className={`font-bold text-lg ${dark ? "text-white" : "text-emerald-900"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}>
            ✏️ Modifier la dépense
          </h2>
          <button onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? "text-emerald-400 hover:bg-emerald-800" : "text-emerald-600 hover:bg-emerald-50"}`}>
            ✕
          </button>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Montant (FCFA) *</label>
            <input type="number" min="0" value={form.amount} onChange={e => set("amount", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Catégorie</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} className={inputClass}>
              <option value="material">Matériel</option>
              <option value="transport">Transport</option>
              <option value="staff">Personnel</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <input type="text" value={form.description} onChange={e => set("description", e.target.value)} className={inputClass} />
          </div>
        </div>
        {error && (
          <div className="mx-6 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}
        <div className={`flex justify-end gap-3 px-6 py-4 border-t ${dark ? "border-emerald-800" : "border-emerald-100"}`}>
          <button onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium ${dark ? "text-emerald-400 hover:bg-emerald-800" : "text-emerald-600 hover:bg-emerald-50"}`}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50">
            {saving ? "Enregistrement..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const { t, dark, currentUser } = useApp();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  const role = currentUser?.role || "VIEWER";

  useEffect(() => {
    getExpenses()
      .then(data => setExpenses(data.expenses || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const navItems = role === "ADMIN" ? [
    { section: t.dashboard },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.projects },
    { icon: "💰", label: t.budget, active: true },
    { icon: "📄", label: t.reports },
    { section: "Admin" },
    { icon: "👥", label: t.users },
    { icon: "🏢", label: t.organization },
  ] : role === "MANAGER" ? [
    { section: t.managerSpace },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.myProjects },
    { icon: "💰", label: t.addExpense, active: true },
    { icon: "📄", label: t.myReports },
  ] : [
    { section: t.viewerSpace },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.myProjects },
    { icon: "💰", label: t.budget, active: true },
    { icon: "📄", label: t.myReports },
  ];

  const categoryColor = {
    material:  "bg-blue-100 text-blue-700",
    transport: "bg-amber-100 text-amber-700",
    staff:     "bg-emerald-100 text-emerald-700",
    other:     "bg-gray-100 text-gray-700",
  };

  async function handleDelete(id) {
    if (!confirm("Supprimer cette dépense ?")) return;
    try {
      await deleteExpense(id);
      setExpenses(prev => prev.filter(e => (e.id || e._id) !== id));
    } catch(err) { alert(err.message); }
  }

  return (
    <DashShell role={role} navItems={navItems}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-emerald-900"}`}
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {t.budget}
        </h2>
        {role !== "VIEWER" && (
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all">
            + {t.addExpenseTitle || "Nouvelle dépense"}
          </button>
        )}
      </div>

      {loading && <div className={`text-center py-20 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>Chargement...</div>}
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

      {!loading && !error && (
        <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
          <table className="w-full">
            <thead>
              <tr className={`text-xs uppercase tracking-widest ${dark ? "bg-emerald-950/50 text-emerald-600" : "bg-emerald-50 text-emerald-600/70"}`}>
                <th className="px-5 py-3 text-left">Description</th>
                <th className="px-5 py-3 text-left">Catégorie</th>
                <th className="px-5 py-3 text-left">Montant</th>
                <th className="px-5 py-3 text-left">Date</th>
                {role !== "VIEWER" && <th className="px-5 py-3 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id || e._id} className={`border-t ${dark ? "border-emerald-800/50 hover:bg-emerald-800/20" : "border-emerald-50 hover:bg-emerald-50"}`}>
                  <td className={`px-5 py-4 text-sm font-medium ${dark ? "text-white" : "text-emerald-900"}`}>{e.description || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor[e.category] || categoryColor.other}`}>
                      {e.category}
                    </span>
                  </td>
                  <td className={`px-5 py-4 text-sm font-mono font-semibold ${dark ? "text-emerald-300" : "text-emerald-800"}`}>
                    {(e.amount || 0).toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className={`px-5 py-4 text-sm ${dark ? "text-emerald-400/70" : "text-emerald-600/60"}`}>
                    {e.date ? new Date(e.date).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  {role !== "VIEWER" && (
                    <td className="px-5 py-4 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => setEditExpense(e)}
                          className={`transition-colors ${dark ? "text-emerald-400 hover:text-white" : "text-emerald-600 hover:text-emerald-900"}`}>
                          ✏️
                        </button>
                        {role === "ADMIN" && (
                          <button onClick={() => handleDelete(e.id || e._id)}
                            className={`transition-colors ${dark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700"}`}>
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={role !== "VIEWER" ? 5 : 4}
                    className={`text-center py-20 ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>
                    Aucune dépense trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ExpenseModal
          onClose={() => setShowModal(false)}
          onSaved={(expense) => setExpenses(prev => [expense, ...prev])}
        />
      )}

      {editExpense && (
        <ExpenseEditModal
          expense={editExpense}
          dark={dark}
          t={t}
          onClose={() => setEditExpense(null)}
          onSaved={(updated) => {
            setExpenses(prev => prev.map(e => (e.id || e._id) === (updated.id || updated._id) ? updated : e));
            setEditExpense(null);
          }}
        />
      )}
    </DashShell>
  );
}