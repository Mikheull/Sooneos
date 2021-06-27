import querystring from 'querystring';

import { SpotifyTokenResponse } from '@/models/Spotify';
import { appConfig } from '@/lib/appConfig';

const BASE_URL = `https://api.spotify.com/v1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const ME_ENDPOINT = `${BASE_URL}/me`;
const TRACKS_ENDPOINT = `${BASE_URL}/tracks`;
const NOW_PLAYING_ENDPOINT = `${ME_ENDPOINT}/player/currently-playing`;

const authToken = Buffer.from(
  `${appConfig.spotify.clientId}:${appConfig.spotify.clientSecret}`,
).toString('base64');

const getHeaders = (accessToken: string) =>
  new Headers({
    Authorization: `Bearer ${accessToken}`,
  });

export const getAccessToken = async (
  refreshToken: string,
): Promise<SpotifyTokenResponse> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  return response.json();
};

export const getProfile = async (accessToken: string) => {
  return fetch(ME_ENDPOINT, {
    headers: getHeaders(accessToken),
  });
};


export const getTrackById = async (accessToken: string, trackId: string) => {
  return fetch(`${TRACKS_ENDPOINT}/${trackId}`, {
    headers: getHeaders(accessToken),
  });
};

export const getNowPlayingTrack = async (accessToken: string) => {
  return fetch(`${NOW_PLAYING_ENDPOINT}`, {
    headers: getHeaders(accessToken),
  });
};
