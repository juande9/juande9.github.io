class Equipo {
    constructor(id, nombre, country, league, founded, logo, venue, lat, lng) {
        team: {
            this.id = id;
            this.nombre = nombre;
            this.country = country;
            this.league = league;
            this.founded = founded;
            this.logo = `./img/escudos/${logo}`.replace(`C:\\fakepath\\`, ``);
        }
        venue:{
            this.venue = venue;
            this.lat = lat;
            this.lng = lng;
        }
    }
}

class Bufanda {
    constructor(id, equipo, decada, thumbnail) {
        this.id = id;
        this.equipo = equipo;
        this.decada = decada;
        this.thumbnail = `./img/bufandas/${thumbnail}`
    }
}

class Pais {
    constructor(nombre, bandera, lat, long, limite) {
        this.nombre = nombre
        this.bandera = `./img/banderas/${bandera}.ico`
        this.lat = lat
        this.long = long
        this.limite = limite
    }
}