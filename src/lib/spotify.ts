import { currentlyPlaying } from "./store";

let intervalId: NodeJS.Timer | undefined = undefined;

export function startNowPlayingObserver() {
  intervalId = setInterval(async () => {
    queryCurrentSong();
  }, 10_000);
}

export async function queryCurrentSong() {
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
  );
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
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
    },
    progress_ms: json.progress_ms,
    is_playing: json.is_playing,
    timestamp: json.timestamp,
  });
}

export function queryLastSong() {
  fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1").then(
    (res) => {
      res.json().then((data) => {
        console.log(data);
      });
    },
  );
}

export function stopNowPlayingObserver() {
  if (intervalId) clearInterval(intervalId);
  intervalId = undefined;
}
