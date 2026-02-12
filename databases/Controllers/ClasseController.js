const Annee_Scolaire = require('../Models/Annee_Scolaire')
const Classes = require('../Models/Classes')
const { buildSequelizeFilters } = require('../utils/filterHandler')

class ClasseController {
  /**
   * handler for controller callback function
   * @param {Electron.IpcMain} IpcMain
   */
  classHandler = (IpcMain) => {
    /**
     * function to get all local classes
     */
    IpcMain.handle('allLocalClasse', async (event, formData) => {
      try {
        const { school_id, page, pageSize, filters, quickFilter } = formData
        const offset = page * pageSize
        const columnsToSearch = ['name', 'level', 'capacity', 'classroom']
        const dynamicFilters = buildSequelizeFilters(filters, quickFilter, columnsToSearch)
        let whereClause = { school_id: school_id, ...dynamicFilters }

        const result = await Classes.findAndCountAll({
          where: whereClause,
          limit: pageSize,
          offset: offset,
          raw: true,
          include: [
            {
              model: Annee_Scolaire
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
     * function to create classe
     */
    IpcMain.handle('createClasse', async (event, formData) => {
      try {
        const create = await Classes.create(formData)

        if (!create) {
          return { success: false, message: "Une erreur s'est produit, veuillez réesayer" }
        } else {
          return { success: true, message: 'Classe crée avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to delete classe
     */
    IpcMain.handle('deleteClasse', async (event, formData) => {
      try {
        const { id, school_id } = formData

        const deleted = await Classes.destroy({
          where: { id: id, school_id: school_id }
        })

        if (!deleted) {
          return { success: false, message: 'Classe non trouver' }
        } else {
          return { success: true, message: 'Classe supprimé avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to update classe
     */
    IpcMain.handle('updateClasse', async (event, formData) => {
      try {
        const { id, school_id, ...data } = formData

        const updated = await Classes.update(data, { where: { id: id, school_id: school_id } })

        if (updated > 0) {
          return { success: true, message: 'Classe a été modifier' }
        } else {
          return { success: false, message: "Une erreur s'est reproduit" }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to get classe by primary key
     */
    IpcMain.handle('getOneClasse', async (event, formData) => {
      try {
        const classe = await Classes.findByPk(formData.id)

        return { success: true, data: classe.dataValues }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new ClasseController()
