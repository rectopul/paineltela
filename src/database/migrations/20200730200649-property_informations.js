'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('property_informations', {
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
            keys_are_with: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            visiting_hours: {
                type: Sequelize.STRING,
            },
            key_number: {
                type: Sequelize.INTEGER,
            },
            liquidator: {
                type: Sequelize.TEXT,
            },
            liquidator_phone: {
                type: Sequelize.STRING,
            },
            other: {
                type: Sequelize.TEXT,
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
        return queryInterface.dropTable('property_informations')
    },
}
