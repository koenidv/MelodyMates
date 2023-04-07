<script lang="ts">
	import { createFollowRequest } from "$lib/db";
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, mutationStore, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import IncomingRequest from "$components/requests/incoming.svelte";
	import Post from "$components/Post.svelte";

	export let data;

	createGraphClient();
	const contextClient = getContextClient();

	const user = queryStore({
		client: contextClient,
		query: gql`
			query {
				userById(id: "${encodeURIComponent(data.user_id)}") {
					id
					profile_name
					profile_image
					spotify_url
					posts {
						data {
							song {
								id
								name
								primary_artist {
									id
									name
								}
								album {
									cover_image
								}
							}
						}
					}
				}
				followState(id: "${encodeURIComponent(data.user_id)}")
			}
		`
	});

	function handleFollowButtonClicked(followState: string, request_id?: string) {
		if (followState == "none") {
			createFollowRequest(data.user_id);
		} else if (followState == "request_outgoing") {
			const result = mutationStore({
				client: contextClient,
				query: gql`
					mutation {
						deleteFollowRequest(id: "${request_id!}") {
							_id
						}
					}
				`
			});
		}
	}
</script>

<div class="p-2 h-full mb-[4.5rem] overflow-y-auto flex flex-col items-center gap-4 pt-8">
	{#if $user.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $user.error}
		<p>Oh no... {$user.error.message}</p>
	{:else}
		<!-- User info -->
		<img
			src={$user.data.userById.profile_image || "/icons/generic_user.svg"}
			alt="Profile"
			class="w-16 h-16 rounded-full bg-gray-800 object-cover" />
		<h1 class="text-xl">
			{$user.data.userById.profile_name}
		</h1>
		<!-- Follow button -->
		{#if $user.data.followState[0] == "request_incoming"}
			<IncomingRequest
				request={{
					_id: $user.data.followState[1],
					from: {
						id: $user.data.userById.id,
						profile_name: $user.data.userById.profile_name,
						profile_image: $user.data.userById.profile_image
					}
				}} />
		{:else}
			<button
				class="{$user.data.followState[0] == 'none'
					? 'bg-spotify'
					: 'bg-gray-800'} h-10 px-2 rounded-xl flex flex-row gap-2 justify-center items-center transition-colors duration-300 min-w-[12rem]"
				on:click={() =>
					handleFollowButtonClicked(
						$user.data.followState[0],
						$user.data.followState[1] || undefined
					)}>
				{$user.data.followState[0] == "follows"
					? "Friends"
					: $user.data.followState[0] == "request_outgoing"
					? "Cancel request"
					: "Add friend"}
			</button>
		{/if}
		<!-- Posts -->
		<div id="posts" class="feed h-full pb-[4.5rem]">
			{#each [...$user.data.userById.posts.data].reverse() as post}
				<Post {post} liked={false} />
			{/each}
		</div>
	{/if}
</div>
