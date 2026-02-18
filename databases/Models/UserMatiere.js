const { DataTypes } = require('sequelize')
const { database } = require('../database')
const User = require('./User')
const Matiere = require('./Matiere')
const School = require('./School')

const UserMatiere = database.define(
  'UserMatiere',
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
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'usermatieres' // definir le nom du table
  }
)
School.hasMany(UserMatiere, { foreignKey: 'school_id' })
UserMatiere.belongsTo(School, { foreignKey: 'school_id' })

// Un utilisateur (prof) enseigne plusieurs matières
User.belongsToMany(Matiere, {
  through: UserMatiere,
  foreignKey: 'user_id',
  otherKey: 'matiere_id'
})

// Une matière est enseignée par plusieurs utilisateurs
Matiere.belongsToMany(User, {
  through: UserMatiere,
  foreignKey: 'matiere_id',
  otherKey: 'user_id'
})

module.exports = UserMatiere
