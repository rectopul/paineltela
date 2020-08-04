const Client = require('../models/Client')
const Contact = require('../models/Contact')
const Address = require('../models/Address')
const UserByToken = require('../middlewares/userByToken')
const { Op } = require('sequelize')

module.exports = {
    async index(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const clients = await Client.findAll({ include: [{ association: 'address' }, { association: 'contact' }] })

            return res.json(clients)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao buscar clientes: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async single(req, res) {
        const authHeader = req.headers.authorization

        if (!authHeader) return res.status(401).send({ error: 'No token provided' })

        await UserByToken(authHeader)

        const { client_id } = req.params

        const client = await Client.findByPk(client_id, {
            include: [{ association: 'address' }, { association: 'contact' }],
        })

        if (!client) {
            return res.status(401).json({ message: 'client not found' })
        }

        return res.json(client)
    },
    async search(req, res) {
        try {
            const authHeader = req.headers.authorization

            if (!authHeader) return res.status(401).send({ error: 'No token provided' })

            await UserByToken(authHeader)

            const { args } = req.params

            const { type } = req.query

            const client = await Client.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${args}%`,
                            },
                            type: {
                                [Op.eq]: type,
                            },
                        },
                        {
                            note: {
                                [Op.like]: `%${args}%`,
                            },
                            type: {
                                [Op.eq]: type,
                            },
                        },
                    ],
                },
            })

            return res.json(client)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({
                    error: error.message.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/(Validation error: )/g, ''),
                })

            console.log(`Erro ao buscar cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const typesAccept = ['proprietário', 'fiador', 'inquilino']

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            await UserByToken(authHeader)

            //Client

            const { name, cpf, rg, gender, nationality, marital, birth_date: birthDate, type, note, email } = req.body

            const clientMail = await Contact.findOne({ where: { email } })

            if (clientMail) return res.status(401).json({ error: 'the email you entered is already registered' })

            //check type
            if (typesAccept.indexOf(type) === -1) return res.status(401).json({ error: 'Customer type not accepted' })

            const client = await Client.create({
                name,
                cpf,
                rg,
                gender,
                nationality,
                marital,
                birthDate,
                type,
                note,
            })

            //Address

            const { street, address: location, city, state, zipCode } = req.body

            const address = await Address.create({
                client_id: client.id,
                street,
                address: location,
                city,
                state,
                zipCode,
            })

            if (!address) await client.destroy()

            //Contact

            const { cell, phone, other } = req.body

            const contact = await Contact.create({
                client_id: client.id,
                cell,
                email,
                phone,
                other,
            })

            if (!contact) await address.destroy()

            return res.json({ client, address, contact })
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async update(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { name, cpf, rg, gender, nationality, marital, birth_date: birthDate, type, note } = req.body

            await UserByToken(authHeader)

            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `client not found` })

            await client.update({
                name,
                cpf,
                rg,
                gender,
                nationality,
                marital,
                birthDate,
                type,
                note,
            })

            //Address

            const address = await Address.findOne({ where: { client_id: client.id } })

            const { street, address: location, city, state, zipCode } = req.body

            await address.update({
                street,
                address: location,
                city,
                state,
                zipCode,
            })

            //Contact

            const contact = await Contact.findOne({ where: { client_id: client.id } })

            const { cell, phone, other, email } = req.body

            await contact.update({
                cell,
                email,
                phone,
                other,
            })

            return res.json(client)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao atualizar cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async destroy(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { client_id } = req.params

            const client = await Client.findByPk(client_id)

            if (!client) return res.status(400).send({ error: `client not found` })

            client.destroy()

            return res.json(client)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao excluir cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
