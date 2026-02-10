const Role = require('../Models/Role')
const School = require('../Models/School')
const User = require('../Models/User')
const bcrypt = require('bcryptjs')

class AuthController {
  /**
   * handler pour tous les utilisateurs
   * @param {Electron.IpcMain} IpcMain
   */
  userHandler = (IpcMain) => {
    /**
     * function to log in
     */
    IpcMain.handle('login', async (event, formData) => {
      try {
        const { username, password } = formData
        const user = await User.findOne({
          where: { username },
          include: [
            {
              model: School
            },
            {
              model: Role
            }
          ]
        })

        if (!user) {
          return { success: false, message: 'Utilisateur introuvable' }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {
          // Retournez les données utiles (évitez de renvoyer le hash du mot de passe)
          const userToSend = user.dataValues
          delete userToSend.password

          return {
            success: true,
            userToSend
          }
        } else {
          return { success: false, message: 'Mot de passe incorrect' }
        }
      } catch (error) {
        return { success: false, message: 'Erreur: ' + error }
      }
    })
  }
}

module.exports = new AuthController()
