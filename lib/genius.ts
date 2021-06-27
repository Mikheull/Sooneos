import querystring from 'querystring';

const BASE_URL = `https://api.genius.com`;
const SEARCH_ID_ENDPOINT = `${BASE_URL}/search?q=`;

const getHeaders = (accessToken: string) =>
  new Headers({
    Authorization: `Bearer ${accessToken}`,
});

export const getLyricsID = async (accessToken: string, query: string) => {
  return fetch(`${SEARCH_ID_ENDPOINT}${query}`, {
    headers: getHeaders(accessToken),
  });
};
