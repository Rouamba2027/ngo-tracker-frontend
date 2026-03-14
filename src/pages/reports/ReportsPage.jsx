import { useApp } from "../../context/AppContext";
import { getReports, generateReport, deleteReport } from "../../api/api";
import { useState, useEffect } from "react";
import DashShell from "../../components/layout/DashShell";

function downloadCSV(report) {
  const rows = [["Projet", "Domaine", "Statut", "Alloué (FCFA)", "Dépensé (FCFA)", "Restant (FCFA)", "Utilisation %"]];
  (report.data || []).forEach(d => {
    rows.push([
      d.project?.name || "—",
      d.project?.domain || "—",
      d.project?.status || "—",
      d.budget?.allocated || 0,
      d.budget?.spent || 0,
      d.budget?.remaining || 0,
      d.budget?.utilizationPct || 0,
    ]);
  });
  const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.title || "rapport"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadPDF(report) {
  try {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(6, 78, 59);
    doc.text(report.title || "Rapport", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le ${new Date(report.generatedAt).toLocaleDateString("fr-FR", { dateStyle: "long" })}`, 14, 28);

    doc.setFontSize(11);
    doc.setTextColor(6, 78, 59);
    doc.text(`Type : ${report.type}`, 14, 36);

    const rows = (report.data || []).map(d => [
      d.project?.name || "—",
      d.project?.domain || "—",
      d.project?.status || "—",
      (d.budget?.allocated || 0).toLocaleString("fr-FR") + " FCFA",
      (d.budget?.spent || 0).toLocaleString("fr-FR") + " FCFA",
      (d.budget?.remaining || 0).toLocaleString("fr-FR") + " FCFA",
      (d.budget?.utilizationPct || 0) + "%",
    ]);

    autoTable(doc, {
      startY: 44,
      head: [["Projet", "Domaine", "Statut", "Alloué", "Dépensé", "Restant", "Utilisation"]],
      body: rows,
      headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    const totalAllocated = (report.data || []).reduce((s, d) => s + (d.budget?.allocated || 0), 0);
    const totalSpent = (report.data || []).reduce((s, d) => s + (d.budget?.spent || 0), 0);
    const finalY = doc.lastAutoTable.finalY + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(6, 78, 59);
    doc.text(`Total alloué : ${totalAllocated.toLocaleString("fr-FR")} FCFA`, 14, finalY);
    doc.text(`Total dépensé : ${totalSpent.toLocaleString("fr-FR")} FCFA`, 14, finalY + 7);

    doc.save(`${report.title || "rapport"}.pdf`);
  } catch (err) {
    alert("Erreur PDF : " + err.message);
  }
}

export default function ReportsPage() {
  const { t, dark, currentUser } = useApp();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const role = currentUser?.role || "VIEWER";

  const navItems = role === "ADMIN" ? [
    { section: t.dashboard },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.projects },
    { icon: "💰", label: t.budget },
    { icon: "📄", label: t.reports, active: true },
    { section: "Admin" },
    { icon: "👥", label: t.users },
    { icon: "🏢", label: t.organization },
  ] : role === "MANAGER" ? [
    { section: t.managerSpace },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.myProjects },
    { icon: "💰", label: t.addExpense },
    { icon: "📄", label: t.myReports, active: true },
  ] : [
    { section: t.viewerSpace },
    { icon: "📊", label: t.dashboard },
    { icon: "🗂️", label: t.myProjects },
    { icon: "💰", label: t.budget },
    { icon: "📄", label: t.myReports, active: true },
  ];

  useEffect(() => {
    getReports()
      .then(data => setReports(data.reports || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate(type) {
    setGenerating(true);
    try {
      const data = await generateReport({ type });
      setReports(prev => [data.report, ...prev]);
    } catch (err) {
      alert(err.message || "Erreur lors de la génération.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce rapport ?")) return;
    try {
      await deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) { alert(err.message); }
  }

  const typeColor = {
    quarterly: "bg-blue-100 text-blue-700",
    semester:  "bg-amber-100 text-amber-700",
    annual:    "bg-emerald-100 text-emerald-700",
  };

  const typeLabel = {
    quarterly: "Trimestriel",
    semester:  "Semestriel",
    annual:    "Annuel",
  };

  return (
    <DashShell role={role} navItems={navItems}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-emerald-900"}`}
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {t.reports}
        </h2>
        {role !== "VIEWER" && (
          <div className="flex gap-2">
            {["quarterly", "semester", "annual"].map(type => (
              <button key={type} onClick={() => handleGenerate(type)} disabled={generating}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50
                  ${dark ? "bg-emerald-800 text-emerald-200 hover:bg-emerald-700" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
                + {typeLabel[type]}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <div className={`text-center py-20 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>Chargement...</div>}

      <div className="grid gap-3">
        {reports.map((r) => (
          <div key={r.id} className={`rounded-2xl border p-5 flex items-center justify-between gap-4
            ${dark ? "bg-emerald-900/40 border-emerald-800" : "bg-white border-emerald-100"}`}>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm truncate ${dark ? "text-white" : "text-emerald-900"}`}>{r.title}</h3>
              <p className={`text-xs mt-1 ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>
                {new Date(r.generatedAt).toLocaleDateString("fr-FR", { dateStyle: "long" })}
                {" · "}{r.data?.length || 0} projet(s)
              </p>
            </div>

            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${typeColor[r.type] || typeColor.quarterly}`}>
              {typeLabel[r.type] || r.type}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => downloadCSV(r)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                  ${dark ? "bg-emerald-800 text-emerald-200 hover:bg-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                ⬇️ CSV
              </button>
              <button onClick={() => downloadPDF(r)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                  ${dark ? "bg-red-900/30 text-red-300 hover:bg-red-900/50" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                📄 PDF
              </button>
              {role === "ADMIN" && (
                <button onClick={() => handleDelete(r.id)}
                  className={`px-2 py-2 rounded-xl text-xs transition-all
                    ${dark ? "text-red-400 hover:bg-red-900/20" : "text-red-500 hover:bg-red-50"}`}>
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
        {!loading && reports.length === 0 && (
          <div className={`text-center py-20 ${dark ? "text-emerald-400/60" : "text-emerald-600/60"}`}>
            Aucun rapport. Générez-en un avec les boutons ci-dessus.
          </div>
        )}
      </div>
    </DashShell>
  );
}