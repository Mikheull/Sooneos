import { APIRoute } from '@/models/APIRoute.enum';
import { NowPlayingResponse } from 'pages/api/now-playing';
import useSWR from 'swr';
import { useState } from 'react';
import GeniusIframe from '@/components/GeniusIframe';
import Link from 'next/link';

const LyricsCard: React.FC = () => {
  const { data } = useSWR<NowPlayingResponse>(APIRoute.NOW_PLAYING);
  const [isVisible, setVisible] = useState(false);

  const isPlaying = data && data.isPlaying;

  if (!isPlaying) {
    return (
      <div className="px-6 mx-auto lg:px-16 h-auto">
        <div className="mt-32 mb-16 text-center mx-auto px-4">
          <div className="text-center">
              <h3 className="text-gray-500 text-md mb-2">You have no music in progress.</h3>
              <a href="spotify:track:4uLU6hMCjMI75M1A2tKUQC" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                  <i className="fa fa-play-circle mr-2"></i>
                  <span>Open Spotify</span>
              </a>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div id="lyrics_app">
        <div id="content" className="mb-4">
            <div className="mb-4">
                <div className="grid ">
                    <div className="grid__item w-full lg:w-1/4 md:w-2/4 sm:w-1/2 px-4 mx-auto">
                        <div className="album relative">
                          <Link href="#lyrics" scroll={true}>
                              {data.albumImage.url.length ? (
                                <img className="music_banner w-full mb-2 cursor-pointer" src={data.albumImage.url} alt="Music banner" />
                              ) : (
                                <img className="music_banner w-full mb-2 cursor-pointer" src="https://i.pinimg.com/originals/7a/ec/a5/7aeca525afa2209807c15da821b2f2c6.png" alt="Music banner" />
                              )}
                            </Link>
                            <div className="flex flex-col">
                                <a href={data.songUrl} target="blank" className="music_title text-lyrics-600 text-3xl font-bold mt-10">"{data.songName}"</a>
                                <div className="music_subtitle flex text-gray-400 truncate">{data.artists}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <GeniusIframe />
            </div>
        </div>
    </div>

  );
};

export default LyricsCard;
