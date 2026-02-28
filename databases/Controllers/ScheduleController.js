const Classes = require('../Models/Classes')
const Matiere = require('../Models/Matiere')
const Schedule = require('../Models/Schedule')
const User = require('../Models/User')

class ScheduleController {
  /**
   * handler of all schedule function
   * @param {Electron.IpcMain} IpcMain
   */
  scheduleHandler = (IpcMain) => {
    /**
     * function to create schedule
     */
    IpcMain.handle('createShedule', async (event, formData) => {
      try {
        const create = await Schedule.create(formData)

        if (!create) {
          return { success: false, message: "Une erreur s'est produit, veuillez réesayer" }
        } else {
          return { success: true, message: 'Emploi du temps crée avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })

    /**
     * function to get all schedule
     */
    IpcMain.handle('getSchedule', async (event, formData) => {
      try {
        const { school_id, class_id } = formData

        const result = await Schedule.findAll({
          where: { school_id, class_id },
          include: [
            {
              model: Matiere,
              required: true
            },
            {
              model: User,
              required: true
            },
            {
              model: Classes,
              required: true
            }
          ],
          raw: true
        })

        return { success: true, data: result }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new ScheduleController()
