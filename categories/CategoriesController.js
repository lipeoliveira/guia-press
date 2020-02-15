const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')
const admAuth = require('../middleware/adminAuth')

router.get('/admin/categories/new', admAuth, (req, res) => {
  res.render('admin/categories/new')
})

router.post('/categories/save', admAuth, async (req, res) => {
  const { title } = req.body
  if (!title) {
    return res.redirect('/admin/categories/new')
  }
  try {
    await Category.create({ title: title, slug: slugify(title) })
    res.redirect('/admin/categories')
  } catch (error) {
    res.redirect('/admin/categories/new')
  }
})

router.get('/admin/categories', admAuth, async (req, res) => {
  try {
    const categories = await Category.findAll()
    res.render('admin/categories/index', { categories })
  } catch (error) {
    res.redirect('/admin/categories')
  }
})

router.get('/categories/edit/:id', admAuth, async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(id)) {
    return res.redirect('/admin/categories')
  }

  try {
    const category = await Category.findOne({ id })
    res.render('admin/categories/edit', { category })
  } catch (error) {
    return res.redirect('/admin/categories')
  }
})

router.post('/categories/update', admAuth, async (req, res) => {
  const { id, title } = req.body
  if (!id || isNaN(id)) {
    return res.redirect('/admin/categories')
  }

  try {
    await Category.update(
      { title: title, slug: slugify(title) },
      { where: { id: id } }
    )
    res.redirect('/admin/categories')
  } catch (error) {
    return res.redirect('/admin/categories')
  }
})

router.get('/categories/delete/:id', admAuth, async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(id)) {
    return res.redirect('/admin/categories')
  }

  try {
    await Category.destroy({ where: { id } })
    res.redirect('/admin/categories')
  } catch (error) {
    res.redirect('/admin/categories')
  }
})

module.exports = router
