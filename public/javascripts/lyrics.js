$( document ).ready(function() {
    socket.emit( 'request_lyrics' ); 

    socket.on('response_lyrics', function(response) {
        console.log(response);
    });
});
