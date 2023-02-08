import { get } from "svelte/store";
import { refreshSpotifyToken } from "$lib/auth";
import { currentlyPlaying, identity } from "$lib/store";

let timeoutId: NodeJS.Timer | null | undefined = undefined;

export async function startNowPlayingObserver() {
  timeoutId = undefined;
  recursiveObserver();
}

async function recursiveObserver() {
  try {
    // todo Error in async currentsong function. Query last if failed .json() or .id not found
    queryCurrentSong();
    timeoutId = setTimeout(async () => {
      recursiveObserver();
    }, 8_000);
  } catch (err) {
    queryLastPlayed();
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
  // todo try/catch here
  const json = await res.json();

  currentlyPlaying.set({
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
        artists: item.artists.map((artist: any) => {
          return {
            id: artist.id,
            name: artist.name,
          };
        }),
      },
    },
    meta: {
      progress_ms: json.progress_ms,
      is_playing: json.is_playing,
      is_current: true,
      timestamp: json.timestamp,
      type: item.type,
      popularity: item.popularity,
    },
  });

  return true;
}

export async function queryLastPlayed() {
  if (!get(identity)?.spotify?.access_token) return;
  await refreshSpotifyToken();
  fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
    headers: {
      Authorization: "Bearer " + get(identity)?.spotify?.access_token,
    },
  }).then(
    (res) => {
      res.json().then((data) => {
        console.log(data);
      });
    },
  );
}

export function stopNowPlayingObserver() {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = null;
}
