const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const connection = new Sequelize(dbConfig)

const User = require('../models/User')
const UserImage = require('../models/UserImage')

//user
User.init(connection)
UserImage.init(connection)

//associations
User.associate(connection.models)
UserImage.associate(connection.models)

module.exports = connection
