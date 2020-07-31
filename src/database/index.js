const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const connection = new Sequelize(dbConfig)

const User = require('../models/User')
const UserImage = require('../models/UserImage')

//Clients
const Client = require('../models/Client')
const Address = require('../models/Address')
const Contact = require('../models/Contact')

//Property
const Property = require('../models/Property')
const PropertyAddress = require('../models/PropertyAddress')
const PropertyFeature = require('../models/PropertyFeature')
const PropertyInformation = require('../models/PropertyInformation')
const PropertyValue = require('../models/PropertyValue')

//user
User.init(connection)
UserImage.init(connection)
Client.init(connection)
Address.init(connection)
Contact.init(connection)
//Property
Property.init(connection)
PropertyAddress.init(connection)
PropertyFeature.init(connection)
PropertyInformation.init(connection)
PropertyValue.init(connection)

//associations
User.associate(connection.models)
UserImage.associate(connection.models)
//Clients
Client.associate(connection.models)
Address.associate(connection.models)
Contact.associate(connection.models)
//Property
Property.associate(connection.models)
PropertyAddress.associate(connection.models)
PropertyFeature.associate(connection.models)
PropertyInformation.associate(connection.models)
PropertyValue.associate(connection.models)

module.exports = connection
