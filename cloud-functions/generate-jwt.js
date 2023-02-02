const selfUrl = "https://europe-west1-melodymates.cloudfunctions.net/generate-jwt"


/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
export async function spotifyCallback(req, res) {
  const authcode = req.query.code;
  const redirectUrl = req.query.cb;

  if (!authcode) {
    res.status(500).send("Spotify authentication code not specified");
    return;
  }

  const response = await spotifyOAuth(authcode);
  const credentials = {
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expires: Date.now() + response.expires_in * 1000,
  };

  if (!credentials.access_token) {
    res.status(500).send("Failed to resolve Spotify access token");
    return;
  }

  const userinfo = await spotifyUserInfo(credentials.access_token)

  if (!userinfo.id) {
    res.status(500).send("Failed to get Spotify user info");
    return;
  }

  res.send(userinfo.display_name)
}

async function spotifyOAuth(code) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(process.env.SPOTIFY_ID + ":" + process.env.SPOTIFY_SECRET).toString("base64"),
    },
    body: new URLSearchParams({
      code: code,
      refresh_token: code,
      redirect_uri: selfUrl,
      grant_type: "authorization_code",
    }),
  });
  const json = await res.json();
  return json;
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
    url: json.external_urls.spotify
  }
}
