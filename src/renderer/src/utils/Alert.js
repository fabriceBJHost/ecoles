import Swal from 'sweetalert2'

/**
 * @description fonction qui affiche un popup message
 * @param {String} title titre de l'alert
 * @param {String} text corps du message de l'alert
 * @param {String} icon type d'icon ex: ['error', 'info', 'question', 'success', 'warning']
 * @param {String} buttonTxt texte sur le bouton de confirmation
 * @param {String} buttonColor couleur du bouton de confirmation
 */
export const Alert = (title, text, icon, buttonTxt, buttonColor) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: buttonTxt,
    confirmButtonColor: buttonColor,
    customClass: {
      popup: 'swal-custom-zindex'
    }
  })
}

/**
 * @description Confirmation avant une action importante
 * @param {String} title Titre
 * @param {String} text Message
 * @param {String} icon types d'Icone ['error', 'info', 'question', 'success', 'warning']
 * @param {String} confirmText Texte du bouton de confirmation
 * @param {String} confirmColor Couleur du bouton confirmer
 * @param {String} cancelText Texte du bouton annuler
 */
export const Confirm = async (
  title,
  text,
  icon,
  confirmText = 'Oui',
  confirmColor = '#3085d6',
  cancelText = 'Annuler'
) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    confirmButtonColor: confirmColor,
    cancelButtonText: cancelText,
    cancelButtonColor: 'var(--error)',
    customClass: {
      popup: 'swal-custom-zindex'
    }
  }).then((result) => result.isConfirmed)
}

/**
 * @description Prompt pour demander une saisie utilisateur
 * @param {String} title Titre
 * @param {String} inputLabel Texte d’indication
 * @param {String} inputPlaceholder Placeholder
 */
export const Prompt = async (title, inputLabel = '', inputPlaceholder = '') => {
  return Swal.fire({
    title,
    input: 'text',
    inputLabel,
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonText: 'OK',
    confirmButtonColor: 'var(--primary)',
    cancelButtonText: 'Annuler',
    cancelButtonColor: 'var(--warning)',
    customClass: {
      popup: 'swal-custom-zindex'
    }
  }).then((result) => (result.isConfirmed ? result.value : null))
}
