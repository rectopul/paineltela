const Client = require('../../models/Client')

module.exports = {
    async view(req, res) {
        try {
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
