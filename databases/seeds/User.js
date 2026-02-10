const User = require('../Models/User')
const School = require('../Models/School')
const Role = require('../Models/Role')
const { database } = require('../database')
const { fakerFR: faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

const seedUser = async () => {
  try {
    await database.authenticate()
    console.log('Connexion établie. Préparation du seeding des utilisateurs...')

    // 1. Récupérer les données nécessaires pour les clés étrangères
    const schools = await School.findAll({ attributes: ['id'] })
    const roles = await Role.findAll()

    if (schools.length === 0 || roles.length === 0) {
      console.error("❌ Erreur : Vous devez d'abord peupler les tables Schools et Roles !")
      process.exit(1)
    }

    const schoolIds = schools.map((s) => s.id)
    const usersToCreate = []
    const usedUsernames = new Set()

    // Hash pré-généré (password123)
    const hashedDefaultPassword = bcrypt.hashSync('password123', 10)

    console.log('Génération des 600 utilisateurs en cours...')

    while (usersToCreate.length < 600) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()

      // ✅ Correction pour Faker 10.2 : utiliser .username()
      let username = faker.internet.username({ firstName, lastName }).toLowerCase()

      if (usedUsernames.has(username)) {
        username = `${username}${faker.number.int(9999)}`
      }
      usedUsernames.add(username)

      usersToCreate.push({
        school_id: faker.helpers.arrayElement(schoolIds),
        role_id: faker.helpers.arrayElement(roles).id,
        username: username,
        password: hashedDefaultPassword,
        firstname: firstName,
        lastname: lastName,
        photo: faker.image.avatar(),
        // On s'assure que le numéro ne dépasse pas 15 caractères
        numbers1: faker.phone.number().substring(0, 15),
        numbers2: faker.helpers.maybe(() => faker.phone.number().substring(0, 15)),
        address: faker.location.streetAddress(true).substring(0, 300)
      })
    }

    // 2. Insertion massive
    await User.bulkCreate(usersToCreate)

    console.log(`✅ ${usersToCreate.length} utilisateurs générés avec succès !`)
    process.exit()
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
    process.exit(1)
  }
}

seedUser()
