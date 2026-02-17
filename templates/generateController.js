const fs = require('fs')
const path = require('path')

// Récupérer le nom passé en argument (ex: NomFiles)
const className = process.argv[2]

if (!className) {
  console.error('Erreur : Veuillez préciser un nom pour la Controller.')
  process.exit(1)
}

const templatePath = path.join(__dirname, 'controller.txt')
const outputPath = path.join(__dirname, '../databases/Controllers', `${className}.js`)

// 1. Lire le template
let content = fs.readFileSync(templatePath, 'utf8')

// 2. Remplacer le placeholder par le nom choisi
content = content.replace(/{{className}}/g, className)

// 3. Créer le dossier migrations s'il n'existe pas
if (!fs.existsSync(path.join(__dirname, '../databases/Controllers'))) {
  fs.mkdirSync(path.join(__dirname, '../databases/Controllers'))
}

// 4. Écrire le nouveau fichier
fs.writeFileSync(outputPath, content)

console.log(`✅ Controller créée avec succès : databases/Controllers/${className}.js`)
