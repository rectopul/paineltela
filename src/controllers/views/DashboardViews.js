const userByToken = require('../../middlewares/auth')
const User = require('../../models/User')
const Product = require('../../models/Product')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await userByToken(token)
            //userName

            const user = await User.findByPk(user_id)

            const products = await Product.findAll({ limit: 25, include: { association: `image` } })

            products.map((producto, key) => {
                if (key == 4) console.log(producto.toJSON())
            })

            return res.render('dashboard', {
                title: `Dashboard`,
                page: `dashboard`,
                token,
                user: user.toJSON(),
                products: products.map((prod) => prod.toJSON()),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
