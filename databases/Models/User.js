const { DataTypes } = require('sequelize')
const { database } = require('../database')
const School = require('./School')

const User = database.define(
  'User',
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('DIRECTEUR', 'SECRETAIRE', 'ENSEIGNANT', 'SURVEILLANT')
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'users' // definir le nom du table
  }
)

School.hasMany(User, { foreignKey: 'school_id' })
User.belongsTo(School, { foreignKey: 'school_id' })

module.exports = User
