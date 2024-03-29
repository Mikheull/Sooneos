import { getNowPlayingTrack } from '@/lib/spotify';
import { isBadStatusCode } from '@/lib/utils';
import { SpotifyImage, SpotifyNowPlayingResponse } from '@/models/Spotify';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export interface NowPlayingResponse {
  isPlaying: boolean;
  songName: string;
  artists: string;
  album: string;
  albumImage: SpotifyImage;
  songType: string;
  songUrl: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const nowPlayingResponse = await getNowPlayingTrack(session.accessToken);

  if (isBadStatusCode(nowPlayingResponse)) {
    return res.status(200).json({
      isPlaying: false,
      songName: '',
      artists: '',
      album: '',
      albumImage: '',
      songType: '',
      songUrl: '',
    });
  }

  const songDetails: SpotifyNowPlayingResponse = await nowPlayingResponse.json();

  const isPlaying = songDetails.is_playing;
  const songName = songDetails.item.name;
  const artists = songDetails.item.artists
    .map((artist) => artist.name)
    .join(', ');
  const album = songDetails.item.album.name;
  const albumImage = songDetails.item.album.images[0];
  const songType = songDetails.currently_playing_type;
  const songUrl = songDetails.item.external_urls.spotify;

  return res.status(200).json({
    isPlaying,
    songName,
    artists,
    album,
    albumImage,
    songType,
    songUrl,
  });
};
