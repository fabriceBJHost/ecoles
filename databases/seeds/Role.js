const { fakerFR: faker } = require('@faker-js/faker')
const { database } = require('../database')
const Role = require('../Models/Role') // Ajuste le chemin selon ton projet

const seedRoles = async () => {
  try {
    // 1. Connexion à la base
    await database.authenticate()
    console.log('Connexion établie pour le seeding des rôles...')

    // 2. Définition des rôles fixes
    const rolesToCreate = [
      { nom: 'Directeur' },
      { nom: 'Régisseur' },
      { nom: 'Enseignant' },
      { nom: 'Surveillant' }
    ]

    // 3. Ajout de permissions fictives avec Faker
    const rolesWithData = rolesToCreate.map((role) => {
      return {
        ...role,
        permission: {
          can_edit: faker.datatype.boolean(),
          can_delete: role.nom === 'Directeur', // Seul le directeur peut supprimer par défaut ici
          can_view_reports: true,
          access_level: faker.number.int({ min: 1, max: 5 }),
          last_audit: faker.date.recent()
        }
      }
    })

    await Role.bulkCreate(rolesWithData)

    console.log('✅ Les 4 rôles (Directeur, Régisseur, Enseignant, Surveillant) ont été créés !')
    process.exit()
  } catch (error) {
    console.error('❌ Erreur lors du seeding des rôles:', error)
    process.exit(1)
  }
}

seedRoles()
