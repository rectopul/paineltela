const routes = require('express').Router()

//Dashboard
const DashboardView = require('../controllers/views/DashboardViews')
//Login
const LoginView = require('../controllers/views/admin/LoginViews')
//Client
const ProductView = require('../controllers/views/admin/ProductView')

//Dashboard
routes.get(`/dashboard`, DashboardView.view)
//Client
routes.get(`/products`, ProductView.index)

//Login
routes.get(`/login`, LoginView.view)

//forgot password
routes.get(`/forgot`, (req, res) => res.redirect('/dashboard'))

//logout
routes.get(`/logout`, (req, res) => {
    res.clearCookie('token')

    return res.redirect('/login')
})

module.exports = routes
