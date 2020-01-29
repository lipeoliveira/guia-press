const Sequelize = require('sequelize')
const dbConnection = require('../database/dbConnection')

const Category = dbConnection.define('categories', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

// Category.sync({ force: true })

module.exports = Category
