'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('locations', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            property_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'properties', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            owner_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'clients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            occupant_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'clients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            guarantor_id: {
                type: Sequelize.INTEGER,
                references: { model: 'clients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            payment_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            location_value: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            location_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            participation: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            location_time: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            location_start: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            location_end: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            location_guarantee: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            capitalization_value: {
                type: Sequelize.DECIMAL,
            },
            capitalization_start: {
                type: Sequelize.DATE,
            },
            capitalization_end: {
                type: Sequelize.DATE,
            },
            capitalization_observation: {
                type: Sequelize.TEXT,
            },
            capitalization_apolice: {
                type: Sequelize.TEXT,
            },
            calcao_value: {
                type: Sequelize.DECIMAL,
            },
            bail_value: {
                type: Sequelize.DECIMAL,
            },
            bail_observation: {
                type: Sequelize.TEXT,
            },
            bail_apolice: {
                type: Sequelize.TEXT,
            },
            bail_start: {
                type: Sequelize.DATE,
            },
            bail_end: {
                type: Sequelize.DATE,
            },
            administration_fee: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            administration_fee_type: {
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
        return queryInterface.dropTable('locations')
    },
}
