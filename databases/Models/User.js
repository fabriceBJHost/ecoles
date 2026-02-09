const { DataTypes } = require('sequelize')
const { database } = require('../database')
const School = require('./School')
const Role = require('./Role')

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
    role_id: {
      type: DataTypes.BIGINT,
      references: {
        model: Role,
        key: 'id'
      }
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    firstname: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    numbers1: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    numbers2: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false
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
Role.hasMany(User, { foreignKey: 'role_id' })
User.belongsTo(Role, { foreignKey: 'role_id' })

module.exports = User
