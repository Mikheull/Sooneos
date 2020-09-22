$( document ).ready(function() {
    let musicID = '';
    let isPlaying = true;

    socket.emit( 'request_lyrics' ); 

    socket.on('response_lyrics', async function(lyrics, current_music) {
        let err_mess = ''

        if(current_music && current_music.status == true){
            if(!lyrics){
                // Erreur pas de paroles
                err_mess = `<h3 class="text-gray-500 text-md mb-2">No lyrics has been found!</h3>`
            }
        }else{
            // Erreur pas de musique en cours
            err_mess = `
            <div class="text-center">
                <h3 class="text-gray-500 text-md mb-2">You have no music in progress.</h3>
                <a href="spotify:track:4uLU6hMCjMI75M1A2tKUQC" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <i class="fa fa-play-circle mr-2"></i>
                    <span>Open Spotify</span>
                </a>
            </div>
            `
        }

        
        if(err_mess !== ''){
            $('#loader').addClass('hidden');
            $('#lyrics_app').addClass('hidden');
            $('#response-mess').removeClass('hidden');
            $('#response-mess').html(err_mess)
            isPlaying = false
        }else{
            $('#lyrics_app').removeClass('hidden');
            $('#response-mess').addClass('hidden');
            $('#loader').addClass('hidden');

            musicID = current_music.response.item.id
            isPlaying = current_music.response.is_playing
            $('.music_banner').attr('src', current_music.response.item.album.images[0].url)
            $('.music_title').html(`"${current_music.response.item.name}"`)
            $('.music_title').attr('href', current_music.response.item.external_urls.spotify)

            $('.music_subtitle').html('');
            current_music.response.item.artists.forEach(artist => {
                $('.music_subtitle').append(`<a href="${artist.external_urls.spotify}" target="blank" class="ml-2 text-gray-600 text-md">${artist.name}</a>`)
            });

            const content = await fetch(`https://genius.com/songs/${lyrics}/embed.js`).then(data => data.text());
            const rgx = content.matchAll(/document\.write\((.*)\)/g)
            const writes = [];
            
            for (const match of rgx)
                writes.push(match[1]);
            
            $('#iframe_genius').html(createElementFromHTML(eval(writes[1])))
        }
        
    });


    socket.on('response_lyrics_error', function(response) {
        let err_mess = ''

        if(response){
            if(response == 'spotify-disconnected'){
                err_mess = `<h3 class="text-gray-500 text-md mb-2">You are not connected to Spotify!</h3>`
            }else if(response == 'lyrics-not-found'){
                err_mess = `<h3 class="text-gray-500 text-md mb-2">No lyrics has been found!</h3>`
            }else if(response == 'music-not-found'){
                err_mess = `<h3 class="text-gray-500 text-md mb-2">No music has been found!</h3>`
            }
            isPlaying = false
        }

        if(err_mess !== ''){
            $('#loader').addClass('hidden');
            $('#lyrics_app').addClass('hidden');
            $('#response-mess').removeClass('hidden');
            $('#response-mess').html(err_mess)
        }
    });


    function createElementFromHTML(str) {
        const div = document.createElement('div');
        div.innerHTML = str.trim();
      
        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild; 
    }
    
    let myInterval = setInterval(function () {
        if(musicID !== '' && isPlaying){
            socket.emit( 'check_music_changes', musicID ); 
        }
    }, 5000);

    socket.on('music_changed', function() {
        socket.emit( 'request_lyrics' ); 
    })

});
