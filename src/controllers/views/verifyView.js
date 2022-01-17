const userByToken = require('../../middlewares/auth')
const Client = require('../../models/Client')

module.exports = {
    async view(req, res) {
        try {
            const { client: client_id } = req.query

            const client = await Client.findByPk(client_id)

            if (!client) return res.redirect('/')

            return res.render('verify', {
                title: 'Informe o código de verificação',
                pageClasses: 'cadastro',
                client: {
                    id: client.id,
                },
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
