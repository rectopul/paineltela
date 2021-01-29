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

            const clients = await Client.findAll({
                where: {
                    [Op.not]: { status: 'finish' },
                },
                order: [['id', 'DESC']],
                include: { association: `operator` },
            })

            const theClients = clients.map((client) => client.toJSON())

            const user = await User.findByPk(user_id)

            return res.render('dashboard', {
                title: `Dashboard`,
                page: `dashboard`,
                token,
                user: user.toJSON(),
                clients: theClients,
                panel: true,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
