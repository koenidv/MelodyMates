<script lang="ts">
	import { page } from '$app/stores';
	import { generateJWT, spotifyOAuth } from '$lib/auth';
	import { onMount } from 'svelte';
    import { SyncLoader } from "svelte-loading-spinners"

	const code = $page.url.searchParams.get('code');

    onMount(async () => {
        if (code) {
            const oauth = await spotifyOAuth(code)
            const access_token = oauth.access_token;
            const expires_in = Math.floor(Date.now() / 1000) + oauth.expires_in;
            const refresh_token = oauth.refresh_token;

            const jwtData = await generateJWT(access_token);
            const jwt = jwtData.token;
            const userdata = jwtData.user;

            if (jwtData.justcreated) {
                window.location.replace("/setup")
            } else {
                window.location.replace("/home")
            }
        } else {
            window.location.replace("/login")
        }
    });
</script>

<div class="flex h-screen w-screen items-center justify-center p-8">

    <SyncLoader color="#ffffff" />

</div>