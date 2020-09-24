const { io } = require('../server');

const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();


io.on('connection', (client) => {
    // Genera el siguiente ticket. 
    // Callback se refiere al callback en socket.nuevo-ticket que cambia el label de nuevo-ticket.html
    client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();
        console.log(siguiente);
        callback(siguiente);
    });

    // emitimos estadoActual que devolvera el getUltimoTickeet
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    // escuchamos. Necesitamos el callback para notificarlo
    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                nensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);
        // actualizar/ notificar cambios en los ultimos 4

        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });




    });
});