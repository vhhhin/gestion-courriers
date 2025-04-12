import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportCourriersPDF = (data, title) => {
  const doc = new jsPDF();
  doc.text(title, 10, 10);

  const tableData = data.map(({ number, date, destinataire, subject, piecesJointes }) => [
    number,
    new Date(date).toLocaleDateString(),
    destinataire,
    subject,
    piecesJointes || 'Aucune',
  ]);

  autoTable(doc, {
    head: [['Numéro', 'Date', 'Destinataire', 'Objet', 'Pièces Jointes']],
    body: tableData,
  });

  doc.save(`${title}.pdf`);
};