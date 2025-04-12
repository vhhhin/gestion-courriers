import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportCourriersDepartPDF = (courriers) => {
  const doc = new jsPDF({ orientation: "landscape" });

  const headers = [
    "Numéro",
    "Date",
    "Destinataire",
    "Objet",
    "Commentaire",
    "Statut",
  ];

  const rows = courriers.map((courrier) => [
    courrier.numero || "",
    new Date(courrier.date).toLocaleDateString() || "",
    courrier.destinataire || "",
    courrier.objet || "",
    courrier.commentaire || "", // Nouveau champ
    courrier.statut || "", // Nouveau champ
  ]);

  doc.text("Liste des Courriers Départ", 148, 10, { align: "center" });
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
    bodyStyles: { halign: "left" },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 60 },
      3: { cellWidth: 80 },
      4: { cellWidth: 50 }, // Largeur pour le champ Commentaire
      5: { cellWidth: 40 }, // Largeur pour le champ Statut
    },
  });

  // Ajout d'un pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} / ${pageCount}`, 280, 200, { align: "right" });
    doc.text(`Exporté le: ${new Date().toLocaleDateString()}`, 10, 200);
  }

  doc.save("courriers-depart.pdf");
};

export default exportCourriersDepartPDF;
