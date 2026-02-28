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

/**
 * function to get one single users
 * @param {Object} formData
 * @returns {Object}
 */
export const getListUser = async (formData) => {
  const response = await window.users.getListUsers(formData)

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
 * function to get list of all local classes
 * @param {Object} formData
 * @returns {Array}
 */
export const listClasse = async (formData) => {
  const response = await window.classe.listClasse(formData)

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

// -------------------------------------- eleves ------------------------------------

/**
 * function to get all eleves
 * @param {Object} formData
 * @returns {Object}
 */
export const getEleves = async (formData) => {
  const response = await window.etudiant.getEtudiant(formData)

  return response
}

/**
 * function to create eleves
 * @param {Object} formData
 * @returns {Object}
 */
export const createEleves = async (formData) => {
  const response = await window.etudiant.createEtudiant(formData)

  return response
}

/**
 * function to get one eleves
 * @param {Object} formData
 * @returns {Object}
 */
export const getOneEleves = async (formData) => {
  const response = await window.etudiant.getOneEtudiant(formData)

  return response
}

/**
 * function to delete eleves
 * @param {Object} formData
 * @returns {Object}
 */
export const deleteEleves = async (formData) => {
  const response = await window.etudiant.deleteEtudiant(formData)

  return response
}

/**
 * function to update eleves
 * @param {Object} formData
 * @returns {Object}
 */
export const updateEleves = async (formData) => {
  const response = await window.etudiant.updateEtudiant(formData)

  return response
}

// ----------------------------------- matieres -----------------------------

/**
 * function to get matiere
 * @param {Object} formData
 * @returns {Object}
 */
export const getMatieres = async (formData) => {
  const response = await window.matiere.getMatiere(formData)

  return response
}

/**
 * function to get one matiere
 * @param {Object} formData
 * @returns {Object}
 */
export const getOneMatieres = async (formData) => {
  const response = await window.matiere.getOneMatiere(formData)

  return response
}

/**
 * function to delete matiere
 * @param {Object} formData
 * @returns {Object}
 */
export const deleteMatieres = async (formData) => {
  const response = await window.matiere.deleteMatiere(formData)

  return response
}

/**
 * function to create matiere
 * @param {Object} formData
 * @returns {Object}
 */
export const createMatieres = async (formData) => {
  const response = await window.matiere.createMatiere(formData)

  return response
}

/**
 * function to create matiere
 * @param {Object} formData
 * @returns {Object}
 */
export const updateMatieres = async (formData) => {
  const response = await window.matiere.updateMatiere(formData)

  return response
}

/**
 * function to get userId from table pivot userMatiere
 * @param {Object} formData
 * @returns {Object}
 */
export const getUserIdUserMatieres = async (formData) => {
  const response = await window.matiere.getUserIdUserMatieres(formData)

  return response
}

/**
 * function to assign matiere to prof
 * @param {Object} formData
 * @returns {Object}
 */
export const asingMatiereToProf = async (formData) => {
  const response = await window.matiere.asingMatiereToProf(formData)

  return response
}

// ---------------------------------------- schedule ---------------------------------

/**
 * function to create emploi du temps
 * @param {Object} formData
 * @returns {Object}
 */
export const createShedule = async (formData) => {
  const response = await window.schedule.createShedule(formData)

  return response
}

/**
 * function to get emploi du temps
 * @param {Object} formData
 * @returns {Array}
 */
export const getSchedule = async (formData) => {
  const response = await window.schedule.getSchedule(formData)

  return response
}
