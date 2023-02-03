/**
 * Request user info based on an access token and generate a JWT
 */

import jwt from 'jsonwebtoken';
import faunadb from 'faunadb';
const q = faunadb.query;

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

	const token = jwt.sign(
		{
			sub: userinfo.id,
			iat: Math.floor(Date.now() / 1000),
			iss: 'MusicMates',
			aud: ['https://db.fauna.com/db/yuzwxs58eyrpc'],
			algorithm: 'RS256'
		},
		process.env.JWT_PRIVATE_KEY
	);

	const existed = await userExists(userinfo.id);
	if (!existed) {
		await createUser(userinfo);
	}

	res.status(200).send({
		token: token,
		user: userinfo,
		justCreated: !existed
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

function getFaunaClient() {
	return new faunadb.Client({
		secret: process.env.FAUNA_SECRET,
		endpoint: 'https://db.fauna.com',
		keepAlive: false
	});
}

async function userExists(id) {
	const queried = await getFaunaClient().query(q.Exists(q.Match(q.Index('unique_User_id'), id)));
	return queried;
}

async function createUser(userinfo) {
	await getFaunaClient().query(
		q.Create(q.Collection('User'), {
			data: {
				id: userinfo.id,
				profile_name: userinfo.display_name,
				profile_image: userinfo.profile_image,
				spotify_url: userinfo.url
			}
		})
	);
}
