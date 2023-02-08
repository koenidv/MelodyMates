import faunadb from "faunadb";
import { get } from "svelte/store";
import { identity } from "$lib/store";
const q = faunadb.query;

type NowPlaying = {
  song: Song;
  meta: SongMeta;
};

type SongMeta = {
  progress_ms: number;
  is_playing: boolean;
  timestamp: number;
  type: string;
  popularity: number;
};

type Song = {
  id: string;
  name: string;
  length_ms: number;
  isrc: string;
  preview_url: string;
  artists: Artist[];
  album: Album;
};

type Artist = {
  id: string;
  name: string;
};

type Album = {
  id: string;
  name: string;
  cover_image: string;
  theme_color: string;
  artists: Artist[];
};

let _fauna: faunadb.Client;

function fauna(): faunadb.Client {
  if (!(get(identity)?.jwt)) {
    throw new Error("Tried to access fauna without a JWT");
  }
  if (!_fauna) {
    _fauna = new faunadb.Client({ secret: get(identity).jwt! });
  }
  return _fauna;
}

function nestedObjectToArray(obj: any): any[] {
  return Object.keys(obj).map((key) => {
    if (typeof obj[key] == "object") {
      return nestedObjectToArray(obj[key]);
    } else return obj[key];
  });
}

export async function createPost(song: Song, comment: string | null) {
    console.log([nestedObjectToArray(song), comment])
  return await fauna().query(
    q.Call(
      q.Function("createPost"),
      [nestedObjectToArray(song), comment],
    ),
  );
}
