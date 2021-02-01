const btnLogin = document.querySelector('#btnLogin')
const userInput = document.querySelector('#nomeUsuario')

if (btnLogin && userInput) {
    btnLogin.addEventListener('click', function (e) {
        if (userInput.value) socket.emit('chat message', userInput.value)
    })
}

socket.on('chat message', function (msg) {
    alert(msg)
})

//menu login
const menuLogin = [...document.querySelectorAll('.menuLogin li')]

if (menuLogin) {
    menuLogin.forEach((element) => {
        element.addEventListener('click', function (e) {
            const parent = element.closest('ul')
            const similar = parent.querySelectorAll('li')
            const number = element.dataset.number
            const content = element.closest('.menuLoginHome').querySelector(`.container-menuLogin > #content${number}`)

            if (!similar.length) return

            similar.forEach((item) => {
                item.classList.remove('selected')
            })

            element.classList.add('selected')

            if (!content) return

            const similarContent = [...content.closest('.container-menuLogin').querySelectorAll('.boxContent')]

            similarContent.forEach((theContent) => {
                theContent.style.display = 'none'
            })

            content.style.display = 'block'
        })
    })
}
