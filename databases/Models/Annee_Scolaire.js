const { DataTypes } = require('sequelize')
const { database } = require('../database')
const School = require('./School')

const Annee_Scolaire = database.define(
  'Annee_Scolaire',
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
      allowNull: false,
      references: {
        model: School,
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'academic_years' // definir le nom du table
  }
)
School.hasMany(Annee_Scolaire, { foreignKey: 'school_id' })
Annee_Scolaire.belongsTo(School, { foreignKey: 'school_id', onDelete: 'CASCADE' })

module.exports = Annee_Scolaire
