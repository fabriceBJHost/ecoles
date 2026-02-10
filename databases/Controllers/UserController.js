const Role = require('../Models/Role')
const User = require('../Models/User')
const { buildSequelizeFilters } = require('../utils/filterHandler')
const bcrypt = require('bcryptjs')

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
        const columnsToSearch = [
          'username',
          'firstname',
          'lastname',
          'numbers1',
          'address',
          'Role.nom'
        ]
        // Construction dynamique du filtre
        const dynamicFilters = buildSequelizeFilters(filters, quickFilter, columnsToSearch)
        let whereClause = { school_id: school_id, ...dynamicFilters }

        const result = await User.findAndCountAll({
          where: whereClause,
          limit: pageSize,
          offset: offset,
          raw: true,
          include: [
            {
              model: Role,
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

    /**
     * function to update users
     */
    IpcMain.handle('updateUsers', async (event, formData) => {
      try {
        const { id, school_id, ...data } = formData

        const updated = await User.update(data, { where: { id: id, school_id: school_id } })

        if (updated > 0) {
          return { success: true, message: "L'utilisateur a été modifier" }
        } else {
          return { success: false, message: "Une erreur s'est reproduit" }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to update password
     */
    IpcMain.handle('updatePassword', async (event, formData) => {
      try {
        const { id, school_id, password, oldPassword } = formData

        const user = await User.findOne({ where: { id: id, school_id: school_id } })
        const userPassword = user.dataValues.password

        if (await bcrypt.compare(oldPassword, userPassword)) {
          const hashedPassword = bcrypt.hashSync(password, 10)
          const data = {
            password: hashedPassword
          }
          await User.update(data, { where: { id: id, school_id: school_id } })

          return { success: true, message: 'Mot de passe a été modifier avec succès' }
        } else {
          return { success: false, message: 'Mot de passe Incorrect' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new UserController()
