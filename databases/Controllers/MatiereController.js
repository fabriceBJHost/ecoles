const Matiere = require('../Models/Matiere')

class MatiereController {
  /**
   * fuction to handle all function matierecontroller
   * @param {Electron.IpcMain} IpcMain
   */
  matiereHandler = (IpcMain) => {
    IpcMain.handle('createMatiere', async (event, formData) => {
      try {
        const created = Matiere.create(formData)

        if (!created) {
          return { success: false, message: "Une erreur s'est produit, veuillez réesayer" }
        } else {
          return { success: true, message: 'Matiere crée avec succès' }
        }
      } catch (error) {
        return { success: false, message: error }
      }
    })
  }
}

module.exports = new MatiereController()
