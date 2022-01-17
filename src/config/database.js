require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

let database

database = {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    storage: './__tests__/database.sqlite',
    logging: false,
    options: {
        port: 5432,
    },
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
}

module.exports = database
