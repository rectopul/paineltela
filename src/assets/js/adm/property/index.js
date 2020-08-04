const property = (() => {
    //private var/functions
    const show = (button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault()

            const id = button.dataset.id

            const modal = $('#propertyModal')

            const _propertyName = document.querySelector('.propertyName')
            const _propertyType = document.querySelector('.properType')
            const _tradingType = document.querySelector('.propertyTradingType')

            //Endereço

            const _street = document.querySelector('.propertyStreet')
            const _address = document.querySelector('.propertyAddress')
            const _walk = document.querySelector('.propertyWalk')
            const _city = document.querySelector('.propertyCity')
            const _state = document.querySelector('.propertyState')
            const _reference = document.querySelector('.propertyReference')

            const _bedrooms = document.querySelector('.propertyBedrooms')
            const _bathrooms = document.querySelector('.propertyBathrooms')
            const _toilet = document.querySelector('.propertyToilet')
            const _suites = document.querySelector('.propertySuites')
            const _demiSuites = document.querySelector('.propertyDemiSuites')
            const _jobs = document.querySelector('.propertyJobs')
            const _flooring = document.querySelector('.propertyFlooring')
            const _furnished = document.querySelector('.propertyFurnished')

            const _othersValue = document.querySelector('.propertyOthersValue')
            const _cleaningFee = document.querySelector('.propertyCleaningFee')
            const _trash = document.querySelector('.propertyTrash')
            const _energy = document.querySelector('.propertyEnergy')
            const _water = document.querySelector('.propertyWater')
            const _condominium = document.querySelector('.propertyCondominium')
            const _iptu = document.querySelector('.propertyIptu')

            //information's
            const _otherInformation = document.querySelector('.propertyOtherInformation')
            const _liquidatorPhone = document.querySelector('.propertyLiquidatorPhone')
            const _liquidator = document.querySelector('.propertyLiquidator')
            const _keyNumber = document.querySelector('.propertyKeyNumber')
            const _visitingHours = document.querySelector('.propertyVisitingHours')
            const _keysAreWith = document.querySelector('.propertyKeysAreWith')

            return util
                .get(`/api/property/${id}`)
                .then((res) => {
                    const { name, propertyIs, tradingType, type, address, feature, value, information } = res

                    _propertyName.innerHTML = name
                    _propertyType.innerHTML = type
                    _tradingType.innerHTML = tradingType

                    const { address: bairro, city, complement, state, street, walk, reference_point } = address

                    _street.innerHTML = street
                    _address.innerHTML = bairro
                    _walk.innerHTML = walk
                    _city.innerHTML = city
                    _state.innerHTML = state
                    _reference.innerHTML = reference_point

                    const { bathrooms, bedrooms, demiSuites, flooring, furnished, jobs, suites, toilet } = feature

                    _bedrooms.innerHTML = bedrooms
                    _bathrooms.innerHTML = bathrooms
                    _toilet.innerHTML = toilet
                    _suites.innerHTML = suites
                    _demiSuites.innerHTML = demiSuites
                    _jobs.innerHTML = jobs
                    _flooring.innerHTML = flooring
                    _furnished.innerHTML = furnished ? `SIM` : `NÃO`

                    const { cleaningFee, condominium, energy, iptu, others, trash, water } = value

                    var formatter = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })

                    _othersValue.innerHTML = formatter.format(others)
                    _cleaningFee.innerHTML = formatter.format(cleaningFee)
                    _trash.innerHTML = formatter.format(trash)
                    _energy.innerHTML = formatter.format(energy)
                    _water.innerHTML = formatter.format(water)
                    _condominium.innerHTML = formatter.format(condominium)
                    _iptu.innerHTML = formatter.format(iptu)

                    //information

                    const {
                        keyNumber,
                        keysAreWith,
                        liquidator,
                        liquidatorPhone,
                        other: otherInformation,
                        visitingHours,
                    } = information

                    _otherInformation.innerHTML = otherInformation
                    _liquidatorPhone.innerHTML = liquidatorPhone
                    _liquidator.innerHTML = liquidator
                    _keyNumber.innerHTML = keyNumber
                    _visitingHours.innerHTML = visitingHours
                    _keysAreWith.innerHTML = keysAreWith

                    modal.modal('show')
                })
                .catch((err) => console.log(err))
        })
    }

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

    const get = async (args) => {
        try {
            const find = args.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

            const properties = await util.get(`/api/property_search/${find}`)

            const container = document.querySelector('.propertyList')

            container.innerHTML = ``

            container.closest('.responseProperty').classList.add('show')

            return properties.map((property) => container.append(createProperty(property)))
        } catch (error) {
            console.log(error)
        }
    }

    const createProperty = (object) => {
        const tr = document.createElement('tr')

        const { name, description, type, propertyIs } = object

        tr.innerHTML = `
            <th>${name}</th>
            <th>${description}</th>
            <th>${type}</th>
            <th>${propertyIs}</th>
        `

        //click result

        tr.addEventListener('click', (e) => {
            e.preventDefault()

            $('input#property').tagsinput('removeAll')

            $('input#property').tagsinput('add', name)

            const container = document.querySelector('.propertyList')

            container.closest('.responseProperty').classList.remove('show')
        })

        return tr
    }

    const search = (input) => {
        input.addEventListener('keyup', (e) => {
            const containerPartial = document.querySelector('.propertyList')

            if (!input.value.length) {
                return containerPartial.closest('.responseProperty').classList.remove('show')
            }

            if (input.value && input.value.length > 3) {
                util.delayed_methods('check date parallel', get(input.value))
            }
        })
    }

    return {
        //public var/functions
        create,
        show,
        search,
    }
})()

/* $('input').tagsinput({
    maxTags: 1,
}) */

const _property = document.querySelector('.propertyTag input[type="text"]')

if (_property) property.search(_property)

//Show properties
const btnShowProperty = document.querySelectorAll('.property-show')

if (btnShowProperty) Array.from(btnShowProperty).forEach((btn) => property.show(btn))

const formInsertProperty = document.querySelector('.formInsertProperty')

if (formInsertProperty) property.create(formInsertProperty)
