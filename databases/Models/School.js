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
    number: {
      type: DataTypes.STRING(15),
      unique: true
    },
    logo: {
      type: DataTypes.TEXT
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
