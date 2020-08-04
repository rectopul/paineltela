const routes = require('express').Router()

const multer = require('multer')
const multerConfig = require('../config/multer')
const multerText = require('../config/multerText')

const UserController = require('../controllers/UserController')
//User Image
const UserImageController = require('../controllers/UserImageController')
//session
const SessionController = require('../controllers/SessionController')

//Cliente
const ClientController = require('../controllers/ClientController')

//Property
const PropertyController = require('../controllers/PropertyController')

//Location
const LocationController = require('../controllers/LocationController')

//API
/* Forgot e Recuperação de senha */
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset_password', UserController.reset)

//somente superuser
routes.get('/api/user', UserController.index)
routes.post('/api/user', UserController.store)
routes.put('/api/user', UserController.update)
routes.get('/api/user/:user_id', UserController.single)
routes.post('/api/user/image/:user_id', multer(multerConfig).single('file'), UserImageController.store)
routes.put('/api/user/image', multer(multerConfig).single('file'), UserImageController.edit)
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset', UserController.reset)

//client
routes.post(`/api/client`, ClientController.store)
routes.get(`/api/client/:client_id`, ClientController.single)
routes.delete(`/api/client/:client_id`, ClientController.destroy)
routes.put(`/api/client/:client_id`, ClientController.update)
routes.get(`/api/client_search/:args`, ClientController.search)

//Property
routes.post(`/api/property`, PropertyController.store)
routes.get(`/api/property/:property_id`, PropertyController.single)
routes.get(`/api/property_search/:args`, PropertyController.search)

//Locations
routes.post(`/api/location`, LocationController.store)

//session
routes.post(`/api/login`, SessionController.store)

module.exports = routes
