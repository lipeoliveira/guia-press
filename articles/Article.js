const Sequelize = require('sequelize')
const dbConnection = require('../database/dbConnection')
const Category = require('../categories/Category')

const Article = dbConnection.define('article', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

Category.hasMany(Article)
Article.belongsTo(Category)

// Article.sync({ force: true })

module.exports = Article
