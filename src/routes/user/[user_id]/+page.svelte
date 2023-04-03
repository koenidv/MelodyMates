<script lang="ts">
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
				selfFollowsUser(id: "${encodeURIComponent(data.user_id)}")
			}
		`
	});

    $: $user, console.log($user);
</script>

<div class="p-2 h-full pb-[4.5rem] overflow-y-auto flex flex-col items-center gap-4 pt-8">
	{#if $user.fetching}
		<div class="flex h-full w-full items-center justify-center p-8">
			<SyncLoader color="#ffffff" />
		</div>
	{:else if $user.error}
		<p>Oh no... {$user.error.message}</p>
	{:else}
		<img src={$user.data.userById.profile_image || "/icons/generic_user.svg"} alt="Profile" class="w-16 h-16 rounded-full bg-gray-800" />
		<h1 class="text-xl">
			{$user.data.userById.profile_name}
		</h1>
		<button class="h-10 {$user.data.selfFollowsUser ? "bg-gray-800" : "bg-spotify"} rounded-xl p-3 flex flex-row gap-2 justify-center content-baseline transition-colors duration-300">
			{$user.data.selfFollowsUser ? "Following" : "Add friend"}
		</button>
	{/if}
</div>
