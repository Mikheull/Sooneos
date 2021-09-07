import { APIRoute } from '@/models/APIRoute.enum';
import { LyricsResponse } from 'pages/api/get-lyrics';
import useSWR from 'swr';
import { useState } from 'react';

const GeniusIframe: React.FC = () => {
  const { data } = useSWR<LyricsResponse>(APIRoute.GET_LYRICS);
  const [isVisible, setVisible] = useState(false);
  
  const isData = data && data.lyrics;

  if (!isData) {
    return (
      <div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="px-6 mx-auto lg:px-16 h-auto" id="lyrics">
      <div className="mt-16 mb-16 mx-auto px-4">
          <p className="text-md text-gray-600 whitespace-pre-line">{data.lyrics}</p>
      </div>
    </div>
  );
};

export default GeniusIframe;
