// Edit username
const user_input = $( "#username_input" );

user_input.keypress(function(e) {
	const count = user_input.html().length;
	if(count >= 24){
		e.preventDefault();
	}
});

user_input.focusout(function(e) {
    socket.emit( 'bl_edit_username', user_input.html() ); 
});
