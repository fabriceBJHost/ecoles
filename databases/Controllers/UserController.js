const User = require('../Models/User')
const { buildSequelizeFilters } = require('../utils/filterHandler')

class UserController {
  /**
   * handler pour tous les utilisateurs
   * @param {Electron.IpcMain} IpcMain
   */
  userHandler = (IpcMain) => {
    /**
     * get all users in same school
     */
    IpcMain.handle('getLocalUsers', async (event, formData) => {
      try {
        const { school_id, page, pageSize, filters, quickFilter } = formData
        const offset = page * pageSize
        const columnsToSearch = ['username', 'role']
        // Construction dynamique du filtre
        const dynamicFilters = buildSequelizeFilters(filters, quickFilter, columnsToSearch)
        let whereClause = { school_id: school_id, ...dynamicFilters }

        const result = await User.findAndCountAll({
          where: whereClause,
          limit: pageSize,
          offset: offset,
          raw: true
        })

        return { success: true, data: result.rows, count: result.count }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to delete users
     */
    IpcMain.handle('deleteUsers', async (event, formData) => {
      try {
        const { id, school_id } = formData

        const deleted = await User.destroy({
          where: { id: id, school_id: school_id }
        })

        if (!deleted) {
          return { success: false, message: 'Utilisateur non trouver' }
        } else {
          return { success: true, message: 'Utilisateur supprimé avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new UserController()
