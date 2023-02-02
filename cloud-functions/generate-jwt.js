/**
 * Request user info based on an access token and generate a JWT
 */

import jwt from "jsonwebtoken";

export async function generateJwt(req, res) {
  const { access_token } = req.body;

  if (!access_token) {
    res.status(400).send("Missing access token");
    return;
  }

  const userinfo = await spotifyUserInfo(access_token);

  if (!userinfo.id) {
    res.status(500).send("Failed to get Spotify user info");
    return;
  }

  const token = jwt.sign(
    {
      sub: userinfo.id,
      iat: Date.now() / 1000,
      iss: "MusicMates",
    },
    process.env.JWT_KEY
  );

  res.send(token);
}

async function spotifyUserInfo(access_token) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  const json = await res.json();

  let image = null;
  if (json.images.length > 0) {
    image = json.images[0].url;
  }

  return {
    id: json.id,
    display_name: json.display_name,
    image: image,
    url: json.external_urls.spotify,
  };
}
