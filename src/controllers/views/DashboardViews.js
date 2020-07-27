const userByToken = require('../../middlewares/auth')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)
            //userName

            return res.render('dashboard', {
                title: `Dashboard`,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
