const fs = require('fs');

// esta clase no la exportamos ya que solo la usaremos en TicketControl
class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }

}

class TicketControl {


    constructor() {
        this.ultimo = 0;
        // solo recogemos el numero del dia, con eso es suficiente
        this.hoy = new Date().getDate();

        // relacion de tickets abiertos
        this.tickets = [];
        // ultimos 4 ticjets atendidos
        this.ultimos4 = [];

        // recuperamos datos del json con ultimo ticket
        let data = require('../data/data.json');

        // Comprobamos si es el mismo dia y en caso contrario reiniciamos el contador
        if (data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;

        } else {
            this.reiniciarConteo();
        }


    }

    // ----------------------------------------------------------
    //
    // ----------------------------------------------------------

    siguiente() {
        this.ultimo += 1;
        // creamos un ticket con el numero de ticket y lo metemos en el array
        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${ this.ultimo}`;
    }

    // ----------------------------------------------------------
    // Recoge el ultimo numero y lo devuelve
    // ----------------------------------------------------------
    getUltimoTicket() {
        return `Ticket ${ this.ultimo}`;
    }

    // ----------------------------------------------------------
    // Recoge los 4 ultimos tickets
    // ----------------------------------------------------------
    getUltimos4() {
        return this.ultimos4;
    }

    // ----------------------------------------------------------
    // 
    // ----------------------------------------------------------
    atenderTicket(escritorio) {

        if (this.tickets.length === 0) {
            return 'No hay tickets';
        }

        // recojo el primer numero de ticket del array y lo borramos
        let numeroTicket = this.tickets[0].numero;
        // eliminamos el primer elemento
        this.tickets.shift();

        //creamos un ticket que es el que vamos a leer
        let atenderTicket = new Ticket(numeroTicket, escritorio);

        // lo agregamos al comienzo
        this.ultimos4.unshift(atenderTicket);
        // si hay mas de 4 elementos, borro el ultimo
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);

        }
        console.log('ultimos 4: ', this.ultimos4);

        this.grabarArchivo();
        // devolvemos el ticket a atender

        return atenderTicket;
    }

    // ----------------------------------------------------------
    //
    // ----------------------------------------------------------

    reiniciarConteo() {

        this.ultimo = 0;
        this.tickets = [];
        this.tickets4 = [];

        this.grabarArchivo();
    }

    // ----------------------------------------------------------
    //
    // ----------------------------------------------------------
    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        // convierto json a string
        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }

}

module.exports = {
    TicketControl
};