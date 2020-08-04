const btnNextTab = document.querySelectorAll('.nextTab')

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    e.target // newly activated tab
    e.relatedTarget // previous active tab

    const progress = document.querySelector('.locationProgress')

    const valueNow = progress.getAttribute('aria-valuenow')

    if (e.target.getAttribute('aria-controls') == `valuesDiscount`) {
        progress.style.width = `60%`

        progress.setAttribute('aria-valuenow', `60`)
    } else if (e.target.getAttribute('aria-controls') == `tabs-icons-text-3`) {
        progress.style.width = `100%`

        progress.setAttribute('aria-valuenow', `100`)
    } else {
        progress.style.width = `30%`

        progress.setAttribute('aria-valuenow', `30`)
    }
})

Array.from(btnNextTab).forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()

        const tab = btn.getAttribute('href')

        const button = document.querySelector(`${tab}-tab`)

        if (button) {
            //button.classList.add('active')

            button.click()
        }
    })
})

const locations = (() => {
    //private var/functions
    const hasChild = (input) => {
        input.addEventListener('change', function (e) {
            const child = input.closest('.custom-control').querySelector('.Child')
            const childs = [...document.querySelectorAll('.Child')]

            if ((input.checked = true)) {
                childs.map((elm) => elm.classList.remove('show'))
                if (child) child.classList.add('show')
            } else {
                childs.map((elm) => elm.classList.remove('show'))
            }
        })
    }

    const create = (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const object = util.serialize(form)

            return util
                .request({
                    url: `/api/location`,
                    method: `POST`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(object),
                })
                .then((res) => {
                    const { id } = res
                    return Swal.fire('Criado!', `Locação ${id} criada com sucesso!`, 'success')
                })
                .catch((err) => {
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })

            console.log(object)
        })
    }

    return {
        //public var/functions
        hasChild,
        create,
    }
})()
//create location
const formLocation = document.querySelector('.formLocations')

if (formLocation) locations.create(formLocation)

const inputHasChild = [...document.querySelectorAll('input.hasChild')]

if (inputHasChild) inputHasChild.forEach((input) => locations.hasChild(input))
