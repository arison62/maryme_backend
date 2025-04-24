const { transporter } = require("../configs/mail");

// Template HTML pour les emails de déclaration
const declarationEmailTemplate = `
<!doctype html>
<html ⚡4email data-css-strict>
 <head>
 <meta charset="utf-8">
 <style amp4email-boilerplate>body{visibility:hidden}</style>
 <script async src="https://cdn.ampproject.org/v0.js"></script>
 <style amp-custom>
 body {
   background-color: #f9f9f9;
   font-family: Arial, sans-serif;
   margin: 0;
   padding: 0;
 }
 .container {
   max-width: 600px;
   margin: 0 auto;
   background-color: #ffffff;
   border-radius: 8px;
   overflow: hidden;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
 }
 .header {
   background-color: rgb(140, 255, 230);
   padding: 20px;
   text-align: center;
 }
 .header img {
   max-width: 150px;
   height: auto;
 }
 h1 {
   background-color: rgb(140, 255, 230);
   padding: 15px 20px;
   font-size: 24px;
   font-weight: bold;
   text-align: center;
   width: 100%;
   color: rgb(0, 23, 9);
   margin: 0;
 }
 .content {
   padding: 30px 20px;
   background-color: #ffffff;
 }
 .description {
   padding: 0 20px 20px;
   font-size: 16px;
   line-height: 1.5;
   color: #333333;
 }
 .declaration-details {
   background-color: #f2f2f2;
   border-radius: 6px;
   padding: 15px;
   margin: 20px;
 }
 .declaration-details h3 {
   font-size: 18px;
   margin-top: 0;
   color: #333;
 }
 .declaration-details p {
   margin: 8px 0;
   color: #555;
 }
 .declaration-detail-row {
   display: flex;
   border-bottom: 1px solid #e0e0e0;
   padding: 8px 0;
 }
 .declaration-detail-row:last-child {
   border-bottom: none;
 }
 .detail-label {
   font-weight: bold;
   width: 40%;
   color: #555;
 }
 .detail-value {
   width: 60%;
 }
 .status {
   display: inline-block;
   padding: 6px 12px;
   border-radius: 4px;
   font-weight: bold;
   text-align: center;
   font-size: 14px;
 }
 .status-pending {
   background-color: #fff8e1;
   color: #f57c00;
 }
 .status-approved {
   background-color: #e8f5e9;
   color: #2e7d32;
 }
 .status-rejected {
   background-color: #ffebee;
   color: #c62828;
 }
 .message {
   padding: 20px;
   background-color: #ffffff;
   border-radius: 6px;
   margin: 20px;
   border: 1px solid #e0e0e0;
 }
 .footer {
   background-color: #f2f2f2;
   padding: 20px;
   text-align: center;
   font-size: 12px;
   color: #666666;
 }
 .button {
   display: inline-block;
   background-color: rgb(0, 180, 150);
   color: white;
   padding: 12px 24px;
   text-decoration: none;
   border-radius: 4px;
   font-weight: bold;
   margin: 20px 0;
 }
 </style>
 </head>
 <body>
   <div class="container">
     <div class="header">
       <h1>{Title}</h1>
     </div>
     <div class="content">
       <div class="description">{Description}</div>
       
       <div class="declaration-details">
         <h3>Détails de la déclaration #{DeclarationId}</h3>
         
         <div class="declaration-detail-row">
           <div class="detail-label">Statut:</div>
           <div class="detail-value">
             <span class="status {StatusClass}">{Status}</span>
           </div>
         </div>
         
         <div class="declaration-detail-row">
           <div class="detail-label">Date de déclaration:</div>
           <div class="detail-value">{DateDeclaration}</div>
         </div>
         
         <div class="declaration-detail-row">
           <div class="detail-label">Date de célébration:</div>
           <div class="detail-value">{DateCelebration}</div>
         </div>
         
         <div class="declaration-detail-row">
           <div class="detail-label">Époux:</div>
           <div class="detail-value">{Epoux}</div>
         </div>
         
         <div class="declaration-detail-row">
           <div class="detail-label">Épouse:</div>
           <div class="detail-value">{Epouse}</div>
         </div>
       </div>
       
       <div class="message">
         <p>{Message}</p>
       </div>
       
       {ButtonSection}
     </div>
     <div class="footer">
       <p>Cet email est automatique, merci de ne pas y répondre directement.</p>
       <p>© {CurrentYear} Service d'état civil - Tous droits réservés</p>
     </div>
   </div>
 </body>
</html>
`;

/**
 * Fonction pour créer un message email concernant une déclaration de mariage
 * @param {Object} options - Options du message
 * @param {string} options.title - Titre de l'email
 * @param {string} options.description - Description courte
 * @param {Object} options.declaration - Données de la déclaration
 * @param {string} options.message - Message personnalisé de l'officier
 * @param {string} options.from - Adresse email expéditeur
 * @param {string} options.to - Adresse email destinataire
 * @param {string} options.subject - Sujet de l'email
 * @param {Object} [options.buttonLink] - Lien optionnel pour un bouton d'action
 * @returns {Object} - Objet contenant les informations pour l'envoi d'email
 */
function createDeclarationEmail({
  title,
  description,
  declaration,
  message,
  from,
  to,
  subject,
  buttonLink = null
}) {
  // Formatage des données pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Déterminer la classe CSS pour le statut
  let statusClass = '';
  let statusText = '';
  
  switch (declaration.status) {
    case 'en_attente':
      statusClass = 'status-pending';
      statusText = 'En attente';
      break;
    case 'accepte':
      statusClass = 'status-approved';
      statusText = 'Accepté';
      break;
    case 'refuse':
      statusClass = 'status-rejected';
      statusText = 'Refusé';
      break;
    default:
      statusClass = 'status-pending';
      statusText = declaration.status;
  }
  
  // Création du bouton si un lien est fourni
  const buttonSection = buttonLink ? 
    `<div style="text-align: center;">
      <a href="${buttonLink.url}" class="button">${buttonLink.text}</a>
     </div>` : '';
  
  // Données pour le remplacement dans le template
  const epoux = `${declaration.Epoux.nom} ${declaration.Epoux.prenom}`;
  const epouse = `${declaration.Epouse.nom} ${declaration.Epouse.prenom}`;
  
  // Texte simple pour les clients qui ne peuvent pas afficher HTML
  const textContent = `
${title}

${description}

Détails de la déclaration #${declaration.id_declaration}:
- Statut: ${statusText}
- Date de déclaration: ${formatDate(declaration.date_declaration)}
- Date de célébration: ${formatDate(declaration.date_celebration)}
- Époux: ${epoux}
- Épouse: ${epouse}

Message de l'officier:
${message}

${buttonLink ? `Pour plus d'informations: ${buttonLink.url}` : ''}

Cet email est automatique, merci de ne pas y répondre directement.
© ${new Date().getFullYear()} Service d'état civil - Tous droits réservés
`;

  // HTML version simplifiée (pour les clients qui ne supportent pas AMP)
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background-color: rgb(140, 255, 230); padding: 20px; text-align: center; }
    h1 { font-size: 24px; font-weight: bold; color: rgb(0, 23, 9); margin: 0; }
    .content { padding: 20px; }
    .description { font-size: 16px; line-height: 1.5; color: #333333; margin-bottom: 20px; }
    .declaration-details { background-color: #f2f2f2; border-radius: 6px; padding: 15px; margin-bottom: 20px; }
    .declaration-details h3 { font-size: 18px; margin-top: 0; color: #333; }
    .declaration-detail-row { padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .declaration-detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: bold; color: #555; }
    .status { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; }
    .status-pending { background-color: #fff8e1; color: #f57c00; }
    .status-approved { background-color: #e8f5e9; color: #2e7d32; }
    .status-rejected { background-color: #ffebee; color: #c62828; }
    .message { padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e0e0e0; margin-bottom: 20px; }
    .button { display: inline-block; background-color: rgb(0, 180, 150); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
    .footer { background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      <div class="description">${description}</div>
      
      <div class="declaration-details">
        <h3>Détails de la déclaration #${declaration.id_declaration}</h3>
        
        <div class="declaration-detail-row">
          <div class="detail-label">Statut:</div>
          <div class="detail-value">
            <span class="status ${statusClass}">${statusText}</span>
          </div>
        </div>
        
        <div class="declaration-detail-row">
          <div class="detail-label">Date de déclaration:</div>
          <div class="detail-value">${formatDate(declaration.date_declaration)}</div>
        </div>
        
        <div class="declaration-detail-row">
          <div class="detail-label">Date de célébration:</div>
          <div class="detail-value">${formatDate(declaration.date_celebration)}</div>
        </div>
        
        <div class="declaration-detail-row">
          <div class="detail-label">Époux:</div>
          <div class="detail-value">${epoux}</div>
        </div>
        
        <div class="declaration-detail-row">
          <div class="detail-label">Épouse:</div>
          <div class="detail-value">${epouse}</div>
        </div>
      </div>
      
      <div class="message">
        <p>${message}</p>
      </div>
      
      ${buttonLink ? `<div style="text-align: center;"><a href="${buttonLink.url}" class="button">${buttonLink.text}</a></div>` : ''}
    </div>
    <div class="footer">
      <p>Cet email est automatique, merci de ne pas y répondre directement.</p>
      <p>© ${new Date().getFullYear()} Service d'état civil - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
`;

  // AMP version (remplace les placeholders dans le template)
  const ampContent = declarationEmailTemplate
    .replace("{Title}", title)
    .replace("{Description}", description)
    .replace("{DeclarationId}", declaration.id_declaration)
    .replace("{StatusClass}", statusClass)
    .replace("{Status}", statusText)
    .replace("{DateDeclaration}", formatDate(declaration.date_declaration))
    .replace("{DateCelebration}", formatDate(declaration.date_celebration))
    .replace("{Epoux}", epoux)
    .replace("{Epouse}", epouse)
    .replace("{Message}", message)
    .replace("{ButtonSection}", buttonSection)
    .replace("{CurrentYear}", new Date().getFullYear());

  // Retourne l'objet message formaté pour nodemailer
  return {
    from,
    to,
    subject,
    text: textContent,
    html: htmlContent,
    amp: ampContent
  };
}

/**
 * Fonction pour envoyer un email de notification pour une déclaration
 * @param {Object} options - Options pour l'email
 * @param {string} options.to - Email du destinataire
 * @param {object} options.declaration - Objet contenant les informations de la déclaration
 * @param {string} options.message - Message personnalisé
 * @param {string} options.status - Statut de la déclaration (en_attente, accepte, refuse)
 * @returns {Promise} - Résultat de l'envoi d'email
 */
async function sendDeclarationEmail({ to, declaration, message, status }) {
  try {
    let title, description, subject;
    let buttonLink = null;
    
    // Définir les textes selon le statut
    switch (status) {
      case 'accepte':
        title = "Déclaration de mariage acceptée";
        description = "Votre déclaration de mariage a été approuvée par l'officier d'état civil.";
        subject = `Déclaration de mariage #${declaration.id_declaration} - Acceptée`;
        buttonLink = {
          url: `https://mariage.example.com/declarations/${declaration.id_declaration}`,
          text: "Voir les détails"
        };
        break;
      case 'refuse':
        title = "Déclaration de mariage refusée";
        description = "Votre déclaration de mariage a été refusée par l'officier d'état civil.";
        subject = `Déclaration de mariage #${declaration.id_declaration} - Refusée`;
        break;
      default:
        title = "Mise à jour de votre déclaration de mariage";
        description = "Nouvelle information concernant votre déclaration de mariage.";
        subject = `Mise à jour - Déclaration de mariage #${declaration.id_declaration}`;
    }
    
    // Créer l'email
    const emailOptions = createDeclarationEmail({
      title,
      description,
      declaration,
      message,
      from: "Maryme",
      to,
      subject,
      buttonLink
    });
    
    // Envoyer l'email
    let info = await transporter.sendMail(emailOptions);
    console.log("Email envoyé:", info.messageId);
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return undefined;
  }
}

/**
 * Fonction pour envoyer un email de notification pour une nouvelle opposition
 * @param {Object} options - Options pour l'email
 * @param {string} options.to - Email du destinataire
 * @param {object} options.declaration - Objet contenant les informations de la déclaration
 * @param {object} options.opposition - Objet contenant les informations sur l'opposition
 * @returns {Promise} - Résultat de l'envoi d'email
 */
async function sendOppositionNotificationEmail({ to, declaration, opposition }) {
  try {
    const title = "⚠️ Nouvelle opposition à votre déclaration de mariage";
    const description = "Une opposition a été enregistrée concernant votre déclaration de mariage.";
    const subject = `Opposition - Déclaration de mariage #${declaration.id_declaration}`;
    
    // Message personnalisé incluant les détails de l'opposition
    const message = `
    Une opposition a été enregistrée sur votre déclaration de mariage.
    
    <strong>Motif de l'opposition:</strong> ${opposition.motif}
    <strong>Date de l'opposition:</strong> ${new Date(opposition.date_opposition).toLocaleDateString('fr-FR')}
    
    Veuillez contacter le service d'état civil pour plus d'informations.
    `;
    
    // Créer l'email
    const emailOptions = createDeclarationEmail({
      title,
      description,
      declaration,
      message,
      from: "Maryme",
      to,
      subject,
      buttonLink: {
        url: `https://mariage.example.com/declarations/${declaration.id_declaration}`,
        text: "Voir les détails"
      }
    });
    
    // Envoyer l'email
    let info = await transporter.sendMail(emailOptions);
    console.log("Email d'opposition envoyé:", info.messageId);
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email d'opposition:", error);
    return undefined;
  }
}

/**
 * Fonction pour envoyer un email de rappel pour une déclaration en attente
 * @param {Object} options - Options pour l'email
 * @param {string} options.to - Email du destinataire
 * @param {object} options.declaration - Objet contenant les informations de la déclaration
 * @returns {Promise} - Résultat de l'envoi d'email
 */
async function sendReminderEmail({ to, declaration }) {
  try {
    const title = "Rappel: Déclaration de mariage en attente";
    const description = "Votre déclaration de mariage est toujours en cours de traitement.";
    const subject = `Rappel - Déclaration de mariage #${declaration.id_declaration}`;
    
    // Calculer le nombre de jours depuis la déclaration
    const declarationDate = new Date(declaration.date_declaration);
    const today = new Date();
    const diffTime = Math.abs(today - declarationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Message personnalisé
    const message = `
    Nous vous rappelons que votre déclaration de mariage déposée il y a ${diffDays} jours est toujours en cours de traitement.
    Si vous avez des questions ou si vous souhaitez modifier votre déclaration, n'hésitez pas à contacter le service d'état civil.
    `;
    
    // Créer l'email
    const emailOptions = createDeclarationEmail({
      title,
      description,
      declaration,
      message,
      from: "Maryme",
      to,
      subject,
      buttonLink: {
        url: `https://mariage.example.com/declarations/${declaration.id_declaration}`,
        text: "Voir ma déclaration"
      }
    });
    
    // Envoyer l'email
    let info = await transporter.sendMail(emailOptions);
    console.log("Email de rappel envoyé:", info.messageId);
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de rappel:", error);
    return undefined;
  }
}


/**
 * Fonction pour envoyer un email par l'officier 
 * @param {Object} options - Options pour l'email
 * @param {string} options.to - Email du destinataire
 * @param {object} options.declaration - Objet contenant les informations de la déclaration
 * @param {string} options.message - Contenu du message
 * @returns {Promise} - Résultat de l'envoi d'email
 */
async function sendMessageEmail({ to, declaration, message }) {
    try {
      const title = "Déclaration de mariage";
      const description = "Votre déclaration de mariage est toujours en cours de traitement.";
      const subject = `Message - Déclaration de mariage #${declaration.id_declaration}`;
      
      // Calculer le nombre de jours depuis la déclaration
      const declarationDate = new Date(declaration.date_declaration);
      const today = new Date();
      const diffTime = Math.abs(today - declarationDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Message personnalisé
      const msg = `
      Nous vous rappelons que votre déclaration de mariage déposée il y a ${diffDays} jours est toujours en cours de traitement.
      ${message}
      `;
      
      // Créer l'email
      const emailOptions = createDeclarationEmail({
        title,
        description,
        declaration,
        message: msg,
        from: "Maryme",
        to,
        subject,
        buttonLink: {
          url: `https://mariage.example.com/declarations/${declaration.id_declaration}`,
          text: "Voir ma déclaration"
        }
      });
      
      // Envoyer l'email
      let info = await transporter.sendMail(emailOptions);
      console.log("Email de rappel envoyé:", info.messageId);
      return info;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de rappel:", error);
      return undefined;
    }
  }
  
module.exports = { 
  sendDeclarationEmail,
  sendMessageEmail,
  sendOppositionNotificationEmail,
  sendReminderEmail,
  createDeclarationEmail
};