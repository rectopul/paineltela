const routes = require('express').Router()

const multer = require('multer')
const multerConfig = require('../config/multer')

const UserController = require('../controllers/UserController')
//User Image
const UserImageController = require('../controllers/UserImageController')
//session
const SessionController = require('../controllers/SessionController')

//Cliente
const ProductController = require('../controllers/ProductController')
const ImageProductController = require('../controllers/ImageProductController')

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

//Product
routes.post(`/api/product`, ProductController.store)
routes.delete(`/api/product/:product_id`, ProductController.destroy)
routes.get(`/api/product/:product_id`, ProductController.show)
routes.put(`/api/product/:product_id`, ProductController.update)
routes.post(`/api/product_image/:product_id`, multer(multerConfig).single('file'), ImageProductController.store)

//session
routes.post(`/api/login`, SessionController.store)

module.exports = routes
