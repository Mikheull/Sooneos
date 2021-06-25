import { getNowPlayingTrack } from '@/lib/spotify';
import { getLyricsID } from '@/lib/genius';
import { appConfig } from '@/lib/appConfig';
import { isBadStatusCode } from '@/lib/utils';
import { SpotifyNowPlayingResponse } from '@/models/Spotify';
import { GeniusLyricsIDResponse } from '@/models/Genius';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export interface LyricsResponse {
  lyricsID: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const nowPlayingResponse = await getNowPlayingTrack(session.accessToken);

  if (isBadStatusCode(nowPlayingResponse)) {
    return res.status(200).json({
      lyricsID: ''
    });
  }

  const songDetails: SpotifyNowPlayingResponse = await nowPlayingResponse.json();

  const query = encodeURI( songDetails.item.name + ' ' + songDetails.item.album.artists[0].name )

  const getGeniusSongID = await getLyricsID(appConfig.genius.accessToken, query);
  const geniusSongID: GeniusLyricsIDResponse = await getGeniusSongID.json();
  const lyricsID = (geniusSongID.response.hits.length !== 0) ? geniusSongID.response.hits[0].result.id : null;

  return res.status(200).json({
    lyricsID,
  });
};
