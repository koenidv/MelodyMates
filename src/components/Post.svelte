<script lang="ts">
	export let post: any;
</script>

<div style="background-color: {post.song.album.theme_color}" class="rounded-lg p-3 mb-2">
	<p>{post.author.profile_name}</p>
	<p>{post.song.name}</p>
	<p>
		{#each post.song.artists.data as artist}
			{artist}
		{/each}
	</p>
</div>
