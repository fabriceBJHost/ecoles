const { Sequelize } = require('sequelize')
require('dotenv').config()

const database = new Sequelize(process.env.database, process.env.user, process.env.password, {
  host: process.env.host,
  dialect: 'mysql',
  logging: true
})

module.exports = {
  database
}
