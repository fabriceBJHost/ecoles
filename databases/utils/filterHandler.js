const { Op } = require('sequelize')

/**
 * Transforme les filtres MUI DataGrid en clauses Sequelize
 * @param {Array} muiFilters - Le tableau filterModel.items
 * @returns {Object} - L'objet de condition Sequelize
 */
const buildSequelizeFilters = (muiFilters, quickFilter, searchableColumns = []) => {
  const where = {}

  if (!muiFilters || !Array.isArray(muiFilters)) return where

  muiFilters.forEach((filter) => {
    const { field, operator, value } = filter

    // On ignore les filtres qui n'ont pas de valeur (sauf pour "vide" / "pas vide")
    const hasNoValue = value === undefined || value === null || value === ''
    const isCheckEmpty = ['isEmpty', 'isNotEmpty'].includes(operator)

    if (hasNoValue && !isCheckEmpty) return

    switch (operator) {
      case 'contains':
        where[field] = { [Op.like]: `%${value}%` }
        break
      case 'doesNotContain': // "ne contient pas"
        where[field] = { [Op.notLike]: `%${value}%` }
        break
      case 'equals':
        where[field] = { [Op.eq]: value }
        break
      case 'doesNotEqual':
        where[field] = { [Op.ne]: value }
        break
      case 'startsWith':
        where[field] = { [Op.like]: `${value}%` }
        break
      case 'endsWith':
        where[field] = { [Op.like]: `%${value}` }
        break
      case 'isEmpty':
        where[field] = { [Op.or]: [{ [Op.eq]: null }, { [Op.eq]: '' }] }
        break
      case 'isNotEmpty':
        where[field] = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
        break
      case 'isAnyOf': // "fait partie de"
        where[field] = { [Op.in]: Array.isArray(value) ? value : [value] }
        break
      default:
        // Gestion des cas numériques ou autres non listés
        where[field] = { [Op.eq]: value }
    }
  })

  // 2. Gestion de la recherche globale (Quick Filter)
  if (quickFilter && searchableColumns.length > 0) {
    where[Op.or] = searchableColumns.map((col) => ({
      [col]: { [Op.like]: `%${quickFilter}%` }
    }))
  }

  return where
}

module.exports = { buildSequelizeFilters }
