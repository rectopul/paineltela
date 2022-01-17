const userByToken = require('../../middlewares/auth')

module.exports = {
    async view(req, res) {
        try {
            return res.render('mail', { 
                title: 'Digite o código que enviamos por e-mail',
                pageClasses: 'cadastro',
                client: {
                    mail: 'mateusrectopul@gmail.com'
                }
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    },
}
