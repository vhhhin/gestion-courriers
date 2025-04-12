import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

const exportDecisionsPDF = (decisions) => {
  if (!decisions || decisions.length === 0) {
    console.warn("Aucune décision à exporter");
    return;
  }

  const doc = new jsPDF();

  // Configuration de la police pour le support de l'arabe et du français
  doc.setFont("helvetica");

  // Titre du document
  doc.setFontSize(16);
  doc.text("Liste des Décisions", 105, 15, { align: "center" });

  // Définition des colonnes
  const headers = [
    [
      "N°",
      "Date",
      "Objet",
      "Observation",
      "Auteur",
      "Statut",
      "Détails supplémentaires",
    ],
  ];

  // Préparation des données
  const rows = decisions.map((decision) => [
    decision.number || "",
    new Date(decision.date).toLocaleDateString(),
    decision.subject || "",
    decision.observation || "N/A",
    decision.author || "N/A",
    decision.status || "N/A",
    decision.additionalDetails || "N/A", // Ensure all details are included
  ]);

  // Configuration et génération du tableau
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 25,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      halign: "center",
      font: "helvetica",
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 35 },
      2: { cellWidth: 70 },
      3: { cellWidth: 60 },
      4: { cellWidth: 50 },
      5: { cellWidth: 40 },
      6: { cellWidth: 80 }, // Largeur pour les détails supplémentaires
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 25 },
  });

  // Ajout d'un pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} / ${pageCount}`, 200, 290, { align: "right" });
    doc.text(`Exporté le: ${new Date().toLocaleDateString()}`, 10, 290);
  }

  // Sauvegarde du PDF
  doc.save("liste-decisions.pdf");
};

export default exportDecisionsPDF;
