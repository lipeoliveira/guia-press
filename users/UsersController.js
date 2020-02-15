const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('./User')
const admAuth = require('../middleware/adminAuth')

router.get('/admin/users', admAuth, async (req, res) => {
  try {
    const users = await User.findAll()
    res.render('admin/users', {
      users
    })
  } catch (error) {
    res.redirect('admin/users')
  }
})

router.get('/admin/users/create', (req, res) => {
  res.render('admin/users/create')
})

router.post('/users/save', async (req, res) => {
  const { email, password } = req.body
  const salt = 10
  try {
    const user = await User.findOne({ where: { email: email } })
    if (user) {
      return res.redirect('/')
    }
    const hashPassword = await bcrypt.hash(password, salt)
    if (!hashPassword) {
      return res.redirect('/')
    }
    await User.create({ email, password: hashPassword })
    res.redirect('/')
  } catch (error) {
    res.redirect('/')
  }
})

router.get('/login', (req, res) => {
  res.render('admin/users/login')
})

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.redirect('/login')
    }
    const samePassword = await bcrypt.compare(password, user.password)
    if (!samePassword) {
      return res.redirect('/login')
    }
    req.session.user = {
      id: user.id,
      email: user.email
    }
    res.redirect('/admin/articles')
  } catch (error) {
    return res.redirect('/login')
  }
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router
