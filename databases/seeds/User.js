const User = require('../Models/User')
const { database } = require('../database')
const { fakerFR: faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

const seedUser = async () => {
  try {
    await database.authenticate()
    console.log('Connexion réussie. Début du seeding...')

    const usersToCreate = []
    const roles = ['DIRECTEUR', 'SECRETAIRE', 'ENSEIGNANT', 'SURVEILLANT']
    const usedUsernames = new Set()

    // On pré-génère le hash pour gagner énormément de temps
    // (Bcrypt est lent, le faire 400 fois dans une boucle bloquera le script)
    const hashedDefaultPassword = bcrypt.hashSync('password123', 10)

    while (usersToCreate.length < 600) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()

      // --- CORRECTION ICI : faker.internet.username ---
      let username = faker.internet.username({ firstName, lastName }).toLowerCase()

      if (usedUsernames.has(username)) {
        username = `${username}${faker.number.int(1000)}`
      }
      usedUsernames.add(username)

      usersToCreate.push({
        school_id: faker.number.int({ min: 1, max: 21 }),
        username: username,
        password: hashedDefaultPassword, // Utilisation du hash pré-généré
        role: faker.helpers.arrayElement(roles),
        photo: faker.image.avatar()
      })
    }

    await User.bulkCreate(usersToCreate)

    console.log('✅ 400 utilisateurs générés avec succès !')
    process.exit()
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
    process.exit(1)
  }
}

seedUser()
