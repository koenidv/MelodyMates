<script lang="ts">
	import PostContentBasic from "./PostContentBasic.svelte";

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
		<PostContentBasic {post} {liked} />
	</div>
</div>
