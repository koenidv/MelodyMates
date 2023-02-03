import { Buffer as buf } from "buffer";

const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-top-read",
];
const SPOTIFY_CLIENT_ID = "f1c9da828b51491dabf6c4df85fbd9ea";
const SPOTIFY_OAUTH_REDIRECT = "http://localhost:5173/login/continue";

export const OAUTH_URL =
  `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${
    encodeURIComponent(
      SPOTIFY_OAUTH_REDIRECT,
    )
  }&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(" "))}`;

export async function spotifyOAuth(code: string) {
  const spotify_secret = import.meta.env.VITE_SPOTIFY_SECRET;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " +
        buf.from(SPOTIFY_CLIENT_ID + ":" + spotify_secret).toString(
          "base64",
        ),
    },
    body: new URLSearchParams({
      code: code,
      refresh_token: code,
      redirect_uri: SPOTIFY_OAUTH_REDIRECT,
      grant_type: "authorization_code",
    }),
  });
  const json = await res.json();
  return json;
}
