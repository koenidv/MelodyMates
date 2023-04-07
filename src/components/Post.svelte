<script lang="ts">
	import { identity } from "$lib/store";
	import PostContentBasic from "./post/PostContentBasic.svelte";

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
		<PostContentBasic {post} {liked} />
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
