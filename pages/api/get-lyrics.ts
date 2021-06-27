import { getNowPlayingTrack } from '@/lib/spotify';
import { getLyricsID } from '@/lib/genius';
import { appConfig } from '@/lib/appConfig';
import { isBadStatusCode } from '@/lib/utils';
import { SpotifyNowPlayingResponse } from '@/models/Spotify';
import { GeniusLyricsIDResponse } from '@/models/Genius';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import Genius from "genius-lyrics";
const Client = new Genius.Client(appConfig.genius.accessToken.toString());

export interface LyricsResponse {
  lyrics: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const nowPlayingResponse = await getNowPlayingTrack(session.accessToken);

  if (isBadStatusCode(nowPlayingResponse)) {
    return res.status(200).json({
      lyrics: ''
    });
  }

  const songDetails: SpotifyNowPlayingResponse = await nowPlayingResponse.json();

  const query = encodeURI( songDetails.item.name + ' ' + songDetails.item.album.artists[0].name )

  const getGeniusSongID = await getLyricsID(appConfig.genius.accessToken, query);
  const geniusSongID: GeniusLyricsIDResponse = await getGeniusSongID.json();
  const lyricsID = (geniusSongID.response.hits.length !== 0) ? geniusSongID.response.hits[0].result.id : null;


  // const searches = await Client.songs.search(songDetails.item.name + ' ' + songDetails.item.album.artists[0].name);
  // const firstSong = searches[0];
  // console.log("About the Song:\n", firstSong, "\n");
  // const lyrics = await firstSong.lyrics();
  // console.log("Lyrics of the Song:\n", lyrics, "\n");

  const song = await Client.songs.get(parseInt(lyricsID));
  const lyrics = await song.lyrics();
  // console.log("Lyrics of the Song:\n", lyrics, "\n");


  return res.status(200).json({
    lyrics,
  });
};
