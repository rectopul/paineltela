'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('contacts', {
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
            cell: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: true,
            },
            phone: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: true,
            },
            other: {
                type: Sequelize.TEXT,
            },
            email: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true,
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
        return queryInterface.dropTable('contacts')
    },
}
