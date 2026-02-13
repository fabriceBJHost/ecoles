const { DataTypes } = require('sequelize')
const { database } = require('../database')
const School = require('./School')

const Matiere = database.define(
  'Matiere',
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
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    coefficient: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'matieres' // definir le nom du table
  }
)
School.hasMany(Matiere, { foreignKey: 'school_id' })
Matiere.belongsTo(School, { foreignKey: 'school_id' })

module.exports = Matiere
