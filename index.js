const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const dbConnection = require('./database/dbConnection')
const app = express()

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
  
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

dbConnection
  .authenticate()
  .then(() => console.log('Sucesso na conexão!'))
  .catch(err => console.log(err))

app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(8080, () => {
  console.log('Servidor rodando na porta: 8080')
})
