<script lang="ts">
	import { playSong } from "$lib/spotify";

	export let post: any;
</script>

<div
	style="background-color: {post.song.album.theme_color}"
	class="rounded-lg p-3 mb-2 relative overflow-clip">
	<img
		src={post.song.album.cover_image}
		alt=""
		class="absolute top-0 left-0 opacity-25 h-full w-full object-cover blur-md" />
	<div class="relative flex flex-col gap-2">
		<a href="/user/{post.author.id}" class="flex flex-row items-center gap-1">
			<img src={post.author.profile_image} alt="Profile" class="w-5 h-5 rounded-full shadow-sm" />
			<p class="opacity-75 text-sm">{post.author.profile_name.split(" ")[0]}</p>
		</a>
		<div class="flex flex-row gap-2">
			<img src={post.song.album.cover_image} alt="Album Cover" class="w-16 h-16 rounded-lg" />
			<div class="flex flex-col grow">
				<p>{post.song.name}</p>
				<p class="opacity-75">
					{post.song.primary_artist.name}
				</p>
			</div>
			<div class="flex items-center pr-0.5">
				<img src="/icons/play.svg" alt="Play song" class="w-9 h-9" on:click={() => playSong(post.song.id)}/>
			</div>
		</div>
	</div>
</div>