$( document ).ready(function() {
    socket.emit( 'request_lyrics' ); 

    socket.on('response_lyrics', async function(lyrics, current_music) {
        console.log(lyrics, current_music);

        let err_mess, app_html = ''

        if(current_music && current_music.status == true){
            if(lyrics){
                app_html = `
                <div id="content" class="mb-4">
                    <div class="grid ">
                        <div class="grid__item w-full lg:w-1/4 md:w-2/4 sm:w-1/2 px-4 mx-auto">
                            <div class="album relative cursor-pointer">
                                <div class="album__bg absolute w-full bg-white"></div>
                                <img class="album__img w-full mb-2" style="box-shadow: -20px 20px #edf2f7;" src="${current_music.response.item.album.images[0].url}" alt="Music banner"/>
                                <h2 class="album__title text-gray-800 text-3xl font-bold">${current_music.response.item.name}</h2>
                                <h3 class="album__subtitle text-gray-600 text-md">${current_music.response.item.album.artists[0].name}</h3>
                                <div class="album__description hidden">
                                    <a href="${current_music.response.item.external_urls.spotify}" target="blank" class="text-green-400 underline block">Link to Spotify</a>
                                    <a href="https://twitter.com/intent/tweet?url=&text=Ready%20to%20sing%20%C2%AB%20${current_music.response.item.name}%20-%20${current_music.response.item.album.artists[0].name}%20%C2%BB%20%3F%0ANow%20on%20sooneos.me%20%F0%9F%8E%89%F0%9F%8E%A4" target="blank" class="text-green-400 underline block">Share on twitter <i class="fa fa-twitter"></i> </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="iframe_genius"></div>
                </div>
                `
            }else{
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

        
        if(err_mess == ''){
            $('#lyrics_app').hide();
            $('#response-mess').show();
            $('#response-mess').html(err_mess)
        }else{
            $('#lyrics_app').show();
            $('#response-mess').hide();
            $('#lyrics_app').html(app_html)

            const content = await fetch(`https://genius.com/songs/${lyrics}/embed.js`).then(data => data.text());
            const rgx = content.matchAll(/document\.write\((.*)\)/g)
            const writes = [];
            
            for (const match of rgx)
                writes.push(match[1]);
            
            $('#iframe_genius').html(createElementFromHTML(eval(writes[1])))
        }
        
    });


    socket.on('response_lyrics_error', function(response) {
        console.log(response);
    });


    function createElementFromHTML(str) {
        const div = document.createElement('div');
        div.innerHTML = str.trim();
      
        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild; 
    }
    


    $('#refresh').click(function (e) { 
        e.preventDefault();
        socket.emit( 'request_lyrics' ); 
    });
});
