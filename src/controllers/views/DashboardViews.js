const userByToken = require('../../middlewares/auth')
const User = require('../../models/User')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)
            //userName

            const user = await User.findByPk(user_id)

            return res.render('dashboard', {
                title: `Dashboard`,
                page: `dashboard`,
                token,
                user: user.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
