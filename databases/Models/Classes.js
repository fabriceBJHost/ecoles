const { DataTypes } = require('sequelize')
const { database } = require('../database')
const School = require('./School')

const Classes = database.define(
  'Classes',
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
      type: DataTypes.STRING(50),
      allowNull: false
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'classes' // definir le nom du table
  }
)

School.hasMany(Classes, { foreignKey: 'school_id' })
Classes.belongsTo(School, { foreignKey: 'school_id' })

module.exports = Classes
