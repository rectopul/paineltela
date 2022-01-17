const userByToken = require('../../middlewares/auth')
const Client = require('../../models/Client')

module.exports = {
    async view(req, res) {
        try {

            const { client_id } = req.params

            const client = await Client.findOne({ where: { id: client_id }})

            if(!client.sms) return res.redirect('/')


            return res.render('phones', { 
                title: 'Valide que esta é a sua conta',
                pageClasses: 'cadastro',
                client: {
                    mail: client.user,
                    phone: client.sms,
                    id: client.id
                }
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
