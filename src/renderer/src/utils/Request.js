/**
 * function to delete users
 * @param {Object} formData
 * @returns {Object}
 */
export const deleteUsers = async (formData) => {
  const response = await window.users.deleteUsers(formData)

  return response
}

/**
 * function to get all local classes
 * @param {Object} formData
 * @returns {Array}
 */
export const allLocalClasse = async (formData) => {
  const response = await window.classe.getClasse(formData)

  return response
}

/**
 * function to create classe
 * @param {Object} formData
 * @returns {Object}
 */
export const createClasse = async (formData) => {
  const response = await window.classe.createClasse(formData)

  return response
}

/**
 * function to delete classe
 * @param {Object} formData
 * @returns {Object}
 */
export const deleteClasse = async (formData) => {
  const response = await window.classe.deleteClasse(formData)

  return response
}

/**
 * function to find one classe by id
 * @param {Object} formData
 * @returns {Object}
 */
export const getClasseByPk = async (formData) => {
  const response = await window.classe.getOneClasse(formData)

  return response
}

/**
 * function to update classe
 * @param {Object} formData
 * @returns {Object}
 */
export const updateClasse = async (formData) => {
  const response = await window.classe.updateClasse(formData)

  return response
}
