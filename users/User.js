const Sequelize = require('sequelize')
const dbConnection = require('../database/dbConnection')

const User = dbConnection.define('users', {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  }
})

// User.sync({force: false})
module.exports = User
