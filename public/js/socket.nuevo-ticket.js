// comando para establecer la conexion
var socket = io();

// referencia a lblNuevoTicket en el html
var label = $('#lblNuevoTicket');

socket.on('connect', function() {
    console.log('Conectado al servidor');

});

// recoge el ticket actual y lo carga en pantalla
socket.on('estadoActual', function(resp) {
    label.text(resp.actual);

});

socket.on('disconnect', function() {
    console.log('Desconectado del servidor');

});


$('button').on('click', function() {
    socket.emit('siguienteTicket', null, function(siguienteTicket) {

        label.text(siguienteTicket);

    });

});