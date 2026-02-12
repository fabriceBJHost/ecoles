const Annee_Scolaire = require('../Models/Annee_Scolaire')
const { buildSequelizeFilters } = require('../utils/filterHandler')

class Annee_ScolaireController {
  /**
   * function to handle all annee scolaire function
   * @param {Electron.IpcMain} IpcMain
   */
  anneeScolaireHandler = (IpcMain) => {
    /**
     * function to get all année scolaire
     */
    IpcMain.handle('allAnneeScolaire', async (event, formData) => {
      try {
        const { school_id, page, pageSize, filters, quickFilter } = formData
        const offset = page * pageSize
        const columnsToSearch = ['name', 'start_date', 'end_date', 'is_active']
        const dynamicFilters = buildSequelizeFilters(filters, quickFilter, columnsToSearch)
        let whereClause = { school_id: school_id, ...dynamicFilters }

        const result = await Annee_Scolaire.findAndCountAll({
          where: whereClause,
          limit: pageSize,
          offset: offset,
          raw: true,
          subQuery: false
        })

        return { success: true, data: result.rows, count: result.count }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to create année scolaire
     */
    IpcMain.handle('createAnneeScolaire', async (event, formData) => {
      try {
        const created = await Annee_Scolaire.create(formData)

        if (!created) {
          return { success: false, message: "Une erreur s'est produit, veuillez réesayer" }
        } else {
          return { success: true, message: 'Année scolaire crée avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to get list of année scolaire
     */
    IpcMain.handle('getAnneeScolaireList', async (event, formData) => {
      try {
        const { school_id } = formData

        const result = await Annee_Scolaire.findAll({
          where: { school_id: school_id },
          raw: true
        })

        return { success: true, data: result }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to delete année scolaire
     */
    IpcMain.handle('deleteAnneeScolaire', async (event, formData) => {
      try {
        const { school_id, id } = formData

        const deleted = await Annee_Scolaire.destroy({
          where: { id: id, school_id: school_id }
        })

        if (deleted === 0) {
          return { success: false, message: 'Année scolaire non trouver' }
        } else {
          return { success: true, message: "L'année scolaire a été supprimé définitivement" }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to update année scolaire
     */
    IpcMain.handle('updateAnneeScolaire', async (event, formData) => {
      try {
        const { school_id, id, ...data } = formData

        const [rowsAffected] = await Annee_Scolaire.update(data, {
          where: { id: id, school_id: school_id }
        })

        if (rowsAffected > 0) {
          return { success: true, message: "L'année scolaire a été modifié avec succès" }
        } else {
          return { success: false, message: "Une erreur s'est reproduit" }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to get one année scolaire
     */
    IpcMain.handle('getOneAnneeScolaire', async (event, formData) => {
      try {
        const { school_id, id } = formData

        const scolaire = await Annee_Scolaire.findOne({
          where: { id: id, school_id: school_id }
        })

        return { success: true, data: scolaire.dataValues }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new Annee_ScolaireController()
