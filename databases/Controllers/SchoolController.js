const School = require('../Models/School')

class SchoolController {
  /**
   * handler for all function in controller
   * @param {Electron.IpcMain} IpcMain
   */
  schoolHandler = (IpcMain) => {
    /**
     * function to get info of the curent school
     */
    IpcMain.handle('getInfoSchool', async (event, formData) => {
      try {
        const { school_id } = formData

        const schoolInfo = await School.findByPk(school_id)

        return { success: true, data: schoolInfo.dataValues }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new SchoolController()
