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
      id: json.item.id,
      name: json.item.name,
      artists: json.item.artists.map((artist: any) => {
        return {
          id: artist.id,
          name: artist.name,
        };
      }),
      album: {
        id: json.item.album.id,
        name: json.item.album.name,
        cover_image: json.item.album.images[0].url,
      },
      duration: json.item.duration_ms,
      popularity: json.item.popularity,
      type: json.item.type,
      preview_url: json.item.preview_url,
      isrc: json.item.external_ids.isrc,
    },
    progress_ms: json.progress_ms,
    is_playing: json.is_playing,
    timestamp: json.timestamp,
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
