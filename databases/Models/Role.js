const { DataTypes } = require('sequelize')
const { database } = require('../database')

const Role = database.define(
  'Role',
  {
    // exemple de champs sur la base
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    permission: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'roles' // definir le nom du table
  }
)

module.exports = Role
