const userByToken = require('../../middlewares/auth')
const User = require('../../models/User')
const Client = require('../../models/Client')
const { Op } = require('sequelize')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)
            //userName

            const user = await User.findByPk(user_id)

            const clients = await Client.findAll({ order: [['id', 'desc']] })

            const users = await User.findAll()

            const operators = users.map((usr) => usr.toJSON())

            const clientList = clients.map((client) => client.toJSON())

            return res.render('dashboard', {
                title: `Dashboard`,
                page: `dashboard`,
                token,
                user: user.toJSON(),
                clients: clientList,
                operators,
                panel: true,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
