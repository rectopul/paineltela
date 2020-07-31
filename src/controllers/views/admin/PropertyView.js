const userByToken = require('../../../middlewares/auth')
const Client = require('../../../models/Client')
const User = require('../../../models/User')

module.exports = {
    async store(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)

            const user = await User.findByPk(user_id)

            return res.render('admin/insert_properties', {
                pageClasses: ``,
                title: `Cadastro de Imóvel`,
                page: `insert_property`,
                token,
                user: user.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },

    async index(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)
            //userName

            const user = await User.findByPk(user_id)

            const clients = await Client.findAll({ include: [{ association: `address` }, { association: `contact` }] })

            const clientsMap = clients.map((client) => {
                const cliente = client.toJSON()

                const { createdAt } = cliente

                const data = new Intl.DateTimeFormat('pt-BR').format(new Date(createdAt))

                cliente.createdAt = data

                return cliente
            })

            return res.render('admin/clients', {
                pageClasses: ``,
                title: `Listagem de cliente`,
                page: `client`,
                clients: clientsMap ? clientsMap : null,
                token,
                user: user.toJSON(),
            })
        } catch (error) {
            console.log(error)
        }
    },
}
