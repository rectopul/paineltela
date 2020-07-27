module.exports = {
    async view(req, res) {
        try {
            const rcSiteKey = process.env.RECAPTCHA_SITE_KEY
            const secretKey = process.env.RECAPTCHA_SITE_KEY

            return res.render('login', {
                pageClasses: `bg-gradient-primary`,
                title: `Login`,
                rcSiteKey,
                secretKey,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
