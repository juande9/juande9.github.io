class Equipo {
    constructor(id, nombre, country, league, founded, logo, venue, lat, lng, capacity) {
        this.team = new team(id, nombre, country, league, founded, logo)
        this.venue = new Venue(venue, lat, lng, capacity)
    }
}

class team {
    constructor(id, name, country, league, founded, logo) {
        this.id = id
        this.name = name,
            this.country = country,
            this.league = league,
            this.founded = founded,
            this.logo = `./img/escudos/${logo}`.replace(`C:\\fakepath\\`, ``);
    }
}

class Venue {
    constructor(name, lat, lng, capacity) {
        this.name = name
        this.lat = lat
        this.lng = lng
        this.capacity = capacity
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