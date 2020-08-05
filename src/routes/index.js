const express = require('express')
const cookieParser = require('cookie-parser')
const pages = require('./pages')
const api = require('./api')

const routes = express.Router()

//const credentials = require('./middlewares/UserCredentials')

//Test de rota
routes.get(`/`, (req, res) => res.redirect('/dashboard'))
routes.use(cookieParser())

routes.use(pages)
routes.use(api)

module.exports = routes
