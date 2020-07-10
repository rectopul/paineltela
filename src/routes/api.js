const routes = require('express').Router()

const multer = require('multer')
const multerConfig = require('../config/multer')
const multerText = require('../config/multerText')

const UserController = require('../controllers/UserController')
//User Image
const UserImageController = require('../controllers/UserImageController')
//products
const ProductController = require('../controllers/ProductController')
//image Products
const ImageProductController = require('../controllers/ImageProductController')
//Files
const FileController = require('../controllers/FileController')
//session
const SessionController = require('../controllers/SessionController')
//categories
const CategoryController = require('../controllers/CategoryController')
//Searches
const SearchController = require('../controllers/SearchController')

//Pages
const PageController = require('../controllers/PageController')

//Newsletter
const Subscriber = require('../controllers/SubscriberController')

//Banners
const BannerController = require('../controllers/BannerController')
const BannerImageController = require('../controllers/BannerImageController')

//API
//Product
routes.post(`/api/product`, ProductController.store)
routes.get(`/api/product`, ProductController.index)
routes.delete(`/api/product/:product_id`, ProductController.destroy)
routes.get(`/api/product/:product_id`, ProductController.show)
//File
routes.post(`/api/file`, multer(multerText).single('file'), FileController.read)
/* Forgot e Recuperação de senha */
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset_password', UserController.reset)

/* Images Products */
routes.post('/api/image/product', multer(multerConfig).single('file'), ImageProductController.store)
routes.get('/api/image/product/:id_product', ImageProductController.index)
routes.delete('/api/image/product/:id', ImageProductController.delete)

//somente superuser
//routes.use(credentials)
routes.get('/api/user', UserController.index)
routes.post('/api/user', UserController.store)
routes.put('/api/user', UserController.update)
routes.get('/api/user/:user_id', UserController.single)
routes.post('/api/user/image', multer(multerConfig).single('file'), UserImageController.store)
routes.put('/api/user/image', multer(multerConfig).single('file'), UserImageController.edit)
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset', UserController.reset)
//categories
routes.post(`/api/category`, CategoryController.store)
routes.get(`/api/category/:categori_id`, CategoryController.show)
routes.get(`/api/category`, CategoryController.index)
routes.delete(`/api/category/:category_id`, CategoryController.destroy)
routes.put(`/api/category/:category_id`, CategoryController.edit)
//Consultas
routes.post(`/api/search`, SearchController.store)
routes.get(`/api/search`, SearchController.index)
routes.get(`/api/search/:search_id`, SearchController.show)
//Páginas
routes.post(`/api/page`, PageController.store)
routes.put(`/api/page/:page_id`, PageController.update)
//newsletter
routes.post(`/api/subscriber`, Subscriber.store)
//Banners
routes.post(`/api/banner/:page_id`, BannerController.store)
routes.put(`/api/banner/:banner_id`, BannerController.update)
routes.post(`/api/banner-image`, multer(multerConfig).single('file'), BannerImageController.store)

//session
routes.post(`/api/login`, SessionController.store)

module.exports = routes