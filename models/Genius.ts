export interface GeniusLyricsIDResponse {
  response: Hits;
}

export interface Hits {
  hits: Result[];
}

export interface Result {
  result: Music;
}

export interface Music {
  id: string;
}
