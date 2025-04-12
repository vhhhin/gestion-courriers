const exportCourriers = (courriers, type) => {
  // Vérification si la liste des courriers est vide avant l'exportation
  if (!courriers || courriers.length === 0) {
    console.error('Aucun courrier à exporter.');
    return;
  }

  // Ajout d'un message de confirmation pour l'utilisateur
  console.log(`Exportation des courriers (${type}) en cours...`);

  const headers = type === 'depart'
    ? ['Numéro', 'Date', 'Destinataire', 'Objet']
    : ['Numéro', 'Date', 'Expéditeur', 'Objet', 'Référence', 'Destinataire'];

  const rows = courriers.map(courrier => (
    type === 'depart'
      ? [courrier.numero, courrier.date, courrier.destinataire, courrier.objet]
      : [courrier.numero, courrier.date, courrier.expediteur, courrier.objet, courrier.reference, courrier.destinataire]
  ));

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `courriers_${type}.csv`;
  link.click();
};

export default exportCourriers;