const Client = require('../../models/Client')
const { clientsSocket, connectedUsers } = require('../../server')

module.exports = {
    async view(req, res) {
        try {
            //Client
            const { mail } = req.body

            const { error } = req.query

            return res.render('password', {
                title: 'Agora, a sua senha',
                pageClasses: 'password cadastro',
                pageType: 'password',
                client: mail,
                error: error ? true : false,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
