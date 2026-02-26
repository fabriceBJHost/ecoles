const { DataTypes } = require('sequelize')
const { database } = require('../database')
const School = require('./School')
const Classes = require('./Classes')
const Matiere = require('./Matiere')
const User = require('./User')

const Schedule = database.define(
  'Schedule',
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
      references: { model: School, key: 'id' }
    },
    class_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: Classes, key: 'id' }
    },
    subject_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: Matiere, key: 'id' }
    },
    teacher_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: User, key: 'id' }
    },
    day: {
      type: DataTypes.ENUM('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'schedules' // definir le nom du table
  }
)

// Un emploi du temps appartient à...
Schedule.belongsTo(School, { foreignKey: 'school_id' })
Schedule.belongsTo(Classes, { foreignKey: 'class_id' })
Schedule.belongsTo(Matiere, { foreignKey: 'subject_id' })
Schedule.belongsTo(User, { foreignKey: 'teacher_id' })

// Relations inverses (Optionnel, mais recommandé)
School.hasMany(Schedule, { foreignKey: 'school_id' })
Classes.hasMany(Schedule, { foreignKey: 'class_id' })
User.hasMany(Schedule, { foreignKey: 'teacher_id' })

module.exports = Schedule
