const Matiere = require('../Models/Matiere')
const User = require('../Models/User')
const UserMatiere = require('../Models/UserMatiere')

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
        const { school_id } = formData

        const result = await Matiere.findAll({
          where: { school_id: school_id },
          raw: true,
          include: [
            {
              model: User,
              required: false
            }
          ],
          subQuery: false
        })

        return { success: true, data: result }
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

    /**
     * function to asign matiere to users
     */
    IpcMain.handle('asingMatiereToProf', async (event, formData) => {
      try {
        const { matiere_id, user_id, school_id } = formData

        // 1. On supprime toutes les relations existantes pour cette matière spécifique
        await UserMatiere.destroy({
          where: { matiere_id: matiere_id, school_id }
        })

        // 2. On prépare les données pour une insertion groupée (plus performant qu'une boucle)
        const records = user_id.map((id) => ({
          user_id: id,
          matiere_id: matiere_id,
          school_id
        }))

        // 3. On insère tout d'un coup
        await UserMatiere.bulkCreate(records)

        return { success: true, message: 'Assignations mises à jour avec succès' }
      } catch (error) {
        return { success: false, message: error.message }
      }
    })

    /**
     * function to get matiere_id from usermatieres pivot table
     */
    IpcMain.handle('getUserIdFromUserMatieres', async (event, formData) => {
      try {
        const { school_id, matiere_id } = formData

        const result = await UserMatiere.findAll({
          where: { school_id: school_id, matiere_id: matiere_id },
          raw: true
        })

        return { success: true, data: result }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new MatiereController()
