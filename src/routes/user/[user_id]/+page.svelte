<script lang="ts">
	import { createFollowRequest } from "$lib/db";
	import { createGraphClient } from "$lib/graphClient";
	import { getContextClient, gql, queryStore } from "@urql/svelte";
	import { SyncLoader } from "svelte-loading-spinners";

	export let data;

	createGraphClient();

	const user = queryStore({
		client: getContextClient(),
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
							}
						}
					}
				}
				followState(id: "${encodeURIComponent(data.user_id)}")
			}
		`
	});

	function handleFollowButtonClicked(followState: string) {
		if (followState == "none") {
			createFollowRequest(data.user_id);
		}
	}
</script>

<div class="p-2 h-full pb-[4.5rem] overflow-y-auto flex flex-col items-center gap-4 pt-8">
	{#if $user.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $user.error}
		<p>Oh no... {$user.error.message}</p>
	{:else}
		<img
			src={$user.data.userById.profile_image || "/icons/generic_user.svg"}
			alt="Profile"
			class="w-16 h-16 rounded-full bg-gray-800" />
		<h1 class="text-xl">
			{$user.data.userById.profile_name}
		</h1>
		{#if $user.data.followState[0] == "request_incoming"}
			Incoming: {$user.data.followState[1]}
		{:else}
			<button
				class="{$user.data.followState[0] == 'none'
					? 'bg-spotify'
					: 'bg-gray-800'} h-10 px-2 rounded-xl flex flex-row gap-2 justify-center items-center transition-colors duration-300"
				on:click={() => handleFollowButtonClicked($user.data.followState[0])}>
				{$user.data.followState[0] == "follows"
					? "Following"
					: $user.data.followState[0] == "request_outgoing"
					? "Cancel request"
					: "Add friend"}
			</button>
		{/if}
	{/if}
</div>
