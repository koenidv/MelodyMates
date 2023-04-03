<script lang="ts">
    import { OAUTH_URL } from "$lib/auth";

</script>

<div class="flex flex-col items-center justify-center w-full h-full gap-3 p-4">
    <h1 class="text-4xl font-display">MelodyMates</h1>
    <p class="mb-[10vh] font-medium">Share music with your mates</p>
    <a href={OAUTH_URL} class="w-full bg-spotify flex items-center justify-center p-3 m-2 rounded-xl">
        <img class="max-h-8" src="/icons/spotify_logo_white.png" alt="Sign in with Spotify"/>
    </a>
    <!--<a href="#" class="w-full bg-[#202020] flex items-center justify-center p-3 mx-2 mb-3 rounded-xl gap-2">
        <img class="max-h-8" src="/icons/apple_music_logo_white.svg" alt="Sign in with Spotify"/>
        <p class="font-medium">Apple Music</p>    
    </a>-->
    <p>Continue with your favorite streaming service</p>
    <p class="mt-[6vh] text-center">⚠</p>
    <p class="text-center">The PWA Client is for testing only and might change or brake any time</p>
</div>