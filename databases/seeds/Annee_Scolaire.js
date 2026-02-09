const { fakerFR: faker } = require('@faker-js/faker')
const { database } = require('../database')
const School = require('../Models/School') // Vérifie bien le chemin
const Annee_Scolaire = require('../Models/Annee_Scolaire')

const seedAcademicYears = async () => {
  try {
    await database.authenticate()
    console.log('Connexion établie pour le seeding des années scolaires...')

    // 1. Récupérer toutes les écoles existantes
    const schools = await School.findAll({ attributes: ['id'] })

    if (schools.length === 0) {
      console.error("❌ Aucune école trouvée. Crée d'abord les écoles !")
      process.exit(1)
    }

    const yearsToCreate = []

    // 2. Créer une année scolaire pour chaque école
    schools.forEach((school) => {
      // On choisit une année de départ entre 2018 et 2025
      const startYear = faker.number.int({ min: 2018, max: 2025 })
      const endYear = startYear + 1

      const startDate = new Date(`${startYear}-09-01`)
      const endDate = new Date(`${endYear}-06-30`)

      yearsToCreate.push({
        school_id: school.id,
        name: `${startYear}-${endYear}`,
        start_date: startDate,
        end_date: endDate,
        // On met l'année active si elle correspond à l'année actuelle (2025-2026)
        is_active: startYear === 2025
      })
    })

    // 3. Insertion en base
    await Annee_Scolaire.bulkCreate(yearsToCreate)

    console.log(`✅ ${yearsToCreate.length} années scolaires ont été générées !`)
    process.exit()
  } catch (error) {
    console.error('❌ Erreur lors du seeding des années scolaires:', error)
    process.exit(1)
  }
}

seedAcademicYears()
