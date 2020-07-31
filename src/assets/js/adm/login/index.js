//formLogin
const login = (() => {
    //private var/functions
    const login = (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const user = util.serialize(form)

            return util
                .request({
                    url: `/api/login`,
                    method: `POST`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(user),
                })
                .then((res) => (window.location.href = `/dashboard`))
                .catch((err) => console.log(err))
        })
    }

    return {
        //public var/functions
        login,
    }
})()

const formLogin = document.querySelector('.formLogin')

if (formLogin) login.login(formLogin)
