let modal = document.getElementById("modal")
const decada = ["80s", "90s", "00s", "2010s", "2020s"]
const bufandas = []
const equiposconBufandas = []

/* Bufandas instanciadas. Puaj*/

const bufEspaña = [
    rma1 = new Bufanda(2, "Real Madrid", decada[2], "rma1/thumbnail.png"),
    rma2 = new Bufanda(3, "Real Madrid", decada[1], "rma2/thumbnail.png"),
    rma3 = new Bufanda(4, "Real Madrid", decada[4], "rma3/thumbnail.png"),
    rma4 = new Bufanda(5, "Real Madrid", decada[2], "rma4/thumbnail.png"),
    bcn1 = new Bufanda(6, "Barcelona", decada[3], "bcn1/thumbnail.png"),
    bcn2 = new Bufanda(7, "Barcelona", decada[1], "bcn2/thumbnail.png"),
    bcn3 = new Bufanda(8, "Barcelona", decada[1], "bcn3/thumbnail.png"),
    bcn4 = new Bufanda(9, "Barcelona", decada[0], "bcn4/thumbnail.png"),
    sev1 = new Bufanda(10, "Sevilla", decada[2], "sev1/thumbnail.png"),
    cel1 = new Bufanda(11, "Celta Vigo", decada[2], "cel1/thumbnail.png"),
    dep1 = new Bufanda(12, "Deportivo La Coruña", decada[1], "dep1/thumbnail.png"),
    dep2 = new Bufanda(13, "Deportivo La Coruña", decada[1], "dep2/thumbnail.png"),
]

const bufInglaterra = [
    man1 = new Bufanda(14, "Manchester United", decada[2], "man1/thumbnail.png")
]

const bufItalia = [
    fio1 = new Bufanda(15, "Fiorentina", decada[2], "fio1/thumbnail.png"),
    fio2 = new Bufanda(16, "Fiorentina", decada[2], "fio2/thumbnail.png"),
    int1 = new Bufanda(17, "Inter de Milán", decada[1], "int1/thumbnail.png"),
    mil1 = new Bufanda(18, "AC Milan", decada[1], "mil1/thumbnail.png"),
    juv1 = new Bufanda(19, "Juventus", decada[1], "juv1/thumbnail.png"),
    par1 = new Bufanda(20, "Parma", decada[1], "par1/thumbnail.png"),
    per1 = new Bufanda(21, "Perugia", decada[2], "per1/thumbnail.png"),
]

const bufFrancia = [
    mco1 = new Bufanda(22, "Monaco", decada[1], "mco1/thumbnail.png"),
]

const bufArgentina = [
    cai1 = new Bufanda(23, "Independiente", decada[4], "cai1/thumbnail.webp"),
]

/* Unifica a todas las bufandas en un solo array */

bufandas.push(...bufEspaña, ...bufInglaterra, ...bufItalia, ...bufFrancia, ...bufArgentina)

bufandas.forEach(e =>
    checkeaExistencia(e)
)

function checkeaExistencia(club) {
    equiposconBufandas.includes(club.equipo) !== true && equiposconBufandas.push(club.equipo)
}


/* Genera de forma dinamica los modals (pop-up) de cada equipo al hacer click en el escudo.*/

function mostrarModal(club) {
    const bufandasEquipo = bufandas.filter(bufanda => bufanda.equipo == club.team.name)
    Swal.fire({
        title: `<strong>${club.team.name}</strong>`,
        html:
            `<section class="datosModal">
                <div class="infoModal"><strong>Liga </strong><span>${club.team.league}</span></div>
                <div class="infoModal"><strong>Estadio </strong><span>${club.venue.name}</span></div>
                <div class="infoModal"><strong>Fundación </strong><span>${club.team.founded}</span></div>
            </section>
            <section id="galeriaBufandas">
            ${plantillaBufandas(bufandasEquipo)}
            </section>`,
        imageUrl: `${club.team.logo}`,
        customClass: {
            popup: 'contenedorModal',
        },
        imageHeight: `8em`,
        focusConfirm: false,
        confirmButtonText: `Cerrar`,
        confirmButtonColor: `#adb5bd`,
    })
}

/* Genera de forma dinamica la galeria de imagenes con las bufandas de cada club*/

function plantillaBufandas(arrBufandas) {
    let plantilla = ""
    arrBufandas.forEach(e => {
        plantilla += `
        <div class="containerBufanda">
        <img src=${e.thumbnail} class="thumbnailImg">
        <div class="decada">${e.decada}</div>
        </div>`
    })
    return plantilla
}
