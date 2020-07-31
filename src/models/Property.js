const { DataTypes, Model } = require('sequelize')

class Property extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The name field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The name field cannot be empty`,
                        },
                    },
                },
                description: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The description field cannot be empty`,
                        },
                    },
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The type field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The type field cannot be empty`,
                        },
                    },
                },
                tradingType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The tradingType field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The tradingType field cannot be empty`,
                        },
                    },
                },
                propertyIs: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The propertyIs field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The propertyIs field cannot be empty`,
                        },
                    },
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {}
}

module.exports = Property
