import dayjs from 'dayjs'

/**
 * Formate un numéro de téléphone de manière lisible.
 * Gère les formats : 0612345678, +33612345678, 0033612345678
 * * @param {string} phone - Le numéro brut
 * @param {string} separator - Le séparateur (espace par défaut)
 * @returns {string} - Le numéro formaté ou le numéro brut si invalide
 */
export const formatPhoneNumber = (phone, separator = ' ') => {
  if (!phone) return ''

  // 1. On nettoie tout ce qui n'est pas un chiffre ou le signe '+'
  let cleaned = phone
    .toString()
    .trim()
    .replace(/[^\d+]/g, '')

  // 2. Gestion du format International (+33 ou 0033)
  if (cleaned.startsWith('+') || cleaned.startsWith('00')) {
    // Si ça commence par 00, on remplace par +
    if (cleaned.startsWith('00')) {
      cleaned = '+' + cleaned.substring(2)
    }

    // Format : +33 6 12 34 56 78
    // On isole l'indicatif (2 ou 3 chiffres) et le reste
    const match = cleaned.match(/^(\+\d{1,3})(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/)
    if (match) {
      return `${match[1]}${separator}${match[2]}${separator}${match[3]}${separator}${match[4]}${separator}${match[5]}${separator}${match[6]}`
    }
  }

  // 3. Gestion du format Local (ex: 0612345678)
  const matchLocal = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
  if (matchLocal) {
    return matchLocal.slice(1).join(separator)
  }

  // Retourne le numéro tel quel si aucun pattern ne correspond
  return cleaned
}

/**
 * function who format date
 * @param {Date} date
 * @returns {string}
 */
export const parseDate = (date) => {
  if (!date) return null
  const dateParsed = dayjs(date).format('DD-MM-YYYY')

  return dateParsed
}
