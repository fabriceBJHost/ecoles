const Eleve = require('../Models/Eleve')
const School = require('../Models/School')
const Annee_Scolaire = require('../Models/Annee_Scolaire')
const { database } = require('../database')
const { fakerFR: faker } = require('@faker-js/faker')

const seedEleves = async () => {
  try {
    await database.authenticate()
    console.log('Connexion établie. Préparation du seeding des eleves...')

    // 1. Récupérer les données nécessaires pour les clés étrangères
    const schools = await School.findAll({ attributes: ['id'] })
    const anneeScolaire = await Annee_Scolaire.findAll()

    if (schools.length === 0 || anneeScolaire.length === 0) {
      console.error("❌ Erreur : Vous devez d'abord peupler les tables Schools et Roles !")
      process.exit(1)
    }

    const schoolIds = schools.map((s) => s.id)

    const elevesToCreate = []

    console.log('Génération des 10 000 eleves en cours...')

    for (let index = 0; index < 10000; index++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()

      elevesToCreate.push({
        school_id: faker.helpers.arrayElement(schoolIds),
        academic_year_id: faker.helpers.arrayElement(anneeScolaire).id,
        firstname: firstName,
        lastname: lastName,
        photos: faker.image.avatar(),
        address: faker.location.streetAddress(true).substring(0, 300),
        birthdate: faker.date.between({ from: '1997-01-01', to: new Date() }),
        status: 'ACTIF'
      })
    }

    // 2. Insertion massive
    await Eleve.bulkCreate(elevesToCreate)

    console.log(`✅ ${elevesToCreate.length} eleves générés avec succès !`)
    process.exit()
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
    process.exit(1)
  }
}

seedEleves()
