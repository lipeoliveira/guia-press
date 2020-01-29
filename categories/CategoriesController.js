const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
  const { title } = req.body

  if (title) {
    Category.create({ title: title, slug: slugify(title) }).then(() => {
      res.redirect('/admin/categories')
    })
  } else {
    res.redirect('/admin/categories/new')
  }
})

router.get('/admin/categories', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/categories/index', {
      categories
    })
  })
})

router.get('/categories/edit/:id', (req, res) => {
  const { id } = req.params

  if (id && !isNaN(id)) {
    Category.findOne({ id }).then(category => {
      res.render('admin/categories/edit', { category })
    })
  } else {
    res.redirect('/admin/categories')
  }
})

router.post('/categories/update', (req, res) => {
  const { id, title } = req.body

  if (id && !isNaN(id)) {
    Category.findOne({ id }).then(category => {
      category.title = title
      category.save().then(() => {
        res.redirect('/admin/categories')
      })
    })
  } else {
    res.redirect('/admin/categories/edit', {
      id,
      title
    })
  }
})

router.get('/categories/delete/:id', (req, res) => {
  const { id } = req.params

  if (id && !isNaN(id)) {
    Category.destroy({ where: { id } }).then(() => {
      res.redirect('/admin/categories')
    })
  } else {
    res.redirect('/admin/categories')
  }
})

module.exports = router
