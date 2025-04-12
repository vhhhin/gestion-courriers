window.alert = function(message) {
  // Création d'une boîte de dialogue personnalisée
  const dialog = document.createElement('div');
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.backgroundColor = '#fff';
  dialog.style.padding = '20px';
  dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  dialog.style.zIndex = '1000';
  dialog.style.borderRadius = '8px';
  dialog.style.textAlign = 'center';

  const messageText = document.createElement('p');
  messageText.innerText = message;
  messageText.style.marginBottom = '20px';
  dialog.appendChild(messageText);

  const okButton = document.createElement('button');
  okButton.innerText = 'OK';
  okButton.style.padding = '10px 20px';
  okButton.style.backgroundColor = '#007BFF';
  okButton.style.color = '#fff';
  okButton.style.border = 'none';
  okButton.style.borderRadius = '5px';
  okButton.style.cursor = 'pointer';

  okButton.onclick = () => {
    document.body.removeChild(dialog);
  };

  dialog.appendChild(okButton);
  document.body.appendChild(dialog);
};