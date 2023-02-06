<script lang="ts">
    import { OAUTH_URL } from "$lib/auth";

</script>

<div class="flex flex-col items-center justify-center w-full h-full gap-3 p-4">
    <h1 class="text-4xl font-display">MelodyMates</h1>
    <p class="mb-32 font-medium">Share music with your mates</p>
    <a href={OAUTH_URL} class="w-full bg-[#1db954] flex items-center justify-center p-3 m-2 rounded-xl"><img class="max-h-8" src="/spotify_logo_white.png" alt="Sign in with Spotify"/></a>
    <p>Sign in with Spotify to continue</p>
</div>