import jsPDF from "jspdf";

export const exportToPDF = (data: any[], title: string) => {
  const doc = new jsPDF();
  doc.text(title, 10, 10);
  data.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.title} - ${item.date}`, 10, 20 + index * 10);
  });
  doc.save(`${title}.pdf`);
};

export const printContent = (elementId: string) => {
  const content = document.getElementById(elementId)?.innerHTML;
  if (content) {
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(content);
    printWindow?.document.close();
    printWindow?.print();
  }
};
