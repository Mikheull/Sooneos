import { APIRoute } from '@/models/APIRoute.enum';
import { LyricsResponse } from 'pages/api/get-lyrics';
import useSWR from 'swr';
import { useState } from 'react';

const GeniusIframe: React.FC = () => {
  const { data } = useSWR<LyricsResponse>(APIRoute.GET_LYRICS);
  const [isVisible, setVisible] = useState(false);
  
  const isData = data;

  if (!isData) {
    return (
      <div id="">
          aaaa
      </div>
    );
  }

  const url = `https://genius.com/songs/${data.lyricsID}/embed.js`;

  return (
    <>
        <div id={`rg_embed_link_5220753`} className='rg_embed_link' data-song-id="5220753"></div>
        <span className="text-gray-800">{data.lyricsID}</span>
        <script crossOrigin="true" async src={`https://genius.com/songs/${data.lyricsID}/embed.js`}></script>
    </>
  );
};

export default GeniusIframe;
