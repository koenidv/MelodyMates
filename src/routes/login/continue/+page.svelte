<script lang="ts">
	import { page } from '$app/stores';
	import { spotifyOAuth } from '$lib/auth';
	import { onMount } from 'svelte';

	const code = $page.url.searchParams.get('code');
	let access_token: string;

    onMount(() => {
        if (code) {
            spotifyOAuth(code).then((token) => {
                access_token = token;
            });
        }
    });
</script>

{#if !access_token}
	<p class="text-xl">Loading...</p>
{:else}
	<p class="text-xl">Success.</p>
	<p>
		Access token is {JSON.stringify(access_token)}.
	</p>
{/if}
