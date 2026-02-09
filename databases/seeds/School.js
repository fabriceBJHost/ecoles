const { fakerFR: faker } = require('@faker-js/faker')
const { database } = require('../database')
const School = require('../Models/School')

const seedSchool = async () => {
  try {
    // Connexion et synchronisation
    await database.authenticate()
    console.log('Connexion établie pour le seeding...')

    const schoolsToCreate = []

    for (let i = 0; i < 20; i++) {
      // Génération de données fictives
      const schoolName =
        faker.company.name() +
        ' ' +
        faker.helpers.arrayElement(['Lycée', 'Académie', 'Institut', 'École Primaire'])

      schoolsToCreate.push({
        name: schoolName,
        address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
        number1: faker.phone.number({ style: 'national' }).replace(/\s/g, '').substring(0, 15),
        number2: faker.phone.number({ style: 'national' }).replace(/\s/g, '').substring(0, 15),
        logo: faker.image.url({ category: 'education', width: 200, height: 200 })
        // created_at et updated_at sont gérés automatiquement par database si timestamps: true
      })
    }

    // Insertion massive (Bulk Create)
    await School.bulkCreate(schoolsToCreate, { validate: true })

    console.log('✅ 20 écoles ont été générées avec succès !')
    process.exit() // Quitter le script
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
    process.exit(1)
  }
}

seedSchool()
