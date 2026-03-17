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

    /**
     * function to update schedules
     */
    IpcMain.handle('updateSchedules', async (event, formData) => {
      try {
        const schedules = formData // C'est ton tableau de 16 objets

        if (!schedules || schedules.length === 0) {
          return { success: false, message: 'Aucune donnée à enregistrer' }
        }

        // 1. Nettoyage des données
        // On ne garde que les champs qui existent réellement dans ta table SQL
        const cleanSchedules = schedules.map((item) => ({
          id: item.id,
          school_id: item.school_id,
          class_id: item.class_id,
          subject_id: item.subject_id,
          teacher_id: item.teacher_id,
          day: item.day,
          start_time: item.start_time,
          end_time: item.end_time
        }))

        // 2. Mise à jour massive
        await Schedule.bulkCreate(cleanSchedules, {
          updateOnDuplicate: ['subject_id', 'teacher_id', 'day', 'start_time', 'end_time']
        })

        return { success: true, message: 'Emploi du temps mis à jour avec succès' }
      } catch (error) {
        console.error('Erreur Backend:', error)
        return { success: false, message: 'Erreur : ' + error.message }
      }
    })

    /**
     * function to get one schedules
     */
    IpcMain.handle('getOneSchedules', async (event, formData) => {
      try {
        const { id, school_id, class_id } = formData

        const result = await Schedule.findOne({
          where: { id, school_id, class_id },
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
          ]
        })

        return { success: true, datra: result.dataValues }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new ScheduleController()
