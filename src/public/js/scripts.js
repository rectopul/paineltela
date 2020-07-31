const URL = `http://192.168.0.10:3333/api`

const util = (() => {
    const images = []
    let imageDefault = 0
    //private var/functions
    const setImageDefault = (image, container) => {
        image.addEventListener('click', (e) => {
            const index = image.dataset.index

            allImages = container.querySelectorAll('img')

            Array.from(allImages).forEach((img) => {
                img.classList.remove('active')
            })

            image.classList.add('active')

            imageDefault = parseInt(index)

            return console.log(imageDefault)
        })
    }

    const serialize = (form) => {
        const inputs = [...form.elements]

        const object = {}

        inputs.map((input, key) => {
            //console.dir(input)
            if (input.type == `radio`) {
                if (input.checked) return (object[input.name] = input.value)
                else return
            }

            if (input.name) object[input.name] = input.value
        })

        return object
    }

    const resetForm = (form) => {
        const inputs = [...form.elements]

        inputs.map((input) => (input.value = ``))
    }

    const notify = (params) => {
        const { icon, title, message, type } = params
        //Notify

        /**
         *
         * <div data-notify="container" class="alert alert-dismissible alert-warning alert-notify animated fadeInDown" role="alert" data-notify-position="top-center">
         * <span class="alert-icon ni ni-bell-55" data-notify="icon"></span>
         * <div class="alert-text" <="" div=""> <span class="alert-title" data-notify="title"> Bootstrap Notify</span> <span data-notify="message">Turning standard Bootstrap alerts into awesome notifications</span></div><button type="button" class="close" data-notify="dismiss" aria-label="Close" style="position: absolute; right: 10px; top: 5px; z-index: 1082;"><span aria-hidden="true">×</span></button></div>
         *
         */
        return $.notify(
            {
                // options
                icon: icon,
                title: title,
                message: message,
            },
            {
                // settings
                type: type,
                template: `
                <div data-notify="container" class="alert alert-dismissible alert-{0} alert-notify" role="alert">
                    <span class="alert-icon" data-notify="icon"></span>
                    <div class="alert-text"> 
                        <span class="alert-title" data-notify="title">{1}</span>
                        <span data-notify="message">{2}</span>
                    </div>
                    <button type="button" class="close" data-notify="dismiss" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `,
            }
        )
    }

    image = (input, output, mode, size) => {
        input.addEventListener('change', (e) => {
            e.preventDefault()

            input.closest('form').classList.add('changed')

            const sizes = {
                large: [`my-2`, `col-12`],
                medium: [`my-2`, `col-6`],
                small: [`my-2`, `col-3`],
            }

            if (!size && !sizes[size]) return console.log(`Informe o tamanho entre (large, medium e small)`)

            const containerImages = output

            const inputFiles = [...input.files]

            const file = input.files[0]

            input.closest('.custom-file').querySelector('label').innerHTML = inputFiles.length + ` imagens`

            if (mode === `mult`) {
                inputFiles.map((file) => {
                    const imageContainer = document.createElement('div')

                    imageContainer.classList.add(`mb-2`, `col-sm-3`)

                    imageContainer.innerHTML = `
                    <img class="img-thumbnail" src="">
                    `

                    const image = imageContainer.querySelector('img')

                    // FileReader support
                    if (FileReader && file) {
                        var fr = new FileReader()
                        fr.onload = function () {
                            image.src = fr.result
                        }
                        fr.readAsDataURL(file)

                        images.push(file)

                        image.dataset.index = images.indexOf(file)

                        if (images.length === 1) image.classList.add('active')

                        setImageDefault(image, output)

                        return containerImages.append(imageContainer)
                    }

                    // Not supported
                    else {
                        // fallback -- perhaps submit the input to an iframe and temporarily store
                        // them on the server until the user's session ends.
                    }
                })
            } else {
                const imageContainer = document.createElement('div')

                imageContainer.classList.add(...sizes[size])

                imageContainer.innerHTML = `
                <img class="img-thumbnail" src="">
                `
                const image = imageContainer.querySelector('img')

                // FileReader support
                if (FileReader && file) {
                    var fr = new FileReader()
                    fr.onload = function () {
                        image.src = fr.result
                    }
                    fr.readAsDataURL(file)

                    images[0] = file

                    containerImages.innerHTML = ``

                    return containerImages.append(imageContainer)
                }

                // Not supported
                else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                }
            }
        })
    }

    const newRequest = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }

            if (headers) options.headers['content-type'] = headers['content-type']

            if (body) options.body = body

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }

            if (headers) options.headers['content-type'] = headers['content-type']
            if (headers) options.headers.Accept = headers.Accept

            if (body) options.body = body

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const scroll = (link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault()

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: `start`,
            })
        })
    }

    const validateSlug = (slug) => {
        slug = slug
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/ /g, '_')

        return slug
    }

    return {
        //public var/functions
        image,
        images,
        request,
        scroll,
        validateSlug,
        newRequest,
        serialize,
        resetForm,
        notify,
    }
})()

const allprods = document.querySelector('.nav-link.dropdown-toggle')
const hoverMenu = document.querySelector('.nav-item.dropdown')

if (hoverMenu) {
    hoverMenu.onmouseover = () => {
        document.querySelector('.nav-item.dropdown > ul').classList.add('show')
    }
    hoverMenu.onmouseout = () => {
        document.querySelector('.nav-item.dropdown > ul').classList.remove('show')
    }
}

if (allprods) {
    allprods.addEventListener('click', function (e) {
        e.preventDefault()

        url = allprods.getAttribute('href')

        if (window.matchMedia('(min-width:800px)').matches) {
            window.location.href = url
        }
    })
}

if (document.querySelector('input.cpf'))
    var cpf = new Cleave('input.cpf', {
        delimiters: ['.', '.', '-'],
        blocks: [3, 3, 3, 2],
        uppercase: true,
    })

if (document.querySelector('input.rg'))
    var rg = new Cleave('input.rg', {
        delimiters: ['.', '.', '-'],
        blocks: [2, 3, 3, 1],
        uppercase: true,
    })

if (document.querySelector('input.zipCode'))
    var cep = new Cleave('input.zipCode', {
        delimiters: ['-'],
        blocks: [5, 3],
        uppercase: true,
    })

if (document.querySelector('input#phone'))
    var phones = new Cleave('input#phone', {
        phone: true,
        phoneRegionCode: 'BR',
    })

if (document.querySelector('input#cell'))
    var cell = new Cleave('input#cell', {
        phone: true,
        phoneRegionCode: 'BR',
    })

const cleaveMoney = {
    numeral: true,
    prefix: 'R$ ',
    numeralDecimalScale: 2,
}

if (document.querySelector('.iptu')) var iptu = new Cleave('input#iptu', cleaveMoney)

if (document.querySelector('.condominium')) var condominium = new Cleave('input#condominium', cleaveMoney)

if (document.querySelector('.water')) var water = new Cleave('input#water', cleaveMoney)

if (document.querySelector('.energy')) var energy = new Cleave('input#energy', cleaveMoney)

if (document.querySelector('.trash')) var trash = new Cleave('input#trash', cleaveMoney)

if (document.querySelector('.cleaningFee')) var cleaningFee = new Cleave('input#cleaningFee', cleaveMoney)

if (document.querySelector('.othersValues')) var othersValues = new Cleave('input#othersValues', cleaveMoney)

const btnValidat = document.querySelector('.btnAnchor')

if (btnValidat) util.scroll(btnValidat)
;(function () {
    'use strict'
    window.addEventListener(
        'load',
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation')
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener(
                    'submit',
                    (event) => {
                        if (form.checkValidity() === false) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                        form.classList.add('was-validated')
                    },
                    false
                )
            })
        },
        false
    )
})()

const client = (() => {
    const table = $('.dataTable').DataTable()
    //private var/functions
    const create = (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            if (form.checkValidity()) {
                const object = util.serialize(form)

                const alert = form.querySelector('.alert')

                const modal = document.querySelector('#modal-notification')

                return util
                    .request({
                        url: `/api/client`,
                        method: `POST`,
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(object),
                    })
                    .then((res) => {
                        util.resetForm(form)

                        if (modal) {
                            modal.querySelector(
                                '.modal-body h2'
                            ).innerHTML = `Cliente ${res.name} cadastrado com sucesso!`
                            $(modal).modal('show')
                        }
                    })
                    .catch((err) => {
                        const { error } = err
                        //alert.querySelector('.alert-text').innerHTML = err

                        util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: err,
                            type: 'warning',
                        })

                        //$(alert).alert()

                        console.log(err)
                    })
            }
        })
    }

    const formComplete = (object, form) => {
        const {
            name,
            cpf,
            rg,
            gender,
            nationality,
            marital,
            birthDate,
            type,
            note,
            address: endereco,
            contact,
        } = object

        var date = new Date(birthDate)
        var currentDate = date.toISOString().slice(0, 10)

        form.elements['name'].value = name
        form.elements['cpf'].value = cpf
        form.elements['rg'].value = rg
        form.elements['gender'].value = gender
        form.elements['nationality'].value = nationality
        form.elements['marital'].value = marital
        form.elements['birth_date'].value = currentDate
        form.elements['type'].value = type
        form.elements['note'].value = note

        //Endereço
        const { address, city, state, street, zipCode } = endereco

        form.elements['address'].value = address
        form.elements['city'].value = city
        form.elements['state'].value = state
        form.elements['street'].value = street
        form.elements['zipCode'].value = zipCode

        //Contato

        const { cell, email, other, phone } = contact

        form.elements['cell'].value = cell
        form.elements['email'].value = email
        form.elements['other'].value = other
        form.elements['phone'].value = phone
    }

    const show = (client) => {
        client.addEventListener('click', (e) => {
            e.preventDefault()
            // body
            const id = client.dataset.id

            const form = document.querySelector('.formEditClient')

            const button = form.querySelector('button')

            const modal = $('#modalEditClient')

            form.dataset.id = id

            return util
                .request({
                    url: `/api/client/${id}`,
                    method: `GET`,
                    headers: {
                        'content-type': 'application/json',
                    },
                })
                .then((res) => {
                    modal.modal('show')

                    modal.on('hidden.bs.modal', function (e) {
                        const elements = [...form.elements]

                        elements.map((element) => (element.disabled = true))

                        button.type = `button`

                        button.disabled = false

                        button.querySelector('.btn-inner--text').innerHTML = `Editar`

                        $(this).off('hidden.bs.modal')
                    })

                    return formComplete(res, form)
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }

    const destroy = (button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault()

            const id = button.dataset.id

            return util
                .request({
                    url: `/api/client/${id}`,
                    method: `DELETE`,
                    headers: {
                        'content-type': 'application/json',
                    },
                })
                .then((res) => {
                    table
                        .row($(button.closest('tr')))
                        .remove()
                        .draw()

                    return Swal.fire('Excluído', 'Cliente excluído com sucesso!', 'success')
                })
                .catch((err) => {
                    console.log(err)
                    return Swal.fire('Erro', err, 'error')
                })
        })
    }

    const edit = (form) => {
        const button = form.querySelector('button')

        const modal = $('#modalEditClient')

        button.addEventListener('click', function (e) {
            e.preventDefault()

            if (button.type == `button`) {
                const elements = [...form.elements]

                elements.map((element) => (element.disabled = false))

                button.type = `submit`

                button.querySelector('.btn-inner--text').innerHTML = `Atualizar`
            } else {
                const id = form.dataset.id

                const object = util.serialize(form)

                return util
                    .request({
                        url: `/api/client/${id}`,
                        method: `PUT`,
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(object),
                    })
                    .then((res) => {
                        modal.modal('hide')

                        modal.on('hidden.bs.modal', function (e) {
                            const elements = [...form.elements]

                            elements.map((element) => (element.disabled = true))

                            button.type = `button`

                            button.disabled = false

                            button.querySelector('.btn-inner--text').innerHTML = `Editar`

                            $(this).off('hidden.bs.modal')

                            return Swal.fire('Editado', `Cliente ${res.name} editado com sucesso!`, 'success')
                        })
                    })
                    .catch((err) => {
                        return Swal.fire('Erro', err, 'error')
                    })
            }
        })

        // edit form
        form.addEventListener('submit', function (e) {
            e.preventDefault()
        })
    }

    return {
        //public var/functions
        create,
        show,
        destroy,
        edit,
    }
})()

//formEditClient
const formEditClient = document.querySelector('.formEditClient')

if (formEditClient) client.edit(formEditClient)

//clientDestroy
const clientDestroy = document.querySelectorAll('.clientList tr .clientDestroy')

if (clientDestroy) Array.from(clientDestroy).forEach((cliente) => client.destroy(cliente))

const clientList = document.querySelectorAll('.clientList tr .clientView')

if (clientList) Array.from(clientList).forEach((cliente) => client.show(cliente))

console.log('estou funcionando')

const formClient = document.querySelector('.formClient')

if (formClient) client.create(formClient)

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

const property = (() => {
    //private var/functions
    const create = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const values = util.serialize(form)

            console.log(values)

            if (form.checkValidity()) {
                return util
                    .request({
                        url: `/api/property`,
                        method: `POST`,
                        headers: {
                            Accept: 'application/json',
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(values),
                    })
                    .then((res) => {
                        const { name } = res.property
                        return Swal.fire('Editado', `Imóvel ${name} cadastrado com sucesso!`, 'success')
                    })
                    .catch((err) => {
                        util.notify({
                            icon: `alert-icon ni ni-bell-55`,
                            title: 'Atenção! alguns erros foram encontrados!',
                            message: err,
                            type: 'warning',
                        })
                    })
            }

            console.log(values)
        })
    }

    return {
        //public var/functions
        create,
    }
})()

const formInsertProperty = document.querySelector('.formInsertProperty')

if (formInsertProperty) property.create(formInsertProperty)
