<script lang="ts">
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import Post from "$components/Post.svelte";

	createGraphClient();

	const posts = queryStore({
		client: getContextClient(),
		query: gql`
			query {
				allPosts {
					data {
						ref: _id
						author {
							id
							profile_name
							profile_image
						}
						comment
						song {
							id
							name
							length_ms
							artists {
								data {
									id
									name
								}
							}
							album {
								id
								name
								cover_image
								theme_color
							}
						}
					}
				}
			}
		`
	});
</script>

<div class="feed p-2 h-full">
	{#if $posts.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $posts.error}
		<p>Oh no... {$posts.error.message}</p>
	{:else}
		{#each $posts.data.allPosts.data as post}
			<Post {post} />
		{/each}
	{/if}
</div>
