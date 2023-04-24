<script lang="ts">
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import { querySongsLiked } from "$lib/spotify";
	import PostFeed from "$components/post/PostFeed.svelte";
	import InfiniteScroll from "svelte-infinite-scroll";
	import { afterUpdate, beforeUpdate } from "svelte";

	createGraphClient();
	const client = getContextClient();

	let paginationCursor: string | undefined = undefined;
	$: posts = [] as any[];

	const postsQuery = gql`
		query ($paginationCursor: String) {
			allPostsPaginated(_size: 8, _cursor: $paginationCursor) {
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
				after
			}
		}
	`;

	$: postsPage = queryStore({
		client: client,
		query: postsQuery,
		variables: { paginationCursor }
	});

	$: $postsPage,
		(() => {
			if ($postsPage.data) {
				posts = [...posts, ...$postsPage.data.allPostsPaginated.data];
			}
		})();

	function loadNextPostsPage() {
		if ($postsPage.data.allPostsPaginated.after)
			paginationCursor = $postsPage.data.allPostsPaginated.after;
	}

	let likedmap = new Map();
	function updateLikedMap() {
		if (posts.length == 0) return;
		querySongsLiked(posts.map((post: { song: { id: any } }) => post.song.id)).then(
			(map) => (likedmap = new Map([...likedmap, ...map]))
		);
	}
	$: $postsPage, updateLikedMap();
</script>

<div class="feed p-2 h-full pb-[4.5rem] overflow-y-auto">
	{#if posts.length == 0 && $postsPage.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if posts.length == 0 && $postsPage.error}
		<p>Oh no... {$postsPage.error.message}</p>
	{:else}
		{#each posts as post}
			<PostFeed {post} liked={likedmap.get(post.song.id)} />
		{/each}
		<InfiniteScroll
			threshold={400}
			on:loadMore={() => {
				loadNextPostsPage();
			}} />
	{/if}
</div>
