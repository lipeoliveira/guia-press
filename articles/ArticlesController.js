const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const admAuth = require('../middleware/adminAuth')

router.get('/admin/articles', admAuth, async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: Category
        }
      ]
    })
    res.render('admin/articles/index', {
      articles
    })
  } catch (e) {
    res.render('admin/articles')
  }
})

router.get('/admin/articles/new', admAuth, async (req, res) => {
  try {
    const categories = await Category.findAll()
    res.render('admin/articles/new', {
      categories
    })
  } catch (e) {
    res.render('admin/articles')
  }
})

router.post('/admin/articles/save', admAuth, async (req, res) => {
  const { title, body, category } = req.body
  try {
    await Article.create({
      title,
      body,
      slug: slugify(title),
      categoryId: category
    })
    res.redirect('/admin/articles')
  } catch (e) {
    res.render('/admin/articles')
  }
})

router.get('/admin/articles/edit/:id', admAuth, async (req, res) => {
  const { id } = req.params
  const categories = await Category.findAll()
  const article = await Article.findOne({
    include: [{ model: Category }],
    where: { id }
  })
  res.render('admin/articles/edit', {
    article,
    categories
  })
})

router.post('/admin/articles/update', admAuth, async (req, res) => {
  const { id, title, body, category } = req.body
  if (id && !isNaN(id)) {
    try {
      await Article.update(
        {
          title,
          body,
          slug: slugify(title),
          categoryId: category
        },
        {
          where: {
            id: id
          }
        }
      )
      res.redirect('/admin/articles')
    } catch (error) {
      res.redirect('/admin/articles')
    }
    res.redirect('/admin/articles')
  } else {
    res.redirect('/admin/articles')
  }
})

router.get('/admin/articles/delete/:id', admAuth, async (req, res) => {
  const { id } = req.params
  if (id && !isNaN(id)) {
    try {
      await Article.destroy({
        where: {
          id: id
        }
      })
      res.redirect('/admin/articles')
    } catch (error) {
      res.redirect('/admin/articles')
    }
  } else {
    res.redirect('/admin/articles')
  }
})

router.get('/articles/page/:num', admAuth, async (req, res) => {
  let { num } = req.params
  let offSet = 0
  if (isNaN(num) || num == 1) {
    offSet = 0
  } else {
    offSet = (parseInt(num) - 1) * 2
  }

  try {
    const articles = await Article.findAndCountAll({
      limit: 2,
      offset: offSet,
      order: [['id', 'DESC']]
    })
    let next = false

    if (offSet + 2 >= articles.count) {
      next = false
    } else {
      next = true
    }

    const result = {
      articles,
      next,
      page: parseInt(num)
    }

    const categories = await Category.findAll()
    res.render('admin/articles/page', {
      result,
      categories
    })
  } catch (error) {
    res.redirect('/admin/articles')
  }
})

module.exports = router
