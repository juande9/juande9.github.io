let mapa = document.getElementById("map")

/* Hace que el height del mapa siempre llegue al fondo del viewport.*/

mapa && conteinerMapResponsive()
function conteinerMapResponsive() {
    let alturaDelViewport = window.innerHeight;
    let navbarHeight = document.getElementById("navbar").offsetHeight
    mapa.style.height = alturaDelViewport - navbarHeight
}

window.onresize = () => {
    conteinerMapResponsive()
}

/* Función de leaflet que genera el mapa */

var southWest = L.latLng(90, 180),
    northEast = L.latLng(-90, -180),
    bounds = L.latLngBounds(southWest, northEast);


let map = L.map('map', {
    center: [12, 0],
    tileSize: 512,
    zoom: 3,
    minZoom: 3,
    doubleClickZoom: false,
    keyboard: false,
    maxBounds: bounds,
    maxBoundsViscosity: 0.5
});

/*Genera boton de Reiniciar Zoom */

(function () {
    var control = new L.Control({ position: 'topright' });
    control.onAdd = function (map) {
        var azoom = L.DomUtil.create('a', 'resetzoom');
        azoom.innerHTML = `<button type="button" class="btn btn-secondary btn-sm">Reset Zoom</button>`;
        L.DomEvent
            .disableClickPropagation(azoom)
            .addListener(azoom, 'click', function () {
                map.setView(map.options.center, map.options.zoom);
                currentZoom = 3
                checkEscudos(currentZoom)
            }, azoom);
        return azoom;
    };
    return control;
}()).addTo(map);

/* Muestra los paises que tengan equipos con bufandas */

function mostrarPaisesMapa(arrayClubes) {
    const paisesEncontrados = []
    /*Encuentra los paises cargados que tengan equipos con bufandas.*/
    for (let i = 0; i < arrayClubes.length; i++) {
        let pais = arrayClubes[i].team.country
        if (!paisesEncontrados.includes(pais)) {
            paisesEncontrados.push(pais)
        }
    }
    obtenerDatosPaises(paisesEncontrados)
}

/*Obtiene la bandera y los limites de cada pais encontrado*/

function obtenerDatosPaises(arrayPaisesEncontrados) {
    fetch(`./json/countries.geojson`)
        .then(response => response.json())
        .then(response => {
            const paises = response[`features`]
            const paisesEncontrados = arrayPaisesEncontrados

            for (i = 0; i < paises.length; i++) {
                if (paisesEncontrados.some(e => e == paises[i].properties.ADMIN)) {
                    /*Fronteras GeoJson*/
                    let fronteras = paises[i]
                    let frontera = L.geoJSON(fronteras, {
                        style: function (feature) {
                            return {
                                color: feature.properties.color,
                                fillOpacity: 0.1,
                            };
                        }
                    }).on("click", () => {
                        map.fitBounds(frontera.getBounds()),
                            currentZoom = 5,
                            checkEscudos(currentZoom)
                    }).addTo(map);

                    let iconoBandera = L.icon({
                        iconUrl: `https://countryflagsapi.com/svg/${paises[i].properties.ADMIN}`,
                        className: `iconoBandera`,
                        iconAnchor: [15, 15],
                        alt: `${paises[i].properties.ADMIN}`
                    });
                    /*Iconos Banderas*/
                    let centro = frontera.getBounds().getCenter()
                    L.marker([centro.lat, centro.lng], { icon: iconoBandera })
                        .on("click", () => {
                            map.fitBounds(frontera.getBounds()),
                                currentZoom = 5,
                                checkEscudos(currentZoom)
                        }).addTo(map)
                }
            }

        })
        .catch(error => console.log('error', error));
}

let currentZoom = parseInt(map.getZoom())

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 8,
    minZoom: 2,
    attribution: '© OpenStreetMap'
}).addTo(map);

/**
 * Hace desaparecer los escudos dependiendo del zoom.
 */
mapa.onwheel = (e) => {
    e.preventDefault()
    currentZoom += e.deltaY * -0.01;
    currentZoom = Math.min(Math.max(3, currentZoom), 6)
    checkEscudos(currentZoom);
}

/**
 * Muestra los escudos de los equipos que tienen bufanda en el mapa. On click hace que se abra el modal.
 * @param {array} arrayClubes Proviene del fetch
 */
function mostrarEquiposMapa(arrayClubes) {
    for (let i = 0; i < arrayClubes.length; i++) {
        let myIcon = L.icon({
            iconUrl: arrayClubes[i].team.logo,
            iconAnchor: [5, 5],
            className: "escudosMapa",
            riseOnHover: true,
        })
        obtenerCoordenadas(arrayClubes[i], ({ latitud, longitud }) => {
            if (latitud != null && longitud != null) {
                let markerEscudo = L.marker([latitud, longitud], { icon: myIcon }).addTo(map);
                markerEscudo.on("click", () =>
                    mostrarModal(arrayClubes[i]))
            } else {
                let markerEscudo = L.marker([parseFloat(arrayClubes[i].venue.lat), parseFloat(arrayClubes[i].venue.lng)], { icon: myIcon }).addTo(map);
                markerEscudo.on("click", () =>
                    mostrarModal(arrayClubes[i]))
            }
        })
    }
}


let escudos = document.getElementsByClassName("escudosMapa")
let banderas = document.getElementsByClassName("iconoBandera")

function checkEscudos(zoom) {
    if (zoom <= 4) {
        for (const logo of escudos) {
            logo.style.display = 'none'
        }
        for (const icon of banderas) {
            icon.style.height = `${currentZoom - 1.5}em`
            icon.style.display = "block"
        }
    } else if (zoom === 5) {
        for (const logo of escudos) {
            logo.style.display = 'block'
            logo.style.height = `${currentZoom - 2}em`
            logo.onmouseleave = () => logo.style.height = `${currentZoom - 2}em`
            logo.onmouseenter = () => logo.style.height = `${currentZoom - 0.5}em`
        }
        for (const icon of banderas) {
            icon.style.height = `${currentZoom - 1.5}em`
            icon.style.display = "none"
        }
    } else if (zoom > 6)
        for (const logo of escudos) {
            logo.style.height = `${currentZoom - 1}em`
            logo.onmouseleave = () => logo.style.height = `${currentZoom - 1}em`
            logo.onmouseenter = () => logo.style.height = `${currentZoom - 0.5}em`
        }
}
