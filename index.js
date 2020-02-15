require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const dbConnection = require('./database/dbConnection')
const app = express()

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const userController = require('./users/UsersController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

app.use(session({
  secret: process.env.SECRETE_KEY,
  cookie: {
    maxAge: 300
  } 
}))

app.set('view engine', 'ejs')
app.set('json spaces', 4)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

const initConnection = async () => {
  try {
    await dbConnection.authenticate()
    console.log('Sucesso na conexão!')
  } catch (error) {
    console.log(err)
  }
}

initConnection()

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', userController)

app.get('/', async (req, res) => {
  try {
    const articles = await Article.findAll({ limit: 2, order: [['id', 'DESC']] })
    const categories = await Category.findAll()
    res.render('index', {
      articles,
      categories
    })
  } catch (e) {
    res.redirect('/')
  }
})

app.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params
  try {
    const article = await Article.findOne({ where: { slug: slug } })
    if (article) {
      const categories = await Category.findAll()
      res.render('article', {
        article,
        categories
      })
    } else {
      res.redirect('/')
    }
  } catch (error) {
    res.redirect('/')
  }
})

app.get('/category/:slug', async (req, res) => {
  const { slug } = req.params
  if (!slug) { return res.redirect('/') }
  try {
    const category = await Category.findOne({ where: { slug }, include: [{ model: Article }] })
    if (!category) { return res.redirect('/') }   
    const categories = await Category.findAll()
    if (!categories) { return res.redirect('/') }
    res.render('index', {
      articles: category.articles,
      categories
    })
  } catch (error) {
    res.redirect('/')
  }
})

app.listen(8080, () => {
  console.log('Servidor rodando na porta: 8080')
})
