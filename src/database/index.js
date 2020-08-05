const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

//const connection = new Sequelize(dbConfig)

const User = require('../models/User')
const UserImage = require('../models/UserImage')

//Product
const Product = require('../models/Product')
const ImageProduct = require('../models/ImageProduct')

const models = [User, UserImage, Product, ImageProduct]

class DataBase {
    constructor() {
        this.init()
    }

    init() {
        // Inicializa conexao
        this.connection = new Sequelize(dbConfig)
        this.models = this.connection.models

        // Percorre o vetor e acessa o método inicializador
        models.map((model) => model.init(this.connection))
        models.map((model) => model.associate(this.models))
    }
}

module.exports = new DataBase()
