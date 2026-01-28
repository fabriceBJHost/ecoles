const School = require('../Models/School')
const User = require('../Models/User')
const bcrypt = require('bcryptjs')

class AuthController {
  /**
   * handler pour tous les utilisateurs
   * @param {Electron.IpcMain} IpcMain
   */
  userHandler = (IpcMain) => {
    IpcMain.handle('login', async (event, formData) => {
      try {
        const { username, password } = formData
        const user = await User.findOne({
          where: { username },
          include: [
            {
              model: School
            }
          ]
        })

        if (!user) {
          return { success: false, message: 'Utilisateur non trouvé' }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {
          // Retournez les données utiles (évitez de renvoyer le hash du mot de passe)
          return {
            success: true,
            user: {
              id: user.id,
              username: user.username,
              role: user.role,
              photo: user.photo,
              school: user.School.dataValues
            }
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
