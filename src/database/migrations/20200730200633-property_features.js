'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('property_features', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            property_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: { model: 'properties', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            bedrooms: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            suites: {
                type: Sequelize.INTEGER,
            },
            demi_suites: {
                type: Sequelize.INTEGER,
            },
            bathrooms: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            toilet: {
                type: Sequelize.INTEGER,
            },
            jobs: {
                type: Sequelize.INTEGER,
            },
            flooring: {
                type: Sequelize.INTEGER,
            },
            flooring: {
                type: Sequelize.INTEGER,
            },
            furnished: {
                type: Sequelize.BOOLEAN,
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
        return queryInterface.dropTable('property_features')
    },
}
