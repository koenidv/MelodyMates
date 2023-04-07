<script lang="ts">
	import { likedUnlikeSong, pausePlayback, playSong } from "$lib/spotify";
	import { currentlyPlaying } from "$lib/store";
	import { identity } from "$lib/store";

	export let post: any;
	export let liked: boolean;
</script>

<div
	style="background-color: {post.song.album.theme_color}"
	class="rounded-lg p-3 mb-2 relative overflow-clip">
	<img
		src={post.song.album.cover_image}
		alt=""
		class="absolute top-0 left-0 opacity-25 h-full w-full object-cover blur-md" />
	<div class="relative flex flex-col gap-2">
		{#if post.author}
			<a href="/user/{post.author.id}" class="flex flex-row items-center gap-1">
				<img
					src={post.author.profile_image || "/icons/generic_user.svg"}
					alt="Profile"
					class="w-5 h-5 rounded-full shadow-sm object-cover"
					style="background-color: {post.song.album.theme_color}" />
				<p class="opacity-75 text-sm">{post.author.profile_name.split(" ")[0]}</p>
			</a>
		{/if}
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
		{#if post.author && post.author.id === $identity.user.id}
			<input
				type="text"
				class="w-full rounded-lg p-2 text-white placeholder-opacity-75 placeholder-white bg-black bg-opacity-[15%] focus:bg-opacity-30 border"
				style="border-color: {post.song.album.theme_color}"
				placeholder="Leave a note" />
		{/if}
		{#if post.author && (post.author.id !== $identity.user.id || post.comment)}
			<input
				type="text"
				class="w-full rounded-lg p-2 text-white placeholder-opacity-75 placeholder-white bg-black bg-opacity-[15%] focus:bg-opacity-30 border"
				style="border-color: {post.song.album.theme_color}"
				placeholder="Send a comment" />
		{/if}
	</div>
</div>
