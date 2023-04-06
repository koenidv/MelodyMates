import { get } from "svelte/store";
import { refreshSpotifyToken } from "$lib/auth";
import { currentlyPlaying, identity } from "$lib/store";

let timeoutId: NodeJS.Timer | null | undefined = undefined;
let lastPlayedQueryTimestamp = 0;

export async function startNowPlayingObserver() {
  timeoutId = undefined;
  recursiveObserver();
}

async function recursiveObserver() {
  // While playing, query current song every 8 seconds
  // When not playing, query current song every 16 seconds
  // and last played song every ~64 seconds
  const success = await queryCurrentSong();
  if (success) {
    timeoutId = setTimeout(async () => {
      recursiveObserver();
    }, 8_000);
  } else {
    if (Date.now() - lastPlayedQueryTimestamp > 60_000) {
      queryLastPlayed();
      lastPlayedQueryTimestamp = Date.now();
    }
    timeoutId = setTimeout(async () => {
      recursiveObserver();
    }, 16_000);
  }
}

export async function queryCurrentSong() {
  if (!get(identity)?.spotify?.access_token) return;
  await refreshSpotifyToken();

  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: "Bearer " + get(identity)?.spotify?.access_token,
      },
    },
  );
  let json;
  let item;
  try {
    json = await res.json();
    item = json.item;
  } catch (err) {
    return false;
  }

  currentlyPlaying.set(apiResponseToNowPlaying(item, json));
  return true;
}

export async function queryLastPlayed() {
  if (!get(identity)?.spotify?.access_token) return;
  await refreshSpotifyToken();

  const res = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    {
      headers: {
        Authorization: "Bearer " + get(identity)?.spotify?.access_token,
      },
    },
  );
  const json = await res.json();

  if (!json.items || json.items.legth === 0) return false;

  currentlyPlaying.set(
    apiResponseToNowPlaying(json.items[0].track, {
      timestamp: json.items[0].played_at,
    }),
  );
  return true;
}

function apiResponseToNowPlaying(item: any, meta: any | undefined) {
  return {
    song: {
      id: item.id,
      name: item.name,
      length_ms: item.duration_ms,
      isrc: item.external_ids.isrc,
      preview_url: item.preview_url,
      artists: item.artists.map((artist: any) => {
        return {
          id: artist.id,
          name: artist.name,
        };
      }),
      album: {
        id: item.album.id,
        name: item.album.name,
        cover_image: item.album.images[0].url,
        theme_color: null,
        artists: item.album.artists.map((artist: any) => {
          return {
            id: artist.id,
            name: artist.name,
          };
        }),
      },
    },
    meta: {
      progress_ms: meta?.progress_ms || 0,
      is_playing: meta?.is_playing || false,
      is_current: true,
      timestamp: meta?.timestamp || 0,
      type: item.type,
      popularity: item.popularity,
    },
  };
}

export function stopNowPlayingObserver() {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = null;
}

export async function playSong(song_id: string) {
  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + get(identity)?.spotify?.access_token,
    },
    body: JSON.stringify({
      uris: [`spotify:track:${song_id}`],
    }),
  });
  await queryCurrentSong();
}

export async function pausePlayback() {
  await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + get(identity)?.spotify?.access_token,
    },
  });
}

export async function querySongsLiked(song_ids: string[]) {
  // todo spotify limits this call to 50 songs
  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${song_ids.join(",")}`,
    {
      headers: {
        Authorization: "Bearer " + get(identity)?.spotify?.access_token,
      },
    },
  );
  const json = await res.json();

  const likedmap = new Map<string, boolean>();
  song_ids.map((id, i) => {
    likedmap.set(id, json[i]);
  });

  return likedmap;
}

export async function likedUnlikeSong(song_id: string, like: boolean) {
  await fetch(
    `https://api.spotify.com/v1/me/tracks?ids=${song_id}`,
    {
      method: like ? "PUT" : "DELETE",
      headers: {
        Authorization: "Bearer " + get(identity)?.spotify?.access_token,
      },
    },
  );
}