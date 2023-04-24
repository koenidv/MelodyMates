<script lang="ts">
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import PostFeed from "$components/post/PostFeed.svelte";
	import { querySongsLiked } from "$lib/spotify";

	createGraphClient();
	const client = getContextClient();

	let paginationCursor;

	const postsQuery = gql`
		query {
			allPostsPaginated(_size: 100, _cursor: ${paginationCursor || "null"}) {
				data {
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
		}
	`;

	const posts = queryStore({
		client: client,
		query: postsQuery
	});

	let likedmap = new Map();
	function updateLikedMap() {
		if (!$posts.data) return;
		querySongsLiked(
			$posts.data.allPostsPaginated.data.map((post: { song: { id: any } }) => post.song.id)
		).then((map) => (likedmap = map));
	}
	$: $posts, updateLikedMap();
</script>

<div class="feed p-2 h-full pb-[4.5rem] overflow-y-auto">
	{#if $posts.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $posts.error}
		<p>Oh no... {$posts.error.message}</p>
	{:else}
		{#each $posts.data.allPostsPaginated.data as post}
			<PostFeed {post} liked={likedmap.get(post.song.id)} />
		{/each}
	{/if}
</div>
