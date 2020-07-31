'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('properties', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            trading_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            property_is: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('properties')
    },
}
