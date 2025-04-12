import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportCourriersArrivesPDF = (courriers) => {
  const doc = new jsPDF({ orientation: "landscape" });

  const headers = [
    "Numéro",
    "Date",
    "Expéditeur",
    "Objet",
    "Référence",
    "Destinataire",
    "Commentaire",
    "Statut",
  ];

  const rows = courriers.map((courrier) => [
    courrier.number || "",
    new Date(courrier.date).toLocaleDateString() || "",
    courrier.sender || "",
    courrier.subject || "",
    courrier.reference || "",
    courrier.recipient || "",
    courrier.commentaire || "", // Nouveau champ
    courrier.statut || "", // Nouveau champ
  ]);

  doc.text("Liste des Courriers Arrivés", 148, 10, { align: "center" });
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
    styles: { fontSize: 9, cellPadding: 2 },
    margin: { left: 10, right: 10 },
    tableWidth: "auto",
  });

  // Ajout d'un pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} / ${pageCount}`, 280, 200, { align: "right" });
    doc.text(`Exporté le: ${new Date().toLocaleDateString()}`, 10, 200);
  }

  doc.save("courriers-arrives.pdf");
};

export default exportCourriersArrivesPDF;
