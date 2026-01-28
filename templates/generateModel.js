const fs = require('fs')
const path = require('path')

// Récupérer le nom passé en argument (ex: NomFiles)
const className = process.argv[2]

if (!className) {
  console.error('Erreur : Veuillez préciser un nom pour la migration.')
  process.exit(1)
}

const templatePath = path.join(__dirname, 'model.txt')
const outputPath = path.join(__dirname, '../databases/Models', `${className}.js`)

// 1. Lire le template
let content = fs.readFileSync(templatePath, 'utf8')

// 2. Remplacer le placeholder par le nom choisi
content = content.replace(/{{className}}/g, className)

// 3. Créer le dossier migrations s'il n'existe pas
if (!fs.existsSync(path.join(__dirname, '../databases/Models'))) {
  fs.mkdirSync(path.join(__dirname, '../databases/Models'))
}

// 4. Écrire le nouveau fichier
fs.writeFileSync(outputPath, content)

console.log(`✅ Migration créée avec succès : databases/Models/${className}.js`)
