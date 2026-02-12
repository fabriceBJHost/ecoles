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
 * function to get one single users
 * @param {Object} formData
 * @returns {Object}
 */
export const getOneUser = async (formData) => {
  const response = await window.users.getOneUsers(formData)

  return response
}

// ---------------------------------------- classe -------------------------------------

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

// ------------------------------------ année scolaire ------------------------------

/**
 * function to get all année scolaire
 * @param {Object} formData
 * @returns {Object}
 */
export const getAllAnneeScolaire = async (formData) => {
  const response = await window.anneeScolaire.getAllAnnee(formData)

  return response
}

/**
 * function to create année scolaire
 * @param {Object} formData
 * @returns {Object}
 */
export const createAnneeScolaire = async (formData) => {
  const response = await window.anneeScolaire.createAnneeScolaire(formData)

  return response
}

/**
 * function to get list année scolaire
 * @param {Object} formData
 * @returns {Object}
 */
export const getAnneeScolaireList = async (formData) => {
  const response = await window.anneeScolaire.getListAnnee(formData)

  return response
}

/**
 * function to delete année scolaire
 * @param {Object} formData
 * @returns {Object}
 */
export const deleteAnneeScolaire = async (formData) => {
  const response = await window.anneeScolaire.deleteAnnee(formData)

  return response
}

/**
 * function to update année scolaire
 * @param {Object} formData
 * @returns {Object}
 */
export const updateAnneeScolaire = async (formData) => {
  const response = await window.anneeScolaire.updateAnneeScolaire(formData)

  return response
}

/**
 * function to get one année scolaire
 * @param {Object} formData
 * @returns {Object}
 */
export const getOneAnneeScolaire = async (formData) => {
  const response = await window.anneeScolaire.getOneAnneeScolaire(formData)

  return response
}
