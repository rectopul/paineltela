const routes = require('express').Router()

const { Op } = require('sequelize')

const User = require('../models/User')

//userbytoken
const authUser = require('../middlewares/auth')

//Views
const UsersView = require('../controllers/views/UsersViews')

//Dashboard
const DashboardView = require('../controllers/views/DashboardViews')
//Login
const LoginView = require('../controllers/views/admin/LoginViews')

//Dashboard
routes.get(`/dashboard`, DashboardView.view)

//Login
routes.get(`/login`, LoginView.view)

//forgot password
routes.get(`/forgot`, (req, res) => res.render('forgot'))

//logout
routes.get(`/logout`, (req, res) => {
    res.clearCookie('token')

    return res.redirect('/login')
})

module.exports = routes
