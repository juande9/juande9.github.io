let inputId = document.getElementById("inputId")
let inputNombre = document.getElementById("nombre")
let selectorLiga = document.getElementById("selectorLigas")
let selectorPais = document.getElementById("selectorPais")
let inputFundacion = document.getElementById("inputFundacion")
let inputEscudo = document.getElementById("inputEscudo")
let inputEstadio = document.getElementById("inputEstadio")
let ingresoClub = document.getElementById("ingresoClub")
let inputLat = document.getElementById("inputLat")
let inputLng = document.getElementById("inputLng")
let errorId = document.getElementById("errorId")
let errorObtCoordenadas = document.getElementById("errorObtCoordenadas")
let error = document.getElementsByClassName("error")
let tabla = document.getElementById("listadoEquipos")
let estadoCarga = document.getElementById("estadoCarga")
let botonCoordenadas = document.getElementById("obtenerCoordenadas")

/**
 * Fetch Local al JSON.
 */
function buscarBaseDatos() {
    fetch(`./json/equipos.json`)
        .then(response => response.json())
        .then(response => {
            console.dir("Base de datos cargada con exito.")
            const equiposLocal = JSON.parse(localStorage.getItem('equiposNuevos'));
            const equipos = response[`response`];
            const equiposEncontrados = []

            for (i = 0; i < equiposconBufandas.length; i++) {
                buscarEquipo(equiposconBufandas[i])
            }

            function buscarEquipo(club) {
                let clubEncontrado = equipos.find(e => e.team.name === club)
                equiposEncontrados.push(clubEncontrado)
            }

            generaSelectors(equipos)

            tabla ? mostrarEquiposTabla(equipos, equiposLocal) & btnLatLgnInput() & checkId(equipos, equiposLocal)
                : mostrarEquiposMapa(equipos) & mostrarPaisesMapa(equipos)

        })
        .catch(error => console.log('error', error));
}

/**
 * Genera selectores de forma dinamica por JSON.
 */
function generaSelectors(arrayClubesEncontrados) {
    const ligas = []

    for (i = 0; i < arrayClubesEncontrados.length; i++) {
        let liga = arrayClubesEncontrados[i].team.league
        if (!ligas.includes(liga)) {
            ligas.push(liga)
        }
    }

    if (tabla) {
        seleccionLiga = ""
        ligas.forEach(element =>
            seleccionLiga += `<option>${element}</option>`)
        selectorLiga.innerHTML = seleccionLiga

        fetch(`./json/countries.geojson`)
            .then(response => response.json())
            .then(response => {
                const paises = response[`features`]
                seleccionPais = ""
                for (i = 0; i < response[`features`].length; i++) {
                    pais = paises[i].properties.ADMIN
                    seleccionPais += `<option>${pais}</option>`
                    selectorPais.innerHTML = seleccionPais
                }
            })
    }
}

/**
 * Imprime los equipos en el DOM.
 * @param {array} arrayClubes Se obtiene del JSON
 */
function mostrarEquiposTabla(arrayClubesJSON, arrayClubesLocal) {
    tabla.innerHTML = ""
    /*Muestra equipos del JSON*/
    for (let i = 0; i < arrayClubesJSON.length; i++) {
        let pos = arrayClubesJSON.indexOf(arrayClubesJSON[i])
        let row = document.createElement("tr")
        let celdaElim = document.createElement("td")
        let celdaAgregar = document.createElement("td")
        let botonEliminar = document.createElement("button")
        let botonAgregarBufanda = document.createElement("button")
        botonEliminar.className = `btn btn-secondary eliminar`
        botonEliminar.innerHTML = `<i class="bi bi-x"></i>`
        botonAgregarBufanda.innerHTML = `<i class="bi bi-bookmark-plus-fill"></i>`
        botonAgregarBufanda.className = `btn btn-secondary btn-sm`
        tabla.append(row)
        row.innerHTML = `
        <td scope="row">${arrayClubesJSON[i].team.id}</td>
        <td>${arrayClubesJSON[i].team.name}</td>
        <td>${arrayClubesJSON[i].team.league}</td>
        <td>${arrayClubesJSON[i].team.country}</td>
        <td>${arrayClubesJSON[i].team.founded}</td>
        <td>${arrayClubesJSON[i].venue.name}</td>
        <td></td>
        <td></td>
        <td>${arrayClubesJSON[i].venue.capacity}</td>
        <td><img class="escudoTabla" src=${arrayClubesJSON[i].team.logo}></td>`

        obtenerCoordenadas(arrayClubesJSON[i], ({ latitud, longitud }) => {
            if (latitud == null && longitud == null) {
                row.children[6].innerText = `${parseFloat(arrayClubesJSON[i].venue.coord.lat)}`
                row.children[7].innerText = `${parseFloat(arrayClubesJSON[i].venue.coord.lgn)}`
            }
            else {
                row.children[6].innerText = `${parseFloat(latitud.toFixed(4))}`
                row.children[7].innerText = `${parseFloat(longitud.toFixed(4))}`
            }
        })

        row.append(celdaElim)
        celdaElim.append(botonEliminar)
        botonEliminar.onclick = () => {
            arrayClubesJSON.splice(pos, 1)
            row.remove()
        }

        row.append(celdaAgregar)
        celdaAgregar.append(botonAgregarBufanda)
        botonAgregarBufanda.onclick = () => agregarBufanda(arrayClubesJSON[i])
    }

    /*Muestra equipos en LocalStorage*/
    if (arrayClubesLocal) {
        for (let i = 0; i < arrayClubesLocal.length; i++) {
            console.log(arrayClubesLocal)
            let pos = arrayClubesLocal.indexOf(arrayClubesLocal[i])
            let row = document.createElement("tr")
            let celdaElim = document.createElement("td")
            let celdaAgregar = document.createElement("td")
            let botonEliminar = document.createElement("button")
            let botonAgregarBufanda = document.createElement("button")
            botonEliminar.className = `btn btn-secondary eliminar`
            botonEliminar.innerHTML = `<i class="bi bi-x"></i>`
            botonAgregarBufanda.innerHTML = `<i class="bi bi-bookmark-plus-fill"></i>`
            botonAgregarBufanda.className = `btn btn-secondary btn-sm`
            tabla.append(row)
            row.innerHTML = `
        <td scope="row">${arrayClubesLocal[i].id}</td>
        <td>${arrayClubesLocal[i].nombre}</td>
        <td>${arrayClubesLocal[i].league}</td>
        <td>${arrayClubesLocal[i].country}</td>
        <td>${arrayClubesLocal[i].founded}</td>
        <td>${arrayClubesLocal[i].venue}</td>
        <td></td>
        <td></td>
        <td>${""}</td>
        <td><img class="escudoTabla" src=${arrayClubesLocal[i].logo}></td>`

            obtenerCoordenadas(arrayClubesLocal[i], ({ latitud, longitud }) => {
                if (latitud == null && longitud == null) {
                    row.children[6].innerText = `${parseFloat(arrayClubesLocal[i].lat)}`
                    row.children[7].innerText = `${parseFloat(arrayClubesLocal[i].lng)}`
                }
                else {
                    row.children[6].innerText = `${parseFloat(latitud.toFixed(4))}`
                    row.children[7].innerText = `${parseFloat(longitud.toFixed(4))}`
                }
            })

            row.append(celdaElim)
            celdaElim.append(botonEliminar)
            botonEliminar.onclick = () => {
                arrayClubesLocal.splice(pos, 1)
                row.remove()
            }

            row.append(celdaAgregar)
            celdaAgregar.append(botonAgregarBufanda)
            botonAgregarBufanda.onclick = () => agregarBufanda(arrayClubesLocal[i])
        }
    }
}

function btnLatLgnInput() {
    /**
    * Habilita o deshabilita el botón para buscar coordenadas si en input esta vacio.
    */
    inputEstadio.addEventListener('input', (e) => {
        if (inputEstadio.value.trim() === "") {
            botonCoordenadas.disabled = true
        } else {
            botonCoordenadas.disabled = false
        }
    })
    /**
     * Genera la animación de busqueda.
     */
    botonCoordenadas.addEventListener("click", function () {
        botonCoordenadas.innerHTML = `
            <span id="spinner" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>`
        buscarCoordenadas(inputEstadio.value, ({ latitud, longitud }) =>
            setTimeout(function () {
                inputLat.value = latitud.toFixed(4),
                    inputLng.value = longitud.toFixed(4),
                    botonCoordenadas.innerHTML = "Obtener Coordenadas"
                errorObtCoordenadas.innerText = "Se ha completado la busqueda con éxito."
                errorObtCoordenadas.style.color = "green"
            }, 2000)
        )
    })
}

/**
 * Obtiene coordenadas usando Geocoder de Google. Solo se pueden obtener 10 resultados por segundo,
 * asi el resto de las coordenadas se agregaron manualmente en el JSON.
 * @param {string} inputAddress El nombre del estadio
 */

let geocoder = new google.maps.Geocoder();

function obtenerCoordenadas(inputAddress, callback) {
    geocoder.geocode({ 'address': inputAddress.venue.name },
        function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                let latitud = results[0].geometry.location.lat();
                let longitud = results[0].geometry.location.lng();
                callback({ latitud, longitud })
            }
            else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                let latitud = null
                let longitud = null
                callback({ latitud, longitud })
            }
        }
    )
}

function buscarCoordenadas(inputAddress, callback) {
    geocoder.geocode({ 'address': inputAddress },
        function (results, status) {
            errorObtCoordenadas.innerText = "Buscando..."
            errorObtCoordenadas.style.color = "black"
            if (status == google.maps.GeocoderStatus.OK) {
                let latitud = results[0].geometry.location.lat();
                let longitud = results[0].geometry.location.lng();
                callback({ latitud, longitud })
            } else if (status = google.maps.GeocoderStatus.ZERO_RESULTS) {
                setTimeout(function () {
                    errorObtCoordenadas.innerText = "No se encontraron resultados válidos. Chequee la ortografía."
                    errorObtCoordenadas.style.color = "red"
                    botonCoordenadas.innerHTML = "Obtener Coordenadas"
                }, 2000)
            }
        })
}

function agregarEquipo(e) {
    e.preventDefault();
    id = inputId.value
    nombre = checkVacio(inputNombre.value)
    league = checkVacio(selectorLiga.value)
    country = checkVacio(selectorPais.value)
    logo = checkVacio(inputEscudo.value)
    founded = checkFundacion(inputFundacion.value)
    venue = checkVacio(inputEstadio.value)
    lat = checkVacio(inputLat.value)
    lng = checkVacio(inputLng.value)
    console.log(id, nombre, league, country, founded, logo, venue, lat, lng)
    if (id && nombre && league && country && founded && logo && venue && lat && lng) {
        const equiposNuevos = []
        const newEquipo = new Equipo(id, nombre, country, league, founded, logo, venue, lat, lng)
        equiposNuevos.push(newEquipo)
        inputId.value++
        estadoCarga.innerText = `El equipo ${nombre} cargado correctamente.`
        estadoCarga.style.color = "green"
        localStorage.setItem('equiposNuevos', JSON.stringify(equiposNuevos));
    } else {
        estadoCarga.innerHTML = "Hubo un error al cargar el equipo. Faltan datos. Intente nuevamente."
        estadoCarga.style.color = "red"
    }
}

function checkId(arrayClubes, arrayLocal) {
    if (arrayLocal != null) {
        let ultimoId = arrayClubes.length + arrayLocal.length
        let proximoId = ultimoId + 1
        inputId.value = proximoId
    } else {
        let ultimoId = arrayClubes.length
        let proximoId = ultimoId + 1
        inputId.value = proximoId
    }
}

function checkVacio(valor) {
    const val = valor !== "" ? valor : false
    return val
}

function checkFundacion(numero) {
    let errorFundacion = document.getElementById("errorFundacion");
    if (numero > 1800) {
        errorFundacion.innerHTML = ""
        return numero
    } else {
        errorFundacion.innerHTML = "<b>El número es invalido. (Mayor a 1800)</b>"
    }
}

function ordenAlfabetico(arrayClubes) {
    arrayClubes.sort((a, b) => {
        if (a.nombre > b.nombre) {
            return 1;
        }
        if (a.nombre < b.nombre) {
            return -1;
        }
        return 0;
    })
    ordenarEquipo.innerHTML =
        `Nombre <i class="bi bi-arrow-up-short"></i>`
    ordenarEquipo.onclick = () => invertir()
    mostrarEquiposTabla()
}

function invertir(arrayClubes) {
    arrayClubes.reverse()
    ordenarEquipo.innerHTML =
        `Nombre <i class="bi bi-arrow-down-short"></i>`
    ordenarEquipo.onclick = () => ordenAlfabetico()
    mostrarEquiposTabla()
}

function diseñoInputs() {
    let inputs = document.querySelectorAll(`.form-control`)
    for (let element of inputs) {
        element.addEventListener('focus', (event) => {
            event.target.style.background = '#f9f9f9';
            event.target.style.borderColor = "grey"
            event.target.style.boxShadow = "0 0 0 0 "
        });
        element.addEventListener('blur', (event) => {
            event.target.style.background = '';
        })
    }
}

buscarBaseDatos()
ingresoClub.onsubmit = (e) => agregarEquipo(e)
/* ordenarEquipo = document.getElementById("ordenarEquipo")
ordenarEquipo.style.cursor = "pointer"
ordenarEquipo.onclick = () => ordenAlfabetico() */
diseñoInputs()