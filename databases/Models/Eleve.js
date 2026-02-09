const { DataTypes } = require('sequelize')
const { database } = require('../database')
const School = require('./School')
const Annee_Scolaire = require('./Annee_Scolaire')

const Eleve = database.define(
  'Eleve',
  {
    // exemple de champs sur la base
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    school_id: {
      type: DataTypes.BIGINT,
      references: {
        model: School,
        key: 'id'
      }
    },
    academic_year_id: {
      type: DataTypes.BIGINT,
      references: {
        model: Annee_Scolaire,
        key: 'id'
      }
    },
    firstname: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    photos: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIF', 'RENVOYE', 'DIPLOME'),
      allowNull: false
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'eleves' // definir le nom du table
  }
)
School.hasMany(Eleve, { foreignKey: 'school_id' })
Eleve.belongsTo(School, { foreignKey: 'school_id' })
Eleve.belongsTo(Annee_Scolaire, { foreignKey: 'academic_year_id' })
Annee_Scolaire.hasMany(Eleve, { foreignKey: 'academic_year_id' })

module.exports = Eleve
