<script lang="ts">
	import { page } from '$app/stores';
	import { generateJWT, spotifyOAuth } from '$lib/auth';
	import { onMount } from 'svelte';

	const code = $page.url.searchParams.get('code');
	let userdata: any;
    let justcreated: boolean;

    onMount(async () => {
        if (code) {
            const oauth = await spotifyOAuth(code)
            const access_token = oauth.access_token;
            const expires_in = Math.floor(Date.now() / 1000) + oauth.expires_in;
            const refresh_token = oauth.refresh_token;

            const jwtData = await generateJWT(access_token);
            const jwt = jwtData.token;
            userdata = jwtData.user;
            justcreated = jwtData.justcreated;

        }
    });
</script>

{#if !userdata}
	<p class="text-xl">Loading...</p>
{:else}
	<p class="text-xl">Success.</p>
	<p>
		Welcome { !justcreated ? "back " : "" }{userdata.display_name}!
	</p>
    <img src={userdata.profile_image} alt={userdata.display_name} />
{/if}
