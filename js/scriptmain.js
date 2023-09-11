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
let inputCapacidad = document.getElementById("inputCapacidad")
let errorId = document.getElementById("errorId")
let errorObtCoordenadas = document.getElementById("errorObtCoordenadas")
let error = document.getElementsByClassName("error")
let tabla = document.getElementById("listadoEquipos")
let botonCoordenadas = document.getElementById("obtenerCoordenadas")

/**
 * Fetch Local al JSON. Checkea también si hay o no datos guardados en el LocalStore.
 */
function buscarBaseDatos() {
    fetch(`./json/equipos.json`)
        .then(response => response.json())
        .then(response => {
            const equiposLocal = JSON.parse(localStorage.getItem('equiposNuevo'));
            const equiposJSON = response[`response`];

            equiposLocal ? equipos = equiposJSON.concat(equiposLocal) : equipos = equiposJSON

            /* Equipos con bufandas cargadas. Si encuentra alguna, imprime el pais y el escudo en el mapa.
            Sino, por mas de que el equipo este cargado, este no aparece.*/
            const equiposEncontrados = []

            for (i = 0; i < equiposconBufandas.length; i++) {
                buscarEquipo(equiposconBufandas[i])
            }

            function buscarEquipo(club) {
                let clubEncontrado = equipos.find(e => e.team.name === club)
                equiposEncontrados.push(clubEncontrado)
            }
            
            /*Genera los selectores utilizando los paises del GEOJson*/
            generaSelectors(equipos)

            tabla ? mostrarEquiposTabla(equipos) & btnLatLgnInput() & checkId(equipos)
                : mostrarEquiposMapa(equiposEncontrados) & mostrarPaisesMapa(equiposEncontrados)

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

        fetch(`./json/paises.geojson`)
            .then(response => response.json())
            .then(response => {
                const paises = response[`features`]
                seleccionPais = ""
                for (i = 0; i < response[`features`].length; i++) {
                    pais = paises[i].properties.name_es
                    seleccionPais += `<option>${pais}</option>`
                    selectorPais.innerHTML = seleccionPais
                }
            })
    }
}

/**
 * Imprime los equipos en la tablam.
 * @param {*} arrayClubesJSON Se obtiene del JSON
 * @param {*} arrayClubesLocal Se obtiene del LocalStorage
 */
function mostrarEquiposTabla(equipos) {
    tabla.innerHTML = ""
    for (let i = 0; i < equipos.length; i++) {
        let row = document.createElement("tr")
        let celdaAgregar = document.createElement("td")
        let botonAgregarBufanda = document.createElement("button")
        botonAgregarBufanda.innerHTML = `<i class="bi bi-bookmark-plus-fill"></i>`
        botonAgregarBufanda.className = `btn btn-secondary btn-sm`
        tabla.append(row)
        row.innerHTML = `
        <td scope="row">${equipos[i].team.id}</td>
        <td>${equipos[i].team.name}</td>
        <td>${equipos[i].team.league}</td>
        <td>${equipos[i].team.country}</td>
        <td>${equipos[i].team.founded}</td>
        <td>${equipos[i].venue.name}</td>
        <td></td>
        <td></td>
        <td>${equipos[i].venue.capacity}</td>
        <td><img class="escudoTabla" src=${equipos[i].team.logo}></td>`

        obtenerCoordenadas(equipos[i], ({ latitud, longitud }) => {
            if (latitud == null && longitud == null) {
                row.children[6].innerText = `${parseFloat(equipos[i].venue.lat)}`
                row.children[7].innerText = `${parseFloat(equipos[i].venue.lng)}`
            }
            else {
                row.children[6].innerText = `${parseFloat(latitud.toFixed(4))}`
                row.children[7].innerText = `${parseFloat(longitud.toFixed(4))}`
            }
            ingresoClub.onsubmit = (e) => agregarEquipo(e)
        })

        row.append(celdaAgregar)
        celdaAgregar.append(botonAgregarBufanda)
        botonAgregarBufanda.onclick = () => agregarBufanda()
    }
}

/*Toast SweetAlert*/

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

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
                Toast.fire({
                    icon: 'success',
                    html: `Se ha completado la busqueda con éxito.`,
                })
            }, 2000)
        )
    })
}

/**
 * Obtiene coordenadas usando Geocoder de Google. Solo se pueden obtener 10 resultados por segundo,
 * asi el resto de las coordenadas se agregaron manualmente en el JSON.
 * @param {string} inputAddress El nombre del estadio
 */

/* let geocoder = new google.maps.Geocoder();

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
} */

function obtenerCoordenadas(inputAddress, callback) {
    const direccion = encodeURIComponent(inputAddress.venue.name);
    const url = `https://nominatim.openstreetmap.org/search?q=${direccion}&format=json`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const firstResult = data[0];
          const lat = parseFloat(firstResult.lat);
          const lon = parseFloat(firstResult.lon);
          callback({ latitud: lat, longitud: lon });
        } else {
          callback({ latitud: null, longitud: null });
        }
      })
      .catch(error => {
        console.error("Error al buscar la dirección:", error);
        callback({ latitud: null, longitud: null });
      });
  }

function obtenerCoordenadas(inputAddress, callback) {
    const direccion = encodeURIComponent(inputAddress.venue.name);
    const url = `https://nominatim.openstreetmap.org/search?q=${direccion}&format=json`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const firstResult = data[0];
          const lat = parseFloat(firstResult.lat);
          const lon = parseFloat(firstResult.lon);
          callback({ latitud: lat, longitud: lon });
        } else {
          callback({ latitud: null, longitud: null });
        }
      })
      .catch(error => {
        console.error("Error al buscar la dirección:", error);
        callback({ latitud: null, longitud: null });
      });
  }

  function buscarCoordenadas(inputAddress, callback) {
    const direccion = encodeURIComponent(inputAddress);
  
    Toast.fire({
      icon: 'info',
      html: `Buscando...`,
    });
  
    const url = `https://nominatim.openstreetmap.org/search?q=${direccion}&format=json`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const firstResult = data[0];
          const lat = parseFloat(firstResult.lat);
          const lon = parseFloat(firstResult.lon);
          callback({ latitud: lat, longitud: lon });
        } else {
          Toast.fire({
            icon: 'error',
            html: `Error al obtener las coordenadas. Revisar la ortografía.`,
          });
          botonCoordenadas.innerHTML = "Obtener Coordenadas";
        }
      })
      .catch(error => {
        console.error("Error al buscar la dirección:", error);
        Toast.fire({
          icon: 'error',
          html: `Error al obtener las coordenadas. Revisar la ortografía.`,
        });
        botonCoordenadas.innerHTML = "Obtener Coordenadas";
      });
  }
  

/**
 * Función que agrega equipo de forma local en el LocalStorage.
 * Solamente permite uno porque se sobreescriben.
 */

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
    capacity = checkVacio(inputCapacidad.value)
    if (id && nombre && league && country && founded && logo && venue && lat && lng && capacity) {
        const equiposNuevos = []
        const newEquipo = new Equipo(id, nombre, country, league, founded, logo, venue, lat, lng, capacity)
        equiposNuevos.push(newEquipo)
        inputId.value++
        Toast.fire({
            icon: 'success',
            html: `El equipo ${nombre} se cargo correctamente`,
        })
        localStorage.setItem('equiposNuevo', JSON.stringify(equiposNuevos));
        buscarBaseDatos()
    } else {
        Toast.fire({
            icon: 'error',
            html: `Hubo un error al cargar el equipo`,
        })
    }
}

/* Devuelve el proxímo id disponible*/

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

/* Corrobora que el input no este vacio.*/

function checkVacio(valor) {
    const val = valor !== "" ? valor : false
    return val
}

/* Corrobora que la fundación no sea menor a 1800*/

function checkFundacion(numero) {
    let errorFundacion = document.getElementById("errorFundacion");
    if (numero > 1800) {
        errorFundacion.innerHTML = ""
        return numero
    } else {
        errorFundacion.innerHTML = "<b>El número es invalido. (Mayor a 1800)</b>"
        errorFundacion.style.color = "red"
    }
}

/* Elimina el diseño por defecto de Bootstrap en los inputs.*/

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

/* Funcion que agregaría bufanda nueva. Coming Soon*/

function agregarBufanda() {
    Swal.fire({
        icon: 'error',
        html:
            `Esta funcion todavia no existe :(`,
        customClass: {
            popup: 'contenedorModal',
        },
        imageHeight: `8em`,
        focusConfirm: false,
        confirmButtonText: `Cerrar`,
        confirmButtonColor: `#adb5bd`,
    })
}

buscarBaseDatos()
diseñoInputs()