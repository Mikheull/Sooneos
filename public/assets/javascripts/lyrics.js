$( document ).ready(function() {
    let musicID = '';

    socket.emit( 'request_lyrics' ); 

    socket.on('response_lyrics', async function(lyrics, current_music) {
        console.log(lyrics, current_music);

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
            $('#lyrics_app').addClass('hidden');
            $('#response-mess').removeClass('hidden');
            $('#response-mess').html(err_mess)
        }else{
            $('#lyrics_app').removeClass('hidden');
            $('#response-mess').addClass('hidden');

            musicID = current_music.response.item.id
            $('.music_banner img').attr('src', current_music.response.item.album.images[0].url)
            $('.music_title').html(current_music.response.item.name)
            $('.music_subtitle').html(current_music.response.item.album.artists[0].name)


            $('.music_link a').attr('href', current_music.response.item.external_urls.spotify)
            $('.music_link_twitter a').attr('href', `https://twitter.com/intent/tweet?url=&text=Ready%20to%20sing%20%C2%AB%20${current_music.response.item.name}%20-%20${current_music.response.item.album.artists[0].name}%20%C2%BB%20%3F%0ANow%20on%20sooneos.me%20%F0%9F%8E%89%F0%9F%8E%A4`)


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
        }

        if(err_mess !== ''){
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
        if(musicID !== ''){
            socket.emit( 'check_music_changes', musicID ); 
        }
    }, 5000);

    socket.on('music_changed', function() {
        socket.emit( 'request_lyrics' ); 
    })

});
