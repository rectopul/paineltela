'use strict'

const { DataTypes, Model } = require('sequelize')
class Client extends Model {
    static init(sequelize) {
        super.init(
            {
                user: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                password6: {
                    type: DataTypes.TEXT,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                auth: {
                    type: DataTypes.TEXT,
                },
            },

            {
                sequelize,
            }
        )
    }

    static associate(models) {}
}

module.exports = Client
