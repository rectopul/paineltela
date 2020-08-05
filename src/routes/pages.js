const routes = require('express').Router()

//Dashboard
const DashboardView = require('../controllers/views/DashboardViews')
//Login
const LoginView = require('../controllers/views/admin/LoginViews')
//Client
const ProductView = require('../controllers/views/admin/ProductView')
//Property
const PropertyView = require('../controllers/views/admin/PropertyView')
//Location
const LocationView = require('../controllers/views/admin/LocationView')

//Dashboard
routes.get(`/dashboard`, DashboardView.view)
//Client
routes.get(`/products`, ProductView.index)

//Properties
routes.get(`/property_insert`, PropertyView.store)
routes.get(`/property_list`, PropertyView.index)

//Location
routes.get(`/location_insert`, LocationView.store)
//routes.get(`/property_list`, PropertyView.index)

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
