const { database } = require('../database')
const School = require('../Models/School')
const Annee_Scolaire = require('../Models/Annee_Scolaire')

const seedAcademicYears = async () => {
  try {
    await database.authenticate()
    console.log('Connexion établie pour le seeding des années scolaires...')

    const schools = await School.findAll({ attributes: ['id'] })

    if (schools.length === 0) {
      console.error("❌ Aucune école trouvée. Crée d'abord les écoles !")
      process.exit(1)
    }

    const yearsToCreate = []

    // Définition de l'intervalle
    const START_LIMIT = 2018
    const END_LIMIT = 2025 // Pour finir en 2026 (2025-2026)

    schools.forEach((school) => {
      // Pour chaque école, on boucle de 2018 à 2025
      for (let startYear = START_LIMIT; startYear <= END_LIMIT; startYear++) {
        const endYear = startYear + 1

        const startDate = new Date(`${startYear}-09-01`)
        const endDate = new Date(`${endYear}-06-30`)

        yearsToCreate.push({
          school_id: school.id,
          name: `${startYear}-${endYear}`,
          start_date: startDate,
          end_date: endDate,
          // L'année est active seulement si c'est la période actuelle (2025-2026)
          is_active: startYear === 2025
        })
      }
    })

    // Insertion groupée pour la performance
    await Annee_Scolaire.bulkCreate(yearsToCreate)

    console.log(`✅ ${schools.length} écoles traitées.`)
    console.log(`✅ ${yearsToCreate.length} entrées d'années scolaires générées !`)
    process.exit()
  } catch (error) {
    console.error('❌ Erreur lors du seeding des années scolaires:', error)
    process.exit(1)
  }
}

seedAcademicYears()
