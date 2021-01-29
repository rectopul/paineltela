'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                name: 'Administrador',
                user: 'admin',
                password_hash: await bcrypt.hash('admin', 8),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {})
    },
}
