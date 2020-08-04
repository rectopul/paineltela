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
//Client
const ClientView = require('../controllers/views/admin/ClientView')
//Property
const PropertyView = require('../controllers/views/admin/PropertyView')
//Location
const LocationView = require('../controllers/views/admin/LocationView')

const CleaveJs = require('cleave.js')

routes.get('/cleave', CleaveJs)

//Dashboard
routes.get(`/dashboard`, DashboardView.view)
//Client
routes.get(`/insert_client`, ClientView.view)
routes.get(`/clients`, ClientView.index)

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
