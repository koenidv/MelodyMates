/**
 * Request user info based on an access token and generate a JWT
 */

import jwt from 'jsonwebtoken';

export async function generateJwt(req, res) {
	const { spotify_token } = req.body;
	res.set('Access-Control-Allow-Origin', '*');

	if (req.method === 'OPTIONS') {
		res.set('Access-Control-Allow-Methods', 'GET, POST');
		res.set('Access-Control-Allow-Headers', 'Content-Type');
		res.set('Access-Control-Max-Age', '3600');
		res.status(204).send('');
		return;
	}

	if (!spotify_token) {
		res.status(500).send('Missing Spotify token');
		return;
	}

	const userinfo = await spotifyUserInfo(spotify_token);

	if (!userinfo) {
		res.status(500).send('Failed to get Spotify user info');
		return;
	}

	const secret = new Buffer.from(process.env.JWT_PRIVATE_KEY, 'base64').toString('utf-8');
	const token = jwt.sign(
		{
			sub: userinfo.id,
			iat: Math.floor(Date.now() / 1000),
			iss: 'MelodyMates',
			aud: ['https://db.fauna.com/db/yuzwxs58eyrpc'],
		},
		secret,
		{
			algorithm: 'RS256',
			keyid: "melodymates"
		}
	);

	res.status(200).send({
		token: token,
		user: userinfo
	});
}

async function spotifyUserInfo(access_token) {
	const res = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + access_token
		}
	});
	const json = await res.json();

	if (json.error) return null;

	let image = null;
	if (json.images && json.images.length > 0) {
		image = json.images[0].url;
	}

	return {
		id: json.id,
		display_name: json.display_name,
		profile_image: image,
		url: json.external_urls.spotify
	};
}