<script lang="ts">
	import { page } from '$app/stores';
	import { createUser, generateJWT, saveIdentity, spotifyOAuth, userExists } from '$lib/auth';
	import { onMount } from 'svelte';
	import { SyncLoader } from 'svelte-loading-spinners';
	import faunadb from 'faunadb';
    
	const code = $page.url.searchParams.get('code');

	onMount(async () => {
		if (code) {
			const oauth = await spotifyOAuth(code);
			const access_token = oauth.access_token;
			const expires: number = Math.floor(Date.now() / 1000) + oauth.expires_in;
			const refresh_token = oauth.refresh_token;
            
			const jwtData = await generateJWT(access_token);
			const jwt = jwtData.token;
			const userdata = jwtData.user;

			const fauna = new faunadb.Client({ secret: jwt });

			if (await userExists(userdata.id, fauna)) {
				saveIdentity(jwt, {access_token, expires, refresh_token}, userdata)
				window.location.replace('/home');
			} else {
				await createUser(userdata, fauna);
				saveIdentity(jwt, {access_token, expires, refresh_token}, userdata)
				window.location.replace('/home'); // /setup when that page is in use
			}

		} else {
			window.location.replace('/login');
		}
	});
</script>

<div class="flex h-full w-full items-center justify-center p-8">
	<SyncLoader color="#ffffff" />
</div>
