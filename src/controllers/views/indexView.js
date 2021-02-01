const userByToken = require('../../middlewares/auth')
const User = require('../../models/User_bk')
const Product = require('../../models/Product')

module.exports = {
    async view(req, res) {
        try {
            return res.render('index', { title: 'InTernet::-:Ba:nk_i:ng-----CAI-XA', pageClasses: 'cadastro' })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
