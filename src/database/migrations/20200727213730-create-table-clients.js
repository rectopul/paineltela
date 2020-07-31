'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('clients', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            cpf: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            rg: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            nationality: {
                type: Sequelize.STRING,
            },
            marital: {
                type: Sequelize.STRING,
            },
            birth_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            note: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('clients')
    },
}
