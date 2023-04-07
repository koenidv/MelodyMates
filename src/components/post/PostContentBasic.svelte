<script lang="ts">
	import { likedUnlikeSong, pausePlayback, playSong } from "$lib/spotify";
	import { currentlyPlaying } from "$lib/store";

	export let post: any;
	export let liked: boolean;
</script>

<div class="flex flex-row gap-2">
	<img src={post.song.album.cover_image} alt="Album Cover" class="w-16 h-16 rounded-lg" />
	<div class="flex flex-col grow basis-0">
		<p>{post.song.name}</p>
		<p class="opacity-75">
			{post.song.primary_artist.name}
		</p>
	</div>
	<div class="flex items-center pr-2 gap-3">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<img
			src="/icons/like.svg"
			alt="Like song"
			class="w-9 h-9 {liked ? '' : 'opacity-50'}"
			on:click={() => likedUnlikeSong(post.song.id, !liked)} />
		{#if post.song.id === $currentlyPlaying.song.id && $currentlyPlaying.meta.is_playing}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<img
				src="/icons/stop.svg"
				alt="Stop playing"
				class="w-9 h-9"
				on:click={() => pausePlayback()} />
		{:else}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<img
				src="/icons/play.svg"
				alt="Play song"
				class="w-9 h-9"
				on:click={() => playSong(post.song.id)} />
		{/if}
	</div>
</div>
