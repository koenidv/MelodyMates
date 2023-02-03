import { Buffer as buf } from "buffer";
import faunadb from "faunadb";
const q = faunadb.query;

/**
 * SPOTIFY OAUTH
 */

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

/**
 * MELODYMATES IDENTITY
 */

const jwtEndpoint =
  "https://europe-west1-melodymates.cloudfunctions.net/generate-jwt";

export async function generateJWT(access_token: string) {
  const res = await fetch(jwtEndpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "spotify_token": access_token,
    }),
  });
  const json = await res.json();
  return json;
}

export async function userExists(id: string, fauna: faunadb.Client) {
  const queried = await fauna.query(
    q.Exists(q.Match(q.Index("unique_User_id"), id)),
  );
  return queried;
}

export async function createUser(userinfo: any, fauna: faunadb.Client) {
  await fauna.query(
    q.Create(q.Collection("User"), {
      data: {
        id: userinfo.id,
        profile_name: userinfo.display_name,
        profile_image: userinfo.profile_image,
        spotify_url: userinfo.url,
      },
    }),
  );
}
