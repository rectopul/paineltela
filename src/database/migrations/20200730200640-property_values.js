'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('property_values', {
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
            iptu: {
                type: Sequelize.DECIMAL,
            },
            condominium: {
                type: Sequelize.DECIMAL,
            },
            water: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            energy: {
                type: Sequelize.DECIMAL,
            },
            trash: {
                type: Sequelize.DECIMAL,
            },
            cleaning_fee: {
                type: Sequelize.DECIMAL,
            },
            others: {
                type: Sequelize.DECIMAL,
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
        return queryInterface.dropTable('property_values')
    },
}
