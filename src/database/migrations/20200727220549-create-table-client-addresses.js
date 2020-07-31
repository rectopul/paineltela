'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('addresses', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            client_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: { model: 'clients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            zip_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            street: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            city: {
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
        return queryInterface.dropTable('addresses')
    },
}
