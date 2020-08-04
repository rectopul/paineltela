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

    const get = async (args, type, container) => {
        try {
            //const find = args.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

            const clients = await util.get(`/api/client_search/${args}?type=${type}`)

            container.innerHTML = ``

            container.closest('.responseCard').classList.add('show')

            return clients.map((client) => container.append(createClient(client, container)))
        } catch (error) {
            console.log(error)
        }
    }

    const createClient = (object, container) => {
        const tr = document.createElement('tr')

        const input = container.closest('.inputWrapper').querySelector('input.searching')

        const { name, cpf, gender, type } = object

        tr.innerHTML = `
            <th>${name}</th>
            <th>${cpf}</th>
            <th>${gender}</th>
            <th>${type}</th>
        `

        //click result

        tr.addEventListener('click', (e) => {
            e.preventDefault()

            $(input).tagsinput('removeAll')

            $(input).tagsinput('add', name)

            container.closest('.responseCard').classList.remove('show')
        })

        return tr
    }

    const search = (input, type) => {
        input.addEventListener('keyup', (e) => {
            const container = input.closest('.inputWrapper').querySelector('.resultList')

            if (!input.value.length) {
                return container.closest('.responseCard').classList.remove('show')
            }

            if (input.value && input.value.length > 3) {
                util.delayed_methods('check date parallel', get(input.value, type, container))
            }
        })
    }

    return {
        //public var/functions
        create,
        show,
        destroy,
        edit,
        search,
    }
})()

//Search Fiador
const inputGuarantor = document.querySelector('.guarantorTag input[type="text"]')

if (inputGuarantor) client.search(inputGuarantor, `fiador`)

//Search proprietário
const inputOwner = document.querySelector('.ownerTag input[type="text"]')

if (inputOwner) client.search(inputOwner, `proprietário`)

const inputOccupant = document.querySelector('.occupantTag input[type="text"]')

if (inputOccupant) client.search(inputOccupant, `inquilino`)

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
