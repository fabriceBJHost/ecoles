const Annee_Scolaire = require('../Models/Annee_Scolaire')
const Eleve = require('../Models/Eleve')
const { buildSequelizeFilters } = require('../utils/filterHandler')

class EleveController {
  /**
   * function to handle all eleve controller function
   * @param {Electron.IpcMain} IpcMain
   */
  eleveHandler = (IpcMain) => {
    /**
     * function to create new etudiants
     */
    IpcMain.handle('createEleves', async (event, formData) => {
      try {
        const created = await Eleve.create(formData)

        if (!created) {
          return { success: false, message: "Une erreur s'est produit, veuillez réesayer" }
        } else {
          return { success: true, message: 'Etudiant crée avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to get all etudiants
     */
    IpcMain.handle('getEtudiants', async (event, formData) => {
      try {
        const { school_id, page, pageSize, filters, quickFilter } = formData
        const offset = page * pageSize
        const columnsToSearch = []
        const dynamicFilters = buildSequelizeFilters(filters, quickFilter, columnsToSearch)
        let whereClause = { school_id: school_id, ...dynamicFilters }

        const result = await Eleve.findAndCountAll({
          where: whereClause,
          limit: pageSize,
          offset: offset,
          raw: true,
          include: [
            {
              model: Annee_Scolaire,
              required: true
            }
          ],
          subQuery: false
        })

        return { success: true, data: result.rows, count: result.count }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to uppdte etudiants
     */
    IpcMain.handle('updateEtudiants', async (event, formData) => {
      try {
        const { school_id, id, ...data } = formData

        const [rowsAffected] = await Eleve.update(data, { where: { id: id, school_id: school_id } })

        if (rowsAffected > 0) {
          return { success: true, message: 'Etudiant a été modifier' }
        } else {
          return { success: false, message: "Une erreur s'est reproduit" }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to delete etudiants
     */
    IpcMain.handle('deleteEtudiants', async (event, formData) => {
      try {
        const { id, school_id } = formData

        const deleted = await Eleve.destroy({
          where: { id: id, school_id: school_id }
        })

        if (deleted === 0) {
          return { success: false, message: 'Etudiant non trouver' }
        } else {
          return { success: true, message: 'Etudiant supprimé avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to get one etudiants
     */
    IpcMain.handle('getOneEleves', async (event, formData) => {
      try {
        const { id, school_id } = formData

        const result = await Eleve.findOne({ where: { id: id, school_id: school_id } })

        return { success: true, data: result.dataValues }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new EleveController()
