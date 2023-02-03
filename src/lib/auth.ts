const SPOTIFY_SCOPES = [
	'user-read-currently-playing',
	'user-read-playback-position',
	'user-read-recently-played',
	'user-top-read'
];
const SPOTIFY_CLIENT_ID = 'f1c9da828b51491dabf6c4df85fbd9ea';
const SPOTIFY_OAUTH_REDIRECT = 'http://localhost:5173/login/continue';

export const OAUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
	SPOTIFY_OAUTH_REDIRECT
)}&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(' '))}`;
