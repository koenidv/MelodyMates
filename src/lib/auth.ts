import { Buffer as buf } from "buffer";
import faunadb from "faunadb";
import { dev } from "$app/environment";
import { identity, type OAuthed } from "$lib/store";
import { get } from "svelte/store";
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
const SPOTIFY_OAUTH_REDIRECT = dev
  ? "http://localhost:5173/login/continue"
  : "https://melodymates.app/login/continue";

export const OAUTH_URL =
  `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${
    encodeURIComponent(
      SPOTIFY_OAUTH_REDIRECT,
    )
  }&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(" "))}`;

export async function spotifyOAuth(code: string) {
  console.time("Spotify OAuth access token");
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
  console.timeEnd("Spotify OAuth access token");
  return json;
}

export async function refreshSpotifyToken() {
  const expires = get(identity)?.spotify?.expires || 0;
  if (expires < Date.now()) {
    const copy = get(identity);
    if (!copy.spotify) return;

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
        code: copy.spotify.refresh_token,
        refresh_token: copy.spotify.refresh_token,
        redirect_uri: SPOTIFY_OAUTH_REDIRECT,
        grant_type: "refresh_token",
      }),
    });
    const json = await res.json();
    copy.spotify.access_token = json.access_token;
    copy.spotify.expires = Date.now() + json.expires_in * 1000;
    identity.set(copy);
  }
}

/**
 * MELODYMATES IDENTITY
 */

const jwtEndpoint =
  "https://europe-west1-melodymates.cloudfunctions.net/generate-jwt";

export async function generateJWT(access_token: string) {
  console.time("Generate JWT Request");
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
  console.timeEnd("Generate JWT Request");
  return json;
}

export function saveIdentity(jwt: string, spotify: OAuthed, user: any) {
  identity.set({
    jwt: jwt,
    spotify: spotify,
    user: user,
  });
}

export async function userExists(id: string, fauna: faunadb.Client) {
  console.time("User Exists Query");

  const queried = await fauna.query(
    q.Exists(q.Match(q.Index("user_id"), id)),
  );
  console.timeEnd("User Exists Query");

  return queried;
}

export async function createUser(userinfo: any, fauna: faunadb.Client) {
  console.time("Create User Query");
  await fauna.query(
    q.Call(q.Function("createUser"), [
      userinfo.id,
      userinfo.display_name,
      userinfo.profile_image,
      userinfo.url,
    ]),
  );
  console.timeEnd("Create User Query");
}
