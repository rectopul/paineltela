'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('users', 'type', { type: Sequelize.DataTypes.STRING })])
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('users', 'type')])
    },
}
