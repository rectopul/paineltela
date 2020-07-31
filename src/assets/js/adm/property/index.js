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
