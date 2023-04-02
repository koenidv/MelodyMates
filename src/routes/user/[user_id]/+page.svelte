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
		<img src={$user.data.userById.profile_image} alt="Profile" class="w-16 h-16 rounded-full" />
		<h1 class="text-xl">
			{$user.data.userById.profile_name}
		</h1>
	{/if}
</div>
