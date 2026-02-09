const { DataTypes } = require('sequelize')
const { database } = require('../database')

const School = database.define(
  'School',
  {
    // exemple de champs sur la base
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING(300),
      unique: true
    },
    number1: {
      type: DataTypes.STRING(15),
      unique: true
    },
    number2: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: true
    },
    logo: {
      type: DataTypes.TEXT,
      default: null
    },
    option: {
      type: DataTypes.JSON,
      defaultValue: {
        baremeNotation: 20,
        roundMoyenne: 2,
        activeCoefperpatiere: 1,
        AficheRangBulletin: 0
      }
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'schools' // definir le nom du table
  }
)

module.exports = School
