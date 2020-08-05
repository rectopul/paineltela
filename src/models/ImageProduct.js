'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')

class ImageProduct extends Model {
    static init(sequelize) {
        super.init(
            {
                url: DataTypes.STRING,
                name: DataTypes.STRING,
                size: DataTypes.STRING,
                key: DataTypes.STRING,
            },
            {
                hooks: {
                    beforeSave: async (file) => {
                        if (!file.url) {
                            if (process.env.DATABASE_URL) {
                                file.url = `${process.env.URLAPPREMOTE}/files/${file.key}`
                            } else {
                                file.url = `${process.env.APP_URL}/files/${file.key}`
                            }

                            file.url = file.url.replace(' ', '%20')
                        }
                    },
                    beforeDestroy: async (file) => {
                        if (process.env.STORAGE_TYPE === 's3') {
                            console.log('S3 Storage')

                            return s3
                                .deleteObject({
                                    Bucket: 'uploadwecheckout',
                                    Key: file.key,
                                })
                                .promise()
                        } else {
                            return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', file.key))
                        }
                    },
                },
                sequelize,
            }
        )
    }

    static associate(models) {
        //Relations
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
    }
}
module.exports = ImageProduct
