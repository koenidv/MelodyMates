const selfUrl =
  "https://europe-west1-melodymates.cloudfunctions.net/generate-jwt";

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
export async function generateJwt(req, res) {
  const { access_token } = req.body;

  const userinfo = await spotifyUserInfo(access_token);

  if (!userinfo.id) {
    res.status(500).send("Failed to get Spotify user info");
    return;
  }

  res.send(JSON.stringify(userinfo));
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
