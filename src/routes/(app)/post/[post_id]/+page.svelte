<script lang="ts">
	import PostLarge from "$components/post/PostLarge.svelte";
	import { createGraphClient } from "$lib/graphClient.js";
	import { querySongsLiked } from "$lib/spotify.js";
	import { getContextClient, gql, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";

	export let data;

	createGraphClient();

	const post = queryStore({
		client: getContextClient(),
		query: gql`
			query {
				findPostByID(id: "${data.post_id}") {
						ref: _id
						author {
							id
							profile_name
							profile_image
						}
						note
						song {
							id
							name
							length_ms
							primary_artist {
								id
								name
							}
							album {
								id
								name
								cover_image
								theme_color
							}
						}
						replies {
							data {
								author {
									id
									profile_name
									profile_image
								}
								comment
							}
						}
				}
			}
		`
	});

	let likedmap = new Map();
	function updateLikedMap() {
		if (!$post.data) return;
		querySongsLiked(
			[$post.data.findPostByID.song.id]
		).then((map) => (likedmap = map));
	}
	$: $post, updateLikedMap();
</script>

<div class="feed p-2 h-full pb-[4.5rem] overflow-y-auto">
	{#if $post.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $post.error}
		<p>Oh no... {$post.error.message}</p>
	{:else}
		<PostLarge post={$post.data.findPostByID} liked={likedmap.get($post.data.findPostByID.song.id)} />
	{/if}
</div>
