'use strict'

const { DataTypes, Model } = require('sequelize')
class Client extends Model {
    static init(sequelize) {
        super.init(
            {
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                user: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                eletronicPassword: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                sms: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
            },

            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'operator' })
    }
}

module.exports = Client
