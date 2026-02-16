const Matiere = require('../Models/Matiere')
const User = require('../Models/User')
const UserMatiere = require('../Models/UserMatiere')
const { buildSequelizeFilters } = require('../utils/filterHandler')

class MatiereController {
  /**
   * fuction to handle all function matierecontroller
   * @param {Electron.IpcMain} IpcMain
   */
  matiereHandler = (IpcMain) => {
    /**
     * function to create new matiere
     */
    IpcMain.handle('createMatiere', async (event, formData) => {
      try {
        const created = await Matiere.create(formData)

        if (!created) {
          return { success: false, message: "Une erreur s'est produit, veuillez réesayer" }
        } else {
          return { success: true, message: 'Matiere crée avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to get all matiere
     */
    IpcMain.handle('getMatieres', async (event, formData) => {
      try {
        const { school_id, page, pageSize, filters, quickFilter } = formData
        const offset = page * pageSize
        const columnsToSearch = []

        const dynamicFilters = buildSequelizeFilters(filters, quickFilter, columnsToSearch)
        let whereClause = { school_id: school_id, ...dynamicFilters }

        const result = await Matiere.findAndCountAll({
          where: whereClause,
          limit: pageSize,
          offset: offset,
          raw: true,
          include: [
            {
              model: User, // On demande le modèle User directement
              required: false
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
     * function to get one matiere
     */
    IpcMain.handle('getOneMatiere', async (event, formData) => {
      try {
        const { id, school_id } = formData

        const matiere = await Matiere.findOne({ where: { id: id, school_id: school_id } })

        return { success: true, data: matiere.dataValues }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to delete matier
     */
    IpcMain.handle('deleteMatiere', async (event, formData) => {
      try {
        const { id, school_id } = formData

        const deleted = await Matiere.destroy({ where: { id: id, school_id: school_id } })

        if (deleted === 0) {
          return { success: false, message: 'Matiere non trouver' }
        } else {
          return { success: true, message: 'Matiere supprimé avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to update matieres
     */
    IpcMain.handle('updateMatiere', async (event, formData) => {
      try {
        const { id, school_id, ...data } = formData

        const [rowsAffected] = await Matiere.update(data, {
          where: { id: id, school_id: school_id }
        })

        if (rowsAffected > 0) {
          return { success: true, message: 'Matiere a été modifier' }
        } else {
          return { success: false, message: "Une erreur s'est reproduit" }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    IpcMain.handle('asingMatiereToProf', async (event, formData) => {
      try {
        const { matiere_id, user_id } = formData

        for (let index = 0; index < user_id.length; index++) {
          await UserMatiere.create({
            user_id: user_id[index],
            matiere_id
          })
        }

        return { success: true, message: 'Matiere a été assigner a un professeur' }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new MatiereController()
